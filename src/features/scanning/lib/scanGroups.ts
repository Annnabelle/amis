import type { ScanAttempt } from "entities/scanSessions/types";

export type ScanProduct = {
  id: string;
  name: string;
  shortName?: string;
};

export type AcceptedScanGroup = {
  productId: string;
  productName: string;
  scans: ScanAttempt[];
};

/**
 * Принятые сканы по товарам в порядке первого скана.
 *
 * Сканируют товар за товаром, и коды одного товара должны стоять рядом.
 */
export const groupAcceptedScans = (
  scans: ScanAttempt[],
  productsById: Map<string, ScanProduct>,
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
