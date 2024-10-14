import { defineTheme } from 'valaxy'

export default defineTheme({
  vite: {
    optimizeDeps: {
      include: [
        '@pixi/utils',
        '@pixi/graphics',
        '@pixi/settings',
        '@pixi/app',
        '@pixi/core',
        '@pixi/extract',
        '@pixi/ticker',
      ],
    },
  },
})
