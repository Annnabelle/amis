import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Router from './routes';
import i18n from './i18n';
import { useAppDispatch, useAppSelector } from './store';
import GlobalLoader from 'shared/ui/loader';
import { ThemeContext, type ThemeMode } from './themeContext';
import { fetchCurrentUser, logout, updateUserPreferences } from 'entities/users/model';
import { AppTheme, isLanguage } from 'shared/types/dtos';
import { persistLanguage } from 'shared/lib/languagePreference';
import {
  clearAccess,
  fetchCurrentUserAccess,
  setCurrentCompanyId,
} from 'entities/access/model';
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

const THEME_MODES: readonly ThemeMode[] = [AppTheme.Light, AppTheme.Dark, AppTheme.System];

const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === 'string' && (THEME_MODES as readonly string[]).includes(value);

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(savedTheme) ? savedTheme : AppTheme.System;
};

const prefersDarkScheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolveEffectiveTheme = (
  mode: ThemeMode,
  systemPrefersDark: boolean
): 'light' | 'dark' => {
  if (mode === AppTheme.System) {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return mode;
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

const AccessBootstrap = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const accessToken = useAppSelector((state) => state.users.accessToken);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      void dispatch(fetchCurrentUserAccess());
      void dispatch(fetchCurrentUser());
      return;
    }

    dispatch(clearAccess());
  }, [accessToken, dispatch, isAuthenticated]);

  return null;
};

const CompanyRouteSync = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const companyId =
      pathSegments[0] === 'organization' && pathSegments.length > 1
        ? pathSegments[1]
        : null;

    dispatch(setCurrentCompanyId(companyId));
  }, [dispatch, location.pathname]);

  return null;
};

function App() {
  const dispatch = useAppDispatch();
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const loading = useAppSelector((state) => state.loader.loading);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDarkScheme);
  const [antdThemeTokens, setAntdThemeTokens] = useState(getAntdThemeTokens);
  const appliedPreferencesRef = useRef<string | null>(null);
  const effectiveTheme = resolveEffectiveTheme(themeMode, systemPrefersDark);
  const isDarkTheme = effectiveTheme === 'dark';

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // apply saved theme/language on login / boot refresh
  useEffect(() => {
    const preferences = currentUser?.preferences;
    if (!currentUser || !preferences) {
      appliedPreferencesRef.current = null;
      return;
    }
    const signature = `${currentUser.id}:${preferences.theme}:${preferences.language}`;
    if (appliedPreferencesRef.current === signature) return;
    appliedPreferencesRef.current = signature;

    if (isThemeMode(preferences.theme)) {
      setThemeMode(preferences.theme);
    }
    if (isLanguage(preferences.language)) {
      persistLanguage(preferences.language);
      if (preferences.language !== i18n.language) {
        void i18n.changeLanguage(preferences.language);
      }
    }
  }, [currentUser]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add(THEME_TRANSITION_CLASS);
    root.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    setAntdThemeTokens(getAntdThemeTokens());

    const timeoutId = window.setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      root.classList.remove(THEME_TRANSITION_CLASS);
    };
  }, [themeMode, effectiveTheme]);

  const themeContextValue = useMemo(
    () => ({
      themeMode,
      isDarkTheme,
      setThemeMode,
      toggleTheme: () => {
        const nextTheme = isDarkTheme ? AppTheme.Light : AppTheme.Dark;
        setThemeMode(nextTheme);
        void dispatch(updateUserPreferences({ theme: nextTheme }));
      },
    }),
    [dispatch, isDarkTheme, themeMode]
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
          <AccessBootstrap />
          <CompanyRouteSync />
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
