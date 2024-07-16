import { getModelJson } from '../utils/model'
import type { Live2DCollection } from '../types'

const MODEL_KEY = 'modelKey'
const SKIN_KEY = 'skinKey'

export async function getLive2DModel(live2DCollection: Live2DCollection) {
  const storedCharacterKey = localStorage.getItem(MODEL_KEY)
  const storedSkinIndex = localStorage.getItem(SKIN_KEY)

  const currentCharacterKey = (storedCharacterKey || Object.keys(live2DCollection!)[0])
  let currentSkinIndex = Number.parseInt(storedSkinIndex || '0', 10)

  let availableModels = live2DCollection![currentCharacterKey]

  if (!availableModels) {
    const defaultKey = Object.keys(live2DCollection!)[0]
    availableModels = live2DCollection![defaultKey]
    setLive2DModelKeys(Object.keys(live2DCollection!)[0], 0)
    console.warn(`缓存中的人物Key值"${currentCharacterKey}"不存在，已初始化为默认值`)
  }

  // Ensure the current skin index is within the valid range
  // Prevent out-of-bounds index if user deletes models
  if (currentSkinIndex >= availableModels.models.length) {
    currentSkinIndex = 0
    console.warn('皮肤索引越界，已初始化皮肤索引。如果这是由于您删除了某些人物 models 导致的，请放心忽略此消息')
  }

  const selectedModel = typeof availableModels.models === 'string'
    ? await getModelJson(availableModels.models, currentSkinIndex)
    : availableModels.models[currentSkinIndex]

  return {
    /**
     * 当前角色的键值
     */
    currentCharacterKey,
    /**
     * 当前皮肤的索引
     */
    currentSkinIndex,
    /**
     * 当前模型的可用模型列表
     */
    availableModels,
    /**
     * 当前选定的模型
     */
    selectedModel,
  }
}

export function setLive2DModelKeys(newModelKey: any, newSkinIndex: any) {
  if (newModelKey !== null)
    localStorage.setItem(MODEL_KEY, newModelKey.toString())
  if (newSkinIndex !== null)
    localStorage.setItem(SKIN_KEY, newSkinIndex.toString())
}
