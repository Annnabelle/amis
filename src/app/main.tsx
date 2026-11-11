import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { ToastContainer } from 'react-toastify'
import App from './App'
// ВРЕМЕННО: проверка, что пакет контрактов попадает в сборку. Удалить после проверки.
import { PackageType } from '@edem2000/amis.contracts'
import './i18n';
import './styles/index.sass'

// ВРЕМЕННО: удалить вместе с импортом выше.
console.log('[amis.contracts] PackageType:', PackageType)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </StrictMode>,
)



