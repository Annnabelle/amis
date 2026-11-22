/**
 * access-токен живёт в памяти модуля, а не в localStorage: оттуда его читает
 * любой XSS. Перезагрузка страницы восстанавливает сессию запросом к
 * /auth/refresh — refresh-токен лежит в httpOnly-cookie и браузер пошлёт её сам.
 */
let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};
