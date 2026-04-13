import type { DeliveryTaskResponseDto } from "entities/deliveryTasks/dtos";
import type { DeliveryTaskResponse } from "entities/deliveryTasks/types";

const toDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

export const mapDeliveryTaskDtoToEntity = (
  dto: DeliveryTaskResponseDto
): DeliveryTaskResponse => ({
  id: dto.id,
  companyId: dto.companyId,
  taskNumber: dto.taskNumber,
  status: dto.status,
  deliveryRouteId: dto.deliveryRouteId,
  salesOrderId: dto.salesOrderId,
  customer: {
    companyId: dto.customer.companyId,
    tin: dto.customer.tin,
    name: dto.customer.name,
  },
  items: dto.items.map((item) => ({
    salesOrderItemId: item.salesOrderItemId,
    product: {
      id: item.product.id,
      name: item.product.name,
      shortName: item.product.shortName,
    },
    quantities: {
      planned: item.quantities.planned,
      loaded: item.quantities.loaded,
      delivered: item.quantities.delivered,
    },
    commercial: item.commercial
      ? {
          unitPrice: item.commercial.unitPrice,
          amount: item.commercial.amount,
        }
      : undefined,
  })),
  totals: {
    plannedQuantity: dto.totals.plannedQuantity,
    loadedQuantity: dto.totals.loadedQuantity,
    deliveredQuantity: dto.totals.deliveredQuantity,
    amount: dto.totals.amount,
  },
  timestamps: {
    loadingStartedAt: toDate(dto.timestamps.loadingStartedAt),
    loadingCompletedAt: toDate(dto.timestamps.loadingCompletedAt),
    deliveryStartedAt: toDate(dto.timestamps.deliveryStartedAt),
    deliveryCompletedAt: toDate(dto.timestamps.deliveryCompletedAt),
  },
  invoice: dto.invoice
    ? {
        invoiceId: dto.invoice.invoiceId,
        status: dto.invoice.status,
        externalId: dto.invoice.externalId,
      }
    : undefined,
  comment: dto.comment,
  createdAt: toDate(dto.createdAt) ?? new Date(),
  updatedAt: toDate(dto.updatedAt) ?? new Date(),
});

export const mapDeliveryTasksDtoToEntities = (
  dtos: DeliveryTaskResponseDto[]
): DeliveryTaskResponse[] => dtos.map(mapDeliveryTaskDtoToEntity);
