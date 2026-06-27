import axios from 'axios';
import { BASE_URL } from './consts';
import {
  clearAuthStorage,
  emitAuthSessionExpired,
  isAuthErrorResponse,
} from './authSession';
import { getRuntimeCompanyId } from './companyContext';
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
  window.location.pathname.match(
    /^\/organization\/([^/]+)(?:\/|$)/
  )?.[1] ?? null;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
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

  const companyId = getCompanyIdFromLocation() ?? getRuntimeCompanyId();
  const requiresCompanyId = endpointAccess?.scope === EndpointScopes.Company;
  const acceptsCompanyId = endpointAccess?.scope === EndpointScopes.Any;

  if (requiresCompanyId || (acceptsCompanyId && companyId)) {

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

axiosInstance.interceptors.response.use((response) => response, (error) => {
  const status = error.response?.status;
  const data = error.response?.data;
  const requestUrl = error.config?.url ?? '';
  const hasToken = Boolean(localStorage.getItem('accessToken'));
  const isLoginRequest = requestUrl.includes('/users/login');

  if (hasToken && !isLoginRequest && isAuthErrorResponse(status, data)) {
    clearAuthStorage();
    emitAuthSessionExpired();
  }

  return Promise.reject(error);
});

export default axiosInstance;


