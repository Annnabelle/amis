/**
 * Адреса страниц: шаблоны для роутера и билдеры для переходов.
 *
 * Шаблон и билдер лежат рядом, поэтому переименование сегмента — правка в
 * одном месте. Литералы путей запрещены линтером (`no-restricted-syntax` в
 * eslint.config.js).
 *
 * Имена параметров у шаблонов те же, что читают страницы через useParams:
 * где-то `:id`, где-то `:orgId`. Разнобой остался от прежних маршрутов —
 * выравнивать его стоит вместе со страницами, которые эти параметры читают.
 */
/**
 * Компания в адресе приходит из useParams и типизирована как строка или
 * ничего: страницы компании открываются только по адресу с компанией, но
 * роутер этого не обещает.
 */
type CompanyId = string | undefined;

const company = (companyId: CompanyId) => `/organization/${companyId}`;

export const routes = {
  login: () => "/",
  register: () => "/register",
  forgotPassword: () => "/forgot-password",
  resetPassword: () => "/reset-password",
  verifyEmail: () => "/verify-email",
  activate: () => "/activate",
  welcome: () => "/welcome",
  profile: () => "/profile",
  changePassword: () => "/change-password",

  users: () => "/users",
  user: (userId: string) => `/users/${userId}`,
  userEdit: (userId: string) => `/users/${userId}/edit`,
  systemEmployees: () => "/system-employees",
  leads: () => "/leads",
  lead: (leadId: string) => `/leads/${leadId}`,
  auditLogs: () => "/audit-logs",

  companies: () => "/organization",
  company,
  companyEdit: (companyId: CompanyId) => `${company(companyId)}/edit`,
  companyMemberships: (companyId: CompanyId) => `${company(companyId)}/memberships`,
  companyIntegrations: (companyId: CompanyId) => `${company(companyId)}/integrations`,

  products: (companyId: CompanyId) => `${company(companyId)}/products`,
  product: (companyId: CompanyId, productId: string) =>
    `${company(companyId)}/products/${productId}`,
  productEdit: (companyId: CompanyId, productId: string) =>
    `${company(companyId)}/products/${productId}/edit`,

  markingCodeOrders: (companyId: CompanyId) => `${company(companyId)}/orders`,
  markingCodeOrder: (companyId: CompanyId, orderId: string) =>
    `${company(companyId)}/orders/${orderId}`,
  markingCodeBatch: (companyId: CompanyId, orderId: string, batchId: string) =>
    `${company(companyId)}/orderId/${orderId}/batchId/${batchId}`,
  ownedCodes: (companyId: CompanyId) => `${company(companyId)}/codes`,

  aggregations: (companyId: CompanyId) => `${company(companyId)}/agregations`,
  aggregationReport: (companyId: CompanyId, reportId: string) =>
    `${company(companyId)}/aggregations/${reportId}`,

  customsCodes: (companyId: CompanyId) => `${company(companyId)}/customs-codes`,
  customsCode: (companyId: CompanyId, orderId: string) =>
    `${company(companyId)}/customs-codes/${orderId}`,

  salesOrders: (companyId: CompanyId) => `${company(companyId)}/sales-orders`,
  salesOrderCreate: (companyId: CompanyId) => `${company(companyId)}/sales-orders/create`,
  salesOrder: (companyId: CompanyId, orderId: string) =>
    `${company(companyId)}/sales-orders/${orderId}`,

  deliveryRoutes: (companyId: CompanyId) => `${company(companyId)}/delivery-routes`,
  deliveryRouteCreate: (companyId: CompanyId) =>
    `${company(companyId)}/delivery-routes/create`,
  deliveryRoute: (companyId: CompanyId, routeId: string) =>
    `${company(companyId)}/delivery-routes/${routeId}`,
  deliveryRouteLoading: (companyId: CompanyId, routeId: string) =>
    `${company(companyId)}/delivery-routes/${routeId}/loading`,
  deliveryRouteReturn: (companyId: CompanyId, routeId: string) =>
    `${company(companyId)}/delivery-routes/${routeId}/return`,

  deliveryTasks: (companyId: CompanyId) => `${company(companyId)}/delivery-tasks`,
  deliveryTask: (companyId: CompanyId, taskId: string) =>
    `${company(companyId)}/delivery-tasks/${taskId}`,
  deliveryTaskScan: (companyId: CompanyId, taskId: string) =>
    `${company(companyId)}/delivery-tasks/${taskId}/scan`,

  vehicles: (companyId: CompanyId) => `${company(companyId)}/vehicles`,
  vehicle: (companyId: CompanyId, vehicleId: string) =>
    `${company(companyId)}/vehicles/${vehicleId}`,

  invoices: (companyId: CompanyId) => `${company(companyId)}/invoices`,
  invoice: (companyId: CompanyId, invoiceId: string) =>
    `${company(companyId)}/invoices/${invoiceId}`,

  waybills: (companyId: CompanyId) => `${company(companyId)}/waybills`,
  waybill: (companyId: CompanyId, waybillId: string) =>
    `${company(companyId)}/waybills/${waybillId}`,
} as const;

/** Шаблоны для `<Route path>`: параметры такие же, какие читают страницы. */
export const routePatterns = {
  login: "/",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  activate: "/activate",
  welcome: "/welcome",
  profile: "/profile",
  changePassword: "/change-password",
  me: "/me",

  users: "/users",
  user: "/users/:id",
  userEdit: "/users/:id/edit",
  systemEmployees: "/system-employees",
  leads: "/leads",
  lead: "/leads/:id",
  auditLogs: "/audit-logs",

  companies: "/organization",
  company: "/organization/:id",
  companyEdit: "/organization/:id/edit",
  companyMemberships: "/organization/:orgId/memberships",
  companyIntegrations: "/organization/:orgId/integrations",

  products: "/organization/:id/products",
  product: "/organization/:orgId/products/:id",
  productEdit: "/organization/:orgId/products/:id/edit",

  markingCodeOrders: "/organization/:id/orders",
  markingCodeOrder: "/organization/:orgId/orders/:orderId",
  markingCodeBatch: "/organization/:orgId/orderId/:orderId/batchId/:batchId",
  ownedCodes: "/organization/:orgId/codes",

  aggregations: "/organization/:id/agregations",
  aggregationReport: "/organization/:orgId/aggregations/:id",

  customsCodes: "/organization/:orgId/customs-codes",
  customsCode: "/organization/:orgId/customs-codes/:id",

  salesOrders: "/organization/:orgId/sales-orders",
  salesOrderCreate: "/organization/:orgId/sales-orders/create",
  salesOrder: "/organization/:orgId/sales-orders/:id",

  deliveryRoutes: "/organization/:orgId/delivery-routes",
  deliveryRouteCreate: "/organization/:orgId/delivery-routes/create",
  deliveryRoute: "/organization/:orgId/delivery-routes/:id",
  deliveryRouteLoading: "/organization/:orgId/delivery-routes/:id/loading",
  deliveryRouteReturn: "/organization/:orgId/delivery-routes/:id/return",

  deliveryTasks: "/organization/:orgId/delivery-tasks",
  deliveryTask: "/organization/:orgId/delivery-tasks/:id",
  deliveryTaskScan: "/organization/:orgId/delivery-tasks/:id/scan",

  vehicles: "/organization/:orgId/vehicles",
  vehicle: "/organization/:orgId/vehicles/:id",

  invoices: "/organization/:orgId/invoices",
  invoice: "/organization/:orgId/invoices/:id",

  waybills: "/organization/:orgId/waybills",
  waybill: "/organization/:orgId/waybills/:id",
} as const;
