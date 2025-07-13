import type { Cubism2Spec } from 'pixi-live2d-display'

export async function urlToJson(url: string): Promise<Cubism2Spec.ModelJSON> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`请求失败，状态码: ${response.status}`)
  }
  return await response.json()
}

export function convertJsdelivrUrlToGithubApiUrl(url: string) {
  const regex = /https:\/\/cdn\.jsdelivr\.net\/gh\/([\w-]+)\/([\w-]+)\/([\w\-/]+)\/index\.json/
  const match = url.match(regex)

  if (match) {
    const username = match[1]
    const repository = match[2]
    const path = match[3]

    const githubUrl = `https://api.github.com/repos/${username}/${repository}/contents/${path}/textures`
    return githubUrl
  }
  else {
    throw new Error('URL格式不正确')
  }
}

/**
 * 从Github 获取文件列表
 */
export async function getFilenamesFromGitHub(url: string) {
  const cacheKey = `live2d-cache-${url}`
  const cacheTimeKey = `live2d-cacheTime-${url}`
  const cacheDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  const cachedData = localStorage.getItem(cacheKey)
  const cachedTime = localStorage.getItem(cacheTimeKey)

  // Check if cached data exists and is still valid
  if (cachedData && cachedTime && (Date.now() - Number.parseInt(cachedTime) < cacheDuration)) {
    return JSON.parse(cachedData)
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Network request failed, status code: ${response.status}`)
    }
    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new TypeError('目录内容获取失败')
    }

    const filenames = data.map(item => item.name)

    localStorage.setItem(cacheKey, JSON.stringify(filenames))
    localStorage.setItem(cacheTimeKey, Date.now().toString())
    return filenames
  }
  catch (error) {
    console.error('获取文件名失败:', error)
    throw error
  }
}
