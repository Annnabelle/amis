import dayjs from "dayjs";

import type { SalesOrder } from "entities/salesOrders/types";
import { formatDate } from "shared/lib/formatDate";

/**
 * Сводка по отмеченным заказам: что везём, кому и на какую сумму.
 *
 * Считается из заказов на экране: рейса ещё нет, спросить сводку не у кого.
 */
export const buildOrderSelectionSummary = (orders: SalesOrder[], selectedIds: string[]) => {
  const selectedOrders = orders.filter((order) => selectedIds.includes(order.id));

  const uniqueCustomers = new Set(selectedOrders.map((order) => order.customer.name));
  const customerList = Array.from(uniqueCustomers);

  const aggregatedProducts = selectedOrders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const productName = item.product.name;
        acc[productName] = (acc[productName] || 0) + item.quantities.ordered;
      });

      return acc;
    },
    {} as Record<string, number>,
  );

  const totalVolume = selectedOrders.reduce(
    (sum, order) => sum + (order.totals.orderedQuantity ?? 0),
    0,
  );
  const totalAmount = selectedOrders.reduce((sum, order) => sum + (order.totals.amount ?? 0), 0);

  const dueDates = selectedOrders.map((order) => dayjs(order.fulfillment.dueDate));
  const earliestDueDate =
    dueDates.length > 0
      ? dueDates.reduce((min, date) => (date.isBefore(min) ? date : min))
      : null;
  const latestDueDate =
    dueDates.length > 0 ? dueDates.reduce((max, date) => (date.isAfter(max) ? date : max)) : null;

  const priorityCounts = selectedOrders.reduce(
    (acc, order) => {
      const priority = order.fulfillment.priority;
      acc[priority] = (acc[priority] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const customersDetails = selectedOrders.map((order) => ({
    name: order.customer.name,
    tin: order.customer.tin,
    address: order.customer.address,
    salesOrderNumber: order.salesOrderNumber ?? "-",
    contractDate: order.contract?.date ? formatDate(order.contract.date) : "-",
    dueDate: formatDate(order.fulfillment.dueDate),
    priority: order.fulfillment.priority,
    items: order.items.map((item) => ({
      productName: item.product.name,
      quantity: item.quantities.ordered,
      unitPrice: item.commercial?.unitPrice ?? 0,
      amount: item.commercial?.amount ?? 0,
      comment: item.comment,
    })),
    totalQuantity: order.totals.orderedQuantity,
    totalAmount: order.totals.amount,
  }));

  return {
    orderCount: selectedIds.length,
    customerCount: uniqueCustomers.size,
    customerList,
    aggregatedProducts,
    totalVolume,
    totalAmount,
    earliestDueDate,
    latestDueDate,
    priorityCounts,
    customersDetails,
  };
};

export type OrderSelectionSummary = ReturnType<typeof buildOrderSelectionSummary>;

/** Цвет приоритета заказа в карточке сводки. */
export const getPriorityColor = (priority?: string) => {
  if (!priority) return "default";

  switch (priority.toLowerCase()) {
    case "urgent":
      return "red";
    case "high":
      return "gold";
    case "normal":
      return "blue";
    case "low":
      return "green";
    default:
      return "default";
  }
};
