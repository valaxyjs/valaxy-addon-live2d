export interface Live2dOptions {
  global?: boolean

  apiPath?: string
  cdnPath?: string
  live2dPath?: Live2dPathOptions
  tools?: []
}

export interface Live2dPathOptions {
  baseUrl?: string | 'online' | 'local'
  live2dJS?: string
  waifuCSS?: string
  waifuTipsJS?: string
  waifuTipsJson?: string
}
