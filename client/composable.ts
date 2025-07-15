import type { Live2DApp as Live2DAppType } from '../app/Live2DApp'
import { createSharedComposable, isClient, useTimeoutFn, useWindowSize } from '@vueuse/core'
import { onUnmounted, ref, watch } from 'vue'
import { Live2dTipsHandler } from '../helpers/tips'
import { hideLive2dTool, showLive2dTool } from '../utils/animate'
import { getCookie, setCookie } from '../utils/cookie'
import { getModelJson } from '../utils/model'
import { convertJsdelivrUrlToGithubApiUrl, getFilenamesFromGitHub } from '../utils/network'
import { getLive2DModel, setLive2DModelKeys } from '../utils/storage'
import { useAddonLive2dConfig } from './options'

export const useAddonLive2d = createSharedComposable(() => {
  const live2dOptions = useAddonLive2dConfig()
  const { randomCharacter, randomSkin, live2DCollection, live2dTips, hideOnScreenSizes, defaultVisibility, cookieExpires } = live2dOptions.value
  const { width } = useWindowSize()
  const live2DApp = ref<typeof Live2DAppType>()
  const isLive2DHide = ref(false)
  const live2dTipsHandler = new Live2dTipsHandler(live2dTips!)

  async function _initializeLive2DApp() {
    await import('../lib/index.js')
    live2DApp.value = (await import('../app/Live2DApp')).Live2DApp

    if (hideOnScreenSizes !== false) {
      const maxWidth = typeof hideOnScreenSizes === 'string'
        ? Number.parseInt(hideOnScreenSizes)
        : hideOnScreenSizes!

      watch(width, (newWidth) => {
        if (newWidth <= maxWidth) {
          hideLive2D()
        }
        else {
          showLive2D()
        }
      }, { immediate: true })
    }

    const live2dCookie = getCookie('live2d')
    const actionMap = {
      Show: showLive2D,
      Hide: hideLive2D,
      default: defaultVisibility ? showLive2D : hideLive2D,
    }
    actionMap[live2dCookie || 'default']()

    live2dTipsHandler.init()
    live2DApp.value.init(live2dOptions.value, live2dTipsHandler)
    live2DApp.value.loadModel((await getLive2DModel(live2DCollection!)).selectedModel)
  }

  async function switchCharacter(random = randomCharacter!) {
    live2DApp.value?.switchModel(random ? await getRandomCharacter() : await getSequentialCharacter())
  }

  async function switchSkin(random = randomSkin!) {
    live2DApp.value?.switchModel(random ? await getRandomSkin() : await getSequentialSkin())
    live2dTipsHandler.showMessage('我的新衣服好看嘛？', 4000, 10)
  }

  /**
   * 随机切换人物
   */
  function getRandomCharacter() {
    const keys = Object.keys(live2DCollection!)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    setLive2DModelKeys(randomKey, 0)

    live2dTipsHandler.showMessage(live2DCollection![randomKey].message!, 4000, 10)

    return live2DCollection![randomKey].models[0]
  }

  /**
   * 顺序切换人物
   */
  async function getSequentialCharacter() {
    const { currentCharacterKey } = await getLive2DModel(live2DCollection!)
    const keys = Object.keys(live2DCollection!)
    const newModelKey = keys[(keys.indexOf(currentCharacterKey) + 1) % keys.length]
    const newLive2DModels = live2DCollection![newModelKey].models

    setLive2DModelKeys(newModelKey, 0)

    live2dTipsHandler.showMessage(live2DCollection![newModelKey].message!, 4000, 10)

    return typeof newLive2DModels === 'string' ? await getModelJson(newLive2DModels, 0) : newLive2DModels[0]
  }

  /**
   * 随机切换皮肤
   */
  async function getRandomSkin() {
    const { currentCharacterKey } = await getLive2DModel(live2DCollection!)
    const live2D = live2DCollection![currentCharacterKey]
    const newSkinIndex = Math.floor(Math.random() * live2D.models.length)

    setLive2DModelKeys(null, newSkinIndex)

    if (live2D.models.length === 0)
      live2dTipsHandler.showMessage(live2dTips!.message.clothes, 4000, 10)

    if (typeof live2D.models === 'string')
      return await getModelJson(live2D.models, newSkinIndex)

    return live2D.models[newSkinIndex]
  }

  /**
   * 顺序切换皮肤
   */
  async function getSequentialSkin() {
    const { currentCharacterKey, currentSkinIndex } = await getLive2DModel(live2DCollection!)
    const live2D = live2DCollection![currentCharacterKey]

    const getNewSkinIndex = (skinsLength: number) => (currentSkinIndex + 1) % skinsLength

    if (typeof live2D.models === 'string') {
      // HACK: The step of using `convertJsdelivrUrlToGithubApiUrl` should be avoided
      const skins = await getFilenamesFromGitHub(convertJsdelivrUrlToGithubApiUrl(live2D.models))
      const newSkinIndex = getNewSkinIndex(skins.length)
      return getModelJson(live2D.models, newSkinIndex)
    }
    else {
      if (live2D.models.length === 0) {
        live2dTipsHandler.showMessage(live2dTips!.message.clothes, 4000, 10)
        return live2D.models[0]
      }
      const newSkinIndex = getNewSkinIndex(live2D.models.length)
      setLive2DModelKeys(null, newSkinIndex)
      return live2D.models[newSkinIndex]
    }
  }

  function captureFrame() {
    live2DApp.value?.captureFrame()
  }

  const { start: startHideModel, stop: stopHideModel } = useTimeoutFn(
    () => live2DApp.value?.hideModel(),
    2000,
    { immediate: false },
  )

  function hideLive2D() {
    isLive2DHide.value = true
    hideLive2dTool()

    const live2dElement = document.getElementById('live2d')!
    // localStorage.setItem('live2d-display', Date.now().toString())
    live2dTipsHandler.showMessage(live2dTips!.tool.display, 2000, 11)
    live2dElement.style.bottom = '-100%'

    stopHideModel()
    startHideModel()

    setTimeout(() => {
      setCookie('live2d', 'Hide', cookieExpires)
    }, 0)
  }

  function showLive2D() {
    isLive2DHide.value = false
    showLive2dTool()

    const live2dElement = document.getElementById('live2d')!
    live2dElement.style.bottom = '0px'

    stopHideModel()
    live2DApp.value?.showModel()

    setTimeout(() => {
      // localStorage.removeItem('live2d-display')
      live2dElement.style.display = ''
      setCookie('live2d', 'Show', cookieExpires)
    }, 0)
  }

  const toggleLive2DVisibility = () => isLive2DHide.value ? showLive2D() : hideLive2D()

  onUnmounted(() => {
    if (live2DApp.value) {
      live2DApp.value.destroyModel()
      live2DApp.value = undefined
    }
  })

  if (isClient)
    _initializeLive2DApp()

  return {
    live2DApp,
    live2dOptions,
    switchCharacter,
    switchSkin,
    getRandomCharacter,
    getSequentialCharacter,
    getRandomSkin,
    getSequentialSkin,
    captureFrame,
    hideLive2D,
    showLive2D,
    toggleLive2DVisibility,
    isLive2DHide,
    live2dTipsHandler,
  }
})
