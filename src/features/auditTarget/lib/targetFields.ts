import { endpointAccessMap, type StaticEndpointAccess } from "shared/config/endpointAccessMap";
import { FormatUzbekPhoneNumber } from "shared/lib/utils";
import { routes } from "shared/config/routes";

/** Цель события аудита: набор полей зависит от сущности, перебираем по ключам. */
export type AuditTarget = Record<string, unknown>;

/** Права на чтение записи, о которой событие. */
export const getTargetAccess = (targetEntity: string): StaticEndpointAccess | null => {
  switch (targetEntity) {
    case "user":
      return endpointAccessMap.usersRead;
    case "company":
      return endpointAccessMap.companiesRead;
    case "product":
      return endpointAccessMap.productsRead;
    case "markingCodeOrder":
    case "order":
      return endpointAccessMap.ordersRead;
    default:
      return null;
  }
};

/** Поля, которые в карточке события не показываются. */
const EXCLUDED_FIELDS_BY_ENTITY: Record<string, string[]> = {
  user: ["companyIds", "id", "status", "firstName", "lastName"],
  company: ["id", "companyId"],
  product: ["id", "companyId"],
};

/** Поле, по которому запись открывается. */
const LINK_FIELD_BY_ENTITY: Record<string, string> = {
  user: "fullName",
  company: "displayName",
  product: "name",
};

/** Вложенные объекты разворачиваются в пути через точку. */
export const flattenTarget = (target: AuditTarget, prefix = ""): [string, unknown][] =>
  Object.entries(target).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      return flattenTarget(value as AuditTarget, fullKey);
    }

    return [[fullKey, value]] as [string, unknown][];
  });

export const formatValueByKey = (key: string, value: unknown) => {
  if (key === "phone" || key === "contacts.phone") {
    return FormatUzbekPhoneNumber(String(value));
  }

  return Array.isArray(value) ? value.map(String).join(", ") : String(value);
};

/** Имя пользователя собирается из частей: в аудите они лежат отдельно. */
export const withFullName = (target: AuditTarget, targetEntity?: string) => {
  if (targetEntity === "user" && target.firstName && target.lastName) {
    return {
      fullName: `${String(target.firstName)} ${String(target.lastName)}`,
      ...target,
    };
  }

  return target;
};

/** Поля цели без служебных и пустых. */
export const selectVisibleFields = (target: AuditTarget, targetEntity?: string) => {
  const excluded = EXCLUDED_FIELDS_BY_ENTITY[targetEntity || ""] || [];

  return flattenTarget(target).filter(([key, value]) => {
    const baseKey = key.split(".").pop() || key;

    if (excluded.includes(baseKey)) return false;

    return value !== null && value !== undefined;
  });
};

export const getLinkField = (targetEntity?: string) =>
  LINK_FIELD_BY_ENTITY[targetEntity || ""];

/** Адрес записи, о которой событие. */
export const resolveTargetPath = (
  target: AuditTarget,
  targetEntity: string | undefined,
  entityId: string,
) => {
  switch (targetEntity) {
    case "user":
      return routes.user(entityId);
    case "company":
      return routes.company(entityId);
    case "product":
      return target.companyId
        ? routes.product(String(target.companyId), entityId)
        : routes.companies();
    default:
      return "";
  }
};
