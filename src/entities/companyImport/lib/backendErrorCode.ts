/**
 * Код ошибки из ответа сервера. Нужен не для текста — его собирает
 * getBackendErrorMessage, — а для ветвления: отсутствие прогона приходит
 * ошибкой 404, и показывать её пользователю нечего.
 */
export const readBackendErrorCode = (error: unknown): number | null => {
  const payload = (
    error as { response?: { data?: { errorCode?: unknown } } } | null
  )?.response?.data;

  return typeof payload?.errorCode === "number" ? payload.errorCode : null;
};
