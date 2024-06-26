import { isClient, useScriptTag } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useSiteConfig } from 'valaxy'
import type { Live2dOptions, Live2dPathOptions } from '../types'
import pkg from '../package.json'
import { useAddonLive2d } from './options'

export function useAutoLoad(options: ComputedRef<Live2dOptions | undefined>) {
  function initAutoLoad(live2dOptions: Live2dOptions) {
    if (!isClient)
      return

    const siteConfig = useSiteConfig()
    const cdnPrefix = computed(() => siteConfig.value.cdn.prefix)
    const live2dOnlinePathBaseUrl = `${cdnPrefix.value}valaxy-addon-live2d@v${pkg.version}/assets/`
    const live2dLocalPathBaseUrl = 'live2d/'

    const defaultOptions: Live2dOptions = {
      live2dPath: { baseUrl: 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/' },
      apiPath: 'https://live2d.fghrsh.net/api/',
      cdnPath: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/',
    }

    const newLive2dOptions = Object.assign(defaultOptions, live2dOptions)

    let live2dPathBaseUrl
    if (newLive2dOptions.live2dPath?.baseUrl === 'online')
      live2dPathBaseUrl = live2dOnlinePathBaseUrl
    else if (newLive2dOptions.live2dPath?.baseUrl === 'local')
      live2dPathBaseUrl = live2dLocalPathBaseUrl
    else
      live2dPathBaseUrl = newLive2dOptions.live2dPath?.baseUrl

    const live2dPath: Live2dPathOptions = {
      waifuCSS: newLive2dOptions.live2dPath?.waifuCSS ? newLive2dOptions.live2dPath.waifuCSS : `${live2dPathBaseUrl}waifu.css`,
      live2dJS: newLive2dOptions.live2dPath?.live2dJS ? newLive2dOptions.live2dPath.live2dJS : `${live2dPathBaseUrl}live2d.min.js`,
      waifuTipsJS: newLive2dOptions.live2dPath?.waifuTipsJS ? newLive2dOptions.live2dPath.waifuTipsJS : `${live2dPathBaseUrl}waifu-tips.js`,
    }

    const initWidgetJson = {
      waifuPath: newLive2dOptions.live2dPath?.waifuTipsJson ? newLive2dOptions.live2dPath?.waifuTipsJson : `${live2dPathBaseUrl}waifu-tips.json`,
      apiPath: newLive2dOptions.apiPath,
      tools: newLive2dOptions.tools,
      ...(live2dOptions.apiPath && !live2dOptions.cdnPath && { cdnPath: newLive2dOptions.cdnPath }),
    }

    useHead({
      link: [
        {
          rel: 'stylesheet',
          href: live2dPath.waifuCSS,
        },
      ],
    })

    useScriptTag(live2dPath.live2dJS as string, () => {
      useScriptTag(live2dPath.waifuTipsJS as string, () => {
        // @ts-expect-error missing types
        initWidget(initWidgetJson)
      })
    })
  }
  if (options.value)
    initAutoLoad(options.value)
}

export function useAutoLoadWithOptions() {
  const addonLive2d = useAddonLive2d()
  const options = computed(() => addonLive2d.value.options)
  useAutoLoad(options)
}
