import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import { ConfigProvider, theme } from 'antd';
import './App.sass'
import {useAppSelector} from "./store";
import GlobalLoader from "./components/loader";

function App() {
  const { darkAlgorithm } = theme;
    const loading = useAppSelector((state) => state.loader.loading);

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
         <GlobalLoader loading={loading} />
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App

