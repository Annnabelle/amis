import { CoreErrorCodes } from "@edem2000/amis.contracts";
import { clearAccessToken, setAccessToken } from "./authToken";

export const AUTH_SESSION_EXPIRED_EVENT = "auth-session-expired";
export const AUTH_SESSION_REFRESHED_EVENT = "auth-session-refreshed";

/**
 * accessToken и refreshToken здесь больше не пишутся — токены ушли в память
 * и в httpOnly-cookie. Ключи остались, чтобы вычистить их у тех, кто уже вошёл
 * до этого изменения.
 */
const AUTH_STORAGE_KEYS = [
  "user",
  "userName",
  "accessToken",
  "refreshToken",
  "userRole",
  "userId",
  "sessionEnd",
];

/** Что клиент знает о сессии: токен в памяти и её конец. */
export type AuthTokens = {
  accessToken: string;
  sessionEnd: number;
};

export const clearAuthStorage = () => {
  clearAccessToken();
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getSessionEnd = (): number | null => {
  const stored = Number(localStorage.getItem("sessionEnd"));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

/**
 * Конец сессии — срок refresh-cookie, его присылает сервер: до него истёкший
 * access продлевается молча, и выходить пользователю незачем.
 */
export const saveAuthTokens = ({ accessToken, sessionEnd }: AuthTokens) => {
  setAccessToken(accessToken);
  localStorage.setItem("sessionEnd", String(sessionEnd));
};

/**
 * Пользователь в localStorage — кеш для первой отрисовки, не доступ: запросы
 * всё равно идут с токеном из памяти.
 */
export const saveAuthSession = ({
  user,
  accessToken,
  sessionEnd,
}: {
  user: unknown;
  accessToken: string;
  sessionEnd: number;
}) => {
  localStorage.setItem("user", JSON.stringify(user));
  saveAuthTokens({ accessToken, sessionEnd });
};

export const emitAuthSessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};

export const emitAuthSessionRefreshed = (tokens: AuthTokens) => {
  window.dispatchEvent(
    new CustomEvent<AuthTokens>(AUTH_SESSION_REFRESHED_EVENT, {
      detail: tokens,
    })
  );
};

export const isStoredSessionExpired = () => {
  const sessionEnd = getSessionEnd();

  return sessionEnd !== null && sessionEnd <= Date.now();
};

/**
 * Истёкшую сессию от бизнес-ошибки отличает машинный код, а не текст ответа:
 * 401 без кода — отказ guard'а, 401 с другим кодом — ответ домена (неверный
 * пароль, заблокированный аккаунт). 403 — нехватка прав, сессия тут цела.
 */
const SESSION_ERROR_CODES: readonly number[] = [
  CoreErrorCodes.AuthenticationRequired,
];

const readErrorCode = (data: unknown): number | null => {
  if (!data || typeof data !== "object") return null;

  const code = (data as { errorCode?: unknown }).errorCode;

  return typeof code === "number" ? code : null;
};

export const isSessionExpiredResponse = (status?: number, data?: unknown) => {
  if (status !== 401) return false;

  const errorCode = readErrorCode(data);

  return errorCode === null || SESSION_ERROR_CODES.includes(errorCode);
};
