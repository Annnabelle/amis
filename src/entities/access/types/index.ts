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

export const Permissions = {
  UsersList: "users.list",
  UsersRead: "users.read",
  UsersCreate: "users.create",
  UsersUpdate: "users.update",
  UsersDelete: "users.delete",
  UsersResetPassword: "users.reset-password",
  UsersPreview: "users.preview",

  SystemEmployeesList: "system-employees.list",
  SystemEmployeesRead: "system-employees.read",
  SystemEmployeesCreate: "system-employees.create",
  SystemEmployeesUpdate: "system-employees.update",
  SystemEmployeesDelete: "system-employees.delete",

  CompaniesList: "companies.list",
  CompaniesRead: "companies.read",
  CompaniesCreate: "companies.create",
  CompaniesUpdate: "companies.update",
  CompaniesDelete: "companies.delete",
  CompaniesValidateXTraceToken: "companies.validate-xtrace-token",
  CompaniesManageIntegrations: "companies.manage-integrations",
  CompaniesLegalInfoRead: "companies.legal-info.read",

  ProductsList: "products.list",
  ProductsRead: "products.read",
  ProductsCreate: "products.create",
  ProductsUpdate: "products.update",
  ProductsDelete: "products.delete",

  OrdersList: "orders.list",
  OrdersRead: "orders.read",
  OrdersCreate: "orders.create",
  OrdersSynchronize: "orders.synchronize",
  OrdersCancel: "orders.cancel",
  CodesRead: "codes.read",

  ReferencesRead: "references.read",
  RolesAssign: "roles.assign",
  UploadsCreate: "uploads.create",
  UploadsDelete: "uploads.delete",

  SalesOrdersList: "sales-orders.list",
  SalesOrdersRead: "sales-orders.read",
  SalesOrdersCreate: "sales-orders.create",
  SalesOrdersUpdate: "sales-orders.update",
  SalesOrdersCancel: "sales-orders.cancel",

  DeliveryRoutesList: "delivery-routes.list",
  DeliveryRoutesRead: "delivery-routes.read",
  DeliveryRoutesCreate: "delivery-routes.create",
  DeliveryRoutesUpdate: "delivery-routes.update",
  DeliveryRoutesStartLoading: "delivery-routes.start-loading",
  DeliveryRoutesCompleteLoading: "delivery-routes.complete-loading",
  DeliveryRoutesStartTransit: "delivery-routes.start-transit",
  DeliveryRoutesStartReturn: "delivery-routes.start-return",
  DeliveryRoutesCompleteReturn: "delivery-routes.complete-return",
  DeliveryRoutesClose: "delivery-routes.close",

  DeliveryTasksList: "delivery-tasks.list",
  DeliveryTasksRead: "delivery-tasks.read",
  DeliveryTasksStartHandover: "delivery-tasks.start-handover",
  DeliveryTasksCompleteHandover: "delivery-tasks.complete-handover",

  ScanSessionsCreate: "scan-sessions.create",
  ScanSessionsComplete: "scan-sessions.complete",
  ScanSessionsScan: "scan-sessions.scan",
  ScanSessionsCancelScan: "scan-sessions.cancel-scan",

  InvoicesList: "invoices.list",
  InvoicesRead: "invoices.read",
  InvoicesCreate: "invoices.create",

  ReportsList: "reports.list",
  ReportsRead: "reports.read",
  ReportsCreateUtilization: "reports.create-utilization",
  ReportsCreateAggregation: "reports.create-aggregation",
  ReportsExportAggregation: "reports.export-aggregation",

  AuditList: "audit.list",
  AuditRead: "audit.read",
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];

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
