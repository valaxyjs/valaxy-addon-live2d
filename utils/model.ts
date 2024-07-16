import { convertJsdelivrUrlToGithubApiUrl, getFilenamesFromGitHub, urlToJson } from './network'
import { setLive2DModelKeys } from './storage'

/**
 * 根据给定的模型地址和皮肤索引，自动切换Live2D模型的皮肤
 *
 * @param model Live2D模型的地址
 * @param newSkinIndex 需要切换的皮肤索引
 */
export async function getModelJson(model: string, newSkinIndex: number) {
  const url = convertJsdelivrUrlToGithubApiUrl(model)
  try {
    const filenames = await getFilenamesFromGitHub(url)
    const json = await urlToJson(model)

    json.url = model
    json.textures[0] = `textures/${filenames[newSkinIndex]}`
    setLive2DModelKeys(null, newSkinIndex)
    return json
  }
  catch (error) {
    console.error(error)
  }
}
