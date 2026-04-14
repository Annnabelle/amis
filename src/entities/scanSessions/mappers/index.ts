import type {
  CancelScanResponseDto,
  CompleteScanSessionResponseDto,
  CreateScanSessionResponseDto,
  ScanCodeResponseDto,
  ScanSessionResponseDto,
} from "entities/scanSessions/dtos";
import type { ScanSessionResponse } from "entities/scanSessions/types";
import type { AvailablePackageType, ErrorDto } from "shared/types/dtos";

const toDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

export const mapScanSessionDtoToEntity = (
  dto: ScanSessionResponseDto
): ScanSessionResponse => ({
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

const isErrorDto = (
  dto:
    | CreateScanSessionResponseDto
    | CompleteScanSessionResponseDto
    | ScanCodeResponseDto
    | CancelScanResponseDto
): dto is ErrorDto => "errorCode" in dto;

export const mapCreateScanSessionResponseDtoToEntity = (
  dto: CreateScanSessionResponseDto
): { success: boolean; scanSession?: ScanSessionResponse; error?: ErrorDto } => {
  if (isErrorDto(dto)) {
    return { success: false, error: dto };
  }

  return {
    success: dto.success,
    scanSession: mapScanSessionDtoToEntity(dto.scanSession),
  };
};

export const mapCompleteScanSessionResponseDtoToEntity = (
  dto: CompleteScanSessionResponseDto
): { success: boolean; scanSession?: ScanSessionResponse; error?: ErrorDto } => {
  if (isErrorDto(dto)) {
    return { success: false, error: dto };
  }

  return {
    success: dto.success,
    scanSession: mapScanSessionDtoToEntity(dto.scanSession),
  };
};

export const mapScanCodeResponseDtoToEntity = (
  dto: ScanCodeResponseDto
): {
  success: boolean;
  error?: ErrorDto;
  markingCode?: {
    productId: string;
    gtin: string;
    packageType: AvailablePackageType;
  };
} => {
  if (isErrorDto(dto)) {
    return { success: false, error: dto };
  }

  return {
    success: dto.success,
    markingCode: {
      productId: dto.markingCode.productId,
      gtin: dto.markingCode.gtin,
      packageType: dto.markingCode.packageType,
    },
  };
};

export const mapCancelScanResponseDtoToEntity = (
  dto: CancelScanResponseDto
): { success: boolean; error?: ErrorDto } => {
  if (isErrorDto(dto)) {
    return { success: false, error: dto };
  }

  return { success: dto.success };
};
