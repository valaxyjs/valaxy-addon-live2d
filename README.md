# valaxy-addon-live2d

<a href="https://www.npmjs.com/package/valaxy-addon-live2d" rel="nofollow"><img src="https://img.shields.io/npm/v/valaxy-addon-live2d?color=0078E7" alt="NPM version"></a>

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
    addonLive2d({})
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
          textures: 'https://api.github.com/repos/fghrsh/live2d_api/contents/model/Potion-Maker/Tia/textures',
        },
        Pio: {
          message: '来自 Potion Maker 的 Pio 酱 ~',
          models: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/model/Potion-Maker/Pio/index.json',
          textures: 'https://api.github.com/repos/fghrsh/live2d_api/contents/model/Potion-Maker/Pio/textures',
        },
      },
      skipHello: true
    })
  ],
})
```

## 配置 / Options

### Live2dOptions

| 属性名            | 类型                            | 默认值  | 说明                                                   |
| ----------------- | ------------------------------- | ------- | ------------------------------------------------------ |
| live2DCollection  | `Live2DCollection`              | ---     | 追加 Live2D 模型集合, 根据名字进行分组                 |
| enableLive2D      | `string[]` \| `'all'`           | `'all'` | 启用的 Live2D，根据名字进行选择，设置 'all' 为全部启用 |
| live2dTips        | `Live2dTips`                    | ---     | 自定义 tips, 相同配置字段会覆盖默认配置                |
| widthLimit        | `number`                        | `250`   | 设置模型的宽度，高度将根据模型比例自动适配             |
| safetyMargin      | `boolean`                       | `50`    | 设置安全边距，防止模型部分超出显示范围                 |
| randomCharacter   | `boolean`                       | `false` | 切换角色时是否进行随机选择                             |
| randomSkin        | `boolean`                       | `false` | 切换皮肤时是否进行随机选择                             |
| skipHello         | `boolean`                       | `false` | 是否禁用在控制台输出 PixiJS 的欢迎消息                 |
| hideOnScreenSizes | `number` \| `string` \| `false` | `640`   | 隐藏 Live2D 响应式范围, 为 false 则不进行隐藏          |
| debugger          | `boolean`                       | `false` | 是否开启调试模式                                       |

### Live2D

`Live2DCollection` 由多个 `Live2D` 组成， 如下是 `Live2D` 的配置

| 属性名   | 类型                   | 默认值 | 说明                                                                                       |
| -------- | ---------------------- | ------ | ------------------------------------------------------------------------------------------ |
| message  | `string`               | ---    | 模型加载时显示的消息                                                                       |
| models   | `string` \| `string[]` | ---    | 模型链接地址，当类型为 `string` 时表示单个模型链接，当类型为 `string[]` 时表示多个模型链接 |
| textures | `string`               | ---    | 皮肤 `textures` 文件夹地址，默认情况下会自动获取                                           |

## TODO

- [ ] 优化 Live2D 拍照工具，防止人物闪烁
- [ ] 兼容 `valaxy-addon-hitokoto` 一言插件
- [ ] 为单个人物提供独立的 tips 配置
- [ ] 优化人物交互的 tips
- [ ] 支持更多的 CDN 纹理地址 url 生成
- [ ] 添加默认人物交互，并增加是否禁用默认交互的配置项
- [ ] 为单个人物配置画布偏移量，防止部分模型偏移
- [ ] 添加更多工具样式
- [ ] 完善工具列表的更多配置项
- [ ] 添加 Live2D 模型声音配置

## 其他

参考或借鉴如下项目

- [Live2D Widget](https://github.com/stevenjoezhang/live2d-widget)
- [live2d](https://github.com/Fog-Forest/live2d)
- [live2d-viewer-web](https://github.com/guansss/live2d-viewer-web)

相关资源：

- [Live2D API](https://github.com/fghrsh/live2d_api)
- [live2d-widget-models](https://github.com/evrstr/live2d-widget-models)
