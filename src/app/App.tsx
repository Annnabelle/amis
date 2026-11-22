import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import Router from './routes';
import i18n from './i18n';
import { useAppDispatch, useAppSelector } from './store';
import GlobalLoader from 'shared/ui/loader';
import { ThemeContext, type ThemeMode } from './themeContext';
import {
  sessionRefreshed,
  sessionRestoreFailed,
  sessionRestored,
} from 'entities/users/model';
import { useLogout } from 'entities/users/lib/useLogout';
import {
  useGetCurrentUserQuery,
  useUpdateUserPreferencesMutation,
} from 'entities/users/api';
import { useGetCurrentUserAccessQuery } from 'entities/access/api';
import { AppTheme, isLanguage } from 'shared/types/dtos';
import { parseCompanyFromPath } from 'shared/lib/companyPath';
import { persistLanguage } from 'shared/lib/languagePreference';
import {
  clearAccess,
  setCurrentCompanyId,
} from 'entities/access/model';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_SESSION_REFRESHED_EVENT,
  isStoredSessionExpired,
  type AuthTokens,
} from 'shared/lib/authSession';
import { refreshAuthSession } from 'shared/lib/axiosInstance';
import StatusChangeListener from './statusChangeListener';
import './styles/App.sass';

const THEME_STORAGE_KEY = 'amis-theme-mode';
const THEME_TRANSITION_CLASS = 'theme-transition';

const getCssVariable = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const readAntdThemeTokens = () => ({
  colorPrimary: getCssVariable('--main-primary'),
  colorBgBase: getCssVariable('--main-bg'),
  colorTextBase: getCssVariable('--basic-black'),
  colorBorder: getCssVariable('--surface-border'),
  colorError: getCssVariable('--status-danger-color'),
  colorWarning: getCssVariable('--status-warning-color'),
  colorSuccess: getCssVariable('--status-success-color'),
  fontFamily: '"Onest", system-ui, sans-serif',
  borderRadius: 8,
  borderRadiusLG: 12,
});

/**
 * Чтение CSS-переменных — синхронный reflow, поэтому каждая тема измеряется
 * один раз. Ключ кеша — применённая тема: значения переменных зависят от
 * data-theme на html.
 */
const themeTokensCache = new Map<string, ReturnType<typeof readAntdThemeTokens>>();

const getAntdThemeTokens = (theme: string) => {
  const cached = themeTokensCache.get(theme);

  if (cached) return cached;

  const tokens = readAntdThemeTokens();

  themeTokensCache.set(theme, tokens);

  return tokens;
};

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

/**
 * После перезагрузки страницы access-токена в памяти нет, а refresh-cookie
 * есть: один запрос к /auth/refresh поднимает сессию. Пока он идёт, роутер
 * держит загрузку и никуда не уводит.
 */
const SessionRestore = () => {
  const dispatch = useAppDispatch();
  const isRestoring = useAppSelector((state) => state.users.isRestoring);

  useEffect(() => {
    if (!isRestoring) return;

    let cancelled = false;

    void refreshAuthSession().then((tokens) => {
      if (cancelled) return;

      dispatch(tokens ? sessionRestored(tokens) : sessionRestoreFailed());
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, isRestoring]);

  return null;
};

const AuthSessionGuard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const requestLogout = useLogout();

  useEffect(() => {
    const handleLogout = () => {
      void requestLogout().then(() => navigate('/', { replace: true }));
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

    // Продление сессии идёт в интерцепторе: слайс узнаёт о новых токенах отсюда.
    const handleSessionRefreshed = (event: Event) => {
      const tokens = (event as CustomEvent<AuthTokens>).detail;

      if (tokens) {
        dispatch(sessionRefreshed(tokens));
      }
    };

    // Выход в другой вкладке стирает срок сессии: токенов в хранилище нет.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'sessionEnd' && !event.newValue) {
        handleLogout();
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleLogout);
    window.addEventListener(AUTH_SESSION_REFRESHED_EVENT, handleSessionRefreshed);
    window.addEventListener('focus', handleSessionCheck);
    window.addEventListener('pageshow', handleSessionCheck);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    handleSessionCheck();

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleLogout);
      window.removeEventListener(
        AUTH_SESSION_REFRESHED_EVENT,
        handleSessionRefreshed
      );
      window.removeEventListener('focus', handleSessionCheck);
      window.removeEventListener('pageshow', handleSessionCheck);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, navigate, requestLogout]);

  return null;
};

const AccessBootstrap = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const accessToken = useAppSelector((state) => state.users.accessToken);

  /** Профиль и права нужны сразу после входа: их читают шапка и роутер. */
  const isSignedIn = isAuthenticated && Boolean(accessToken);

  useGetCurrentUserQuery(undefined, { skip: !isSignedIn });
  useGetCurrentUserAccessQuery(undefined, { skip: !isSignedIn });

  useEffect(() => {
    if (isSignedIn) return;

    dispatch(clearAccess());
  }, [dispatch, isSignedIn]);

  return null;
};

const CompanyRouteSync = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setCurrentCompanyId(parseCompanyFromPath(location.pathname)));
  }, [dispatch, location.pathname]);

  return null;
};

function App() {
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const loading = useAppSelector((state) => state.loader.loading);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const isAuthenticated = useAppSelector((state) => state.users.isAuthenticated);
  const [updateUserPreferences] = useUpdateUserPreferencesMutation();
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(prefersDarkScheme);
  const [antdThemeTokens, setAntdThemeTokens] = useState(readAntdThemeTokens);
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
    setAntdThemeTokens(getAntdThemeTokens(effectiveTheme));

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
        // На экране входа настройки сохранять некому: запрос уйдёт только в сессии.
        if (isAuthenticated) {
          void updateUserPreferences({ theme: nextTheme });
        }
      },
    }),
    [isAuthenticated, isDarkTheme, themeMode, updateUserPreferences]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? darkAlgorithm : defaultAlgorithm,
          token: antdThemeTokens,
          components: {
            Menu: {
              itemHeight: 38,
              itemBorderRadius: 8,
              itemMarginInline: 4,
              groupTitleFontSize: 11,
            },
            Table: {
              headerBg: 'var(--surface-soft)',
              headerColor: 'var(--text-secondary)',
              rowHoverBg: 'var(--main-more-lighter)',
            },
            Button: { fontWeight: 500 },
          },
        }}
      >
        <GlobalLoader loading={loading} />
        <BrowserRouter>
          <SessionRestore />
          <AuthSessionGuard />
          <AccessBootstrap />
          <CompanyRouteSync />
          <StatusChangeListener />
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export default App;
