import { StatusEntity } from "shared/config/statusCatalog";

/**
 * Что мы знаем о сущности, пришедшей в уведомлении: куда вести и под каким
 * ключом её статусы лежат в каталоге подписей и цветов.
 *
 * Ключи — машинные имена сущностей бэкенда (`EntityType`): сравнение идёт с тем,
 * что прислал сервер. С `LifecycleTargetType` они местами расходятся — у нас
 * `customsCodeOrder`, у бэкенда `aggregatedCustomsCodeOrder`.
 */
export const StatusChangeEntity = {
  Lead: "lead",
  MarkingCodeOrder: "markingCodeOrder",
  MarkingCodeOrderBatch: "markingCodeOrderBatch",
  Waybill: "waybill",
  Invoice: "invoice",
  UtilizationReport: "utilizationReport",
  AggregationReport: "aggregationReport",
  AggregatedCustomsCodeOrder: "aggregatedCustomsCodeOrder",
  DeliveryRoute: "deliveryRoute",
  DeliveryTask: "deliveryTask",
  SalesOrder: "salesOrder",
  ScanSession: "scanSession",
  Vehicle: "vehicle",
  Product: "product",
  User: "user",
  Company: "company",
  CompanyXTraceIntegration: "companyXTraceIntegration",
  CompanyFakturaUzIntegration: "companyFakturaUzIntegration",
} as const;

export type StatusChangeEntity =
  (typeof StatusChangeEntity)[keyof typeof StatusChangeEntity];

type RouteParams = {
  id: string;
  companyId: string | null;
};

type EntityRoutes = {
  /** Страница записи. `null` — страницы нет, имя в тосте не кликабельно. */
  card: ((params: RouteParams) => string | null) | null;
  /**
   * Ключ в каталоге статусов: по нему берутся цвет тега и подпись. Пусто —
   * статусов этой сущности в каталоге нет, тег возьмёт подпись из уведомления.
   */
  statusEntity?: StatusEntity;
};

const inCompany =
  (path: (companyId: string, id: string) => string) =>
  ({ id, companyId }: RouteParams) =>
    companyId ? path(companyId, id) : null;

const routes: Record<string, EntityRoutes> = {
  [StatusChangeEntity.MarkingCodeOrder]: {
    statusEntity: StatusEntity.MarkingCodeOrder,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/orders/${id}`,
    ),
  },
  /**
   * У партии своя страница есть, но её адрес требует ещё и id заказа
   * (`/orderId/:orderId/batchId/:batchId`), а в уведомлении его нет.
   */
  [StatusChangeEntity.MarkingCodeOrderBatch]: {
    statusEntity: StatusEntity.MarkingCodeOrderBatch,
    card: null,
  },
  [StatusChangeEntity.AggregationReport]: {
    statusEntity: StatusEntity.AggregationReport,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/aggregations/${id}`,
    ),
  },
  // Отдельной страницы у отчёта о нанесении нет: он живёт в карточке партии.
  [StatusChangeEntity.UtilizationReport]: {
    statusEntity: StatusEntity.UtilizationReport,
    card: null,
  },
  [StatusChangeEntity.AggregatedCustomsCodeOrder]: {
    statusEntity: StatusEntity.CustomsCodeOrder,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/customs-codes/${id}`,
    ),
  },
  [StatusChangeEntity.Waybill]: {
    statusEntity: StatusEntity.Waybill,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/waybills/${id}`,
    ),
  },
  [StatusChangeEntity.Invoice]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/invoices/${id}`,
    ),
  },
  [StatusChangeEntity.DeliveryRoute]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/delivery-routes/${id}`,
    ),
  },
  [StatusChangeEntity.DeliveryTask]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/delivery-tasks/${id}`,
    ),
  },
  [StatusChangeEntity.SalesOrder]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/sales-orders/${id}`,
    ),
  },
  [StatusChangeEntity.Vehicle]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/vehicles/${id}`,
    ),
  },
  [StatusChangeEntity.Product]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/products/${id}`,
    ),
  },
  [StatusChangeEntity.Lead]: {
    statusEntity: StatusEntity.Lead,
    card: ({ id }) => `/leads/${id}`,
  },
  [StatusChangeEntity.User]: {
    card: ({ id }) => `/users/${id}`,
  },
  [StatusChangeEntity.Company]: {
    card: ({ id }) => `/organization/${id}`,
  },
  [StatusChangeEntity.CompanyXTraceIntegration]: {
    card: inCompany((companyId) => `/organization/${companyId}/integrations`),
  },
  [StatusChangeEntity.CompanyFakturaUzIntegration]: {
    card: inCompany((companyId) => `/organization/${companyId}/integrations`),
  },
};

export const resolveStatusChangeCard = (
  entity: string,
  params: RouteParams,
): string | null => routes[entity]?.card?.(params) ?? null;

export const resolveStatusChangeStatusEntity = (
  entity: string,
): StatusEntity | undefined => routes[entity]?.statusEntity;
