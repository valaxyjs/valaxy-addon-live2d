import type { InternalModel, Live2DModel, ModelSettings } from 'pixi-live2d-display'
import type { Live2dTipsHandler } from '../helpers/tips'
import type { Live2dOptions, Live2dTips } from '../types'
import { Graphics } from '@pixi/graphics'
import { settings } from '@pixi/settings'
import { SoundManager } from 'pixi-live2d-display'
import { save } from '../helpers/storage'
import { ModelEntity } from './ModelEntity'
import { PixiApp } from './PixiApp'

export class Live2DApp {
  static model: ModelEntity
  static pixiApp: PixiApp
  static widthLimit: number
  static safetyMargin: number
  static scaleRatio: number
  static horizontalAnchorAdjustment: number
  static verticalAnchorAdjustment: number
  static debugger: boolean
  static live2dTipsHandler: Live2dTipsHandler
  static live2dTips: Live2dTips
  static stats: Stats

  private static _volume = SoundManager.volume
  private static _showHitAreaFrames = false
  private static _showModelFrame = false
  private static _showStats = false
  private static _cachedModel: Live2DModel | null = null

  static async init(options: Live2dOptions, live2dTipsHandler: Live2dTipsHandler) {
    settings.RENDER_OPTIONS.hello = !options.skipHello
    Live2DApp.showStats = Live2DApp.debugger = options.debugger!
    Live2DApp.widthLimit = options.widthLimit!
    Live2DApp.safetyMargin = options.safetyMargin!
    Live2DApp.live2dTips = options.live2dTips!
    Live2DApp.live2dTipsHandler = live2dTipsHandler

    if (options.debugger) {
      const Stats = (await import('stats.js')).default
      this.stats = new Stats()
      this.stats.showPanel(1)
      document.body.appendChild(this.stats.dom)
      this.stats.dom.style.left = ''
      this.stats.dom.style.right = '0'
    }
  }

  static async loadModel(source: string | ModelSettings) {
    try {
      const model = new ModelEntity(source)
      this.initModel(model)

      // 保证live2d加载完成
      await model.loadPromise

      this.mount(model.live2dModel!)

      this.model = model

      return model
    }
    catch (error) {
      console.error('Error adding model:', error)
    }
  }

  private static initModel(model: ModelEntity) {
    model.on('modelLoaded', (_live2dModel: Live2DModel) => {
      // if (!this.pixiApp.stage.children.includes(live2dModel)) {
      if (!this.pixiApp) {
        this.pixiApp = new PixiApp(this.stats)
      }
    })
  }

  static async switchModel(source: string | ModelSettings) {
    try {
      // this.removeModel()

      await this.loadModel(source)
    }
    catch (error) {
      console.error('Error switching model:', error)
    }
  }

  static mount(live2dModel: Live2DModel<InternalModel>): void {
    this.clearAppStage()

    if (live2dModel) {
      const widthLimit = this.widthLimit
      const safetyMargin = this.safetyMargin
      this.scaleRatio = widthLimit / live2dModel.width

      const scaledWidth = live2dModel.width * this.scaleRatio
      const scaledHeight = live2dModel.height * this.scaleRatio

      this.pixiApp.renderer.resize(scaledWidth + safetyMargin, scaledHeight + safetyMargin)

      // 设置模型缩放比例, 模型不算安全边距
      live2dModel.scale.set(this.scaleRatio)
      this.pixiApp.stage.addChild(live2dModel)

      // 计算模型相对于视图百分比
      this.horizontalAnchorAdjustment = safetyMargin / scaledWidth
      this.verticalAnchorAdjustment = safetyMargin / scaledHeight

      if (this.debugger) {
        const appBorder = new Graphics()
        appBorder.lineStyle(2, 0xFF0000, 1)
        appBorder.drawRect(0, 0, scaledWidth + safetyMargin, scaledHeight + safetyMargin)

        this.pixiApp.stage.addChild(appBorder)
      }

      /**
       * @see https://pixijs.download/v6.1.1/docs/PIXI.Sprite.html#anchor
       *
       * x: 动态计算水平居中
       * y: 自动计算底部距离
       */
      live2dModel.anchor.set(-(this.horizontalAnchorAdjustment / 2), -this.verticalAnchorAdjustment)

      if (this.debugger) {
        const anchorBorder = new Graphics()
        anchorBorder.lineStyle(2, 0x00FF00, 1)
        anchorBorder.drawRect(
          -live2dModel.width * live2dModel.anchor.x,
          -live2dModel.height * live2dModel.anchor.y,
          live2dModel.width,
          live2dModel.height,
        )

        this.pixiApp.stage.addChild(anchorBorder)
      }
    }
    else {
      console.error('挂载模型失败, live2dModel 参数无效或为空')
    }
  }

  static clearAppStage(live2dModel?: Live2DModel<InternalModel>): void {
    if (live2dModel && this.pixiApp.stage.children.includes(live2dModel)) {
      this.pixiApp.stage.removeChild(live2dModel)
      return
    }

    const childLen = this.pixiApp.stage.children.length || 0

    if (childLen > 0) {
      this.pixiApp.stage.removeChildren(0)
    }
  }

  static captureFrame() {
    this.model.live2dModel!.anchor.set(0)
    this.model.live2dModel!.scale.set(1)

    const pixiModel = this.model.live2dModel
    settings.RESOLUTION = 1

    // HACK: Later change to a hook instead of a fixed setTimeout. Is there a more convenient way to take a snapshot?
    setTimeout(() => {
      try {
        const renderer = this.pixiApp.renderer
        const image = renderer.plugins.extract.image(pixiModel!, 'image/png', 0.9)

        const link = document.createElement('a')
        link.href = image.src
        link.download = 'live2d-photo.png'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        this.model.live2dModel!.scale.set(this.scaleRatio)
        this.model.live2dModel!.anchor.set(-(this.horizontalAnchorAdjustment / 2), -this.verticalAnchorAdjustment)

        this.live2dTipsHandler.showMessage(this.live2dTips.tool.camera, 6000, 9)
      }
      catch (e) {
        console.warn(e)
      }
    }, 100)
  }

  static hideModel() {
    if (this.model?.live2dModel) {
      this._cachedModel = this.model.live2dModel
      this.pixiApp.stage.removeChild(this.model.live2dModel)
    }
  }

  static async showModel() {
    if (this._cachedModel && !this.pixiApp.stage.children.includes(this._cachedModel)) {
      this.pixiApp.stage.addChild(this._cachedModel)
    }
  }

  static async destroyModel() {
    this.clearAppStage()
     
    if (this.model) {
      this.model.destroy()
      this.model = null
    }
  }

  static async restoreModel(source: string | ModelSettings) {
    await this.loadModel(source);
  }

  @save('stats')
  static set showStats(value: boolean) {
    this._showStats = value

    if (!this.stats)
      return

    if (value) {
      document.body.appendChild(this.stats.dom)
    }
    else {
      this.stats.dom.parentElement?.removeChild(this.stats.dom)
    }
  }

  static get showStats(): boolean {
    return this._showStats
  }

  @save('volume')
  static set volume(value: number) {
    this._volume = value
    SoundManager.volume = value
  }

  static get volume(): number {
    return this._volume
  }

  static get showModelFrame(): boolean {
    return this._showModelFrame
  }

  @save('hitAreaFrames')
  static set showHitAreaFrames(value: boolean) {
    this._showHitAreaFrames = value

    if (this.model?.live2dModel) {
      this.model.live2dModel.hitAreaFrames.visible = value
    }
  }

  static get showHitAreaFrames(): boolean {
    return this._showHitAreaFrames
  }
}
