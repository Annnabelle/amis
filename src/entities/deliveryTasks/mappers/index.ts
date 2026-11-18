import type { DeliveryTaskResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { DeliveryTask } from "entities/deliveryTasks/types";

const toDate = (value: string | undefined): Date | undefined =>
  value ? new Date(value) : undefined;

export const mapDeliveryTaskDtoToEntity = (
  dto: DeliveryTaskResponseDto
): DeliveryTask => ({
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
    deliveredQuantity: dto.totals.deliveredQuantity,
    amount: dto.totals.amount,
  },
  timestamps: {
    handoverStartedAt: toDate(dto.timestamps.handoverStartedAt),
    handoverCompletedAt: toDate(dto.timestamps.handoverCompletedAt),
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
): DeliveryTask[] => dtos.map(mapDeliveryTaskDtoToEntity);
