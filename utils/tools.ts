import { toReactive } from '@vueuse/core'
import { useAddonLive2d } from '../client'
import { addonHitokoto } from '../shared'

/** Dynamic import of Asteroids game from CDN */
export async function loadAsteroids() {
  try {
    // Source: https://github.com/stevenjoezhang/asteroids
    // Project homepage: http://www.websiteasteroids.com
    // @ts-expect-error - Dynamic import from URL lacks type definitions
    const { default: Asteroids } = await import('https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js')
    const instance = new Asteroids();
    (window as any).ASTEROIDSPLAYERS = (window as any).ASTEROIDSPLAYERS || [];
    (window as any).ASTEROIDSPLAYERS.push(instance)
  }
  catch (error) {
    console.error('Failed to load Asteroids:', error)
  }
}

export async function captureLive2dImage() {
  const live2D = useAddonLive2d()
  const { showMessage } = live2D.live2dTipsHandler
  const message = live2D.live2dOptions.value.live2dTips!.tool.camera

  showMessage(message, 6000, 9)
  const canvas = document.getElementById('live2d-canvas') as HTMLCanvasElement
  if (!canvas)
    return

  await new Promise(resolve => requestAnimationFrame(resolve))

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png', 1)
  })

  if (!blob)
    return

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'live2d-photo.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function showHitokoto() {
  const live2D = useAddonLive2d()
  const { showMessage } = live2D.live2dTipsHandler

  if (!addonHitokoto.value) {
    showMessage('请先安装 <a href="https://github.com/valaxyjs/valaxy-addon-hitokoto" target="_blank">valaxy-addon-hitokoto</a> 才能使用一言哦~', 5000, 10)
    console.warn('Please install valaxy-addon-hitokoto')
    return
  }

  const { creator, hitokoto } = toReactive(addonHitokoto.value.hitokoto)
  await addonHitokoto.value.fetchHitokoto()

  showMessage(`${hitokoto} - ${creator}投稿`, 6000, 10)
}
