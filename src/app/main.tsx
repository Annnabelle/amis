import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { ToastContainer } from 'react-toastify'
import App from './App'
import { i18nReady } from './i18n';
import { renderConfigErrorScreen } from './configErrorScreen';
import { runtimeConfigProblems } from 'shared/config/runtime'
import './styles/index.sass'

if (runtimeConfigProblems.length) {
  // Без адреса API поднимать приложение незачем: каждый запрос уйдёт в никуда.
  renderConfigErrorScreen(runtimeConfigProblems);
} else {
  /** Переводы активного языка грузятся чанком — ждём до первого рендера. */
  await i18nReady;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <ToastContainer />
        <App />
      </Provider>
    </StrictMode>,
  )
}
