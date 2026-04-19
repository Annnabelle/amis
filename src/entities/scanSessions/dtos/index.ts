import type { ScanSessionStatus, ScanSessionType } from "entities/scanSessions/types";
import type { AvailablePackageType, ErrorDto, HexString } from "shared/types/dtos";

export type ScanSessionResponseDto = {
  id: string;
  companyId: HexString;
  status: ScanSessionStatus;
  type: ScanSessionType;
  routeId: HexString;
  taskId?: HexString;
  device?: {
    id?: string;
    name?: string;
  };
  counters: {
    accepted: number;
    rejected: number;
  };
  timestamps: {
    startedAt: Date | string;
    completedAt?: Date | string;
  };
  userId: HexString;
  comment?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateScanSessionDto = {
  type: ScanSessionType;
  routeId: HexString;
  taskId?: HexString;
  device?: {
    id?: string;
    name?: string;
  };
  comment?: string;
};

export type CreateScanSessionResponseDto =
  | {
      success: boolean;
      scanSession: ScanSessionResponseDto;
    }
  | ErrorDto;

export type CompleteScanSessionResponseDto =
  | {
      success: boolean;
      scanSession: ScanSessionResponseDto;
    }
  | ErrorDto;

export type ScanCodeDto = {
  code: string;
};

export type CancelScanDto = {
  code: string;
  routeId: HexString;
  taskId?: HexString;
};

export type ScanCodeResponseDto =
  | {
      success: true;
      markingCode: {
        productId: string;
        gtin: string;
        packageType: AvailablePackageType;
      };
    }
  | ErrorDto;

export type CancelScanResponseDto =
  | {
      success: true;
    }
  | ErrorDto;
