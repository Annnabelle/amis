import type { ErrorDto, MultiLanguage } from "shared/types/dtos";
import type {
  CompanyImportStage,
  CompanyImportStageStatus,
  CompanyImportStatus,
  CompanyImportTotals,
} from "entities/companyImport/types";

export type StartCompanyImportDto = {
  /** Не задано — весь конвейер. */
  stages?: CompanyImportStage[];
};

export type CompanyImportStageResponseDto = {
  stage: CompanyImportStage;
  status: CompanyImportStageStatus;
  startedAt?: string;
  finishedAt?: string;
  queued: number;
  done: number;
  failed: number;
  note?: MultiLanguage;
  issues?: MultiLanguage[];
};

export type CompanyImportResponseDto =
  | {
      success: true;
      id: string;
      companyId: string;
      status: CompanyImportStatus;
      stage: CompanyImportStage;
      startedByUserId: string;
      startedAt: string;
      finishedAt?: string;
      stages: CompanyImportStageResponseDto[];
      totals: CompanyImportTotals;
    }
  | ErrorDto;

export const isCompanyImportResponseSuccess = (
  response: CompanyImportResponseDto
): response is Extract<CompanyImportResponseDto, { success: true }> =>
  "success" in response && response.success === true && "stages" in response;

/**
 * Код ошибки из ответа сервера. Нужен не для текста — его собирает
 * getBackendErrorMessage, — а для ветвления: отсутствие прогона приходит
 * ошибкой 404, и показывать её пользователю нечего.
 */
export const readBackendErrorCode = (error: unknown): number | null => {
  const payload = (
    error as { response?: { data?: { errorCode?: unknown } } } | null
  )?.response?.data;

  return typeof payload?.errorCode === "number" ? payload.errorCode : null;
};
