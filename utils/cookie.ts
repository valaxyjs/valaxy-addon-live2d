/**
 * 设置 Cookie
 * @param {string} name - Cookie 的名称
 * @param {string} value - Cookie 的值
 * @param {number} [days] - Cookie 的有效期（天）
 */
export function setCookie(name: string, value: string, days?: number) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/`
}

/**
 * 获取 Cookie
 * @param {string} name - Cookie 的名称
 * @returns {string | null} - Cookie 的值
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  return null
}

/**
 * 删除 Cookie
 * @param {string} name - Cookie 的名称
 */
export function removeCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=-99999999; path=/`
}
