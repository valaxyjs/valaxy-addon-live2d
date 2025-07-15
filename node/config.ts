import type { Live2dOptions } from '../types'
import { captureLive2dImage, loadAsteroids } from '../utils/tools'

export const defaultLive2DOptions: Live2dOptions = {
  widthLimit: 250,
  safetyMargin: 50,
  randomCharacter: false,
  randomSkin: false,
  skipHello: false,
  hideOnScreenSizes: 640,
  debugger: false,
  defaultVisibility: true,
  cookieExpires: 7,
  tools: {
    'quit': {
      id: 'live2d-tool-quit',
      action: 'toggleVisibility',
      visible: true,
      normal: {
        label: 'Hide',
        bgColor: '#9c27b0',
      },
      hidden: {
        label: 'Show',
        bgColor: '#4caf50',
      },
    },
    'switch-model': {
      id: 'live2d-tool-switch-model',
      action: 'switchCharacter',
      visible: true,
      normal: {
        label: 'Char',
        bgColor: '#673ab7',
      },
    },
    'switch-texture': {
      id: 'live2d-tool-switch-texture',
      action: 'switchSkin',
      visible: true,
      normal: {
        label: 'Skin',
        bgColor: '#009688',
      },
    },
    'photo': {
      id: 'live2d-tool-photo',
      action: captureLive2dImage,
      visible: true,
      normal: {
        label: 'Cap',
        bgColor: '#ff9800',
      },
    },
    'hitokoto': {
      id: 'live2d-hitokoto',
      action: 'showHitokoto',
      visible: false,
      normal: { label: 'Hitokoto', bgColor: '#4caf50' },
    },
    'asteroids': {
      id: 'live2d-asteroids',
      action: loadAsteroids,
      visible: false,
      normal: { label: 'Asteroids', bgColor: '#9c27b0' },
    },
    'info': {
      id: 'info',
      action: () => {
        open('https://github.com/valaxyjs/valaxy-addon-live2d')
      },
      visible: true,
      normal: { label: 'Info', bgColor: '#2196f3' },
    },
  },
}
