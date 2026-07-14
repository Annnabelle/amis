import type {
  ErrorDto,
  HexString,
  PaginatedDto,
  PaginatedResponseDto,
} from "shared/types/dtos";

export const InvoiceStatus = {
  Created: "created",
  InReview: "in_review",
  Approved: "approved",
  Sent: "sent",
  Pending: "pending",
  Completed: "completed",
  Rejected: "rejected",
  Canceled: "canceled",
  Returned: "returned",
  Unknown: "unknown",
  Registered: "registered",
  Deleted: "deleted",
} as const;

export const ExternalInvoiceStatus = {
  None: "None",
  AwaitContractor: "AwaitContractor",
  AwaitAction: "AwaitAction",
  Rejected: "Rejected",
  Archived: "Archived",
  AwaitAgreement: "AwaitAgreement",
  AwaitSign: "AwaitSign",
  Deleted: "Deleted",
  AwaitThirdSide: "AwaitThirdSide",
  ArchiveCancelRequested: "ArchiveCancelRequested",
  AwaitCancelArchiveRequest: "AwaitCancelArchiveRequest",
  RejectArchiveCancelRequest: "RejectArchiveCancelRequest",
  ArchiveCanceled: "ArchiveCanceled",
  AgreementAgreed: "AgreementAgreed",
  AgreementReject: "AgreementReject",
  SigningSigned: "SigningSigned",
  SigningReject: "SigningReject",
  AwaitDecline: "AwaitDecline",
  VerifiedBySystem: "VerifiedBySystem",
  AwaitResponsiblePerson: "AwaitResponsiblePerson",
  ResponsiblePersonAccepted: "ResponsiblePersonAccepted",
  AwaitResponsiblePersonAccepted: "AwaitResponsiblePersonAccepted",
  ResponsiblePersonRejected: "ResponsiblePersonRejected",
  ResponsiblePersonTillReturned: "ResponsiblePersonTillReturned",
  ResponsiblePersonReturned: "ResponsiblePersonReturned",
  ReturnAccepted: "ReturnAccepted",
  AwaitReturnAccept: "AwaitReturnAccept",
} as const;

export const ExternalInvoiceStatusNumericToSymbol: Record<number, ExternalInvoiceStatus> = {
  20: "None",
  21: "AwaitContractor",
  22: "AwaitAction",
  23: "Rejected",
  24: "Archived",
  25: "AwaitAgreement",
  26: "AwaitSign",
  27: "Deleted",
  28: "AwaitThirdSide",
  31: "ArchiveCancelRequested",
  32: "AwaitCancelArchiveRequest",
  33: "RejectArchiveCancelRequest",
  34: "ArchiveCanceled",
  41: "AgreementAgreed",
  42: "AgreementReject",
  43: "SigningSigned",
  44: "SigningReject",
  45: "AwaitDecline",
  46: "VerifiedBySystem",
  60: "AwaitResponsiblePerson",
  61: "ResponsiblePersonAccepted",
  62: "AwaitResponsiblePersonAccepted",
  63: "ResponsiblePersonRejected",
  64: "ResponsiblePersonTillReturned",
  65: "ResponsiblePersonReturned",
  66: "ReturnAccepted",
  67: "AwaitReturnAccept",
};

export const InvoiceSortField = {
  Id: "_id",
  InvoiceNumber: "invoiceNumber",
  IssuedAt: "issuedAt",
  Status: "status",
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
export type ExternalInvoiceStatus =
  (typeof ExternalInvoiceStatus)[keyof typeof ExternalInvoiceStatus];
export type InvoiceSortField = (typeof InvoiceSortField)[keyof typeof InvoiceSortField];

export type InvoiceParticipantResponseDto = {
  tin?: string;
  name: string;
  address?: string;
};

export type InvoiceResponseDto = {
  id: string;
  invoiceNumber: string;
  deliveryRouteId: string;
  deliveryTaskId: string;
  salesOrderId: string;
  status: InvoiceStatus;
  external?: {
    id?: string;
    status?: ExternalInvoiceStatus | number;
  };
  totals: {
    amountWithoutVat: number;
    itemsQuantity: number;
    unitsQuantity: number;
  };
  fileMeta?: {
    filename?: string;
    programVersion?: string;
    formatVersion?: string;
  };
  sender: InvoiceParticipantResponseDto & { companyId: string };
  receiver: InvoiceParticipantResponseDto & { companyId?: string };
  contract?: {
    number: string;
    date: Date | string;
  };
  invoice: {
    number: string;
    date: Date | string;
  };
  currency: string;
  comment?: string;
  createdBy?: string;
  createdAt: Date | string;
};

export type GetInvoicesDto = Partial<PaginatedDto> & {
  status?: InvoiceStatus;
  sortBy?: InvoiceSortField;
  receiverCompanyId?: HexString;
};

export type GetInvoicesResponseDto =
  | ({ success: boolean } & PaginatedResponseDto<InvoiceResponseDto>)
  | ErrorDto;

export type GetInvoiceDto = {
  id: HexString;
};

export type GetInvoiceResponseDto =
  | {
      success: boolean;
      invoice: InvoiceResponseDto;
    }
  | ErrorDto;

export type InvoiceItemResponseDto = {
  id?: string;
  invoiceId: HexString;
  productId: HexString;
  productName: string;
  quantity: number;
  amountWithoutVat: number;
  unitPrice: number;
  measurementUnit: string;
  measurementUnitCode: string;
  exciseRate: number;
  vatRate: number;
  psic: {
    code: string;
    name: string;
  };
  reliefId?: string;
};

export type GetInvoiceItemsDto = Partial<PaginatedDto> & {
  id: HexString;
};

export type GetInvoiceItemsResponseDto =
  | ({ success: boolean } & PaginatedResponseDto<InvoiceItemResponseDto>)
  | ErrorDto;
