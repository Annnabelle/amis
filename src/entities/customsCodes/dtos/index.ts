import type { AggregatedCustomsCodeOrderStatus } from 'entities/customsCodes/types';

export type CustomsCodeExternalDocumentDto = {
  documentId: string | null;
  documentBase64: string | null;
};

export type CustomsCodeExternalDto = {
  registration: CustomsCodeExternalDocumentDto;
  dissolution: CustomsCodeExternalDocumentDto;
};

export type CustomsCodeOrderDto = {
  id: string;
  accOrderNumber: string | null;
  userId: string;
  productId: string;
  orderId: string;
  batchId: string;
  quantity: number;
  customsCode: string | null;
  measurement: string | null;
  status: AggregatedCustomsCodeOrderStatus;
  external: CustomsCodeExternalDto;
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
  data: CustomsCodeOrderDto[];
  total: number;
  page: number;
  limit: number;
};

export type GetCustomsCodeResponseDto = {
  success: true;
  accOrder: CustomsCodeOrderDto;
};

export type CreateCustomsCodeResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrderDto;
};

export type SignRegistrationAggregatedCustomsCodeOrderPayload = {
  accOrderId: string;
  signedDocumentBase64: string;
};

export type SignRegistrationAggregatedCustomsCodeOrderResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrderDto;
};

export type InitiateDissolutionAggregatedCustomsCodeOrderResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrderDto;
};

export type SignDissolutionAggregatedCustomsCodeOrderPayload = {
  accOrderId: string;
  signedDocumentBase64: string;
};

export type SignDissolutionAggregatedCustomsCodeOrderResponseDto = {
  success: true;
  aggregatedCustomsCode: CustomsCodeOrderDto;
};
