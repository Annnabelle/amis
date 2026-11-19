import type { EndpointAccessDefinition } from "shared/config/endpointAccessMap";
import type { CompanyScopeOption } from "shared/lib/requestScope";

/** Имена path-параметров пути из карты доступа: "/vehicles/:id" -> "id". */
type PathParamName<TPath extends string> =
  TPath extends `${string}:${infer Param}/${infer Rest}`
    ? Param | PathParamName<Rest>
    : TPath extends `${string}:${infer Param}`
      ? Param
      : never;

type RequestOptions = {
  /** Query-параметры; форму задаёт тип аргумента эндпоинта. */
  params?: unknown;
  /** Тело запроса. */
  data?: unknown;
  headers?: Record<string, string>;
  companyScope?: CompanyScopeOption;
};

/**
 * Опции запроса: pathParams обязателен ровно тогда, когда путь эндпоинта
 * содержит параметры, и принимает ровно их имена.
 */
export type ApiRequestOptions<TPath extends string> =
  [PathParamName<TPath>] extends [never]
    ? RequestOptions & { pathParams?: never }
    : RequestOptions & { pathParams: Record<PathParamName<TPath>, string | number> };

export type ApiRequestSpec = RequestOptions & {
  endpoint: EndpointAccessDefinition;
  pathParams?: Record<string, string | number>;
};

/**
 * Единственный способ объявить запрос для RTK Query: метод и путь берутся из
 * записи endpointAccessMap, а не пишутся строкой. Проверяется в
 * scripts/check-endpoints.mjs — литеральный url в эндпоинте ломает сборку.
 */
export const request = <const TEndpoint extends EndpointAccessDefinition>(
  endpoint: TEndpoint,
  ...[options]: [PathParamName<TEndpoint["path"]>] extends [never]
    ? [options?: ApiRequestOptions<TEndpoint["path"]>]
    : [options: ApiRequestOptions<TEndpoint["path"]>]
): ApiRequestSpec => ({ endpoint, ...(options ?? {}) });

/** Путь эндпоинта с подставленными path-параметрами. */
export const buildRequestUrl = (spec: ApiRequestSpec): string =>
  spec.endpoint.path
    .split("/")
    .map((segment) => {
      if (!segment.startsWith(":")) return segment;

      const name = segment.slice(1);
      const value = spec.pathParams?.[name];

      if (value === undefined || value === null || value === "") {
        throw new Error(
          `[ApiRequest] ${spec.endpoint.method} ${spec.endpoint.path}: не передан параметр :${name}`
        );
      }

      return encodeURIComponent(String(value));
    })
    .join("/");
