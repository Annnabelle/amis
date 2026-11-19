import type {
  GetLifecycleEventsResponseDto,
  GetLifecycleSummaryResponseDto,
} from "@edem2000/amis.contracts/api/lifecycle/responses";
import { hasMoreLifecycleEvents } from "entities/lifecycle/lib";
import {
  mapLifecycleEventDtoToEntity,
  mapLifecycleSummaryDtoToEntity,
} from "entities/lifecycle/mappers";
import type {
  LifecycleEvent,
  LifecycleFeedFilters,
  LifecycleSummary,
} from "entities/lifecycle/types";
import { baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import type { CompanyScopeOption } from "shared/lib/requestScope";

export const LIFECYCLE_DEFAULT_LIMIT = 10;
export const LIFECYCLE_MAX_LIMIT = 100;

export type LifecycleSummaryArgs = {
  targetId: string;
  companyScope?: CompanyScopeOption;
};

export type LifecycleFeedArgs = LifecycleFeedFilters & {
  targetId: string;
  limit?: number;
  companyScope?: CompanyScopeOption;
};

export type LifecycleFeedPage = {
  events: LifecycleEvent[];
  page: number;
  limit: number;
  total: number;
  /** Верхняя граница первой страницы: по ней листаются следующие. */
  asOf: string | null;
};

/**
 * Фоновый процесс дописывает события, сортировка — от новых к старым. Первую
 * страницу берём как есть и запоминаем её верхнюю границу, дальше листаем
 * относительно неё, иначе часть записей уедет на страницу назад.
 */
type LifecycleFeedPageParam = {
  page: number;
  asOf?: string;
};

export const lifecycleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLifecycleSummary: build.query<LifecycleSummary, LifecycleSummaryArgs>({
      query: ({ targetId, companyScope }) =>
        request(endpointAccessMap.lifecycleSummary, {
          params: { targetId },
          companyScope,
        }),
      transformResponse: (
        response: SuccessOf<GetLifecycleSummaryResponseDto>
      ) => mapLifecycleSummaryDtoToEntity(response),
    }),

    /**
     * Лента статусов. Данные реактивные: вкладку всегда перечитываем, поэтому
     * запись в кеше не живёт после закрытия карточки.
     */
    getLifecycleEvents: build.infiniteQuery<
      LifecycleFeedPage,
      LifecycleFeedArgs,
      LifecycleFeedPageParam
    >({
      infiniteQueryOptions: {
        initialPageParam: { page: 1 },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          /**
           * Считаем страницами, а не элементами: data может быть короче limit,
           * потому что часть ошибок скрывается уже после подсчёта total.
           */
          if (!hasMoreLifecycleEvents(lastPage.page, lastPage.limit, lastPage.total)) {
            return undefined;
          }

          return {
            page: lastPageParam.page + 1,
            asOf: allPages[0]?.asOf ?? undefined,
          };
        },
      },
      query: ({ queryArg, pageParam }) =>
        request(endpointAccessMap.lifecycleEvents, {
          params: {
            targetId: queryArg.targetId,
            scope: queryArg.scope,
            vendor: queryArg.vendor,
            kind: queryArg.kind,
            page: pageParam.page,
            limit: Math.min(queryArg.limit ?? LIFECYCLE_DEFAULT_LIMIT, LIFECYCLE_MAX_LIMIT),
            asOf: pageParam.asOf,
          },
          companyScope: queryArg.companyScope,
        }),
      transformResponse: (
        response: SuccessOf<GetLifecycleEventsResponseDto>,
        _meta: unknown,
        arg: { queryArg: LifecycleFeedArgs; pageParam: LifecycleFeedPageParam }
      ): LifecycleFeedPage => {
        const events = response.data.map(mapLifecycleEventDtoToEntity);

        return {
          events,
          page: response.page,
          limit: response.limit,
          total: response.total,
          asOf: arg.pageParam.asOf ?? events[0]?.occurredAt ?? null,
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetLifecycleSummaryQuery,
  useGetLifecycleEventsInfiniteQuery,
} = lifecycleApi;
