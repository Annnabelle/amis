import type { PaginatedApiResponseDto } from "@edem2000/amis.contracts/api/common/responses";
import type { SuccessOf } from "./types";

/** Страница списка в доменных терминах. */
export type Paginated<TItem> = {
  items: TItem[];
  total: number;
  page: number;
  limit: number;
};

/**
 * transformResponse для постраничного списка: сам конверт разбирается здесь,
 * сущности остаётся передать свой маппер.
 */
export const toPaginated =
  <TDto, TItem>(mapItem: (dto: TDto) => TItem) =>
  (response: SuccessOf<PaginatedApiResponseDto<TDto>>): Paginated<TItem> => ({
    items: response.data.map(mapItem),
    total: response.total,
    page: response.page,
    limit: response.limit,
  });
