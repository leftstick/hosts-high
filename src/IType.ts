export interface IHost {
  ip: string;
  domain: string;
  alias: string;
  disabled: boolean;
  invalid: boolean;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IAlias {
  [key: string]: string;
}

export interface IPCResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
