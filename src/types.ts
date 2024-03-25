export interface DispatchParams {
  type: string;
  payload?: any;
};

export interface OriginalDispatchParams extends DispatchParams {
  handle: () => any;
  callback: () => any;
};

export type RewriteHandle = (state: any) => Promise<any>;
export type UpdateHandle = (state: any) => any;

export interface DispatchUpdaterParams {
  rewrite: (handle: RewriteHandle) => Promise<any>;
  update: (handle: UpdateHandle) => Promise<any>;
};

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

export interface StoreProviderProps {
  children?: any;
  value: any;
  mode: {
    [key: string]: (params: DispatchUpdaterParams) => Promise<any>;
  }
}