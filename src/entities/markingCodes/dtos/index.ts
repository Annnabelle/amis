import type { OrderListQueryParams } from "@edem2000/amis.contracts/api/orders/requests";
import type { PackageType } from "shared/types/dtos";

/**
 * Фактический запрос списка заказов: фронт фильтрует партии по типу упаковки
 * (страница таможенных кодов берёт только unit), а в контракте packageType нет.
 */
export type OrderListQueryRequestDto = OrderListQueryParams & {
  packageType?: PackageType;
};
