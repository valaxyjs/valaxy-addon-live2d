import type { Live2DModel } from 'pixi-live2d-display'
import { lowerCase } from 'lodash-es'

enum StageState {
  NOT_AVAILABLE, PENDING, COMPLETED, FAILED,
}

export class ModelLoadingState {
  stages = {
    settingsJSON: StageState.PENDING,
    settings: StageState.NOT_AVAILABLE,
    textures: StageState.NOT_AVAILABLE,
    internalModel: StageState.NOT_AVAILABLE,
    pose: StageState.NOT_AVAILABLE,
    physics: StageState.NOT_AVAILABLE,
  }

  text = ''

  constructor() {
    this.updateText()
  }

  watch(model: Live2DModel) {
    model
      .once('settingsJSONLoaded', () => this.complete('settingsJSON', model))
      .once('settingsLoaded', () => this.complete('settings', model))
      .once('textureLoaded', () => this.complete('textures', model))
      .once('modelLoaded', () => this.complete('internalModel', model))

      .once('poseLoaded', () => this.complete('pose', model))
      .once('physicsLoaded', () => this.complete('physics', model))
  }

  complete(stage: keyof ModelLoadingState['stages'], model: Live2DModel) {
    if (stage !== 'settingsJSON' && this.stages.settingsJSON !== StageState.COMPLETED) {
      this.complete('settingsJSON', model)
      this.complete('settings', model)
    }

    this.stages[stage] = StageState.COMPLETED

    if (stage === 'settingsJSON') {
      this.stages.settings = StageState.PENDING
    }
    else if (stage === 'settings') {
      this.stages.textures = StageState.PENDING
      this.stages.internalModel = StageState.PENDING
      // model.factoryContext.settings!.pose && (this.stages.pose = StageState.PENDING)
      // model.factoryContext.settings!.physics && (this.stages.physics = StageState.PENDING)
    }

    this.updateText()
  }

  updateText() {
    this.text = Object.entries(this.stages).map(
      ([stage, state]) => {
        if (state === StageState.NOT_AVAILABLE) {
          return ''
        }

        let mark

        switch (state) {
          case StageState.PENDING:
            mark = '[ ]'
            break
          case StageState.COMPLETED:
            mark = '[x]'
            break
          case StageState.FAILED:
            mark = ' X '
            break
        }

        return `${mark} Loading ${lowerCase(stage)}`
      },
    ).filter(Boolean).join('\n')
  }
}
