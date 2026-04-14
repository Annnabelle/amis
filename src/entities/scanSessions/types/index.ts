import type { AvailablePackageType } from "shared/types/dtos";

export const ScanSessionStatus = {
  Active: "active",
  Completed: "completed",
  Cancelled: "cancelled",
  Failed: "failed",
} as const;

export type ScanSessionStatus =
  (typeof ScanSessionStatus)[keyof typeof ScanSessionStatus];

export const ScanSessionType = {
  Loading: "loading",
  Delivery: "delivery",
  Return: "return",
} as const;

export type ScanSessionType =
  (typeof ScanSessionType)[keyof typeof ScanSessionType];

export type ScanSessionResponse = {
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
  packageType?: AvailablePackageType;
  ts: string;
};

export type ScanSessionsState = {
  currentSession: ScanSessionResponse | null;
  recentScans: ScanAttempt[];
  isCreating: boolean;
  isScanning: boolean;
  isCompleting: boolean;
  error: string | null;
};
