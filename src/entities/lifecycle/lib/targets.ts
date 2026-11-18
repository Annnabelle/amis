/**
 * Подключение сущности к таймлайну: конфиг ниже и <LifecyclePanel target=… />
 * на карточке.
 */
import { LifecycleTargetEntity } from '@edem2000/amis.contracts';

export { LifecycleTargetEntity };

import { CompanyScopeOptions, type CompanyScopeOption } from "shared/lib/requestScope";


export type LifecycleTargetConfig = {
  /**
   * Auto — обычный клиентский контур: x-company-id уходит из контекста.
   * None — у сущности компании нет (заявка с сайта), журнал читается
   *        только системной ролью и только без заголовка.
   */
  companyScope: CompanyScopeOption;
};

export const lifecycleTargets: Record<
  LifecycleTargetEntity,
  LifecycleTargetConfig
> = {
  [LifecycleTargetEntity.Lead]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetEntity.SalesOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.DeliveryRoute]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.DeliveryTask]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.ScanSession]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.Invoice]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.Waybill]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.MarkingCodeOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.MarkingCodeOrderBatch]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.UtilizationReport]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.AggregationReport]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.AggregatedCustomsCodeOrder]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.Product]: { companyScope: CompanyScopeOptions.Auto },
  [LifecycleTargetEntity.Vehicle]: { companyScope: CompanyScopeOptions.Auto },
  /**
   * User и Company читаются только системной ролью (эндпоинты /users/:id и
   * /companies/:id — Global-scope), заголовок компании тут ни при чём —
   * тот же случай, что и Lead.
   */
  [LifecycleTargetEntity.User]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetEntity.Company]: { companyScope: CompanyScopeOptions.None },
  [LifecycleTargetEntity.CompanyXTraceIntegration]: {
    companyScope: CompanyScopeOptions.Auto,
  },
  [LifecycleTargetEntity.CompanyFakturaUzIntegration]: {
    companyScope: CompanyScopeOptions.Auto,
  },
};

export const getLifecycleTargetConfig = (
  target: LifecycleTargetEntity
): LifecycleTargetConfig => lifecycleTargets[target];
