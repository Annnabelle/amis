/**
 * Ошибка запроса в терминах RTK Query. Собирается в axiosBaseQuery из любого
 * провала: сетевой сбой, HTTP-ошибка, 200 с success: false, отказ интерцептора
 * по карте доступа.
 */
export type ApiError = {
  status?: number;
  /** Локализованное сообщение бэкенда, если оно было. */
  message?: string;
  data?: unknown;
  /** Запрос отменён RTK Query (смена аргументов, размонтирование). */
  isCancelled?: boolean;
};

/**
 * Успешная ветка конверта ApiResponseDto. axiosBaseQuery не отдаёт в data
 * ответы с success: false, поэтому transformResponse работает уже с ней.
 */
export type SuccessOf<TResponse> = Extract<TResponse, { success: true }>;
