import type { ValaxyAddon } from 'valaxy'
import type { Live2DCollection, Live2dOptions, Live2dTips } from '../types'
import { useRuntimeConfig } from 'valaxy'
import { computed } from 'vue'
import { live2DCollection } from '../constants/live2dCollection'
import { live2dTips } from '../constants/live2dTips'
import { filterLive2DCollection, mergeConfigs } from '../utils/config'

export function useAddonLive2dConfig() {
  const runtimeConfig = useRuntimeConfig()
  return computed<Live2dOptions>(() => {
    const { options } = runtimeConfig.value.addons['valaxy-addon-live2d'] as ValaxyAddon<Live2dOptions>

    const enableLive2D = options?.enableLive2D ?? 'all'
    const mergedLive2DCollection: Live2DCollection = { ...live2DCollection, ...options?.live2DCollection }

    const filteredAndSortedLive2DCollection: Live2DCollection = (enableLive2D === 'all')
      ? mergedLive2DCollection
      : filterLive2DCollection(enableLive2D, mergedLive2DCollection)

    const mergedLive2dTips = mergeConfigs(live2dTips, options?.live2dTips || {}) as Live2dTips

    return {
      widthLimit: 250,
      safetyMargin: 50,
      randomCharacter: false,
      randomSkin: false,
      skipHello: false,
      hideOnScreenSizes: 600,
      debugger: false,
      defaultVisibility: true,
      cookieExpires: 7,

      ...options,

      live2DCollection: filteredAndSortedLive2DCollection,
      enableLive2D,
      live2dTips: mergedLive2dTips,
    }
  })
}
