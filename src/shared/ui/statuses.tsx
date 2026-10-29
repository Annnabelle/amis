import type { StatusBadgeVariant } from "shared/ui/statusBadge";
import {
  fallbackStatusVariants,
  statusVariants,
} from "shared/config/statusCatalog";

/**
 * Цвета antd Tag выводятся из той же семантической шкалы, что и StatusBadge,
 * поэтому равнозначные статусы выглядят одинаково на старых страницах с Tag
 * и на новых со StatusBadge. Здесь нет собственных решений о цвете — только
 * перевод варианта в имя цвета antd.
 */
const tagColorByVariant: Record<StatusBadgeVariant, string> = {
  default: "blue",
  neutral: "default",
  info: "blue",
  warning: "gold",
  orange: "orange",
  success: "green",
  cyan: "cyan",
  purple: "purple",
  danger: "red",
};

/**
 * Коды, которых нет в каталоге сущностей: статусы КМ, внешние статусы
 * инвойсов, состояния пользователей и участников. Выражены вариантами,
 * а не цветами, чтобы шкала оставалась одна.
 */
const legacyStatusVariants: Record<string, StatusBadgeVariant> = {
  // Коды маркировки
  RECEIVED: "info",
  APPLIED: "success",
  INTRODUCED: "warning",
  WITHDRAWN: "info",
  WRITTEN_OFF: "success",
  UPLOADED: "info",
  AGGREGATED: "success",

  // Внешние статусы отчётов и заказов в системе маркировки
  CREATED: "info",
  VALIDATING: "warning",
  IN_PROCESS: "warning",
  PARTIALLY_PROCESSED: "orange",
  SUCCESS: "success",
  ERROR: "danger",
  PENDING: "warning",
  ACTIVE: "success",
  EXHAUSTED: "neutral",
  REJECTED: "danger",
  CLOSED: "neutral",
  READY: "info",
  OUTSOURCED: "purple",
  outsourcered: "purple",

  // Пользователи и участники
  invited: "info",
  declined: "danger",
  accepted: "success",
  in_review: "warning",
  approved: "success",
  issued: "success",
  rejected_by_external: "danger",

  // Рейсы и задачи доставки
  assigned_to_warehouse: "warning",
  ready_for_loading: "warning",
  handover_in_progress: "info",
  returning: "purple",
  failed: "danger",

  // Внешние статусы инвойсов
  None: "neutral",
  AwaitContractor: "warning",
  AwaitAction: "warning",
  AwaitAgreement: "warning",
  AwaitSign: "warning",
  AwaitThirdSide: "warning",
  AwaitDecline: "warning",
  AwaitCancelArchiveRequest: "warning",
  AwaitReturnAccept: "warning",
  AwaitCounterparty: "warning",
  AwaitResponsiblePerson: "warning",
  AwaitResponsiblePersonAccepted: "warning",
  Archived: "success",
  ArchiveCancelRequested: "orange",
  RejectArchiveCancelRequest: "danger",
  ArchiveCanceled: "neutral",
  AgreementAgreed: "success",
  AgreementReject: "danger",
  SigningSigned: "success",
  SigningReject: "danger",
  VerifiedBySystem: "success",
  ResponsiblePersonAccepted: "success",
  ResponsiblePersonRejected: "danger",
  ResponsiblePersonTillReturned: "orange",
  ResponsiblePersonReturned: "orange",
  ReturnAccepted: "success",
  Sent: "info",
  Registered: "success",
  Rejected: "danger",
  Cancelled: "danger",
  Returned: "orange",
  Deleted: "neutral",
  Unknown: "neutral",
};

const collectCatalogVariants = (): Record<string, StatusBadgeVariant> => {
  const collected: Record<string, StatusBadgeVariant> = {};

  for (const entityScopes of Object.values(statusVariants)) {
    for (const scopeVariants of Object.values(entityScopes)) {
      for (const [code, variant] of Object.entries(scopeVariants ?? {})) {
        collected[code] = variant;
      }
    }
  }

  return collected;
};

export const statusVariantByCode: Record<string, StatusBadgeVariant> = {
  ...legacyStatusVariants,
  ...fallbackStatusVariants,
  ...collectCatalogVariants(),
};

export const statusColors: Record<string, string> = Object.fromEntries(
  Object.entries(statusVariantByCode).map(([code, variant]) => [
    code,
    tagColorByVariant[variant],
  ])
);

export const getStatusTagColor = (status?: string | null): string =>
  statusColors[status?.trim() ?? ""] ?? "default";
