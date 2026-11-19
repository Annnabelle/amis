import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { apiTagTypes } from "./tags";

/**
 * Один api-слайс на приложение; сущности добавляют свои эндпоинты через
 * injectEndpoints в entities/<entity>/api.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: apiTagTypes,
  /**
   * Открытие страницы всегда перечитывает данные — так работали санки, и для
   * учётных данных это важнее экономии запросов: записи меняют и другие
   * пользователи, и фоновые задачи. Кеш при этом не бесполезен: он сразу
   * отрисовывает прошлый ответ, пока идёт новый.
   */
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
});
