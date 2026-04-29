import type { Dayjs } from "dayjs";
import type {
  CreateSalesOrderDto,
  CreateSalesOrderResponseDto,
  SalesOrderResponseDto,
} from "entities/salesOrders/dtos";
import type { ErrorDto } from "shared/types/dtos";
import type { SalesOrderResponse } from "entities/salesOrders/types";
import type { SalesOrderPriority } from "shared/types/dtos";

const toDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

const toDateString = (value: string | Date | Dayjs | undefined): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof (value as Dayjs).toISOString === "function") {
    return (value as Dayjs).toISOString();
  }
  return undefined;
};

export const mapSalesOrderDtoToEntity = (
  dto: SalesOrderResponseDto
): SalesOrderResponse => ({
  id: dto.id,
  companyId: dto.companyId,
  salesOrderNumber: dto.salesOrderNumber,
  status: dto.status,
  customer: {
    companyId: dto.customer.companyId,
    tin: dto.customer.tin,
    name: dto.customer.name,
    address: dto.customer.address,
  },
  contract: dto.contract
    ? {
        number: dto.contract.number,
        date: toDate(dto.contract.date) ?? new Date(),
      }
    : undefined,
  fulfillment: {
    dueDate: toDate(dto.fulfillment.dueDate) ?? new Date(),
    priority: dto.fulfillment.priority,
  },
  items: dto.items.map((item) => ({
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      shortName: item.product.shortName,
    },
    quantities: {
      ordered: item.quantities.ordered,
      assigned: item.quantities.assigned,
      delivered: item.quantities.delivered,
    },
    commercial: item.commercial
      ? {
          unitPrice: item.commercial.unitPrice,
          amount: item.commercial.amount,
        }
      : undefined,
    comment: item.comment,
  })),
  totals: {
    orderedQuantity: dto.totals.orderedQuantity,
    assignedQuantity: dto.totals.assignedQuantity,
    deliveredQuantity: dto.totals.deliveredQuantity,
    amount: dto.totals.amount,
  },
  comment: dto.comment,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: toDate(dto.createdAt) ?? new Date(),
  updatedAt: toDate(dto.updatedAt) ?? new Date(),
});

export const mapCreateSalesOrderResponseDtoToEntity = (
  dto: CreateSalesOrderResponseDto
): { success: boolean; salesOrder?: SalesOrderResponse; error?: ErrorDto } => {
  if ("errorCode" in dto) {
    return { success: false, error: dto };
  }

  if (!dto.success || !("salesOrder" in dto)) {
    return {
      success: false,
      error: {
        success: false,
        errorCode: 100,
        errorMessage: {
          ru: "Неизвестный формат ответа сервера",
          en: "Unknown server response format",
          uz: "Server javobining nomaʼlum formati",
        },
      },
    };
  }

  return {
    success: dto.success,
    salesOrder: mapSalesOrderDtoToEntity(dto.salesOrder),
  };
};

export type SalesOrderFormValues = {
  customer: {
    companyId?: string;
    tin: string;
    name: string;
    address?: string;
  };
  contract?: {
    number?: string;
    date?: string | Date | Dayjs;
  };
  fulfillment: {
    dueDate: string | Date | Dayjs;
    priority: SalesOrderPriority;
  };
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    comment?: string;
  }[];
  comment?: string;
};

export const mapSalesOrderFormToCreateDto = (
  values: SalesOrderFormValues,
  companyId: string
): CreateSalesOrderDto => {
  const contractDate = toDateString(values.contract?.date);
  const dueDate = toDateString(values.fulfillment?.dueDate);

  return {
    companyId,
    customer: {
      companyId: values.customer.companyId,
      tin: values.customer.tin.replace(/\D/g, '').trim(),
      name: values.customer.name.trim(),
      address: values.customer.address?.trim() || undefined,
    },
    contract:
      values.contract?.number && contractDate
        ? {
            number: values.contract.number.trim(),
            date: contractDate,
          }
        : undefined,
    fulfillment: {
      dueDate: dueDate ?? new Date().toISOString(),
      priority: values.fulfillment.priority,
    },
    items: values.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      comment: item.comment?.trim() || undefined,
    })),
    comment: values.comment?.trim() || undefined,
  };
};
