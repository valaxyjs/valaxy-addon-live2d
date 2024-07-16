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
        this.showMessage(text, 7000, true)
        this.messageArray.push(text)
      }
    })
  }

  private randomSelection(obj) {
    return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj
  }

  private welcomeMessage() {
    const now = new Date().getHours()
    let text
    const timeConfig = this.live2dTips.time

    for (let i = 0; i < timeConfig.length; i++) {
      const timeRange = timeConfig[i].hour.split('-')
      const startHour = Number.parseInt(timeRange[0])
      const endHour = Number.parseInt(timeRange[1])

      if (now >= startHour && now <= endHour) {
        if (Array.isArray(timeConfig[i].text)) {
          text = this.randomSelection(timeConfig[i].text)
        }
        else {
          text = timeConfig[i].text
        }
        break
      }
    }

    setTimeout(() => {
      this.showMessage(text, 7000, 8)
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
          return `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${searchParams.find(param => param.startsWith('wd=')).split('=')[1]}</span> 找到的我吗？`
        }
        else if (domain === 'so') {
          return `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${searchParams.find(param => param.startsWith('q=')).split('=')[1]}</span> 找到的我吗？`
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
    let userActionTimer
    const messageArray = this.live2dTips.message.default

    window.addEventListener('mousemove', () => userAction = true)
    window.addEventListener('keydown', () => userAction = true)

    setInterval(() => {
      if (userAction) {
        userAction = false
        clearInterval(userActionTimer)
        userActionTimer = null
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

  showMessage(text, timeout, priority) {
    const tips = document.getElementById('live2d-tips')

    if (!text) {
      tips.classList.remove('live2d-tips-active')
      return
    }

    if (!sessionStorage.getItem('live2d-text') || sessionStorage.getItem('live2d-text') <= priority) {
      if (this.messageTimer) {
        clearTimeout(this.messageTimer)
        this.messageTimer = null
      }
      text = this.randomSelection(text)
      sessionStorage.setItem('live2d-text', priority)
      tips.innerHTML = text
      tips.classList.add('live2d-tips-active')
      this.messageTimer = window.setTimeout(() => {
        sessionStorage.removeItem('live2d-text')
        tips.classList.remove('live2d-tips-active')
      }, timeout)
    }
  }
}
