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

- waifuPath (可选): 用于指定存储Live2D模型交互提示信息的JSON文件的路径。默认值为 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json'。
- apiPath (可选): 用于指定Live2D模型API的基础路径。默认值为 'https://live2d.fghrsh.net/api/'。
- cdnPath (可选): 用于指定Live2D模型资源的CDN基础路径。默认值为 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/'。
- live2dPath (可选): 用于指定Live2D模型和相关资源的基础路径。默认值为 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/'。

### 可自定义文件

~~~
live2d.js                       // Live2D 核心
waifu-tips.js                   // Live2D 看板娘 扩展
waifu-tips.json                 // Live2D 看板娘 提示语
waifu.css                       // Live2D 看板娘 样式表
~~~

## 其他

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)
