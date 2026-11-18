/**
 * Коды, которыми владеет компания. Это реестр кодов, а не записи учёта: у кода,
 * пришедшего от контрагента, записи учёта может не быть вовсе.
 */
import {
  MarkingCodeExternalStatus,
  PackageType,
} from '@edem2000/amis.contracts'

export {
  MarkingCodeExternalStatus,
  PackageType,
}


export type OwnedCode = {
  code: string;
  gtin: string;
  packageType: PackageType;
  parentCode?: string;
  status?: MarkingCodeExternalStatus;
  ownerTin?: string;
  /**
   * Момент заявки на перечень, а не разбора результата: владение верно на этот
   * момент, и возраст снимка — часть ответа.
   */
  lastSyncedAt?: string;
};

export type OwnedCodesSummaryPackage = {
  packageType: PackageType;
  gtin: string;
  count: number;
};

export type OwnedCodesSummaryProduct = {
  productId: string;
  name: string;
  shortName: string;
  packages: OwnedCodesSummaryPackage[];
  total: number;
};

/**
 * На какой момент верно владение. Границы, а не одна дата: разные GTIN
 * забирались в разное время, и разброс честнее одного числа.
 */
export type OwnedCodesFreshness = {
  oldest: string;
  newest: string;
};

export type OwnedCodesSummary = {
  products: OwnedCodesSummaryProduct[];
  /** GTIN, которых в каталоге нет: каталог меняется, а коды остаются. */
  unknownGtins: { gtin: string; count: number }[];
  total: number;
  freshness: OwnedCodesFreshness | null;
};

export type OwnedCodesState = {
  summary: OwnedCodesSummary | null;
  summaryLoading: boolean;
  codes: OwnedCode[];
  total: number;
  page: number;
  limit: number;
  gtin: string | null;
  isLoading: boolean;
  error: string | null;
};
