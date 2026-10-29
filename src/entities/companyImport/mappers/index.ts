import type {
  CompanyImportResponseDto,
  CompanyImportStageResponseDto,
} from "entities/companyImport/dtos";
import type {
  CompanyImport,
  CompanyImportStageState,
} from "entities/companyImport/types";

const mapStage = (
  dto: CompanyImportStageResponseDto
): CompanyImportStageState => ({
  stage: dto.stage,
  status: dto.status,
  startedAt: dto.startedAt,
  finishedAt: dto.finishedAt,
  queued: dto.queued,
  done: dto.done,
  failed: dto.failed,
  note: dto.note,
  issues: dto.issues ?? [],
});

export const mapCompanyImportDtoToEntity = (
  dto: Extract<CompanyImportResponseDto, { success: true }>
): CompanyImport => ({
  id: dto.id,
  companyId: dto.companyId,
  status: dto.status,
  stage: dto.stage,
  startedByUserId: dto.startedByUserId,
  startedAt: dto.startedAt,
  finishedAt: dto.finishedAt,
  stages: (dto.stages ?? []).map(mapStage),
  totals: dto.totals ?? { queued: 0, done: 0, failed: 0 },
});
