export const AggregatedCustomsCodeOrderStatus = {
  New: 'new',
  Generated: 'generated',
  ReadyForSign: 'ready_for_sign',
  SignedForRegistration: 'signed_for_registration',
  Verified: 'verified',
  Registered: 'registered',
  Dissolved: 'dissolved',
} as const;

export type AggregatedCustomsCodeOrderStatus =
  (typeof AggregatedCustomsCodeOrderStatus)[keyof typeof AggregatedCustomsCodeOrderStatus];

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
  userId: string;
  productId: string;
  orderId: string;
  batchId: string;
  quantity: number;
  customsCode: string | null;
  measurement: string | null;
  status: AggregatedCustomsCodeOrderStatus;
  external: CustomsCodeExternal;
};

export type GetCustomsCodesParams = {
  page?: number;
  limit?: number;
};

export type CreateCustomsCodePayload = {
  companyId: string;
  batchId: string;
};

export type GetCustomsCodesResponseDto = {
  success: true;
  data: CustomsCodeOrder[];
  total: number;
  page: number;
  limit: number;
};

export type GetCustomsCodeResponseDto = {
  success: true;
  accOrder: CustomsCodeOrder;
};

export type CreateCustomsCodeResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrder;
};

export type SignCustomsCodePayload = {
  accOrderId: string;
  signedDocumentBase64: string;
};

export type SignCustomsCodeResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrder;
};

export type ApiErrorResponse = {
  success: false;
  errorCode: number;
  errorMessage: {
    ru: string;
    en: string;
    uz: string;
  };
};
