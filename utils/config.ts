import type { Live2DCollection } from '../types'

/**
 * Merge two configuration objects. If a key exists in both configurations,
 * merge their values. Arrays will be concatenated, while other types will be
 * combined into an array.
 *
 * @param {object} config1 - The first configuration object.
 * @param {object} config2 - The second configuration object.
 * @returns {object} The merged configuration object.
 */
export function mergeConfigs(config1: object, config2: object) {
  const mergedConfig = { ...config1 }

  for (const key in config2) {
    if (Object.prototype.hasOwnProperty.call(config2, key)) {
      if (mergedConfig[key]) {
        if (Array.isArray(mergedConfig[key]) && Array.isArray(config2[key])) {
          mergedConfig[key] = [...mergedConfig[key], ...config2[key]]
        }
        else {
          mergedConfig[key] = [mergedConfig[key], config2[key]]
        }
      }
      else {
        mergedConfig[key] = config2[key]
      }
    }
  }

  return mergedConfig
}

export function filterLive2DCollection(enableLive2D: string | string[], mergedLive2DCollection: Live2DCollection): Live2DCollection {
  if (Array.isArray(enableLive2D)) {
    return enableLive2D.reduce((collection, key) => {
      if (key in mergedLive2DCollection) {
        collection[key] = mergedLive2DCollection[key]
      }
      return collection
    }, {} as Live2DCollection)
  }
  return {}
}
