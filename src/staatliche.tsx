import { createContext, FC, useReducer as reactUseReducer, useContext, Dispatch } from 'react';
import { Mode, DispatchParams, ReducerParams, RewriteHandle, UpdateHandle, UpdateEnum, StoreProviderProps, UseStoreType } from './types';

export const createStore = () => {
  const useMode = async (reducerParams: ReducerParams) => {
    // 更新模式
    let changeMode: any = UpdateEnum.NULL;
  
    const { state, type, payload, handle, callback } = reducerParams;
  
    // 重写模式
    const rewrite = async (method: RewriteHandle): Promise<any> => {
      changeMode = UpdateEnum.RE_WRITE;
      return await method(state, payload);
    };
    // 更新模式
    const update = async (method: UpdateHandle): Promise<any> => {
      changeMode = UpdateEnum.UPDATE;
      await method(state, payload);
    };
  
    const newState = await handle({ rewrite, update, payload, state });
  
    switch (changeMode) {
      case UpdateEnum.RE_WRITE: {
        return {
          state: newState,
          type,
          payload,
          callback
        };
      }
      case UpdateEnum.UPDATE: {
        return {
          state,
          type,
          payload,
          callback
        }
      }
      default: {
        return {
          state: newState !== undefined ? newState : state,
          type,
          payload,
          callback
        }
      }
    }
  };
  
  const StateContext = createContext<any>({});
  const DispatchContext = createContext<any>(useMode);
  const ModeContext = createContext<any>({});
  
  const useReducer = (initState: any, subscribe: (state: any) => any) => {
    // 初始化state值
    const [state, dispatch] = reactUseReducer(
      (...args: any[]) => {
        const newState = { ...args[1] };
        subscribe(newState);
        return newState
      },
      initState
    ) as [any, Dispatch<any>];
  
    // 处理 dispatch 返回值
    const reducerProxy = async (params: ReducerParams) => {
      const { state, type, payload, callback } = await useMode(params);
      await dispatch(state);
      callback && callback({ state, type, payload });
      return { state, type, payload };
    };
    return [state, reducerProxy] as const; // 返回一个元组
  };
  
  const StoreProvider: FC<any> = ({ children, state: defaultState, mode, subscribe = () => null }: StoreProviderProps) => {
    const [state, dispatch] = useReducer(defaultState, subscribe);
  
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <ModeContext.Provider value={mode}>
            { children }
          </ModeContext.Provider>
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
  };
  
  const useStore: UseStoreType = (mode?: Mode) => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const commonMode = useContext(ModeContext);
  
    const getMode = (type: string) => {
      if (mode && mode[type]) return mode[type];
      return commonMode[type];
    };
  
    const dispatchHandle = async ({ type, payload }: DispatchParams, callback?: any) => {
      const handle = getMode(type);
      if (!handle) return Promise.reject({ message: 'no handle' });
  
      return await dispatch({ state, type, payload, handle, callback });
    };
  
    return [state, dispatchHandle];
  };

  return {
    StoreProvider,
    useStore
  };
};
