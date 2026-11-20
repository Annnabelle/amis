import type { Permission } from "entities/access/types";

/**
 * Раздел, которого не хватает пользователю, — человеческим языком.
 *
 * Права названы ресурсом бэкенда (users.list, companies.read): показывать их
 * в интерфейсе нечего, но сказать, какой именно раздел недоступен, надо.
 * Ключи берём у меню там, где раздел в меню есть; остальным заведён
 * access.sections.
 */
const SECTION_KEY_BY_RESOURCE: Record<string, string> = {
  users: "navigation.users",
  "system-employees": "navigation.systemEmployees",
  companies: "navigation.organizations",
  "company-xtrace-integrations": "navigation.integrations",
  "company-faktura-uz-integrations": "navigation.integrations",
  "company-memberships": "navigation.companyMemberships",
  products: "navigation.products",
  leads: "navigation.leads",
  orders: "navigation.markingCodes",
  codes: "navigation.ownedCodes",
  "customs-code-orders": "customsCodes.title",
  "customs-code-order": "customsCodes.title",
  "sales-orders": "navigation.salesOrders",
  "delivery-routes": "navigation.deliveryRoutes",
  "delivery-tasks": "navigation.deliveryTasks",
  vehicle: "navigation.vehicles",
  invoices: "navigation.invoices",
  waybills: "navigation.waybills",
  reports: "navigation.agregations",
  audit: "navigation.audit",
  references: "access.sections.references",
  roles: "access.sections.roles",
  uploads: "access.sections.uploads",
  "scan-sessions": "access.sections.scanSessions",
  lifecycle: "access.sections.lifecycle",
  "lifecycle-internal": "access.sections.lifecycle",
  jobs: "access.sections.jobs",
  "company-import": "access.sections.companyImport",
};

/**
 * Ключи разделов по списку прав — без повторов и в порядке прав.
 * Право незнакомого ресурса пропускается: общего сообщения алерта хватает,
 * а машинное имя уходит в консоль разработчику.
 */
export const resolveSectionKeys = (
  permissions: readonly Permission[],
): string[] => [
  ...new Set(
    permissions
      .map((permission) => SECTION_KEY_BY_RESOURCE[permission.split(".")[0]])
      .filter((key): key is string => Boolean(key)),
  ),
];
