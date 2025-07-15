export interface Live2dOptions {
  global?: boolean
  /**
   * 追加 Live2D 模型集合, 根据名字进行分组
   */
  live2DCollection?: Live2DCollection
  /**
   * 启用的 Live2D，根据名字进行选择，设置 'all' 为全部启用
   * @defaultValue 'all'
   */
  enableLive2D?: string[] | 'all'
  /**
   * 自定义 tips, 相同配置字段会覆盖默认配置
   */
  live2dTips?: Live2dTips
  /**
   * 设置模型的宽度，高度将根据模型比例自动适配
   * @defaultValue 250
   */
  widthLimit?: number
  /**
   * 设置安全边距，防止模型部分超出显示范围
   * @defaultValue 50
   */
  safetyMargin?: number
  /**
   * 切换角色时是否进行随机选择
   * @defaultValue false
   */
  randomCharacter?: boolean
  /**
   * 切换皮肤时是否进行随机选择
   * @defaultValue false
   */
  randomSkin?: boolean
  /**
   * 是否禁用在控制台输出 PixiJS 的欢迎消息
   * @defaultValue false
   */
  skipHello?: boolean
  /**
   * 隐藏 Live2D 响应式范围, 为 false 则不进行隐藏
   * @defaultValue 640
   */
  hideOnScreenSizes?: number | string | false
  /**
   * 启用的工具列表
   */
  tools?: Record<Live2DToolId, Live2DToolConfig>
  /**
   * 是否开启调试模式
   * @defaultValue false
   */
  debugger?: boolean
  /**
   * Live2D 默认显示状态
   * @defaultValue true
   */
  defaultVisibility?: boolean
  /**
   * Cookie 过期时间（天）
   * @defaultValue 7
   */
  cookieExpires?: number
}

export interface Live2DCollection {
  [key: string]: Live2D
}

export interface Live2D {
  /**
   * 模型加载时显示的消息
   */
  message?: string

  /**
   * 模型链接地址
   * - 当类型为 `string` 时，表示单个模型链接
   * - 当类型为 `string[]` 时，表示多个模型链接
   */
  models: string | string[]

  /**
   * 皮肤 `textures` 文件夹地址。默认情况下会自动获取
   */
  textures?: string
}

export interface Live2dTips {
  mouseover: {
    selector: string
    text: string | string[]
  }[]
  click: {
    selector: string
    text: string | string[]
  }[]
  seasons: {
    date: string
    text: string | string[]
  }[]
  time: {
    hour: string
    text: string | string[]
  }[]
  message: {
    default: string[]
    console: string
    copy: string
    visibilitychange: string
    clothes: string | string[]
  }
  tool: {
    camera: string[]
    display: string[]
  }
}

export interface Live2DToolStateConfig {
  label: string
  bgColor?: string
}

export interface Live2DToolConfig {
  id: string
  visible?: boolean
  action: Live2DToolAction | (() => void)
  /** When Live2D is visible */
  normal?: Live2DToolStateConfig
  /** When Live2D is hidden (only relevant for toggleVisibility action) */
  hidden?: Live2DToolStateConfig
}

export type Live2DToolId
  = | 'hitokoto'
    | 'asteroids'
    | 'switch-model'
    | 'switch-texture'
    | 'photo'
    | 'info'
    | 'quit'

export type Live2DToolAction
    = | 'showHitokoto'
      | 'switchCharacter'
      | 'switchSkin'
      | 'captureFrame'
      | 'toggleVisibility'
