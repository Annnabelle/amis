import {
  Permissions,
  type Permission,
} from "shared/config/permissions";

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const EndpointScopes = {
  Public: "PUBLIC",
  Authenticated: "AUTHENTICATED",
  Global: "GLOBAL",
  Company: "COMPANY",
  Any: "ANY",
  Dynamic: "DYNAMIC",
} as const;

export type EndpointScope =
  (typeof EndpointScopes)[keyof typeof EndpointScopes];

export type ResolvedEndpointScope = Exclude<
  EndpointScope,
  typeof EndpointScopes.Dynamic
>;

export const DynamicEndpointScopes = {
  System: "system",
  Company: "company",
} as const;

export type DynamicEndpointScope =
  (typeof DynamicEndpointScopes)[keyof typeof DynamicEndpointScopes];

export type EndpointAccessDefinition = {
  method: HttpMethod;
  path: string;
  permission: Permission | null;
  scope: EndpointScope;
};

const endpoint = <const T extends EndpointAccessDefinition>(definition: T) =>
  definition;

export const endpointAccessMap = {
  usersHealth: endpoint({ method: "GET", path: "/users/health", permission: null, scope: EndpointScopes.Public }),
  usersLogin: endpoint({ method: "POST", path: "/users/login", permission: null, scope: EndpointScopes.Public }),
  currentAccess: endpoint({ method: "GET", path: "/users/me/access", permission: null, scope: EndpointScopes.Authenticated }),
  decideSystemAccessInvitation: endpoint({ method: "PATCH", path: "/users/me/system-access/invitations/:id", permission: null, scope: EndpointScopes.Authenticated }),
  respondCompanyMembershipInvitation: endpoint({ method: "PATCH", path: "/users/me/company-membership/invitations/:id", permission: null, scope: EndpointScopes.Authenticated }),
  usersCreate: endpoint({ method: "POST", path: "/users/register", permission: Permissions.UsersCreate, scope: EndpointScopes.Global }),
  usersResetPassword: endpoint({ method: "PATCH", path: "/users/:id/change-password", permission: Permissions.UsersResetPassword, scope: EndpointScopes.Global }),
  usersSearch: endpoint({ method: "GET", path: "/users/search", permission: Permissions.UsersList, scope: EndpointScopes.Global }),
  usersList: endpoint({ method: "GET", path: "/users", permission: Permissions.UsersList, scope: EndpointScopes.Global }),
  usersPreview: endpoint({ method: "GET", path: "/users/:id/preview", permission: Permissions.UsersPreview, scope: EndpointScopes.Any }),
  usersRead: endpoint({ method: "GET", path: "/users/:id", permission: Permissions.UsersRead, scope: EndpointScopes.Global }),
  usersUpdate: endpoint({ method: "PATCH", path: "/users/:id", permission: Permissions.UsersUpdate, scope: EndpointScopes.Global }),
  usersDelete: endpoint({ method: "DELETE", path: "/users/:id", permission: Permissions.UsersDelete, scope: EndpointScopes.Global }),

  systemEmployeesList: endpoint({ method: "GET", path: "/system/employees", permission: Permissions.SystemEmployeesList, scope: EndpointScopes.Global }),
  systemEmployeesRead: endpoint({ method: "GET", path: "/system/employees/:id", permission: Permissions.SystemEmployeesRead, scope: EndpointScopes.Global }),
  systemEmployeesCreate: endpoint({ method: "POST", path: "/system/employees", permission: Permissions.SystemEmployeesCreate, scope: EndpointScopes.Global }),
  systemEmployeesUpdate: endpoint({ method: "PATCH", path: "/system/employees/:id", permission: Permissions.SystemEmployeesUpdate, scope: EndpointScopes.Global }),
  systemEmployeesDelete: endpoint({ method: "DELETE", path: "/system/employees/:id", permission: Permissions.SystemEmployeesDelete, scope: EndpointScopes.Global }),

  companiesCreate: endpoint({ method: "POST", path: "/companies", permission: Permissions.CompaniesCreate, scope: EndpointScopes.Global }),
  companiesList: endpoint({ method: "GET", path: "/companies", permission: Permissions.CompaniesList, scope: EndpointScopes.Global }),
  companiesSearch: endpoint({ method: "GET", path: "/companies/search", permission: Permissions.CompaniesList, scope: EndpointScopes.Global }),
  companiesByTin: endpoint({ method: "GET", path: "/companies/by-tin/:tin", permission: Permissions.CompaniesLegalInfoRead, scope: EndpointScopes.Any }),
  companiesRead: endpoint({ method: "GET", path: "/companies/:id", permission: Permissions.CompaniesRead, scope: EndpointScopes.Global }),
  companiesUpdate: endpoint({ method: "PATCH", path: "/companies/:id", permission: Permissions.CompaniesUpdate, scope: EndpointScopes.Global }),
  companiesDelete: endpoint({ method: "DELETE", path: "/companies/:id", permission: Permissions.CompaniesDelete, scope: EndpointScopes.Global }),
  companiesValidateXTrace: endpoint({ method: "GET", path: "/companies/x-trace/validate", permission: Permissions.CompaniesValidateXTraceToken, scope: EndpointScopes.Global }),
  integrationsXTraceValidate: endpoint({ method: "GET", path: "/integrations/x-trace/validate", permission: Permissions.CompanyXTraceIntegrationsValidateToken, scope: EndpointScopes.Company }),
  integrationsXTraceRead: endpoint({ method: "GET", path: "/integrations/x-trace", permission: Permissions.CompanyXTraceIntegrationsRead, scope: EndpointScopes.Company }),
  integrationsXTraceCreate: endpoint({ method: "POST", path: "/integrations/x-trace", permission: Permissions.CompanyXTraceIntegrationsCreate, scope: EndpointScopes.Company }),
  integrationsFakturaUzRead: endpoint({ method: "GET", path: "/integrations/faktura-uz", permission: Permissions.CompanyFakturaUzIntegrationsRead, scope: EndpointScopes.Company }),
  integrationsFakturaUzCreate: endpoint({ method: "POST", path: "/integrations/faktura-uz", permission: Permissions.CompanyFakturaUzIntegrationsCreate, scope: EndpointScopes.Company }),
  companyMembershipsList: endpoint({ method: "GET", path: "/company-memberships", permission: Permissions.CompanyMembershipsList, scope: EndpointScopes.Company }),
  companyMembershipsSearch: endpoint({ method: "GET", path: "/company-memberships/search", permission: Permissions.CompanyMembershipsList, scope: EndpointScopes.Company }),
  companyMembershipsRead: endpoint({ method: "GET", path: "/company-memberships/:id", permission: Permissions.CompanyMembershipsRead, scope: EndpointScopes.Company }),
  companyMembershipsCreate: endpoint({ method: "POST", path: "/company-memberships", permission: Permissions.CompanyMembershipsCreate, scope: EndpointScopes.Company }),
  companyMembershipsUpdate: endpoint({ method: "PATCH", path: "/company-memberships/:id", permission: Permissions.CompanyMembershipsUpdate, scope: EndpointScopes.Company }),
  companyMembershipsDelete: endpoint({ method: "DELETE", path: "/company-memberships/:id", permission: Permissions.CompanyMembershipsDelete, scope: EndpointScopes.Company }),

  referencesRead: endpoint({ method: "GET", path: "/references/:type", permission: Permissions.ReferencesRead, scope: EndpointScopes.Any }),
  roleReferencesRead: endpoint({ method: "GET", path: "/references/roles/:scope", permission: Permissions.ReferencesRead, scope: EndpointScopes.Dynamic }),
  assignableRoleReferencesRead: endpoint({ method: "GET", path: "/references/roles/:scope/assignable", permission: Permissions.RolesAssign, scope: EndpointScopes.Dynamic }),

  productsCreate: endpoint({ method: "POST", path: "/products", permission: Permissions.ProductsCreate, scope: EndpointScopes.Company }),
  productsList: endpoint({ method: "GET", path: "/products", permission: Permissions.ProductsList, scope: EndpointScopes.Company }),
  productsSearch: endpoint({ method: "GET", path: "/products/search", permission: Permissions.ProductsList, scope: EndpointScopes.Company }),
  productsRead: endpoint({ method: "GET", path: "/products/:id", permission: Permissions.ProductsRead, scope: EndpointScopes.Company }),
  productsUpdate: endpoint({ method: "PATCH", path: "/products/:id", permission: Permissions.ProductsUpdate, scope: EndpointScopes.Company }),
  productsDelete: endpoint({ method: "DELETE", path: "/products/:id", permission: Permissions.ProductsDelete, scope: EndpointScopes.Company }),

  ordersCreate: endpoint({ method: "POST", path: "/orders", permission: Permissions.OrdersCreate, scope: EndpointScopes.Company }),
  ordersList: endpoint({ method: "GET", path: "/orders", permission: Permissions.OrdersList, scope: EndpointScopes.Company }),
  ordersSynchronize: endpoint({ method: "GET", path: "/orders/synchronize", permission: Permissions.OrdersSynchronize, scope: EndpointScopes.Company }),
  ordersRead: endpoint({ method: "GET", path: "/orders/:id", permission: Permissions.OrdersRead, scope: EndpointScopes.Company }),
  orderBatchRead: endpoint({ method: "GET", path: "/orders/:orderId/batches/:batchId", permission: Permissions.OrdersRead, scope: EndpointScopes.Company }),
  codesRead: endpoint({ method: "GET", path: "/codes/batches", permission: Permissions.CodesRead, scope: EndpointScopes.Company }),

  salesOrdersCreate: endpoint({ method: "POST", path: "/sales-orders", permission: Permissions.SalesOrdersCreate, scope: EndpointScopes.Company }),
  salesOrdersList: endpoint({ method: "GET", path: "/sales-orders", permission: Permissions.SalesOrdersList, scope: EndpointScopes.Company }),
  salesOrdersRead: endpoint({ method: "GET", path: "/sales-orders/:id", permission: Permissions.SalesOrdersRead, scope: EndpointScopes.Company }),

  deliveryRoutesCreate: endpoint({ method: "POST", path: "/delivery-routes", permission: Permissions.DeliveryRoutesCreate, scope: EndpointScopes.Company }),
  deliveryRoutesList: endpoint({ method: "GET", path: "/delivery-routes", permission: Permissions.DeliveryRoutesList, scope: EndpointScopes.Company }),
  deliveryRoutesRead: endpoint({ method: "GET", path: "/delivery-routes/:id", permission: Permissions.DeliveryRoutesRead, scope: EndpointScopes.Company }),
  deliveryRouteTasksList: endpoint({ method: "GET", path: "/delivery-routes/:id/tasks", permission: Permissions.DeliveryTasksList, scope: EndpointScopes.Company }),
  deliveryRoutesStartLoading: endpoint({ method: "POST", path: "/delivery-routes/:id/start-loading", permission: Permissions.DeliveryRoutesStartLoading, scope: EndpointScopes.Company }),
  deliveryRoutesCompleteLoading: endpoint({ method: "POST", path: "/delivery-routes/:id/complete-loading", permission: Permissions.DeliveryRoutesCompleteLoading, scope: EndpointScopes.Company }),
  deliveryRoutesStartTransit: endpoint({ method: "POST", path: "/delivery-routes/:id/start-transit", permission: Permissions.DeliveryRoutesStartTransit, scope: EndpointScopes.Company }),
  deliveryRoutesStartReturn: endpoint({ method: "POST", path: "/delivery-routes/:id/start-return", permission: Permissions.DeliveryRoutesStartReturn, scope: EndpointScopes.Company }),
  deliveryRoutesCompleteReturn: endpoint({ method: "POST", path: "/delivery-routes/:id/complete-return", permission: Permissions.DeliveryRoutesCompleteReturn, scope: EndpointScopes.Company }),
  deliveryRoutesClose: endpoint({ method: "POST", path: "/delivery-routes/:id/close", permission: Permissions.DeliveryRoutesClose, scope: EndpointScopes.Company }),

  deliveryTasksRead: endpoint({ method: "GET", path: "/delivery-tasks/:id", permission: Permissions.DeliveryTasksRead, scope: EndpointScopes.Company }),
  deliveryTasksStartHandover: endpoint({ method: "POST", path: "/delivery-tasks/:id/start-handover", permission: Permissions.DeliveryTasksStartHandover, scope: EndpointScopes.Company }),
  deliveryTasksCompleteHandover: endpoint({ method: "POST", path: "/delivery-tasks/:id/complete-handover", permission: Permissions.DeliveryTasksCompleteHandover, scope: EndpointScopes.Company }),

  scanSessionsCreate: endpoint({ method: "POST", path: "/scan-sessions", permission: Permissions.ScanSessionsCreate, scope: EndpointScopes.Company }),
  scanSessionsComplete: endpoint({ method: "PATCH", path: "/scan-sessions/:id/complete", permission: Permissions.ScanSessionsComplete, scope: EndpointScopes.Company }),
  scanSessionsScan: endpoint({ method: "POST", path: "/scan-sessions/:sessionId/scan", permission: Permissions.ScanSessionsScan, scope: EndpointScopes.Company }),
  scanSessionsCancelScan: endpoint({ method: "POST", path: "/scan-sessions/cancel-scan", permission: Permissions.ScanSessionsCancelScan, scope: EndpointScopes.Company }),

  invoicesList: endpoint({ method: "GET", path: "/invoices", permission: Permissions.InvoicesList, scope: EndpointScopes.Company }),
  invoicesRead: endpoint({ method: "GET", path: "/invoices/:id", permission: Permissions.InvoicesRead, scope: EndpointScopes.Company }),
  invoiceItemsRead: endpoint({ method: "GET", path: "/invoices/:id/items", permission: Permissions.InvoicesRead, scope: EndpointScopes.Company }),

  utilizationReportsCreate: endpoint({ method: "POST", path: "/reports/utilization", permission: Permissions.ReportsCreateUtilization, scope: EndpointScopes.Company }),
  aggregationReportsCreate: endpoint({ method: "POST", path: "/reports/aggregation", permission: Permissions.ReportsCreateAggregation, scope: EndpointScopes.Company }),
  aggregationReportsList: endpoint({ method: "GET", path: "/reports/aggregation", permission: Permissions.ReportsList, scope: EndpointScopes.Company }),
  aggregationReportsRead: endpoint({ method: "GET", path: "/reports/aggregation/:id", permission: Permissions.ReportsRead, scope: EndpointScopes.Company }),
  aggregationReportUnitsRead: endpoint({ method: "GET", path: "/reports/aggregation/:id/units", permission: Permissions.ReportsRead, scope: EndpointScopes.Company }),
  aggregationReportsExport: endpoint({ method: "GET", path: "/reports/aggregation/:id/export", permission: Permissions.ReportsExportAggregation, scope: EndpointScopes.Company }),

  auditList: endpoint({ method: "GET", path: "/audit", permission: Permissions.AuditList, scope: EndpointScopes.Global }),
  auditRead: endpoint({ method: "GET", path: "/audit/:id", permission: Permissions.AuditRead, scope: EndpointScopes.Global }),

  uploadsCreate: endpoint({ method: "POST", path: "/uploads", permission: Permissions.UploadsCreate, scope: EndpointScopes.Global }),
  uploadsDelete: endpoint({ method: "DELETE", path: "/uploads/:id", permission: Permissions.UploadsDelete, scope: EndpointScopes.Global }),
} as const;

export type EndpointAccess =
  (typeof endpointAccessMap)[keyof typeof endpointAccessMap];

export type CheckableEndpointAccess = Extract<
  EndpointAccess,
  { permission: string }
>;

export type StaticEndpointAccess = Extract<
  CheckableEndpointAccess,
  {
    scope:
      | typeof EndpointScopes.Global
      | typeof EndpointScopes.Company
      | typeof EndpointScopes.Any;
  }
>;

export type DynamicEndpointAccess = Extract<
  CheckableEndpointAccess,
  { scope: typeof EndpointScopes.Dynamic }
>;

export type ResolvedEndpointAccess = Omit<EndpointAccess, "scope"> & {
  scope: ResolvedEndpointScope;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const compilePath = (path: string) => {
  const segments = path.split("/").filter(Boolean);
  const source = segments
    .map((segment) => {
      if (segment.startsWith(":")) {
        return `(?<${segment.slice(1)}>[^/]+)`;
      }

      return escapeRegExp(segment);
    })
    .join("/");

  return new RegExp(`^/${source}/?$`);
};

const getPathSpecificity = (path: string) => {
  const segments = path.split("/").filter(Boolean);
  const staticSegments = segments.filter(
    (segment) => !segment.startsWith(":")
  ).length;

  return staticSegments * 100 + segments.length;
};

const compiledEndpoints = Object.values(endpointAccessMap)
  .map((definition) => ({
    definition,
    pattern: compilePath(definition.path),
    specificity: getPathSpecificity(definition.path),
  }))
  .sort((left, right) => right.specificity - left.specificity);

export const resolveEndpointAccess = (
  method: string | undefined,
  pathname: string
): ResolvedEndpointAccess | null => {
  const normalizedMethod = method?.toUpperCase();

  for (const endpointEntry of compiledEndpoints) {
    if (endpointEntry.definition.method !== normalizedMethod) continue;

    const match = endpointEntry.pattern.exec(pathname);
    if (!match) continue;

    const definition = endpointEntry.definition;
    if (definition.scope !== EndpointScopes.Dynamic) {
      return definition as ResolvedEndpointAccess;
    }

    const dynamicScope = match.groups?.scope;
    if (
      dynamicScope !== DynamicEndpointScopes.System &&
      dynamicScope !== DynamicEndpointScopes.Company
    ) {
      return null;
    }

    return {
      ...definition,
      scope: dynamicScope === DynamicEndpointScopes.Company
        ? EndpointScopes.Company
        : EndpointScopes.Global,
    } as ResolvedEndpointAccess;
  }

  return null;
};
