import type { ModelSettings } from 'pixi-live2d-display'
import { convertJsdelivrUrlToGithubApiUrl, getFilenamesFromGitHub, urlToJson } from './network'
import { setLive2DModelKeys } from './storage'

/**
 * 根据给定的模型地址和皮肤索引，自动切换Live2D模型的皮肤
 *
 * @param model Live2D模型的地址
 * @param newSkinIndex 需要切换的皮肤索引
 */
export async function getModelJson(model: string, newSkinIndex: number): Promise<ModelSettings> {
  let textureFilenames: string[]
  const json = await urlToJson(model)

  const result = {
    ...json,
    url: model,
  } as unknown as ModelSettings

  if (model.startsWith('https://cdn.jsdelivr.net/gh')) {
    const githubApiUrl = convertJsdelivrUrlToGithubApiUrl(model)
    const rawFilenames = await getFilenamesFromGitHub(githubApiUrl)
    textureFilenames = rawFilenames.map(filename => `textures/${filename}`)
  }
  else {
    textureFilenames = json.textures
  }

  if (newSkinIndex >= 0 && newSkinIndex < textureFilenames.length) {
    result.textures[0] = textureFilenames[newSkinIndex]
    setLive2DModelKeys(null, newSkinIndex)
  }

  return result
}
