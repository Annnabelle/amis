import type { MultiLanguage } from "shared/types/dtos";

export const LifecycleEventKind = {
  Status: "status",
  Error: "error",
} as const;

export const LifecycleEventKinds = Object.values(LifecycleEventKind);

export type LifecycleEventKind =
  (typeof LifecycleEventKind)[keyof typeof LifecycleEventKind];

export const LifecycleScope = {
  Internal: "internal",
  External: "external",
} as const;

export const LifecycleScopes = Object.values(LifecycleScope);

export type LifecycleScope =
  (typeof LifecycleScope)[keyof typeof LifecycleScope];

export const LifecycleVendor = {
  XTrace: "x_trace",
  FakturaUz: "faktura_uz",
  Tasnif: "tasnif",
} as const;

export const LifecycleVendors = Object.values(LifecycleVendor);

export type LifecycleVendor =
  (typeof LifecycleVendor)[keyof typeof LifecycleVendor];

export const LifecycleActorType = {
  User: "user",
  System: "system",
  Vendor: "vendor",
} as const;

export type LifecycleActorType =
  (typeof LifecycleActorType)[keyof typeof LifecycleActorType];

export const LifecycleErrorClass = {
  Transient: "transient",
  Permanent: "permanent",
  Conflict: "conflict",
  Unknown: "unknown",
} as const;

export const LifecycleErrorClasses = Object.values(LifecycleErrorClass);

export type LifecycleErrorClass =
  (typeof LifecycleErrorClass)[keyof typeof LifecycleErrorClass];

export const LifecycleOrigin = {
  Ui: "ui",
  Api: "api",
  Scheduler: "scheduler",
  Webhook: "webhook",
  Import: "import",
  Migration: "migration",
} as const;

export type LifecycleOrigin =
  (typeof LifecycleOrigin)[keyof typeof LifecycleOrigin];

/** Ключ сводной вкладки, которую бэкенд присылает первой. */
export const LIFECYCLE_ALL_TAB_KEY = "all";

export type LifecycleActor = {
  type: LifecycleActorType;
  userId?: string;
  vendor?: LifecycleVendor;
};

export type LifecycleStatusChange = {
  from?: string | null;
  to: string;
  fromLabel: MultiLanguage | null;
  toLabel: MultiLanguage | null;
  reasonCode?: string;
  comment?: string;
};

export type LifecycleError = {
  class: LifecycleErrorClass;
  code: number;
  message: MultiLanguage;
  details?: Record<string, unknown>;
  occurrenceCount?: number;
  lastOccurredAt?: string;
};

export type LifecycleEvent = {
  id: string;
  kind: LifecycleEventKind;
  occurredAt: string;
  scope: LifecycleScope;
  vendor?: LifecycleVendor;
  actor: LifecycleActor;
  status?: LifecycleStatusChange;
  error?: LifecycleError;
  origin?: LifecycleOrigin;
  requestId?: string;
  correlationId?: string;
  causedByEventId?: string;
};

export type LifecycleTab = {
  key: string;
  scope?: LifecycleScope;
  vendor?: LifecycleVendor;
  count: number;
};

export type LifecycleActiveError = {
  class: LifecycleErrorClass;
  code: number;
  message: MultiLanguage;
  occurrenceCount?: number;
  since: string;
};

export type LifecycleSummary = {
  total: number;
  tabs: LifecycleTab[];
  activeError: LifecycleActiveError | null;
};

/** Фильтры ленты — то, что отличает одну вкладку от другой. */
export type LifecycleFeedFilters = {
  scope?: LifecycleScope;
  vendor?: LifecycleVendor;
  kind?: LifecycleEventKind;
};

export type LifecycleFeedQuery = LifecycleFeedFilters & {
  targetId: string;
  page: number;
  limit: number;
  asOf?: string;
};

export type LifecycleState = {
  targetId: string | null;
  summary: LifecycleSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  /** Подпись фильтров текущей ленты: смена подписи сбрасывает накопленные события. */
  feedKey: string | null;
  events: LifecycleEvent[];
  page: number;
  limit: number;
  total: number;
  /** Снимок времени для стабильной пагинации, см. asOf в контракте. */
  asOf: string | null;
  eventsLoading: boolean;
  eventsError: string | null;
  /** Последний отправленный запрос ленты: ответы прошлых вкладок отбрасываем. */
  eventsRequestId: string | null;
};
