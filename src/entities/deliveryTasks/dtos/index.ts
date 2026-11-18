import type { HexString } from "shared/types/dtos";

/** Аргумент санка: список задач висит на маршруте рейса. */
export type GetDeliveryTasksParams = {
  routeId: HexString;
};
