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

~~~ts
export interface Live2dOptions {
  global?: boolean

  apiPath?: string
  cdnPath?: string
  live2dPath?: {
    baseUrl?: string | 'online' | 'local'
    live2dJS?: string
    waifuCSS?: string
    waifuTipsJS?: string
    waifuTipsJson?: string
  }
  tools?: []
}
~~~

| Configuration Item | Description | Default Value |
|---|---|---|
| **apiPath** (optional) | Used to specify the base path for the Live2D model **API** | `https://live2d.fghrsh.net/api/` |
| **cdnPath** (optional) | Used to specify the base path for the Live2D model resources **CDN** | `https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/` |
| **live2dPath** (optional) | Used to specify the configuration items for the Live2D model and related resources |
| **live2dPath.baseUrl** (optional) | Set to `'online'` to use the online version of Live2D models and related resources. Set to `'local'` to enable the local version of Live2D models and related resources. Allows for custom Live2D URL path prefix settings | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/` |
| **live2dPath.live2dJS** (optional) | Used to specify the path for storing the Live2D core files | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js` |
| **live2dPath.waifuCSS** (optional) | Used to specify the path for storing the Live2D stylesheet files | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu.css` |
| **live2dPath.waifuTipsJS** (optional) | Used to specify the path for storing the JS files for Live2D model interaction extensions | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.js` |
| **live2dPath.waifuTipsJson** (optional) | Used to specify the path for storing the JSON files for Live2D model interaction prompts | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json` |

- When both `apiPath` and `cdnPath` are filled in, `apiPath` is enabled by default.
- Setting `live2dPath.baseUrl` establishes the basic prefix path for all configuration items within `live2dPath`. If specific paths are designated for individual configuration items (such as `live2dJS`, `waifuCSS`, etc.), these items will use the specified paths, thus overriding the default path settings derived from `baseUrl`.


### Customizable Files

```
live2d.js                       // Live2D core script
waifu.css                       // Live2D model widget styles
waifu-tips.js                   // Live2D model widget extension
waifu-tips.json                 // Live2D model widget prompts
```

## Additional Resources

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)