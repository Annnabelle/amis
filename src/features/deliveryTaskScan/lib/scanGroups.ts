import type { DeliveryTask } from "entities/deliveryTasks/types";
import type { ScanAttempt } from "entities/scanSessions/types";

export type AcceptedScanGroup = {
  productId: string;
  productName: string;
  scans: ScanAttempt[];
};

/** Товары задачи по идентификатору: скан приносит только его. */
export const buildProductsById = (task?: DeliveryTask | null) =>
  new Map(
    (task?.items ?? []).map((item) => [
      item.product.id,
      {
        id: item.product.id,
        name: item.product.name,
        shortName: item.product.shortName,
      },
    ]),
  );

/**
 * Принятые сканы по товарам в порядке первого скана.
 *
 * Выдача идёт товар за товаром, и коды одного товара должны стоять рядом.
 */
export const groupAcceptedScans = (
  scans: ScanAttempt[],
  productsById: ReturnType<typeof buildProductsById>,
) => {
  const groups = new Map<string, AcceptedScanGroup>();

  scans.forEach((scan) => {
    if (scan.status !== "accepted" || !scan.productId) return;

    const existing = groups.get(scan.productId);

    if (existing) {
      existing.scans.push(scan);
      return;
    }

    groups.set(scan.productId, {
      productId: scan.productId,
      productName: productsById.get(scan.productId)?.name ?? scan.productId,
      scans: [scan],
    });
  });

  return Array.from(groups.values());
};

export const selectRejectedScans = (scans: ScanAttempt[]) =>
  scans.filter((scan) => scan.status === "rejected");

/** Товары, по которым выдано меньше запланированного. */
export const selectIncompleteProducts = (task?: DeliveryTask | null) =>
  (task?.items ?? []).filter((item) => item.quantities.delivered < item.quantities.planned);
