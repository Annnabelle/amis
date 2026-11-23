import { describe, expect, it } from "vitest";

import type { SalesOrder } from "entities/salesOrders/types";
import {
  buildOrderSelectionSummary,
  getPriorityColor,
} from "features/deliveryRouteCreate/lib/orderSelectionSummary";

const order = (
  id: string,
  customer: string,
  items: Array<{ name: string; quantity: number }>,
  totals: { quantity: number; amount: number },
  dueDate: string,
  priority = "normal",
): SalesOrder =>
  ({
    id,
    salesOrderNumber: `SO-${id}`,
    customer: { name: customer, tin: "123456789", address: "Ташкент" },
    items: items.map(({ name, quantity }) => ({
      product: { name },
      quantities: { ordered: quantity },
      commercial: { unitPrice: 10, amount: quantity * 10 },
    })),
    totals: { orderedQuantity: totals.quantity, amount: totals.amount },
    fulfillment: { dueDate, priority },
    contract: undefined,
  }) as unknown as SalesOrder;

const orders = [
  order("1", "Алмаз", [{ name: "Сок", quantity: 10 }], { quantity: 10, amount: 100 }, "2026-02-01"),
  order(
    "2",
    "Алмаз",
    [
      { name: "Сок", quantity: 5 },
      { name: "Вода", quantity: 7 },
    ],
    { quantity: 12, amount: 120 },
    "2026-01-20",
    "urgent",
  ),
  order("3", "Бета", [{ name: "Вода", quantity: 3 }], { quantity: 3, amount: 30 }, "2026-03-05"),
];

describe("сводка по выбранным заказам", () => {
  it("считает клиентов по именам без повторов", () => {
    const summary = buildOrderSelectionSummary(orders, ["1", "2"]);

    expect(summary.orderCount).toBe(2);
    expect(summary.customerCount).toBe(1);
    expect(summary.customerList).toEqual(["Алмаз"]);
  });

  it("складывает одинаковые товары из разных заказов", () => {
    const summary = buildOrderSelectionSummary(orders, ["1", "2", "3"]);

    expect(summary.aggregatedProducts).toEqual({ Сок: 15, Вода: 10 });
  });

  it("суммирует объём и сумму", () => {
    const summary = buildOrderSelectionSummary(orders, ["1", "3"]);

    expect(summary.totalVolume).toBe(13);
    expect(summary.totalAmount).toBe(130);
  });

  it("берёт крайние сроки выдачи", () => {
    const summary = buildOrderSelectionSummary(orders, ["1", "2", "3"]);

    expect(summary.earliestDueDate?.format("YYYY-MM-DD")).toBe("2026-01-20");
    expect(summary.latestDueDate?.format("YYYY-MM-DD")).toBe("2026-03-05");
  });

  it("считает заказы по приоритетам", () => {
    const summary = buildOrderSelectionSummary(orders, ["1", "2", "3"]);

    expect(summary.priorityCounts).toEqual({ normal: 2, urgent: 1 });
  });

  it("на пустом выборе отдаёт нули и пустые сроки", () => {
    const summary = buildOrderSelectionSummary(orders, []);

    expect(summary.orderCount).toBe(0);
    expect(summary.totalAmount).toBe(0);
    expect(summary.earliestDueDate).toBeNull();
    expect(summary.customersDetails).toEqual([]);
  });

  it("цвет приоритета известен для каждого значения", () => {
    expect(getPriorityColor("urgent")).toBe("red");
    expect(getPriorityColor("HIGH")).toBe("gold");
    expect(getPriorityColor(undefined)).toBe("default");
    expect(getPriorityColor("что-то своё")).toBe("default");
  });
});
