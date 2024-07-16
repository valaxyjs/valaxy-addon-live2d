import { EventEmitter } from '@pixi/utils'
import type { ModelSettings } from 'pixi-live2d-display'
import { Live2DFactory } from 'pixi-live2d-display'
import { ModelLoadingState } from './ModelLoadingState'
import { Live2DModel } from './Live2DModel'

export class ModelEntity extends EventEmitter {
  live2dModel?: Live2DModel

  source: string | object
  loadingState = new ModelLoadingState()
  name = 'New Model'
  aspectRatio = 1
  loadPromise: Promise<void>

  constructor(source: string | ModelSettings) {
    super()

    this.loadPromise = this.loadModel(source)
  }

  async loadModel(source: string | ModelSettings) {
    this.source = source

    const live2dModel = new Live2DModel()

    this.loadingState.watch(live2dModel)

    try {
      await Live2DFactory.setupLive2DModel(live2dModel, source)

      this.modelLoaded(live2dModel)
      // await this.loadPromise
      this.emit('modelLoaded', live2dModel)
    }
    catch (e) {
      console.error(e instanceof Error ? e.message : `${e}`)
    }
  }

  /**
   * 当Live2D模型加载完成时调用的方法
   * @param {Live2DModel} live2dModel - 加载的Live2D模型
   */
  modelLoaded(live2dModel: Live2DModel) {
    this.live2dModel = live2dModel
    this.name = live2dModel.internalModel.settings.name
    // this.aspectRatio = live2dModel.width / live2dModel.height

    // live2dModel.scale.set(10)

    // draggable(live2dModel)
  }

  destroy() {
    if (this.live2dModel) {
      this.live2dModel.destroy({ children: true })
      this.live2dModel = undefined
    }
  }
}
