import type { DeliveryTask } from "entities/deliveryTasks/types";
import type { ScanProduct } from "features/scanning/lib/scanGroups";

/** Товары задачи по идентификатору: скан приносит только его. */
export const buildProductsById = (task?: DeliveryTask | null) =>
  new Map<string, ScanProduct>(
    (task?.items ?? []).map((item) => [
      item.product.id,
      {
        id: item.product.id,
        name: item.product.name,
        shortName: item.product.shortName,
      },
    ]),
  );

/** Товары, по которым выдано меньше запланированного. */
export const selectIncompleteProducts = (task?: DeliveryTask | null) =>
  (task?.items ?? []).filter((item) => item.quantities.delivered < item.quantities.planned);
