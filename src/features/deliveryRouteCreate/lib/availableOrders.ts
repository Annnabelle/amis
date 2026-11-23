import type { TFunction } from "i18next";

import type { SalesOrder } from "entities/salesOrders/types";
import { formatDate } from "shared/lib/formatDate";

export type AvailableOrderRow = {
  key: string;
  customer: string;
  salesOrderNumber: string;
  dueDate: string;
  priority: string;
  ordered: number;
  assigned: number;
  delivered: number;
  remaining: number;
};

/**
 * Заказы, которые ещё можно поставить в рейс.
 *
 * Заказ попадает в список, пока в нём остаётся неназначенное количество:
 * остаток и есть то, что заберёт новый рейс.
 */
export const buildAvailableOrders = (
  orders: SalesOrder[],
  t: TFunction,
): AvailableOrderRow[] =>
  orders
    .map((order) => {
      const ordered = order.totals.orderedQuantity ?? 0;
      const assigned = order.totals.assignedQuantity ?? 0;
      const delivered = order.totals.deliveredQuantity ?? 0;

      return {
        key: order.id,
        customer: order.customer.name,
        salesOrderNumber: order.salesOrderNumber,
        dueDate: order.fulfillment.dueDate ? formatDate(order.fulfillment.dueDate) : "-",
        priority: t(`salesOrders.priority.${order.fulfillment.priority}`),
        ordered,
        assigned,
        delivered,
        remaining: Math.max(0, ordered - assigned),
      };
    })
    .filter((row) => row.remaining > 0);

/** Подпись машины в подсказке: имя и номер, если он известен. */
export const formatVehicleLabel = (vehicle: { name: string; plateNumber?: string }) =>
  vehicle.plateNumber ? `${vehicle.name} · ${vehicle.plateNumber}` : vehicle.name;

/** Подсказка пуста: искомого в списке нет. */
export const hasNoVehicleMatches = (
  options: { label: string }[],
  query: string,
  isLoading: boolean,
) => {
  if (isLoading) return false;

  const normalized = query.trim().toLowerCase();

  if (!normalized) return options.length === 0;

  return !options.some((option) => option.label.toLowerCase().includes(normalized));
};
