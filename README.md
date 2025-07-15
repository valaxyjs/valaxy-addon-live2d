<h1 align="center">valaxy-addon-live2d</h1>

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

**valaxy-addon-live2d** 是专为 Valaxy 设计的 live2d 看板娘组件。该插件基于 [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) 和 [pixi.js](https://pixijs.com/) 对 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget) 进行了重构和增强，提供了更多功能和更好的模块化支持

## 安装插件

```bash
pnpm add valaxy-addon-live2d
```

## 基础配置

在默认情况下，插件包含一些默认 `live2DCollection` 配置，详情请参见 [live2DCollection](https://github.com/valaxyjs/valaxy-addon-live2d/tree/main/constants/live2dCollection.ts)

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonLive2d } from 'valaxy-addon-live2d'

export default defineValaxyConfig({
  addons: [
    addonLive2d()
  ],
})
```

## 配置示例

您可以选择覆盖或自定义配置。在 `live2DCollection` 中，相同模型名字会被覆盖。以下是一个简单的自定义配置示例：

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonLive2d } from 'valaxy-addon-live2d'

export default defineValaxyConfig({
  addons: [
    addonLive2d({
      enableLive2D: ['XiaoYun', 'Tia', 'Pio'],
      live2DCollection: {
        XiaoYun: {
          message: '来自云游君的小云 ~',
          models: ['https://cdn.jsdelivr.net/npm/@yunyoujun/live2d@latest/小云.model3.json'],
        },
        // https://github.com/fghrsh/live2d_api
        Tia: {
          message: '来自 Potion Maker 的 Tia 酱 ~',
          models: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Tia/index.json',
        },
        Pio: {
          message: '来自 Potion Maker 的 Pio 酱 ~',
          models: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Pio/index.json',
        },
      },
    })
  ],
})
```

<details>
<summary>完整配置示例</summary><br>

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonLive2d } from 'valaxy-addon-live2d'

export default defineValaxyConfig({
  addons: [
    addonLive2d({
      enableLive2D: ['Tia', 'Pio', 'Type95', 'HK416'],
      widthLimit: 290,
      live2DCollection: {
        Type95: {
          models: [
            'https://registry.npmmirror.com/weblive2d/latest/files/model/95type/95type_3702/normal/index.json',
            'https://registry.npmmirror.com/weblive2d/latest/files/model/95type/95type_3702/destroy/index.json',
          ],
        },
        HK416: {
          models: [
            'https://registry.npmmirror.com/weblive2d/latest/files/model/HK416/HK416_3401/destroy/index.json',
            'https://registry.npmmirror.com/weblive2d/latest/files/model/HK416/HK416_3401/normal/index.json',
            'https://registry.npmmirror.com/weblive2d/latest/files/model/HK416/HK416_805/normal/index.json',
            'https://registry.npmmirror.com/weblive2d/latest/files/model/HK416/HK416_805/destroy/index.json',
          ],
        },
      },
      tools: {
        hitokoto: {
          visible: true,
        },
        asteroids: {
          visible: true,
        },
      },
      skipHello: true,
    }),
  ]
})
```

<br></details>

## 配置 / Options

### Live2dOptions

| 属性名            | 类型                                                       | 默认值                                        | 说明                                                   |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| live2DCollection  | `Live2DCollection`                                         | ---                                           | 追加 Live2D 模型集合, 根据名字进行分组                 |
| enableLive2D      | `string[]` \| `'all'`                                      | `'all'`                                       | 启用的 Live2D，根据名字进行选择，设置 'all' 为全部启用 |
| live2dTips        | `Live2dTips`                                               | ---                                           | 自定义 tips, 相同配置字段会覆盖默认配置                |
| widthLimit        | `number`                                                   | `250`                                         | 设置模型的宽度，高度将根据模型比例自动适配             |
| safetyMargin      | `boolean`                                                  | `50`                                          | 设置安全边距，防止模型部分超出显示范围                 |
| randomCharacter   | `boolean`                                                  | `false`                                       | 切换角色时是否进行随机选择                             |
| randomSkin        | `boolean`                                                  | `false`                                       | 切换皮肤时是否进行随机选择                             |
| skipHello         | `boolean`                                                  | `false`                                       | 是否禁用在控制台输出 PixiJS 的欢迎消息                 |
| hideOnScreenSizes | `number` \| `string` \| `false`                            | `640`                                         | 隐藏 Live2D 响应式范围, 为 false 则不进行隐藏          |
| tools             | `Partial<Record<Live2DToolId, Partial<Live2DToolConfig>>>` | 隐藏 Live2D 响应式范围, 为 false 则不进行隐藏 |
| debugger          | `boolean`                                                  | `false`                                       | 是否开启调试模式                                       |
| defaultVisibility | `boolean`                                                  | `true`                                        | Live2D 默认显示状态                                    |
| cookieExpires     | `number`                                                   | `7`                                           | Cookie 过期时间（天）                                  |

### Live2D

`Live2DCollection` 由多个 `Live2D` 实例组成， 如下是 `Live2D` 的配置

| 属性名  | 类型                   | 默认值 | 说明                                                                                       |
| ------- | ---------------------- | ------ | ------------------------------------------------------------------------------------------ |
| message | `string`               | ---    | 模型加载时显示的消息                                                                       |
| models  | `string` \| `string[]` | ---    | 模型链接地址，当类型为 `string` 时表示单个模型链接，当类型为 `string[]` 时表示多个模型链接 |

> [!IMPORTANT]
> 当 models 为 string[] 时，无论 textures 数量多少，都会视为一个皮肤组。部分 Live2D 通过多个 model.json 区分皮肤以实现兼容。若 CDN 前缀为 <https://cdn.jsdelivr.net> 将自动获取 github 地址补充完整 textures 列表（因多数 model.json 仅含一个 textures 项）。私有部署需手动补全 textures 配置。

### Live2DToolConfig

`tools` 属性用于配置 Live2D 的工具栏选项

| 属性名  | 类型                                                                                                                  | 默认值 | 说明                                                              |
| ------- | --------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------- |
| id      | `'hitokoto'` \| `'asteroids'` \| `'switch-model'` \| `'switch-texture'` \| `'photo'` \| `'info'` \| `'quit'`          | ---    | 工具的唯一标识符                                                  |
| visible | `boolean`                                                                                                             | `true` | 工具是否可见                                                      |
| action  | `'showHitokoto'` \| `'switchCharacter'` \| `'switchSkin'` \| `'captureFrame'` \| `'toggleVisibility'` \| `() => void` | ---    | 工具触发的动作，可以是内置动作或自定义函数                        |
| normal  | `Live2DToolStateConfig`                                                                                               | ---    | Live2D 可见状态下的工具样式配置                                   |
| hidden  | `Live2DToolStateConfig`                                                                                               | ---    | Live2D 隐藏状态下的工具样式配置（仅对 toggleVisibility 动作有效） |

### Live2DToolStateConfig

工具状态样式配置：

| 属性名  | 类型     | 默认值 | 说明                     |
| ------- | -------- | ------ | ------------------------ |
| label   | `string` | ---    | 工具显示的文本标签       |
| bgColor | `string` | ---    | 工具的背景颜色（CSS 值） |

### 预定义工具列表

以下是可用的工具 ID 及其对应的默认行为：

| 工具 ID          | 默认动作           | 说明                                     |
| ---------------- | ------------------ | ---------------------------------------- |
| `hitokoto`       | `showHitokoto`     | 一言 (需安装 valaxy-addon-hitokoto 插件) |
| `asteroids`      | -                  | 小飞机游戏                               |
| `switch-model`   | `switchCharacter`  | 切换角色模型                             |
| `switch-texture` | `switchSkin`       | 切换皮肤                                 |
| `photo`          | `captureFrame`     | Live2D 截图                              |
| `info`           | -                  | 项目地址                                 |
| `quit`           | `toggleVisibility` | 隐藏/显示 Live2D 模型                    |

## TODO

- [x] 优化 Live2D 拍照工具，防止人物闪烁
- [x] 兼容 `valaxy-addon-hitokoto` 一言插件
- [ ] 为单个人物提供独立的 tips 配置
- [x] 优化人物交互的 tips
<!-- - [ ] 支持更多的 CDN 纹理地址 url 生成 -->
- [ ] 添加默认人物交互，并增加是否禁用默认交互的配置项
<!-- - [ ] 为单个人物配置画布偏移量，防止部分模型偏移 -->
- [ ] 添加更多工具样式
- [x] 完善工具列表的更多配置项
- [ ] 添加 Live2D 模型声音配置

## 其他

参考或借鉴如下项目

- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)
- [live2d-viewer-web](https://github.com/guansss/live2d-viewer-web)

相关资源：

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [live2d-widget-models](https://github.com/evrstr/live2d-widget-models)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/valaxy-addon-live2d?style=flat&colorA=18181B&colorB=9333ea
[npm-version-href]: https://npmjs.com/package/valaxy-addon-live2d
[npm-downloads-src]: https://img.shields.io/npm/dm/valaxy-addon-live2d.svg?style=flat&colorA=18181B&colorB=9333ea
[npm-downloads-href]: https://npm.chart.dev/valaxy-addon-live2d
