import { CompanyScopeOptions, type CompanyScopeOption } from "shared/lib/requestScope";

/**
 * Реестр типов сущностей, у которых есть таймлайн.
 * Подключение новой сущности = строка здесь + <LifecyclePanel target=... />
 * на её карточке.
 */
export const LifecycleTargetType = {
  Lead: "lead",
  SalesOrder: "salesOrder",
  DeliveryRoute: "deliveryRoute",
  DeliveryTask: "deliveryTask",
  ScanSession: "scanSession",
  Invoice: "invoice",
  Waybill: "waybill",
  MarkingCodeOrder: "markingCodeOrder",
  MarkingCodeOrderBatch: "markingCodeOrderBatch",
  UtilizationReport: "utilizationReport",
  AggregationReport: "aggregationReport",
  CustomsCodeOrder: "customsCodeOrder",
  Product: "product",
  Vehicle: "vehicle",
  User: "user",
  Company: "company",
  CompanyXTraceIntegration: "companyXTraceIntegration",
  CompanyFakturaUzIntegration: "companyFakturaUzIntegration",
} as const;

export type LifecycleTargetType =
  (typeof LifecycleTargetType)[keyof typeof LifecycleTargetType];

export type LifecycleTargetConfig = {
  /**
   * Auto — обычный клиентский контур: x-company-id уходит из контекста.
   * None — у сущности компании нет (заявка с сайта), журнал читается
   *        только системной ролью и только без заголовка.
   */
  companyScope: CompanyScopeOption;
};

export const lifecycleTargets: Record<
  LifecycleTargetType,
  LifecycleTargetConfig
> = {
  [LifecycleTargetType.Lead]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetType.SalesOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.DeliveryRoute]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.DeliveryTask]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.ScanSession]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.Invoice]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.Waybill]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.MarkingCodeOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.MarkingCodeOrderBatch]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.UtilizationReport]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.AggregationReport]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.CustomsCodeOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.Product]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetType.Vehicle]: { companyScope: CompanyScopeOptions.Auto },
  /**
   * User и Company читаются только системной ролью (эндпоинты /users/:id и
   * /companies/:id — Global-scope), заголовок компании тут ни при чём —
   * тот же случай, что и Lead.
   */
  [LifecycleTargetType.User]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetType.Company]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetType.CompanyXTraceIntegration]: {
    companyScope: CompanyScopeOptions.Auto,
  },
  [LifecycleTargetType.CompanyFakturaUzIntegration]: {
    companyScope: CompanyScopeOptions.Auto,
  },
};

export const getLifecycleTargetConfig = (
  target: LifecycleTargetType
): LifecycleTargetConfig => lifecycleTargets[target];
