import type { InvoiceStatus } from '@edem2000/amis.contracts';
import type { PackageType, MarkingCodeStatus } from "shared/types/dtos";

export type InvoiceParticipant = {
  tin?: string;
  name: string;
  address?: string;
};

export type Invoice = {
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

export type InvoiceItem = {
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

export type InvoiceMarkingCode = {
  id: string;
  code: string;
  status: MarkingCodeStatus;
  packageType: PackageType | string;
};

export type InvoiceMarkingCodesState = {
  data: InvoiceMarkingCode[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
};

export type InvoicesState = {
  invoices: Invoice[];
  invoiceById: Invoice | null;
  items: InvoiceItem[];
  codesByProductId: Record<string, InvoiceMarkingCodesState>;
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
