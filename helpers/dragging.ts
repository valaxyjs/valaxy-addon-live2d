import type { Live2DModel } from 'pixi-live2d-display'
import type { FederatedPointerEvent } from 'pixi.js'

export interface DraggableLive2DModel extends Live2DModel {
  dragging: boolean
  _pointerX: number
  _pointerY: number
}

export function draggable(_model: Live2DModel) {
  const model = _model as DraggableLive2DModel

  model.on('pointerdown', onPointerDown)
  model.on('pointermove', onPointerMove)
  model.on('pointerup', onPointerUp)
  model.on('pointerupoutside', onPointerUp)
}

function onPointerDown(this: DraggableLive2DModel, e: FederatedPointerEvent) {
  this.dragging = true
  this._pointerX = e.data.global.x - this.x
  this._pointerY = e.data.global.y - this.y
}

function onPointerMove(this: DraggableLive2DModel, e: FederatedPointerEvent) {
  if (this.dragging) {
    this.position.x = e.data.global.x - this._pointerX
    this.position.y = e.data.global.y - this._pointerY
  }
}

function onPointerUp(this: DraggableLive2DModel, _e: FederatedPointerEvent) {
  this.dragging = false
}
