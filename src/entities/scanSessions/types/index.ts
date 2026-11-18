import {
  ScanSessionStatus,
  ScanSessionType,
} from '@edem2000/amis.contracts'

export {
  ScanSessionStatus,
  ScanSessionType,
}

import type { PackageType } from "shared/types/dtos";


export type ScanSession = {
  id: string;
  companyId: string;
  status: ScanSessionStatus;
  type: ScanSessionType;
  routeId: string;
  taskId?: string;
  device?: {
    id?: string;
    name?: string;
  };
  counters: {
    accepted: number;
    rejected: number;
  };
  timestamps: {
    startedAt: Date;
    completedAt?: Date;
  };
  userId: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ScanStatus = "accepted" | "rejected";

export type ScanAttempt = {
  code: string;
  status: ScanStatus;
  reason?: string;
  productId?: string;
  gtin?: string;
  packageType?: PackageType;
  ts: string;
};

export type ScanSessionsState = {
  currentSession: ScanSession | null;
  recentScans: ScanAttempt[];
  isCreating: boolean;
  isScanning: boolean;
  isCompleting: boolean;
  error: string | null;
};
