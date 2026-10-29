export const AggregatedCustomsCodeOrderStatus = {
  New: 'new',
  Generated: 'generated',
  ReadyForSign: 'ready_for_sign',
  SignedForRegistration: 'signed_for_registration',
  Verified: 'verified',
  VerifiedForRegistration: 'verified_for_registration',
  Registered: 'registered',
  DissolutionInitialized: 'dissolution_initialized',
  SignedForDissolution: 'signed_for_dissolution',
  VerifiedForDissolution: 'verified_for_dissolution',
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
  accOrderNumber: string | null;
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
