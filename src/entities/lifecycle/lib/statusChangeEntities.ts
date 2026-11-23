/**
 * Куда вести по сущности из уведомления и под каким ключом её статусы лежат
 * в каталоге. Ключи — машинные имена сущностей бэкенда.
 */
import { LifecycleTargetEntity } from "./targets";
import { routes } from "shared/config/routes";
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

const entityRoutes: Record<string, EntityRoutes> = {
  [LifecycleTargetEntity.MarkingCodeOrder]: {
    statusEntity: StatusEntity.MarkingCodeOrder,
    card: inCompany(
      (companyId, id) => routes.markingCodeOrder(companyId, id),
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
      (companyId, id) => routes.aggregationReport(companyId, id),
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
      (companyId, id) => routes.customsCode(companyId, id),
    ),
  },
  [LifecycleTargetEntity.Waybill]: {
    statusEntity: StatusEntity.Waybill,
    card: inCompany(
      (companyId, id) => routes.waybill(companyId, id),
    ),
  },
  [LifecycleTargetEntity.Invoice]: {
    card: inCompany(
      (companyId, id) => routes.invoice(companyId, id),
    ),
  },
  [LifecycleTargetEntity.DeliveryRoute]: {
    card: inCompany(
      (companyId, id) => routes.deliveryRoute(companyId, id),
    ),
  },
  [LifecycleTargetEntity.DeliveryTask]: {
    card: inCompany(
      (companyId, id) => routes.deliveryTask(companyId, id),
    ),
  },
  [LifecycleTargetEntity.SalesOrder]: {
    card: inCompany(
      (companyId, id) => routes.salesOrder(companyId, id),
    ),
  },
  [LifecycleTargetEntity.Vehicle]: {
    card: inCompany(
      (companyId, id) => routes.vehicle(companyId, id),
    ),
  },
  [LifecycleTargetEntity.Product]: {
    card: inCompany(
      (companyId, id) => routes.product(companyId, id),
    ),
  },
  [LifecycleTargetEntity.Lead]: {
    statusEntity: StatusEntity.Lead,
    card: ({ id }) => routes.lead(id),
  },
  [LifecycleTargetEntity.User]: {
    card: ({ id }) => routes.user(id),
  },
  [LifecycleTargetEntity.Company]: {
    card: ({ id }) => routes.company(id),
  },
  [LifecycleTargetEntity.CompanyXTraceIntegration]: {
    card: inCompany((companyId) => routes.companyIntegrations(companyId)),
  },
  [LifecycleTargetEntity.CompanyFakturaUzIntegration]: {
    card: inCompany((companyId) => routes.companyIntegrations(companyId)),
  },
};

export const resolveStatusChangeCard = (
  entity: string,
  params: RouteParams,
): string | null => entityRoutes[entity]?.card?.(params) ?? null;

export const resolveStatusChangeStatusEntity = (
  entity: string,
): StatusEntity | undefined => entityRoutes[entity]?.statusEntity;
