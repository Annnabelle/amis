import {
  AggregatedCustomsCodeOrderStatus,
} from '@edem2000/amis.contracts'

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

export type CustomsCodeOrder = {
  id: string;
  accOrderNumber: string | null;
  userId: string;
  productId: string;
  orderId: string;
  batchId: string;
  quantity: number;
  customsCode: string | null;
  measurement: { value: string; quantity: number } | null;
  status: AggregatedCustomsCodeOrderStatus;
  external: CustomsCodeExternal;
};
