import { describe, expect, it } from "vitest";
import { matchPath } from "react-router-dom";

import { routePatterns, routes } from "./routes";

/** Аргументы билдера — по числу параметров, значения различимы в адресе. */
const placeholders = (arity: number) =>
  Array.from({ length: arity }, (_, index) => `id-${index + 1}`);

describe("routes", () => {
  it("каждому билдеру отвечает шаблон того же имени", () => {
    const withoutPattern = Object.keys(routes).filter(
      (name) => !(name in routePatterns)
    );

    expect(withoutPattern).toEqual([]);
  });

  it("адрес из билдера попадает в свой шаблон", () => {
    const mismatched: string[] = [];

    for (const [name, build] of Object.entries(routes)) {
      const pattern = routePatterns[name as keyof typeof routePatterns];
      const path = build(...(placeholders(build.length) as [string, string, string]));

      if (!matchPath(pattern, path)) {
        mismatched.push(`${name}: ${path} не совпал с ${pattern}`);
      }
    }

    expect(mismatched).toEqual([]);
  });

  it("собирает адреса компании", () => {
    expect(routes.company("c-1")).toBe("/organization/c-1");
    expect(routes.products("c-1")).toBe("/organization/c-1/products");
    expect(routes.product("c-1", "p-2")).toBe("/organization/c-1/products/p-2");
    expect(routes.markingCodeBatch("c-1", "o-2", "b-3")).toBe(
      "/organization/c-1/orderId/o-2/batchId/b-3"
    );
  });

  it("собирает адреса вне компании", () => {
    expect(routes.login()).toBe("/");
    expect(routes.companies()).toBe("/organization");
    expect(routes.userEdit("u-1")).toBe("/users/u-1/edit");
  });
});
