import ReactDOM from 'react-dom/client'
import App from './App'
import { StoreProvider } from './index'
import { StoreProviderProps } from './types';

const mode = {
  add({ rewrite }) {
    return rewrite(async (state) => Object.assign(state, { count: state.count + 1 }));
  },
  async setValueRandom() {
    return { count: Math.random() }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StoreProvider value={{ count: 0 }} mode={mode}>
    <App />
  </StoreProvider>
)