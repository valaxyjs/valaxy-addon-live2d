import type { Live2dTips } from '../types'

export class Live2dTipsHandler {
  private live2dTips: Live2dTips
  private messageArray: string[] = []
  private messageTimer: number | null = null

  constructor(live2dTips: Live2dTips) {
    this.live2dTips = live2dTips
  }

  init() {
    this.setupEvents()
    this.setupSeasonalTips(this.live2dTips.seasons)
    this.welcomeMessage()
    this.activityBasedMessages()
    this.setupAdditionalEvents()

    this.showMessage(this.generateReferrerMessage(), 7000, 10)
  }

  private setupEvents() {
    this.setupEventHandlers(this.live2dTips.mouseover, 'mouseover')
    this.setupEventHandlers(this.live2dTips.click, 'click')
  }

  private setupEventHandlers(tips: any[], eventType: string) {
    tips.forEach((tip) => {
      window.addEventListener(eventType, (event) => {
        const target = event.target as HTMLElement
        if (target.matches(tip.selector)) {
          const text = this.randomSelection(tip.text).replace('{text}', target.textContent || '')
          this.showMessage(text, 4000, 8)
        }
      })
    })
  }

  private setupSeasonalTips(tips: any[]) {
    const now = new Date()
    tips.forEach((tip) => {
      const [after, before] = tip.date.split('-')
      const [afterMonth, afterDay] = after.split('/').map(Number)
      const [beforeMonth, beforeDay] = before ? before.split('/').map(Number) : [afterMonth, afterDay]
      const currentMonth = now.getMonth() + 1
      const currentDay = now.getDate()

      if ((afterMonth <= currentMonth && currentMonth <= beforeMonth)
        && (afterDay <= currentDay && currentDay <= beforeDay)) {
        let text = this.randomSelection(tip.text)
        text = text.replace('{year}', String(now.getFullYear()))
        this.showMessage(text, 7000, 100)
        this.messageArray.push(text)
      }
    })
  }

  private randomSelection(obj: object) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj
  }

  private welcomeMessage() {
    const now = new Date().getHours()
    let messageText: string | string[]
    const timeConfig = this.live2dTips.time

    for (let i = 0; i < timeConfig.length; i++) {
      const timeRange = timeConfig[i].hour.split('-')
      const startHour = Number.parseInt(timeRange[0])
      const endHour = Number.parseInt(timeRange[1])

      if (now >= startHour && now <= endHour) {
        const text = timeConfig[i].text
        if (Array.isArray(text)) {
          messageText = this.randomSelection(text)
        }
        else {
          messageText = text
        }
        break
      }
    }

    setTimeout(() => {
      this.showMessage(messageText, 7000, 8)
    }, 3000)
  }

  private generateReferrerMessage() {
    if (document.referrer !== '') {
      const referrer = new URL(document.referrer)
      const domain = referrer.hostname.split('.')[1]
      if (location.hostname === referrer.hostname) {
        return `欢迎阅读<span>「${document.title.split(' - ')[0]}」</span>`
      }
      else {
        const searchParams = referrer.search.split('&')
        if (domain === 'baidu') {
          return `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${searchParams.find(param => param.startsWith('wd='))?.split('=')[1]}</span> 找到的我吗？`
        }
        else if (domain === 'so') {
          return `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${searchParams.find(param => param.startsWith('q='))?.split('=')[1]}</span> 找到的我吗？`
        }
        else if (domain === 'google') {
          return `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span>「${document.title.split(' - ')[0]}」</span>`
        }
        else {
          return `Hello！来自 <span>${referrer.hostname}</span> 的朋友`
        }
      }
    }
    else {
      return `欢迎阅读<span>「${document.title.split(' - ')[0]}」</span>`
    }
  }

  private activityBasedMessages() {
    let userAction = false
    let userActionTimer: number | null | ReturnType<typeof setInterval> = null
    const messageArray = this.live2dTips.message.default

    window.addEventListener('mousemove', () => userAction = true)
    window.addEventListener('keydown', () => userAction = true)

    setInterval(() => {
      if (userAction) {
        userAction = false
        if (userActionTimer !== null) {
          clearInterval(userActionTimer)
          userActionTimer = null
        }
      }
      else if (!userActionTimer) {
        userActionTimer = setInterval(() => {
          this.showMessage(this.randomSelection(messageArray), 6000, 9)
        }, 20000)
      }
    }, 1000)
  }

  private setupAdditionalEvents() {
    window.addEventListener('copy', () => {
      this.showMessage(this.live2dTips.message.copy, 6000, 9)
    })

    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.showMessage(this.live2dTips.message.visibilitychange, 6000, 9)
      }
    })
  }

  private showHitokoto() {
    fetch('https://v1.hitokoto.cn')
      .then(response => response.json())
      .then((result) => {
        const text = `这句一言是 <span>${result.creator}</span>投稿的。`
        this.showMessage(result.hitokoto, 6000, 9)
        setTimeout(() => {
          this.showMessage(text, 4000, 9)
        }, 6000)
      })
  }

  /**
   * Displays a message on the Live2D model's tips element.
   *
   * @param {string | object} text - The message to display, which can be a string or an object.
   *                                 If it's an object, a random selection will be made.
   * @param {number} [timeout] - The time (in milliseconds) for which the message will be visible.
   *                                  Defaults to 3000 ms.
   * @param {number} convertedPriority - The priority of the message. Messages with higher priority
   *                                     will replace lower-priority ones.
   *
   * If the `text` is null or empty, the message will be hidden.
   * The function uses sessionStorage to ensure only messages with a higher priority than
   * the current one are displayed. The message will be automatically hidden after the timeout.
   */
  showMessage(text: string | object, timeout: number = 3000, convertedPriority: number) {
    const tips = document.getElementById('live2d-tips')!

    if (!text) {
      tips.classList.remove('live2d-tips-active')
      return
    }

    const currentPriority = sessionStorage.getItem('live2d-text')

    if (Number(currentPriority) <= convertedPriority) {
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
        this.messageTimer = null
      }

      sessionStorage.setItem('live2d-text', convertedPriority.toString())
      tips.innerHTML = typeof text === 'string' ? text : this.randomSelection(text)
      tips.classList.add('live2d-tips-active')
      this.messageTimer = window.setTimeout(() => {
        sessionStorage.removeItem('live2d-text')
        tips.classList.remove('live2d-tips-active')
      }, timeout)
    }
  }
}
