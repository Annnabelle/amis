import type { Permission } from "shared/config/permissions";

export { Permissions } from "shared/config/permissions";
export type { Permission } from "shared/config/permissions";

export const AccessModules = {
  Companies: "companies",
  Users: "users",
  Products: "products",
  Orders: "orders",
  Codes: "codes",
  SalesOrders: "sales-orders",
  DeliveryRoutes: "delivery-routes",
  DeliveryTasks: "delivery-tasks",
  ScanSessions: "scan-sessions",
  Invoices: "invoices",
  Reports: "reports",
  Audit: "audit",
} as const;

export type AccessModule =
  (typeof AccessModules)[keyof typeof AccessModules];

export type AccessScope = {
  roles: string[];
  permissions: Permission[];
  modules: AccessModule[];
};

export type CompanyAccess = AccessScope & {
  companyId: string;
  name: string;
};

export type UserAccess = {
  system: AccessScope;
  companies: CompanyAccess[];
};

export type AccessState = {
  data: UserAccess | null;
  currentCompanyId: string | null;
  loading: boolean;
  error: string | null;
};
