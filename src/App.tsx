import { useStore } from './index'

const App = () => {
  const [state, dispatch] = useStore({
    sub: async ({ update }) => update(async (state) => {
      state.count = 5;
    }), // 更新state的函数
  })

  const onClick = () => {
    dispatch({
      type: 'add',
    });
  };

  const onSet5 = () => {
    dispatch({
      type: 'sub',
    });
  };

  const onSetValueRandom = () => {
    dispatch({
      type: 'setValueRandom'
    })
  };

  console.log(state)

  return (
    <div>
      <div>count: {state.count}</div>
      <button onClick={onClick}>加1</button>
      <button onClick={onSet5}>设置5</button>
      <button onClick={onSetValueRandom}>set value random</button>
    </div>
  )
};
export default App;