import type { StatusBadgeVariant } from "shared/ui/statusBadge";

/**
 * Единый справочник статусов: ключ тот же, что у каталога подписей на бэкенде —
 * (сущность, контур, код).
 *
 * Разделение ответственности:
 *  - бэкенд — источник истины для набора кодов;
 *  - этот файл — источник истины для ЦВЕТА (каталог бэкенда цветов не содержит);
 *  - i18n-блок `statusCatalog.*` — источник истины для ТЕКСТА, одинакового
 *    в ленте lifecycle и на карточках сущностей.
 */
export const StatusEntity = {
  Lead: "lead",
  Waybill: "waybill",
  MarkingCodeOrder: "markingCodeOrder",
  MarkingCodeOrderBatch: "markingCodeOrderBatch",
  UtilizationReport: "utilizationReport",
  AggregationReport: "aggregationReport",
  CustomsCodeOrder: "customsCodeOrder",
} as const;

export type StatusEntity = (typeof StatusEntity)[keyof typeof StatusEntity];

export const StatusScope = {
  Internal: "internal",
  External: "external",
} as const;

export type StatusScope = (typeof StatusScope)[keyof typeof StatusScope];

type StatusVariantMap = Record<string, StatusBadgeVariant>;

type EntityStatusVariants = Partial<Record<StatusScope, StatusVariantMap>>;

/**
 * Семантическая шкала, одна на все сущности:
 *  neutral — черновик и нейтральные терминальные состояния;
 *  info    — заведён, зарегистрирован, передан дальше;
 *  warning — ожидание чужого действия или обработки;
 *  orange  — частичное выполнение;
 *  success — успешное завершение шага;
 *  danger  — ошибка и отказ;
 *  cyan    — в движении;
 *  purple  — особый маршрут.
 */
export const statusVariants: Record<StatusEntity, EntityStatusVariants> = {
  [StatusEntity.Lead]: {
    [StatusScope.Internal]: {
      new: "info",
      in_progress: "warning",
      completed: "success",
      rejected: "danger",
    },
  },

  [StatusEntity.Waybill]: {
    [StatusScope.Internal]: {
      draft: "neutral",
      ready: "info",
      sending: "warning",
      sent: "info",
      registered: "success",
      rejected: "danger",
      send_failed: "danger",
      cancelled: "danger",
    },
    [StatusScope.External]: {
      Sent: "info",
      AwaitCounterparty: "warning",
      AwaitAction: "warning",
      AwaitAgreement: "warning",
      AwaitSign: "warning",
      AwaitThirdSide: "warning",
      AwaitResponsiblePerson: "warning",
      AwaitResponsiblePersonAccepted: "warning",
      Registered: "success",
      Rejected: "danger",
      Cancelled: "danger",
      Returned: "orange",
      Deleted: "neutral",
      Unknown: "neutral",
    },
  },

  [StatusEntity.MarkingCodeOrder]: {
    [StatusScope.Internal]: {
      new: "info",
      vendor_pending: "warning",
      ready_for_codes: "info",
      codes_partially_received: "orange",
      codes_received: "info",
      codes_utilization_requested: "warning",
      codes_partially_utilized: "orange",
      codes_utilized: "success",
      codes_partially_aggregated: "orange",
      codes_aggregated: "success",
      rejected: "danger",
      closed: "neutral",
    },
    [StatusScope.External]: {
      CREATED: "info",
      PENDING: "warning",
      READY: "info",
      REJECTED: "danger",
      CLOSED: "neutral",
      OUTSOURCED: "purple",
    },
  },

  [StatusEntity.MarkingCodeOrderBatch]: {
    [StatusScope.Internal]: {
      new: "info",
      created: "info",
      vendor_pending: "warning",
      ready_for_codes: "info",
      codes_partially_received: "orange",
      codes_received: "info",
      codes_utilization_requested: "warning",
      codes_utilized: "success",
      codes_aggregated: "success",
      rejected: "danger",
      closed: "neutral",
      error: "danger",
    },
    [StatusScope.External]: {
      PENDING: "warning",
      ACTIVE: "success",
      EXHAUSTED: "neutral",
      REJECTED: "danger",
      CLOSED: "neutral",
    },
  },

  [StatusEntity.UtilizationReport]: {
    [StatusScope.Internal]: {
      new: "info",
      vendor_pending: "warning",
      partially_processed: "orange",
      success: "success",
      error: "danger",
    },
    [StatusScope.External]: {
      CREATED: "info",
      VALIDATING: "warning",
      IN_PROCESS: "warning",
      PARTIALLY_PROCESSED: "orange",
      SUCCESS: "success",
      ERROR: "danger",
    },
  },

  [StatusEntity.AggregationReport]: {
    [StatusScope.Internal]: {
      new: "info",
      requested: "warning",
      vendor_pending: "warning",
      partially_processed: "orange",
      success: "success",
      error: "danger",
    },
    [StatusScope.External]: {
      CREATED: "info",
      VALIDATING: "warning",
      IN_PROCESS: "warning",
      PARTIALLY_PROCESSED: "orange",
      SUCCESS: "success",
      ERROR: "danger",
    },
  },

  [StatusEntity.CustomsCodeOrder]: {
    [StatusScope.Internal]: {
      new: "neutral",
      generated: "info",
      ready_for_sign: "warning",
      signed_for_registration: "info",
      verified: "cyan",
      verified_for_registration: "cyan",
      registered: "success",
      dissolution_initialized: "warning",
      signed_for_dissolution: "orange",
      verified_for_dissolution: "purple",
      dissolved: "purple",
    },
  },
};

/**
 * Запасная карта по одному лишь коду — для сущностей, которых в каталоге ещё
 * нет, и для старого `statusColors`. Держит ту же шкалу, что и каталог, чтобы
 * равнозначные статусы не разъезжались по цвету.
 */
export const fallbackStatusVariants: StatusVariantMap = {
  draft: "neutral",
  closed: "neutral",
  deleted: "neutral",
  returned: "neutral",
  unknown: "neutral",
  inactive: "neutral",
  disabled: "neutral",
  new: "info",
  created: "info",
  registered: "info",
  sent: "info",
  invited: "info",
  confirmed: "info",
  assigned: "cyan",
  in_transit: "cyan",
  delivering: "cyan",
  pending: "warning",
  requested: "warning",
  validating: "warning",
  in_process: "warning",
  in_progress: "warning",
  in_review: "warning",
  sending: "warning",
  loading: "warning",
  prospective: "warning",
  planned: "warning",
  vendor_pending: "warning",
  partially_processed: "orange",
  partially_delivered: "orange",
  partially_assigned: "orange",
  success: "success",
  completed: "success",
  approved: "success",
  delivered: "success",
  loaded: "success",
  active: "success",
  issued: "success",
  ready: "info",
  exhausted: "neutral",
  error: "danger",
  failed: "danger",
  rejected: "danger",
  cancelled: "danger",
  canceled: "danger",
  declined: "danger",
  send_failed: "danger",
  issue_failed: "danger",
  outsourced: "purple",
};

const statusEntities = Object.values(StatusEntity) as string[];

export const isStatusEntity = (value?: string | null): value is StatusEntity =>
  Boolean(value) && statusEntities.includes(value as string);

const normalizeCode = (code?: string | null) => code?.trim() ?? "";

export const resolveStatusVariant = (
  entity: StatusEntity | undefined,
  scope: StatusScope | undefined,
  code?: string | null
): StatusBadgeVariant => {
  const normalized = normalizeCode(code);
  if (!normalized) return "neutral";

  const entityVariants = entity ? statusVariants[entity] : undefined;
  const scopeVariants = entityVariants?.[scope ?? StatusScope.Internal];
  const exact = scopeVariants?.[normalized];
  if (exact) return exact;

  return (
    fallbackStatusVariants[normalized] ??
    fallbackStatusVariants[normalized.toLowerCase()] ??
    "neutral"
  );
};

/** Ключ i18n для подписи статуса. Один и тот же в ленте и на карточках. */
export const getStatusLabelKey = (
  entity: StatusEntity,
  scope: StatusScope,
  code: string
) => `statusCatalog.${entity}.${scope}.${code}`;

/** Знает ли каталог этот код — нужно, чтобы не печатать ключ вместо текста. */
export const hasStatusInCatalog = (
  entity: StatusEntity | undefined,
  scope: StatusScope | undefined,
  code?: string | null
): boolean => {
  const normalized = normalizeCode(code);
  if (!entity || !normalized) return false;

  return Boolean(statusVariants[entity]?.[scope ?? StatusScope.Internal]?.[normalized]);
};
