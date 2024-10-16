import type { Renderer } from '@pixi/core'
import type Stats from 'stats.js'
import { Application } from '@pixi/app'
import { BatchRenderer, extensions } from '@pixi/core'
import { Extract } from '@pixi/extract'
import { TickerPlugin } from '@pixi/ticker'

extensions.add(TickerPlugin, Extract, BatchRenderer)

export class PixiApp extends Application {
  declare renderer: Renderer

  constructor(stats: Stats) {
    const view = document.getElementById('live2d-canvas') as HTMLCanvasElement

    if (!view)
      console.warn('The view element with id "live2d" was not found in the document.')
    else if (!(view instanceof HTMLCanvasElement))
      console.warn('The view element must be an instance of HTMLCanvasElement.')

    super({
      view,
      antialias: true,
      resolution: 2,
      autoStart: true,
      autoDensity: true,
      backgroundAlpha: 0,
      width: 0,
      height: 0,
    })

    this.ticker.remove(this.render, this)

    this.ticker.add(() => {
      stats?.begin()

      this.render()

      stats?.end()
    })
  }
}
