import { describe, expect, it } from "vitest";

import { parseCompanyFromPath } from "shared/lib/companyPath";

describe("parseCompanyFromPath", () => {
  it("читает компанию из адреса карточки", () => {
    expect(parseCompanyFromPath("/organization/c-1")).toBe("c-1");
  });

  it("читает компанию из вложенного раздела", () => {
    expect(parseCompanyFromPath("/organization/c-1/products/p-2/edit")).toBe(
      "c-1",
    );
  });

  it("на списке компаний компании нет", () => {
    expect(parseCompanyFromPath("/organization")).toBeNull();
    expect(parseCompanyFromPath("/organization/")).toBeNull();
  });

  it("не путает другие разделы", () => {
    expect(parseCompanyFromPath("/organizations/c-1")).toBeNull();
    expect(parseCompanyFromPath("/users/u-1")).toBeNull();
    expect(parseCompanyFromPath("/")).toBeNull();
  });
});
