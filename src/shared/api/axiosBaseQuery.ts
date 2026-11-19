import axios from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import { buildRequestUrl, type ApiRequestSpec } from "./request";
import type { ApiError } from "./types";

/** Бэкенд отвечает 200 с success: false — для RTK Query это ошибка, не данные. */
const isFailureBody = (body: unknown): boolean =>
  typeof body === "object" &&
  body !== null &&
  "success" in body &&
  (body as { success?: unknown }).success === false;

const toMessage = (source: unknown): string | undefined =>
  getBackendErrorMessage(source, "") || undefined;

/**
 * Единственная точка, где RTK Query уходит в сеть. Идёт через axiosInstance,
 * поэтому карта доступа, заголовок x-company-id и обработка истёкшей сессии
 * работают как раньше. Отмену запроса даёт signal из RTK Query.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<ApiRequestSpec, unknown, ApiError> =>
  async (spec, api) => {
    try {
      const response = await axiosInstance.request({
        url: buildRequestUrl(spec),
        method: spec.endpoint.method,
        params: spec.params,
        data: spec.data,
        headers: spec.headers,
        companyScope: spec.companyScope,
        signal: api.signal,
      });

      if (isFailureBody(response.data)) {
        return {
          error: {
            status: response.status,
            message: toMessage(response.data),
            data: response.data,
          },
        };
      }

      return { data: response.data };
    } catch (error) {
      if (axios.isCancel(error)) {
        return { error: { isCancelled: true } };
      }

      const responseData = axios.isAxiosError(error)
        ? error.response?.data
        : undefined;

      return {
        error: {
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
          message: toMessage(responseData ?? error),
          data: responseData,
        },
      };
    }
  };
