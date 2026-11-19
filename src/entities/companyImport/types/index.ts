/**
 * Импорт компании из ASL Belgisi: конвейер этапов, который идёт в фоне.
 * Формы повторяют domain/company-import бэкенда — расхождение здесь означает
 * расхождение с ответом сервера.
 */
import {
  CompanyImportStage,
  CompanyImportStageStatus,
  CompanyImportStatus,
} from '@edem2000/amis.contracts'

export {
  CompanyImportStage,
  CompanyImportStageStatus,
  CompanyImportStatus,
}

import type { MultiLanguage } from "shared/types/dtos";


/** Порядок конвейера: в нём этапы и показываем. */
export const companyImportStageOrder: readonly CompanyImportStage[] = [
  CompanyImportStage.Products,
  CompanyImportStage.Orders,
  CompanyImportStage.OrderBatches,
  CompanyImportStage.BatchCodes,
  CompanyImportStage.OwnedCodes,
  CompanyImportStage.Documents,
];

/**
 * Этапы, которые можно запросить по отдельности. Партий и кодов здесь нет:
 * своего входа у них не существует — они раздаются веером от заказа.
 */
export const selectableCompanyImportStages: readonly CompanyImportStage[] = [
  CompanyImportStage.Products,
  CompanyImportStage.Orders,
  CompanyImportStage.OwnedCodes,
  CompanyImportStage.Documents,
];


export type CompanyImportStageState = {
  stage: CompanyImportStage;
  status: CompanyImportStageStatus;
  startedAt?: string;
  finishedAt?: string;
  /** Единиц работы поставлено, сделано и отказано: ход этапа виден по ним. */
  queued: number;
  done: number;
  failed: number;
  /**
   * Чем кончилось, если кончилось не само: причина пропуска или отказа.
   * Приходит на всех языках — язык выбирается при показе.
   */
  note?: MultiLanguage;
  /** Что этап пропустил и почему. Список на сервере ограничен 50 находками. */
  issues: MultiLanguage[];
};

export type CompanyImportTotals = {
  queued: number;
  done: number;
  failed: number;
};

export type CompanyImport = {
  id: string;
  companyId: string;
  status: CompanyImportStatus;
  /** Этап, на котором прогон сейчас стоит. */
  stage: CompanyImportStage;
  startedByUserId: string;
  startedAt: string;
  finishedAt?: string;
  stages: CompanyImportStageState[];
  totals: CompanyImportTotals;
};

/** Прогон идёт в фоне, у очереди шаг в секунды — чаще спрашивать нечего. */
export const COMPANY_IMPORT_POLL_INTERVAL_MS = 5000;

/** Коды ошибок блока импорта: по ним отличаем «нет прогона» от настоящего сбоя. */
export const CompanyImportErrorCode = {
  AlreadyRunning: 10600,
  NotFound: 10601,
} as const;

