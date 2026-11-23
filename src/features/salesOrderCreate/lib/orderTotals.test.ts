import { describe, expect, it } from "vitest";

import {
  calculateDeliveryCost,
  calculateItemsTotal,
} from "features/salesOrderCreate/lib/orderTotals";

type Item = Parameters<typeof calculateItemsTotal>[0];

const items = (...rows: Array<{ quantity?: unknown; unitPrice?: unknown }>) =>
  rows as unknown as Item;

describe("суммы заказа", () => {
  it("считает сумму позиций", () => {
    expect(calculateItemsTotal(items({ quantity: "3", unitPrice: "1500" }))).toBe(4500n);
  });

  it("складывает позиции между собой", () => {
    expect(
      calculateItemsTotal(
        items({ quantity: "2", unitPrice: "100" }, { quantity: "5", unitPrice: "20" }),
      ),
    ).toBe(300n);
  });

  it("не теряет точность на крупных суммах", () => {
    expect(calculateItemsTotal(items({ quantity: "1000000", unitPrice: "9007199254740993" }))).toBe(
      9007199254740993000000n,
    );
  });

  it("пустые и неполные позиции считает нулями", () => {
    expect(calculateItemsTotal(undefined)).toBe(0n);
    expect(calculateItemsTotal(items({}))).toBe(0n);
    expect(calculateItemsTotal(items({ quantity: "2" }))).toBe(0n);
    expect(calculateItemsTotal(items({ quantity: "2 шт", unitPrice: "1 000" }))).toBe(2000n);
  });

  it("стоимость доставки — цена за единицу на расстояние", () => {
    expect(calculateDeliveryCost("1500", "12.5")).toBe(18750);
  });

  it("без цены или расстояния доставка стоит ноль", () => {
    expect(calculateDeliveryCost(undefined, "12")).toBe(0);
    expect(calculateDeliveryCost("1500", "далеко")).toBe(0);
  });
});
