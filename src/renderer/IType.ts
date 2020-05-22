export interface IHost {
  ip: string
  domain: string
  alias: string
  disabled: boolean
}

export interface ISize {
  width: number
  height: number
}

export interface IAlias {
  [key: string]: string
}
