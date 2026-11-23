import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { useCan } from "entities/access/lib";
import { accessSlice } from "entities/access/model";
import type { UserAccess } from "entities/access/types";
import { Permissions } from "shared/config/permissions";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import { renderWithProviders } from "test/render";

const accessOfCompany = (companyId: string): UserAccess => ({
  system: { roles: [], permissions: [], modules: [] },
  companies: [
    {
      companyId,
      name: "Компания",
      roles: ["manager"],
      permissions: [Permissions.ProductsList],
      modules: [],
    },
  ],
  invitations: { systemAccess: [], companyMemberships: [] },
});

const ProductsButton = () => {
  const canListProducts = useCan(endpointAccessMap.productsList);

  return <span>{canListProducts ? "кнопка видна" : "кнопка скрыта"}</span>;
};

const renderAt = (route: string) =>
  renderWithProviders(<ProductsButton />, {
    route,
    preloadedState: {
      access: {
        data: accessOfCompany("c-1"),
        currentCompanyId: null,
        loading: false,
        error: null,
      },
    },
    reducers: { access: accessSlice.reducer as never },
  });

describe("useCan", () => {
  it("на карточке компании право компании действует", () => {
    renderAt("/organization/c-1");

    expect(screen.getByText("кнопка видна")).toBeInTheDocument();
  });

  it("во вложенном разделе компании — тоже", () => {
    renderAt("/organization/c-1/products");

    expect(screen.getByText("кнопка видна")).toBeInTheDocument();
  });

  it("вне компании право компании не действует", () => {
    renderAt("/users");

    expect(screen.getByText("кнопка скрыта")).toBeInTheDocument();
  });

  it("чужая компания прав не даёт", () => {
    renderAt("/organization/c-2/products");

    expect(screen.getByText("кнопка скрыта")).toBeInTheDocument();
  });
});
