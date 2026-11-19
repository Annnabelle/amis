/**
 * Код ошибки из ответа сервера. Нужен не для текста — его собирает
 * getApiErrorMessage, — а для ветвления: отсутствие прогона приходит
 * ошибкой 404, и показывать её пользователю нечего.
 *
 * Понимает и ошибку RTK Query (ApiError.data), и сырую ошибку axios.
 */
export const readBackendErrorCode = (error: unknown): number | null => {
  const source = error as
    | {
        data?: { errorCode?: unknown };
        response?: { data?: { errorCode?: unknown } };
      }
    | null
    | undefined;
  const payload = source?.data ?? source?.response?.data;

  return typeof payload?.errorCode === "number" ? payload.errorCode : null;
};
