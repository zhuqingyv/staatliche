# Staatliche

_A super simple and user-friendly **React** state management tool developed based on **context** and **reducer**_

## install

``` shell
  npm install Staatliche
```

## use

``` tsx
import { StoreProvider, useStore } from 'staatliche'

const Child = () => {
  const [state, dispatch] = useStore({
    add: ({ rewrite }) => rewrite((state) => Object.assign(state, { count: state.count + 1 }))
  });

  const onClick = async () => {
    const { type, payload, state } = dispatch({ type: 'add', payload: 'hello add' });
    console.log(type, payload, state); // 'add', 'hello add', { count: 1 }
  }

  const onSetValueRandom = () => {
    dispatch({
      type: 'setValueRandom',
      payload: {
        count: Math.random()
      }
    })
  }

  return (
    <div>
      <div>count: {state.count}</div>
      <button onClick={onClick}>add + 1</button>
      <button onClick={() => dispatch({ type: 'sub' })}>sub - 1</button>
      <button onClick={onSetValueRandom}>set value random</button>
    </div>
  );
};

const App = () => {
  const mode = {
    sub: async({ update }) => update((state) => state.count += -1),
    setValueRandom: asnyc ({ state, payload }) => ({ ...state, ...payload })
  };
  return (
    <StoreProvider state={{ count: 1 }} mode={mode}>
      <Child />
    </StoreProvider>
  );
};
```

# API

## useStore(actions)

actions: Object

``` tsx
const [
  state,
  dispatch
] = useStore({
  // This is your actions(Function return Promise!)
  async add({ state, payload }) {
    // Make sure payload & state is an Object!
    return { ...state, ...payload };
  },
  // 'rewrite' param is an Function return a Promise
  // The value of then Promise will replace the old state value
  async rewriteAction({ rewrite }) {
    return rewrite((state, payload) => ({ message: 'hello new state!' }))
  },
  // 'update' param is an Function
  // You can set state.xx = xxx and return nothing!
  async updateAction({ update }) {
    return update((state, payload) => {
      state.message = 'hellow new update state!';
    })
  }
});
```

## StoreProvider

``` tsx
/*
  If there is no corresponding action in the actions of 'useStore'
  it will be searched from 'globalMode'
  If it is not found in the end, the 'dispatch' will throw a Promise error
*/
const globalMode = {};
/*
  Set default state value
*/
const defaultStateValueRef = useRef({ count: 1 });

<StoreProvider
  state={stateValueRef.current}
  mode={globalMode}
>
  <App />
</StoreProvider>
```
