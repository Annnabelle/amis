import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import type { ApiError } from "./types";

/**
 * Сообщение об ошибке запроса RTK Query: берёт то, что собрал axiosBaseQuery,
 * иначе разбирает значение как ответ бэкенда.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as ApiError).message;
    if (typeof message === "string" && message) return message;
  }

  return getBackendErrorMessage(error, fallback);
};
