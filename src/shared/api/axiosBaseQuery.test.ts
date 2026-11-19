import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { CanceledError } from "axios";
import { EndpointScopes } from "shared/config/endpointAccessMap";
import { CompanyScopeOptions } from "shared/lib/requestScope";
import { axiosBaseQuery } from "./axiosBaseQuery";
import { buildRequestUrl, request, type ApiRequestSpec } from "./request";

const axiosRequest = vi.hoisted(() => vi.fn());

vi.mock("shared/lib/axiosInstance", () => ({
  default: { request: axiosRequest },
}));

const listEndpoint = {
  method: "GET",
  path: "/vehicles",
  permission: null,
  scope: EndpointScopes.Company,
} as const;

const readEndpoint = {
  method: "GET",
  path: "/vehicles/:id",
  permission: null,
  scope: EndpointScopes.Company,
} as const;

const baseQuery = axiosBaseQuery();

const invoke = (spec: ApiRequestSpec) =>
  baseQuery(
    spec,
    { signal: new AbortController().signal } as unknown as BaseQueryApi,
    {}
  );

beforeEach(() => {
  axiosRequest.mockReset();
});

describe("buildRequestUrl", () => {
  it("подставляет path-параметры из записи карты доступа", () => {
    expect(
      buildRequestUrl(request(readEndpoint, { pathParams: { id: "42" } }))
    ).toBe("/vehicles/42");
  });

  it("падает, если значение path-параметра не передано", () => {
    expect(() =>
      buildRequestUrl({ endpoint: readEndpoint, pathParams: { id: "" } })
    ).toThrow(/:id/);
  });
});

describe("request", () => {
  it("несёт метод и путь записи карты доступа, а не строку url", () => {
    const spec = request(readEndpoint, { pathParams: { id: "42" } });

    expect(spec.endpoint).toBe(readEndpoint);
    expect(spec.endpoint.path).toBe("/vehicles/:id");
  });

  it("кодирует значение path-параметра", () => {
    expect(
      buildRequestUrl(request(readEndpoint, { pathParams: { id: "a/b" } }))
    ).toBe("/vehicles/a%2Fb");
  });
});

describe("axiosBaseQuery", () => {
  it("берёт метод и путь из записи карты доступа", async () => {
    axiosRequest.mockResolvedValue({ status: 200, data: { success: true } });

    await invoke(request(listEndpoint, { params: { page: 1 } }));

    expect(axiosRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/vehicles",
        method: "GET",
        params: { page: 1 },
      })
    );
  });

  it("отдаёт тело успешного ответа как данные", async () => {
    const body = { success: true, total: 1 };
    axiosRequest.mockResolvedValue({ status: 200, data: body });

    await expect(invoke(request(listEndpoint))).resolves.toEqual({ data: body });
  });

  it("считает 200 с success: false ошибкой и берёт сообщение бэкенда", async () => {
    const body = {
      success: false,
      errorCode: 4040,
      errorMessage: { ru: "Транспорт не найден", en: "Vehicle not found" },
    };
    axiosRequest.mockResolvedValue({ status: 200, data: body });

    const result = await invoke(request(listEndpoint));

    expect(result).toEqual({
      error: { status: 200, message: "Транспорт не найден", data: body },
    });
  });

  it("нормализует ошибку HTTP: статус, сообщение и тело", async () => {
    const data = {
      success: false,
      errorCode: 4030,
      errorMessage: { ru: "Нет доступа" },
    };
    axiosRequest.mockRejectedValue({
      isAxiosError: true,
      response: { status: 403, data },
    });

    const result = await invoke(request(listEndpoint));

    expect(result).toEqual({
      error: { status: 403, message: "Нет доступа", data },
    });
  });

  it("сообщает об отказе карты доступа текстом интерцептора", async () => {
    axiosRequest.mockRejectedValue(
      new Error("[EndpointAccessMap] GET /vehicles is not registered")
    );

    const result = await invoke(request(listEndpoint));

    expect(result.error?.message).toBe(
      "[EndpointAccessMap] GET /vehicles is not registered"
    );
  });

  it("помечает отменённый запрос, а не выдаёт его за ошибку бэкенда", async () => {
    axiosRequest.mockRejectedValue(new CanceledError("canceled"));

    await expect(invoke(request(listEndpoint))).resolves.toEqual({
      error: { isCancelled: true },
    });
  });

  it("прокидывает signal из RTK Query, чтобы запрос можно было отменить", async () => {
    axiosRequest.mockResolvedValue({ status: 200, data: { success: true } });

    await invoke(request(listEndpoint));

    expect(axiosRequest.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal);
  });

  it("передаёт заголовок компании и отказ от него как есть", async () => {
    axiosRequest.mockResolvedValue({ status: 200, data: { success: true } });

    await invoke(
      request(listEndpoint, {
        headers: { "x-company-id": "company-1" },
        companyScope: CompanyScopeOptions.None,
      })
    );

    expect(axiosRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { "x-company-id": "company-1" },
        companyScope: CompanyScopeOptions.None,
      })
    );
  });
});
