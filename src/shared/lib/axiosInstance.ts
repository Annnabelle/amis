import axios from 'axios';
import { BASE_URL } from './consts';
import {
  clearAuthStorage,
  emitAuthSessionExpired,
  isAuthErrorResponse,
} from './authSession';

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


