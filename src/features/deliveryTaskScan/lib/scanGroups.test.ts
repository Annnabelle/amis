import { describe, expect, it } from "vitest";

import type { DeliveryTask } from "entities/deliveryTasks/types";
import type { ScanAttempt } from "entities/scanSessions/types";
import {
  groupAcceptedScans,
  selectRejectedScans,
} from "features/scanning/lib/scanGroups";
import {
  buildProductsById,
  selectIncompleteProducts,
} from "features/deliveryTaskScan/lib/scanGroups";

const task = {
  items: [
    {
      product: { id: "p-1", name: "Сок", shortName: "Сок" },
      quantities: { planned: 10, delivered: 10 },
    },
    {
      product: { id: "p-2", name: "Вода", shortName: "Вода" },
      quantities: { planned: 5, delivered: 2 },
    },
  ],
} as unknown as DeliveryTask;

const scan = (code: string, status: "accepted" | "rejected", productId?: string): ScanAttempt =>
  ({ code, status, productId, ts: code, reason: status === "rejected" ? "код чужой" : undefined }) as ScanAttempt;

describe("журнал сканирования задачи", () => {
  it("собирает товары задачи по идентификатору", () => {
    const products = buildProductsById(task);

    expect(products.get("p-1")?.name).toBe("Сок");
    expect(buildProductsById(null).size).toBe(0);
  });

  it("группирует принятые сканы по товару в порядке первого скана", () => {
    const groups = groupAcceptedScans(
      [
        scan("a", "accepted", "p-2"),
        scan("b", "accepted", "p-1"),
        scan("c", "accepted", "p-2"),
      ],
      buildProductsById(task),
    );

    expect(groups.map((group) => group.productId)).toEqual(["p-2", "p-1"]);
    expect(groups[0].scans).toHaveLength(2);
    expect(groups[0].productName).toBe("Вода");
  });

  it("скан без товара и отклонённый в группы не попадают", () => {
    const groups = groupAcceptedScans(
      [scan("a", "accepted"), scan("b", "rejected", "p-1")],
      buildProductsById(task),
    );

    expect(groups).toEqual([]);
  });

  it("незнакомый товар показывается своим идентификатором", () => {
    const groups = groupAcceptedScans([scan("a", "accepted", "p-9")], buildProductsById(task));

    expect(groups[0].productName).toBe("p-9");
  });

  it("отклонённые сканы отбираются отдельно", () => {
    const rejected = selectRejectedScans([scan("a", "accepted", "p-1"), scan("b", "rejected")]);

    expect(rejected.map((item) => item.code)).toEqual(["b"]);
  });

  it("недовыдача — товары, где выдано меньше плана", () => {
    expect(selectIncompleteProducts(task).map((item) => item.product.id)).toEqual(["p-2"]);
    expect(selectIncompleteProducts(null)).toEqual([]);
  });
});
