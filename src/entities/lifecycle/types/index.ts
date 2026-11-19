import {
  LifecycleActorType,
  LifecycleErrorClass,
  LifecycleEventKind,
  LifecycleOrigin,
  LifecycleScope,
  VendorCode,
} from '@edem2000/amis.contracts'

export {
  LifecycleActorType,
  LifecycleErrorClass,
  LifecycleEventKind,
  LifecycleOrigin,
  LifecycleScope,
  VendorCode,
}

import type { MultiLanguage } from "shared/types/dtos";


export const LifecycleEventKinds = Object.values(LifecycleEventKind);


export const LifecycleScopes = Object.values(LifecycleScope);


export const LifecycleVendors = Object.values(VendorCode);


export const LifecycleErrorClasses = Object.values(LifecycleErrorClass);


/** Ключ сводной вкладки, которую бэкенд присылает первой. */
export const LIFECYCLE_ALL_TAB_KEY = "all";

export type LifecycleActor = {
  type: LifecycleActorType;
  userId?: string;
  vendor?: VendorCode;
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
  vendor?: VendorCode;
  actor: LifecycleActor;
  status?: LifecycleStatusChange;
  error?: LifecycleError;
  origin?: LifecycleOrigin;
  requestId?: string;
  causedByEventId?: string;
};

export type LifecycleTab = {
  key: string;
  scope?: LifecycleScope;
  vendor?: VendorCode;
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
  vendor?: VendorCode;
  kind?: LifecycleEventKind;
};

export type LifecycleFeedQuery = LifecycleFeedFilters & {
  targetId: string;
  page: number;
  limit: number;
  asOf?: string;
};
