import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Router from './routes';
import { useAppDispatch, useAppSelector } from './store';
import GlobalLoader from 'shared/ui/loader';
import { ThemeContext, type ThemeMode } from './themeContext';
import { logout } from 'entities/users/model';
import { AUTH_SESSION_EXPIRED_EVENT, isStoredSessionExpired } from 'shared/lib/authSession';
import './styles/App.sass';

const THEME_STORAGE_KEY = 'amis-theme-mode';
const THEME_TRANSITION_CLASS = 'theme-transition';

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const getAntdThemeTokens = () => ({
  colorPrimary: getCssVariable('--main-primary'),
  colorBgBase: getCssVariable('--main-bg'),
  colorTextBase: getCssVariable('--basic-black'),
});

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return 'light';
};

const AuthSessionGuard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
      navigate('/', { replace: true });
    };

    const handleSessionCheck = () => {
      if (isStoredSessionExpired()) {
        handleLogout();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleSessionCheck();
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken' && !event.newValue) {
        handleLogout();
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleLogout);
    window.addEventListener('focus', handleSessionCheck);
    window.addEventListener('pageshow', handleSessionCheck);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleSessionCheck();

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleLogout);
      window.removeEventListener('focus', handleSessionCheck);
      window.removeEventListener('pageshow', handleSessionCheck);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, navigate]);

  return null;
};

function App() {
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const loading = useAppSelector((state) => state.loader.loading);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [antdThemeTokens, setAntdThemeTokens] = useState(getAntdThemeTokens);
  const isDarkTheme = themeMode === 'dark';

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add(THEME_TRANSITION_CLASS);
    root.setAttribute('data-theme', themeMode);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    setAntdThemeTokens(getAntdThemeTokens());

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
          token: antdThemeTokens,
        }}
      >
        <GlobalLoader loading={loading} />
        <BrowserRouter>
          <AuthSessionGuard />
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
