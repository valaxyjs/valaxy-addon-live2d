import { Live2DModel as BaseLive2DModel } from 'pixi-live2d-display'
import { Graphics } from '@pixi/graphics'
import { Ticker } from '@pixi/ticker'

BaseLive2DModel.registerTicker(Ticker)

export class Live2DModel extends BaseLive2DModel {
  hitAreaFrames: Graphics

  currentMotionStartTime = performance.now()
  currentMotionDuration = 0

  constructor() {
    super()

    this.hitAreaFrames = new Graphics()
    this.hitAreaFrames.visible = false

    this.once('modelLoaded', this._init)
  }

  _init() {
    this.addChild(this.hitAreaFrames)

    // this.anchor.set(0.5, 0.5)

    this.on('hit', this.startHitMotion)

    this.internalModel.motionManager.on('motionStart', (group: string, index: number) => {
      this.currentMotionStartTime = this.elapsedTime
      this.currentMotionDuration = 0

      const motion = this.internalModel.motionManager.motionGroups[group]?.[index]

      if (motion) {
        if ('_loopDurationSeconds' in motion) {
          this.currentMotionDuration = motion._loopDurationSeconds * 1000
        }
        else if ('getDurationMSec' in motion) {
          this.currentMotionDuration = motion.getDurationMSec()
        }
      }

      const expressionManager = this.internalModel.motionManager.expressionManager

      if (expressionManager) {
        const originalStartMotion = (expressionManager as any)._setExpression;

        (expressionManager as any)._setExpression = (expression: any) => {
          originalStartMotion.call(expressionManager, expression)

          this.emit('expressionSet', expressionManager.expressions.indexOf(expression))
        }

        let reserveExpressionIndex = expressionManager.reserveExpressionIndex

        Object.defineProperty(expressionManager, 'reserveExpressionIndex', {
          get: () => reserveExpressionIndex,
          set: (index: number) => {
            reserveExpressionIndex = index

            this.emit('expressionReserved', index)
          },
        })
      }
    })
  }

  startHitMotion(hitAreaNames: string[]) {
    for (let area of hitAreaNames) {
      area = area.toLowerCase()

      const possibleGroups = [area, `tap${area}`, `tap_${area}`, 'tap']

      for (const possibleGroup of possibleGroups) {
        for (const group of Object.keys(this.internalModel.motionManager.definitions)) {
          if (possibleGroup === group.toLowerCase()) {
            this.motion(group)
            return
          }
        }
      }
    }
  }

  // 交互
  // live2dModel.on('hit', (hitAreas) => {
  //   if (hitAreas.includes('body')) {
  //     live2dModel.motion('tap_body')
  //   }
  // })
}
