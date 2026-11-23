import type { DeliveryRoute } from "entities/deliveryRoutes/types";
import type { ScanProduct } from "features/scanning/lib/scanGroups";

type RouteProduct = NonNullable<DeliveryRoute["products"]>[number];

/** Товары рейса по идентификатору: скан приносит только его. */
export const buildRouteProductsById = (route?: DeliveryRoute | null) =>
  new Map<string, ScanProduct>(
    (route?.products ?? []).map((product) => [
      product.id,
      {
        id: product.id,
        name: product.name,
        shortName: product.shortName,
      },
    ]),
  );

/** Товары, которых погружено меньше запланированного. */
export const selectUnderloadedProducts = (products: RouteProduct[]) =>
  products.filter(
    (product) => product.quantities.loadedQuantity < product.quantities.plannedQuantity,
  );
