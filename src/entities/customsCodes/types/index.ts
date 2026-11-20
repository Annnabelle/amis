import {
  AggregatedCustomsCodeOrderStatus,
} from '@edem2000/amis.contracts'
import type { JobFailureReason, JobStatus, MultiLanguage } from '@edem2000/amis.contracts'
import type { Paginated } from 'shared/api'

export {
  AggregatedCustomsCodeOrderStatus,
}

export type CustomsCodeExternalDocument = {
  documentId: string | null;
  documentBase64: string | null;
};

export type CustomsCodeExternal = {
  registration: CustomsCodeExternalDocument;
  dissolution: CustomsCodeExternalDocument;
};

export type CustomsCodeProduct = {
  id: string;
  name: string;
  gtin: string;
};

/** Состояние обработки заказа: по нему видно, что шаг встал. */
export type CustomsCodeProcessing = {
  jobType: string;
  jobStatus: JobStatus;
  failureReason: JobFailureReason | null;
  attempts: number;
  maxAttempts: number;
  runAt: string;
  lastError: MultiLanguage | null;
};

export type CustomsCodeOrder = {
  id: string;
  accOrderNumber: string | null;
  userId: string;
  productId: string;
  orderId: string;
  batchId: string;
  quantity: number;
  customsCode: string | null;
  product: CustomsCodeProduct | null;
  measurement: { value: string; quantity: number } | null;
  status: AggregatedCustomsCodeOrderStatus;
  external: CustomsCodeExternal;
  processing: CustomsCodeProcessing | null;
};

export type CustomsCodeOrderList = Paginated<CustomsCodeOrder>;
