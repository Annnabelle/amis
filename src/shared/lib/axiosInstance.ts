import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { LoginResponseDto } from '@edem2000/amis.contracts/api/users/responses';
import type { SuccessOf } from 'shared/api/types';
import { BASE_URL } from './consts';
import {
  clearAuthStorage,
  emitAuthSessionExpired,
  emitAuthSessionRefreshed,
  isSessionExpiredResponse,
  saveAuthTokens,
  type AuthTokens,
} from './authSession';
import { getAccessToken } from './authToken';
import { getRuntimeCompanyId } from './companyContext';
import { parseCompanyFromPath } from './companyPath';
import { CompanyScopeOptions } from './requestScope';
import {
  EndpointScopes,
  resolveEndpointAccess,
} from 'shared/config/endpointAccessMap';

const getRequestPathname = (url?: string) => {
  if (!url) return '';

  try {
    return new URL(url, BASE_URL).pathname;
  } catch {
    return url.split('?')[0];
  }
};

const getCompanyIdFromLocation = () =>
  parseCompanyFromPath(window.location.pathname);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Без этого браузер не пошлёт httpOnly-cookie с refresh-токеном.
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const endpointAccess = resolveEndpointAccess(
    config.method,
    getRequestPathname(config.url)
  );
  if (!endpointAccess) {
    const method = config.method?.toUpperCase() ?? 'UNKNOWN';
    const pathname = getRequestPathname(config.url) || config.url || 'UNKNOWN';

    return Promise.reject(
      new Error(
        `[EndpointAccessMap] ${method} ${pathname} is not registered`
      )
    );
  }

  const explicitCompanyId =
    config.headers['x-company-id'] ??
    config.headers['X-Company-Id'];
  const companyId = explicitCompanyId ?? getCompanyIdFromLocation() ?? getRuntimeCompanyId();
  const requiresCompanyId = endpointAccess?.scope === EndpointScopes.Company;
  const acceptsCompanyId =
    endpointAccess?.scope === EndpointScopes.Any ||
    endpointAccess?.scope === EndpointScopes.OptionalCompany;
  const optsOutOfCompany =
    (config.companyScope ?? CompanyScopeOptions.Auto) ===
    CompanyScopeOptions.None;

  if (
    requiresCompanyId ||
    (acceptsCompanyId && companyId && !optsOutOfCompany)
  ) {

    if (!companyId) {
      return Promise.reject(
        new Error(`Company context is required for ${config.url ?? 'request'}`)
      );
    }

    config.headers['x-company-id'] = companyId;
  } else {
    delete config.headers['x-company-id'];
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Ответы самих ручек сессии ею не управляют: вход сообщает об ошибке формы,
 * а неудачу продления разбирает ветка ниже, по исходному запросу.
 */
const SESSION_ENDPOINT_PATHS = ['/auth/login', '/auth/refresh', '/auth/logout'];

/** Повторяем запрос после обновления ровно один раз. */
type RetriableConfig = InternalAxiosRequestConfig & {
  retriedAfterRefresh?: boolean;
};

let refreshInFlight: Promise<AuthTokens | null> | null = null;

const requestNewTokens = async (): Promise<AuthTokens | null> => {
  try {
    // Тело пустое: refresh-токен приходит httpOnly-cookie, клиент его не видит.
    const { data } = await axiosInstance.post<SuccessOf<LoginResponseDto>>(
      `${BASE_URL}/auth/refresh`,
      {}
    );

    const tokens = {
      accessToken: data.tokens.accessToken,
      sessionEnd: new Date(data.tokens.refreshExpiresAt).getTime(),
    };

    saveAuthTokens(tokens);
    emitAuthSessionRefreshed(tokens);

    return tokens;
  } catch {
    return null;
  }
};

/**
 * Один запрос на обновление для всех ожидающих: остальные ждут его результат.
 * Он же восстанавливает сессию после перезагрузки страницы — access-токен
 * жил в памяти и перезагрузку не переживает.
 */
export const refreshAuthSession = (): Promise<AuthTokens | null> => {
  refreshInFlight ??= requestNewTokens().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

axiosInstance.interceptors.response.use((response) => response, async (error) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const config = error.config as RetriableConfig | undefined;
  const requestPath = getRequestPathname(config?.url);
  const hasToken = Boolean(getAccessToken());

  if (
    !hasToken ||
    SESSION_ENDPOINT_PATHS.includes(requestPath) ||
    !isSessionExpiredResponse(status, data)
  ) {
    return Promise.reject(error);
  }

  const refreshable = config !== undefined && !config.retriedAfterRefresh;

  // Истёкший access-токен продлевается молча: страница и заполненная форма остаются.
  if (refreshable) {
    const tokens = await refreshAuthSession();

    if (tokens) {
      config.retriedAfterRefresh = true;

      return axiosInstance.request(config);
    }
  }

  clearAuthStorage();
  emitAuthSessionExpired();

  return Promise.reject(error);
});

export default axiosInstance;
