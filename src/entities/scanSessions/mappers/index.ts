import type { ScanSessionResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { ScanSession } from "entities/scanSessions/types";

const toDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

export const mapScanSessionDtoToEntity = (
  dto: ScanSessionResponseDto
): ScanSession => ({
  id: dto.id,
  companyId: dto.companyId,
  status: dto.status,
  type: dto.type,
  routeId: dto.routeId,
  taskId: dto.taskId,
  device: dto.device
    ? {
        id: dto.device.id,
        name: dto.device.name,
      }
    : undefined,
  counters: {
    accepted: dto.counters.accepted,
    rejected: dto.counters.rejected,
  },
  timestamps: {
    startedAt: toDate(dto.timestamps.startedAt) ?? new Date(),
    completedAt: toDate(dto.timestamps.completedAt),
  },
  userId: dto.userId,
  comment: dto.comment,
  createdAt: toDate(dto.createdAt) ?? new Date(),
  updatedAt: toDate(dto.updatedAt) ?? new Date(),
});
