import axios from 'axios';
import { BASE_URL } from './consts';
import {
  clearAuthStorage,
  emitAuthSessionExpired,
  isAuthErrorResponse,
} from './authSession';
import { getRuntimeCompanyId } from './companyContext';

const COMPANY_SCOPED_PATHS = [
  /^\/products(?:\/|$)/,
  /^\/orders(?:\/|$)/,
  /^\/codes\/batches(?:\/|$)/,
  /^\/sales-orders(?:\/|$)/,
  /^\/delivery-routes(?:\/|$)/,
  /^\/delivery-tasks(?:\/|$)/,
  /^\/scan-sessions(?:\/|$)/,
  /^\/invoices(?:\/|$)/,
  /^\/reports(?:\/|$)/,
];

const getRequestPathname = (url?: string) => {
  if (!url) return '';

  try {
    return new URL(url, BASE_URL).pathname;
  } catch {
    return url.split('?')[0];
  }
};

const isCompanyScopedRequest = (url?: string) => {
  const pathname = getRequestPathname(url);

  if (/^\/references\/roles\/company(?:\/assignable)?\/?$/.test(pathname)) {
    return true;
  }

  return COMPANY_SCOPED_PATHS.some((pattern) => pattern.test(pathname));
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

  if (isCompanyScopedRequest(config.url)) {
    const companyId = getCompanyIdFromLocation() ?? getRuntimeCompanyId();

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


