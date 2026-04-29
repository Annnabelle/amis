import type { ReactNode } from 'react';

export type ScanStatus = 'accepted' | 'rejected';
export type ScannerStage = 'idle' | 'starting' | 'camera_active' | 'code_detected' | 'processing' | 'error';

export interface ScanResult {
  status: ScanStatus;
  reason?: string;
}

export interface ScanItem {
  code: string;
  status: ScanStatus;
  reason?: string;
  ts: string;
}

export interface DataMatrixScannerProps {
  title: string;
  subtitle?: string;
  helperText?: string;
  onScan?: (code: string) => ScanResult | Promise<ScanResult>;
  lastScans?: ScanItem[];
  acceptedCount?: number;
  rejectedCount?: number;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  enableCamera?: boolean;
  scanDisabled?: boolean;
  scanInProgress?: boolean;
  cameraAutoStart?: boolean;
  lastScansContent?: ReactNode;
  onCameraClose?: () => void | Promise<void>;
}
