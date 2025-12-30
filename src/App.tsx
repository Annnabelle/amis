import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { ConfigProvider, theme } from 'antd';
import './App.sass'

function App() {
  const { darkAlgorithm } = theme;

  return (
     <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: "#1e90ff", // твой основной цвет
          colorBgBase: "#0d1117",  // цвет фона
          colorTextBase: "#e6e6e6" // цвет текста
        },
      }}
    >
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

