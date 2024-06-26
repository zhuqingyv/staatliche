export interface DispatchParams {
  type: string;
  payload?: any;
};

export interface OriginalDispatchParams extends DispatchParams {
  handle: () => any;
  callback: () => any;
};

export type RewriteHandle = (state: any, payload?: any) => Promise<any>;
export type UpdateHandle = (state: any, payload?: any) => any;

export interface DispatchUpdaterParams {
  rewrite: (handle: RewriteHandle) => Promise<any>;
  update: (handle: UpdateHandle) => Promise<any>;
  state: any,
  payload?: any;
};

export type DispatchHandle = (params: DispatchParams) => Promise<any>;

export interface ReducerParams {
  state: any;
  callback: (state: any) => any;
  handle: (params: DispatchUpdaterParams) => Promise<any>;
  type: string;
  payload?: any;
};

export enum UpdateEnum {
  NULL = 'NULL',
  RE_WRITE = 'RE_WRITE',
  UPDATE = 'UPDATE'
}

export interface Mode {
  [key: string]: DispatchHandle;
}

export interface StoreProviderProps {
  children?: any;
  state: any;
  mode: Mode,
  subscribe?: (state: any) => any
}

export type UseStoreType = (mode?: Mode) => [any, DispatchHandle];