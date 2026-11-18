/**
 * Куда вести по сущности из уведомления и под каким ключом её статусы лежат
 * в каталоге. Ключи — машинные имена сущностей бэкенда.
 */
import { LifecycleTargetEntity } from "./targets";
import { StatusEntity } from "shared/config/statusCatalog";


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
  [LifecycleTargetEntity.MarkingCodeOrder]: {
    statusEntity: StatusEntity.MarkingCodeOrder,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/orders/${id}`,
    ),
  },
  /**
   * У партии своя страница есть, но её адрес требует ещё и id заказа
   * (`/orderId/:orderId/batchId/:batchId`), а в уведомлении его нет.
   */
  [LifecycleTargetEntity.MarkingCodeOrderBatch]: {
    statusEntity: StatusEntity.MarkingCodeOrderBatch,
    card: null,
  },
  [LifecycleTargetEntity.AggregationReport]: {
    statusEntity: StatusEntity.AggregationReport,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/aggregations/${id}`,
    ),
  },
  // Отдельной страницы у отчёта о нанесении нет: он живёт в карточке партии.
  [LifecycleTargetEntity.UtilizationReport]: {
    statusEntity: StatusEntity.UtilizationReport,
    card: null,
  },
  [LifecycleTargetEntity.AggregatedCustomsCodeOrder]: {
    statusEntity: StatusEntity.AggregatedCustomsCodeOrder,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/customs-codes/${id}`,
    ),
  },
  [LifecycleTargetEntity.Waybill]: {
    statusEntity: StatusEntity.Waybill,
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/waybills/${id}`,
    ),
  },
  [LifecycleTargetEntity.Invoice]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/invoices/${id}`,
    ),
  },
  [LifecycleTargetEntity.DeliveryRoute]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/delivery-routes/${id}`,
    ),
  },
  [LifecycleTargetEntity.DeliveryTask]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/delivery-tasks/${id}`,
    ),
  },
  [LifecycleTargetEntity.SalesOrder]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/sales-orders/${id}`,
    ),
  },
  [LifecycleTargetEntity.Vehicle]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/vehicles/${id}`,
    ),
  },
  [LifecycleTargetEntity.Product]: {
    card: inCompany(
      (companyId, id) => `/organization/${companyId}/products/${id}`,
    ),
  },
  [LifecycleTargetEntity.Lead]: {
    statusEntity: StatusEntity.Lead,
    card: ({ id }) => `/leads/${id}`,
  },
  [LifecycleTargetEntity.User]: {
    card: ({ id }) => `/users/${id}`,
  },
  [LifecycleTargetEntity.Company]: {
    card: ({ id }) => `/organization/${id}`,
  },
  [LifecycleTargetEntity.CompanyXTraceIntegration]: {
    card: inCompany((companyId) => `/organization/${companyId}/integrations`),
  },
  [LifecycleTargetEntity.CompanyFakturaUzIntegration]: {
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
