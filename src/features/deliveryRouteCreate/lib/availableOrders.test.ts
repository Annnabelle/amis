import { describe, expect, it } from "vitest";
import type { TFunction } from "i18next";

import type { SalesOrder } from "entities/salesOrders/types";
import {
  buildAvailableOrders,
  formatVehicleLabel,
  hasNoVehicleMatches,
} from "features/deliveryRouteCreate/lib/availableOrders";

const t = ((key: string) => key) as TFunction;

const order = (
  id: string,
  totals: { ordered: number; assigned: number; delivered?: number },
): SalesOrder =>
  ({
    id,
    salesOrderNumber: `SO-${id}`,
    customer: { name: "Алмаз" },
    totals: {
      orderedQuantity: totals.ordered,
      assignedQuantity: totals.assigned,
      deliveredQuantity: totals.delivered ?? 0,
    },
    fulfillment: { dueDate: "2026-02-01", priority: "normal" },
  }) as unknown as SalesOrder;

describe("заказы, доступные рейсу", () => {
  it("оставляет заказы с неназначенным остатком", () => {
    const rows = buildAvailableOrders(
      [order("1", { ordered: 10, assigned: 4 }), order("2", { ordered: 5, assigned: 5 })],
      t,
    );

    expect(rows.map((row) => row.key)).toEqual(["1"]);
    expect(rows[0].remaining).toBe(6);
  });

  it("перевыдачу считает нулевым остатком", () => {
    expect(buildAvailableOrders([order("1", { ordered: 3, assigned: 5 })], t)).toEqual([]);
  });

  it("срок без значения показывает прочерком", () => {
    const rows = buildAvailableOrders(
      [{ ...order("1", { ordered: 2, assigned: 0 }), fulfillment: { priority: "normal" } } as SalesOrder],
      t,
    );

    expect(rows[0].dueDate).toBe("-");
  });

  it("подпись машины включает номер, когда он есть", () => {
    expect(formatVehicleLabel({ name: "Исузу", plateNumber: "01A777AA" })).toBe(
      "Исузу · 01A777AA",
    );
    expect(formatVehicleLabel({ name: "Исузу" })).toBe("Исузу");
  });

  it("пустая подсказка машин отличается от загрузки", () => {
    const options = [{ label: "Исузу · 01A777AA" }];

    expect(hasNoVehicleMatches(options, "исузу", false)).toBe(false);
    expect(hasNoVehicleMatches(options, "газель", false)).toBe(true);
    expect(hasNoVehicleMatches([], "", false)).toBe(true);
    expect(hasNoVehicleMatches([], "газель", true)).toBe(false);
  });
});
