# valaxy-addon-live2d

主题开发者可以通过将其作为依赖使用，以快速集成 live2d看板娘组件。

## Usage

```bash
pnpm install valaxy-addon-live2d
```

### 主题使用者

启用 live2d看板娘

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonLive2d } from 'valaxy-addon-live2d'

export default defineValaxyConfig({
  // 设置 valaxy-addon-live2d 配置项
  addons: [
    addonLive2d({ }),
  ],
})
```

### 配置选项

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

| 配置项 | 描述 | 默认值 |
|---|---|---|
| **apiPath** (可选) | 用于指定Live2D模型**API**的基础路径 | `https://live2d.fghrsh.net/api/` |
| **cdnPath** (可选) | 用于指定Live2D模型资源的**CDN**基础路径 | `https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/` |
| **live2dPath** (可选) | 用于指定Live2D模型和相关资源的配置项 | 
| **live2dPath.baseUrl** (可选) | 设置`'online'`使用在线版的Live2D模型和相关资源、设置为`'custom'`时，使用自定义的Live2D文件路径，此路径可能会被覆盖。设置其他为自定义前缀。| `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/` | 
| **live2dPath.live2dJS** (可选) | 用于指定存储Live2D核心文件的路径 | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js` |
| **live2dPath.waifuCSS** (可选) | 用于指定存储Live2D样式表文件的路径 | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu.css` |
| **live2dPath.waifuTipsJS** (可选) | 用于指定存储Live2D模型交互扩展的JS文件的路径 | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.js` |
| **live2dPath.waifuTipsJson** (可选) | 用于指定存储Live2D模型交互提示语的JSON文件的路径 | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json` |


- 当`apiPath`和`cdnPath`都填入的时候默认启用`apiPath`
- `live2dPath.baseUrl` 设置了`live2dPath`中所有配置项的基本前缀路径。如果为单独的配置项（如`live2dJS`、`waifuCSS`等）指定了具体路径，则这些配置项将使用指定的路径，从而覆盖由`baseUrl`派生的默认路径设置

### 自定义Live2D文件

~~~
live2d.js                       // Live2D 核心
waifu.css                       // Live2D 看板娘 样式表
waifu-tips.js                   // Live2D 看板娘 交互扩展
waifu-tips.json                 // Live2D 看板娘 提示语
~~~

## 其他

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)
