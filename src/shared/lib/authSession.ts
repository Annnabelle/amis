export const AUTH_SESSION_EXPIRED_EVENT = "auth-session-expired";

const AUTH_STORAGE_KEYS = [
  "user",
  "userName",
  "accessToken",
  "refreshToken",
  "userRole",
  "userId",
  "sessionEnd",
];

const TOKEN_ERROR_MARKERS = [
  "access token",
  "bearer",
  "jwt",
  "token expired",
  "invalid token",
  "unauthorized",
];

export const clearAuthStorage = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const emitAuthSessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};

export const isStoredSessionExpired = () => {
  const token = localStorage.getItem("accessToken");
  const sessionEnd = Number(localStorage.getItem("sessionEnd"));

  return Boolean(token && sessionEnd && sessionEnd <= Date.now());
};

const getErrorText = (data: unknown): string => {
  if (!data) return "";

  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    const values = [
      record.message,
      record.error,
      record.errorMessage,
      record.details,
    ];

    return values
      .map((value) => {
        if (typeof value === "string") return value;
        if (value && typeof value === "object") return JSON.stringify(value);
        return "";
      })
      .join(" ");
  }

  return "";
};

export const isAuthErrorResponse = (status?: number, data?: unknown) => {
  if (status !== 401 && status !== 403) {
    return false;
  }

  const errorText = getErrorText(data).toLowerCase();
  const hasTokenErrorMarker = TOKEN_ERROR_MARKERS.some((marker) =>
    errorText.includes(marker)
  );

  if (hasTokenErrorMarker) {
    return true;
  }

  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;
    const isBusinessError =
      response.success === false && response.errorCode !== undefined;

    if (isBusinessError) {
      return false;
    }
  }

  return status === 401;
};
