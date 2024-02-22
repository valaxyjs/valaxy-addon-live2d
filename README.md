# valaxy-addon-live2d

[中文文档](./README_zh.md)

Theme developers can use this as a dependency to quickly integrate the live2d model widget into their projects.

## Usage

```bash
pnpm install valaxy-addon-live2d
```

### For Theme Users

Enable the live2d model widget:

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonLive2d } from 'valaxy-addon-live2d'

export default defineValaxyConfig({
  // Set valaxy-addon-live2d configuration options
  addons: [
    addonLive2d({ }),
  ],
})
```

### Configuration Options

- waifuPath (optional): Specifies the path to the JSON file containing interaction prompts for the Live2D models. The default is 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json'.
- apiPath (optional): Specifies the base path for the Live2D model API. The default is 'https://live2d.fghrsh.net/api/'.
- cdnPath (optional): Specifies the CDN base path for Live2D model resources. The default is 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/'.
- live2dPath (optional): Specifies the base path for the Live2D models and related resources. The default is 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/'.

### Customizable Files

```
live2d.js                       // Live2D core script
waifu-tips.js                   // Live2D model widget extension
waifu-tips.json                 // Live2D model widget prompts
waifu.css                       // Live2D model widget styles
```

## Additional Resources

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)