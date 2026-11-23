import { describe, expect, it } from "vitest";

import {
  flattenTarget,
  formatValueByKey,
  getLinkField,
  getTargetAccess,
  resolveTargetPath,
  selectVisibleFields,
  withFullName,
} from "features/auditTarget/lib/targetFields";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

describe("цель события аудита", () => {
  it("разворачивает вложенные поля в пути через точку", () => {
    expect(
      flattenTarget({ contacts: { phone: "998901234567", email: "a@b.uz" }, tin: "123" }),
    ).toEqual([
      ["contacts.phone", "998901234567"],
      ["contacts.email", "a@b.uz"],
      ["tin", "123"],
    ]);
  });

  it("массив остаётся значением, а не разворачивается", () => {
    expect(flattenTarget({ roles: ["admin", "agent"] })).toEqual([["roles", ["admin", "agent"]]]);
  });

  it("телефон показывается в местном формате, список — через запятую", () => {
    expect(formatValueByKey("phone", "998901234567")).toContain("90");
    expect(formatValueByKey("roles", ["admin", "agent"])).toBe("admin, agent");
    expect(formatValueByKey("tin", 123)).toBe("123");
  });

  it("служебные и пустые поля в карточку не попадают", () => {
    const fields = selectVisibleFields(
      { id: "u-1", status: "active", email: "a@b.uz", phone: null },
      "user",
    );

    expect(fields).toEqual([["email", "a@b.uz"]]);
  });

  it("имя пользователя собирается из частей и встаёт первым", () => {
    const target = withFullName({ firstName: "Иван", lastName: "Петров", id: "u-1" }, "user");

    expect(Object.keys(target)[0]).toBe("fullName");
    expect(target.fullName).toBe("Иван Петров");
  });

  it("имя собирается только для пользователя и только из обеих частей", () => {
    expect(withFullName({ firstName: "Иван" }, "user").fullName).toBeUndefined();
    expect(withFullName({ firstName: "Иван", lastName: "Петров" }, "company").fullName).toBeUndefined();
  });

  it("ссылку несёт поле своей сущности", () => {
    expect(getLinkField("user")).toBe("fullName");
    expect(getLinkField("company")).toBe("displayName");
    expect(getLinkField("auth")).toBeUndefined();
  });

  it("адрес записи зависит от сущности", () => {
    expect(resolveTargetPath({}, "user", "u-1")).toBe("/users/u-1");
    expect(resolveTargetPath({ companyId: "c-1" }, "product", "p-1")).toBe(
      "/organization/c-1/products/p-1",
    );
    expect(resolveTargetPath({}, "product", "p-1")).toBe("/organization");
    expect(resolveTargetPath({}, "auth", "x")).toBe("");
  });

  it("права на чтение известны для сущностей со страницей", () => {
    expect(getTargetAccess("user")).toBe(endpointAccessMap.usersRead);
    expect(getTargetAccess("order")).toBe(endpointAccessMap.ordersRead);
    expect(getTargetAccess("auth")).toBeNull();
  });
});
