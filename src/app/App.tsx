import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Router from './routes';
import { useAppSelector } from './store';
import GlobalLoader from 'shared/ui/loader';
import { ThemeContext, type ThemeMode } from './themeContext';
import './styles/App.sass';

const THEME_STORAGE_KEY = 'amis-theme-mode';
const THEME_TRANSITION_CLASS = 'theme-transition';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return 'light';
};

function App() {
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const loading = useAppSelector((state) => state.loader.loading);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const isDarkTheme = themeMode === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(THEME_TRANSITION_CLASS);
    root.setAttribute('data-theme', themeMode);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    const timeoutId = window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      root.classList.remove(THEME_TRANSITION_CLASS);
    };
  }, [themeMode]);

  const themeContextValue = useMemo(
    () => ({
      themeMode,
      isDarkTheme,
      setThemeMode,
      toggleTheme: () => {
        setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
      },
    }),
    [isDarkTheme, themeMode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: '#1E90FF',
            colorBgBase: isDarkTheme ? '#090A0C' : '#FAFAFA',
            colorTextBase: isDarkTheme ? '#EAEAEA' : '#1E1E1E',
          },
        }}
      >
        <GlobalLoader loading={loading} />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
