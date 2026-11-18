import type { InvoiceItemResponseDto, InvoiceResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { CompanyMarkingCodeRow } from '@edem2000/amis.contracts/api/invoices/responses';
import type { ExternalInvoiceStatus } from '@edem2000/amis.contracts';
import { ExternalInvoiceStatusNumericToSymbol } from 'entities/invoices/lib/externalStatus';
import type {
  InvoiceItem,
  InvoiceMarkingCode,
  Invoice,
} from "entities/invoices/types";

const toDate = (value: string | Date | undefined): Date => {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
};

const toExternalStatus = (
  status: ExternalInvoiceStatus | number | undefined
): string | undefined => {
  if (typeof status === "number") {
    return ExternalInvoiceStatusNumericToSymbol[status] ?? String(status);
  }

  return status;
};

export const mapInvoiceDtoToEntity = (
  dto: InvoiceResponseDto
): Invoice => ({
  id: dto.id,
  invoiceNumber: dto.invoiceNumber,
  deliveryRouteId: dto.deliveryRouteId,
  deliveryTaskId: dto.deliveryTaskId,
  salesOrderId: dto.salesOrderId,
  status: dto.status,
  external: dto.external
    ? {
        id: dto.external.id,
        status: toExternalStatus(dto.external.status),
      }
    : undefined,
  totals: {
    amountWithoutVat: dto.totals.amountWithoutVat,
    itemsQuantity: dto.totals.itemsQuantity,
    unitsQuantity: dto.totals.unitsQuantity,
  },
  fileMeta: dto.fileMeta,
  sender: {
    companyId: dto.sender.companyId,
    tin: dto.sender.tin,
    name: dto.sender.name,
    address: dto.sender.address,
  },
  receiver: {
    companyId: dto.receiver.companyId,
    tin: dto.receiver.tin,
    name: dto.receiver.name,
    address: dto.receiver.address,
  },
  contract: dto.contract
    ? {
        number: dto.contract.number,
        date: toDate(dto.contract.date),
      }
    : undefined,
  invoice: {
    number: dto.invoice.number,
    date: toDate(dto.invoice.date),
  },
  currency: dto.currency,
  comment: dto.comment,
  createdBy: dto.createdBy,
  createdAt: toDate(dto.createdAt),
});

/** invoiceId в ответе не приходит — передаёт вызывающая сторона. */
export const mapInvoiceItemDtoToEntity = (
  invoiceId: string,
  dto: InvoiceItemResponseDto
): InvoiceItem => ({
  id: dto.id,
  invoiceId,
  productId: dto.productId,
  productName: dto.productName,
  quantity: dto.quantity,
  amountWithoutVat: dto.amountWithoutVat,
  unitPrice: dto.unitPrice,
  measurementUnit: dto.measurementUnit,
  measurementUnitCode: dto.measurementUnitCode,
  exciseRate: dto.exciseRate,
  vatRate: dto.vatRate,
  psic: {
    code: dto.psic.code,
    name: dto.psic.name,
  },
  reliefId: dto.reliefId,
});

export const mapInvoiceMarkingCodeDtoToEntity = (
  dto: CompanyMarkingCodeRow
): InvoiceMarkingCode => ({
  id: dto.id,
  code: dto.code,
  status: dto.status,
  packageType: dto.packageType,
});
