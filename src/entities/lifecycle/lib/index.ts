import dayjs from "dayjs";
import {
  LIFECYCLE_ALL_TAB_KEY,
  LifecycleErrorClass,
  type LifecycleEvent,
  type LifecycleFeedFilters,
  type LifecycleTab,
} from "entities/lifecycle/types";
import { Language, type MultiLanguage } from "shared/types/dtos";
import type { StatusBadgeVariant } from "shared/ui/statusBadge";

export * from "./targets";
export * from "./useCanReadLifecycle";
export * from "./useLifecycleSummary";

const LANGUAGE_FALLBACK_ORDER = [
  Language.Russian,
  Language.English,
  Language.Uzbek,
] as const;

/** Забираем подпись на языке интерфейса, с откатом на любой заполненный. */
export const resolveMultiLanguage = (
  value: MultiLanguage | null | undefined,
  language: string
): string | null => {
  if (!value) return null;

  const preferred = value[language as Language];
  if (preferred) return preferred;

  for (const fallback of LANGUAGE_FALLBACK_ORDER) {
    if (value[fallback]) return value[fallback];
  }

  return null;
};

export const lifecycleErrorVariants: Record<
  string,
  StatusBadgeVariant
> = {
  [LifecycleErrorClass.Permanent]: "danger",
  [LifecycleErrorClass.Conflict]: "orange",
  [LifecycleErrorClass.Transient]: "warning",
  [LifecycleErrorClass.Unknown]: "neutral",
};

export const getLifecycleErrorVariant = (
  errorClass?: string | null
): StatusBadgeVariant =>
  (errorClass && lifecycleErrorVariants[errorClass]) || "neutral";

export const getLifecycleTabFilters = (
  tab: LifecycleTab | undefined
): LifecycleFeedFilters => {
  if (!tab || tab.key === LIFECYCLE_ALL_TAB_KEY) return {};

  return { scope: tab.scope, vendor: tab.vendor };
};

export const buildLifecycleFeedKey = (
  targetId: string,
  filters: LifecycleFeedFilters
): string =>
  [targetId, filters.scope ?? "", filters.vendor ?? "", filters.kind ?? ""].join(
    "|"
  );

/**
 * Считаем страницами, а не элементами: data может быть короче limit,
 * потому что часть ошибок скрывается уже после подсчёта total.
 */
export const hasMoreLifecycleEvents = (
  page: number,
  limit: number,
  total: number
): boolean => page * limit < total;

export type LifecycleEventGroup = {
  date: string;
  events: LifecycleEvent[];
};

export const groupLifecycleEventsByDay = (
  events: LifecycleEvent[]
): LifecycleEventGroup[] => {
  const groups: LifecycleEventGroup[] = [];

  for (const event of events) {
    const date = dayjs(event.occurredAt).format("YYYY-MM-DD");
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.date === date) {
      lastGroup.events.push(event);
      continue;
    }

    groups.push({ date, events: [event] });
  }

  return groups;
};

