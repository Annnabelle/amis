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
  endpoints: () => ({}),
});
