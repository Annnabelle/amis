/**
 * Теги кеша RTK Query. Пополняются по мере перевода сущностей; список
 * объявляется в baseApi одним местом.
 */
export const ApiTags = {
  Access: "Access",
  AggregationReport: "AggregationReport",
  Company: "Company",
  CompanyImport: "CompanyImport",
  CompanyIntegration: "CompanyIntegration",
  CompanyMembership: "CompanyMembership",
  CustomsCodeOrder: "CustomsCodeOrder",
  DeliveryRoute: "DeliveryRoute",
  DeliveryTask: "DeliveryTask",
  Lead: "Lead",
  MarkingCodeOrder: "MarkingCodeOrder",
  Product: "Product",
  SalesOrder: "SalesOrder",
  SystemEmployee: "SystemEmployee",
  User: "User",
  UserPreview: "UserPreview",
  Vehicle: "Vehicle",
} as const;

export type ApiTag = (typeof ApiTags)[keyof typeof ApiTags];

export const apiTagTypes = Object.values(ApiTags);

/** Тег на весь список сущности — инвалидируется любой мутацией. */
export const LIST_TAG_ID = "LIST";
