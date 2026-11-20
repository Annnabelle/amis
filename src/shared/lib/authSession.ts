import { CoreErrorCodes } from "@edem2000/amis.contracts";

export const AUTH_SESSION_EXPIRED_EVENT = "auth-session-expired";
export const AUTH_SESSION_REFRESHED_EVENT = "auth-session-refreshed";

const AUTH_STORAGE_KEYS = [
  "user",
  "userName",
  "accessToken",
  "refreshToken",
  "userRole",
  "userId",
  "sessionEnd",
];

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

/** Срок сессии, если в токене нет exp. */
const FALLBACK_SESSION_DURATION_MS = 60 * 60 * 1000;

/** exp токена: срок, после которого он не принимается. */
export const readTokenExpiry = (token: string): number | null => {
  const payload = token.split(".")[1];

  if (!payload) return null;

  try {
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: unknown };

    return typeof decoded.exp === "number" ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const getSessionEnd = (): number | null => {
  const stored = Number(localStorage.getItem("sessionEnd"));

  return Number.isFinite(stored) && stored > 0 ? stored : null;
};

/**
 * Токены сессии в localStorage. Живут здесь, а не в редьюсере: редьюсер
 * обязан быть чистым, а в StrictMode он вызывается дважды.
 *
 * Конец сессии — exp refresh-токена: до него истёкший access продлевается
 * молча, и выходить пользователю незачем.
 */
export const saveAuthTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem(
    "sessionEnd",
    String(
      readTokenExpiry(refreshToken) ??
        readTokenExpiry(accessToken) ??
        Date.now() + FALLBACK_SESSION_DURATION_MS
    )
  );
};

export const saveAuthSession = ({
  user,
  accessToken,
  refreshToken,
}: {
  user: unknown;
  accessToken: string;
  refreshToken: string;
}) => {
  localStorage.setItem("user", JSON.stringify(user));
  saveAuthTokens({ accessToken, refreshToken });
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
  const token = localStorage.getItem("accessToken");
  const sessionEnd = getSessionEnd();

  return Boolean(token && sessionEnd && sessionEnd <= Date.now());
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
