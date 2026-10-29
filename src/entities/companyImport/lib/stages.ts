import {
  CompanyImportStageStatus,
  CompanyImportStatus,
  companyImportStageOrder,
  type CompanyImport,
  type CompanyImportStage,
  type CompanyImportStageState,
  type CompanyImportTotals,
} from "entities/companyImport/types";
import type { StatusBadgeVariant } from "shared/ui/statusBadge";

const activeRunStatuses: readonly string[] = [
  CompanyImportStatus.Pending,
  CompanyImportStatus.Running,
];

export const isCompanyImportActive = (
  companyImport: CompanyImport | null
): boolean => !!companyImport && activeRunStatuses.includes(companyImport.status);

export const findCompanyImportStage = (
  companyImport: CompanyImport | null,
  stage: CompanyImportStage
): CompanyImportStageState | null =>
  companyImport?.stages.find((candidate) => candidate.stage === stage) ?? null;

/** Этапы прогона в порядке конвейера: сервер отдаёт их все, даже пропущенные. */
export const orderedCompanyImportStages = (
  companyImport: CompanyImport | null
): CompanyImportStageState[] =>
  companyImportStageOrder
    .map((stage) => findCompanyImportStage(companyImport, stage))
    .filter((state): state is CompanyImportStageState => state !== null);

const stageVariants: Record<string, StatusBadgeVariant> = {
  [CompanyImportStageStatus.Pending]: "neutral",
  [CompanyImportStageStatus.Running]: "info",
  [CompanyImportStageStatus.Completed]: "success",
  [CompanyImportStageStatus.Failed]: "danger",
  [CompanyImportStageStatus.Skipped]: "default",
};

export const getCompanyImportStageVariant = (
  status?: string | null
): StatusBadgeVariant => (status && stageVariants[status]) || "default";

const statusVariants: Record<string, StatusBadgeVariant> = {
  [CompanyImportStatus.Pending]: "neutral",
  [CompanyImportStatus.Running]: "info",
  [CompanyImportStatus.Completed]: "success",
  [CompanyImportStatus.Failed]: "danger",
};

export const getCompanyImportStatusVariant = (
  status?: string | null
): StatusBadgeVariant => (status && statusVariants[status]) || "default";

/**
 * Знаменатель показываем только когда он сходится. Счётчики растут по ходу
 * веера: пока этап не досчитал поставленное, сделанного бывает больше, чем
 * «из». «Выполнено 100 из 0» читается бредом, «выполнено 100» — нет.
 */
export const isCompanyImportProgressSound = (counters: CompanyImportTotals): boolean =>
  counters.queued > 0 && counters.done + counters.failed <= counters.queued;

/**
 * Доля закрытых единиц работы этапа. Считаем от queued: ни очередь, ни
 * сервер заранее не знают, сколько их будет, — queued растёт по ходу веера,
 * поэтому полоса ползёт не только вправо.
 */
export const getCompanyImportStageProgress = (
  state: CompanyImportStageState
): number =>
  state.queued > 0
    ? Math.min(100, Math.round(((state.done + state.failed) / state.queued) * 100))
    : 0;
