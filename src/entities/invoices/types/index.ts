import type { InvoiceStatus } from "entities/invoices/dtos";

export type InvoiceParticipant = {
  tin?: string;
  name: string;
  address?: string;
};

export type InvoiceResponse = {
  id: string;
  invoiceNumber: string;
  deliveryRouteId: string;
  deliveryTaskId: string;
  salesOrderId: string;
  status: InvoiceStatus;
  external?: {
    id?: string;
    status?: string;
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
  sender: InvoiceParticipant & { companyId: string };
  receiver: InvoiceParticipant & { companyId?: string };
  contract?: {
    number: string;
    date: Date;
  };
  invoice: {
    number: string;
    date: Date;
  };
  currency: string;
  comment?: string;
  createdBy?: string;
  createdAt: Date;
};

export type InvoiceItemResponse = {
  id: string;
  invoiceId: string;
  productId: string;
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

export type InvoicesState = {
  invoices: InvoiceResponse[];
  invoiceById: InvoiceResponse | null;
  items: InvoiceItemResponse[];
  itemsTotal: number;
  itemsPage: number;
  itemsLimit: number;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  loadingById: boolean;
  itemsLoading: boolean;
  error: string | null;
};
