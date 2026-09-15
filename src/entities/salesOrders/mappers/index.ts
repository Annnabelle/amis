import type { Dayjs } from "dayjs";
import type {
  CreateSalesOrderDto,
  CreateSalesOrderResponseDto,
  SalesOrderAddressResponseDto,
  SalesOrderResponseDto,
} from "entities/salesOrders/dtos";
import type { ErrorDto } from "shared/types/dtos";
import type { SalesOrderResponse } from "entities/salesOrders/types";
import type { SalesOrderPaymentMethod, SalesOrderPriority } from "shared/types/dtos";
import type { SalesOrderDeliveryType } from "entities/waybills/dtos";

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

const optionalNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const mapAddressResponseDtoToEntity = (
  addressDetails: SalesOrderAddressResponseDto
): SalesOrderResponse["customer"]["addressDetails"] => ({
  regionId: addressDetails.regionId,
  districtId: addressDetails.districtId,
  address: addressDetails.address,
  location: addressDetails.location
    ? {
        latitude: addressDetails.location.latitude,
        longitude: addressDetails.location.longitude,
      }
    : undefined,
});

export const mapSalesOrderDtoToEntity = (
  dto: SalesOrderResponseDto
): SalesOrderResponse => ({
  id: dto.id,
  companyId: dto.companyId,
  salesOrderNumber: dto.salesOrderNumber,
  status: dto.status,
  sender: dto.sender
    ? {
        addressDetails: mapAddressResponseDtoToEntity(dto.sender.addressDetails),
      }
    : undefined,
  customer: {
    companyId: dto.customer.companyId,
    tin: dto.customer.tin,
    name: dto.customer.name,
    address: dto.customer.address,
    addressDetails: mapAddressResponseDtoToEntity(dto.customer.addressDetails),
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
    paymentMethod: dto.fulfillment.paymentMethod,
  },
  delivery: dto.delivery
    ? {
        type: dto.delivery.type,
        costPerDistanceUnit: dto.delivery.costPerDistanceUnit,
        totalDistance: dto.delivery.totalDistance,
        totalCost: dto.delivery.totalCost,
      }
    : undefined,
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
    packageCode: item.packageCode,
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
  sender?: {
    tin?: string;
    name?: string;
    addressDetails?: SalesOrderAddressFormValues;
  };
  customer: {
    id?: string;
    tin: string;
    name: string;
    addressDetails?: SalesOrderAddressFormValues;
  };
  contract?: {
    number?: string;
    date?: string | Date | Dayjs;
  };
  fulfillment: {
    dueDate: string | Date | Dayjs;
    priority: SalesOrderPriority;
    paymentMethod: SalesOrderPaymentMethod;
  };
  delivery?: {
    type?: SalesOrderDeliveryType;
    costPerDistanceUnit?: number;
    totalDistance?: number;
  };
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    packageCode?: string;
    comment?: string;
  }[];
  comment?: string;
};

export type SalesOrderAddressFormValues = {
  regionId?: string;
  districtId?: string;
  address?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
};

const mapAddressDetails = (
  addressDetails?: SalesOrderAddressFormValues
): CreateSalesOrderDto["customer"]["addressDetails"] | undefined => {
  if (!addressDetails?.regionId || !addressDetails.districtId || !addressDetails.address?.trim()) {
    return undefined;
  }

  const latitude = Number(addressDetails.location?.latitude);
  const longitude = Number(addressDetails.location?.longitude);
  const hasLocation = Number.isFinite(latitude) && Number.isFinite(longitude);

  if (!hasLocation) {
    return undefined;
  }

  return {
    regionId: addressDetails.regionId,
    districtId: addressDetails.districtId,
    address: addressDetails.address.trim(),
    location: { latitude, longitude },
  };
};

export class SalesOrderContractError extends Error {}

export const mapSalesOrderFormToCreateDto = (
  values: SalesOrderFormValues
): CreateSalesOrderDto => {
  const contractDate = toDateString(values.contract?.date);
  const dueDate = toDateString(values.fulfillment?.dueDate);
  const senderAddressDetails = mapAddressDetails(values.sender?.addressDetails);
  const customerAddressDetails = mapAddressDetails(values.customer.addressDetails);

  if (!senderAddressDetails) {
    throw new SalesOrderContractError("sender.addressDetails");
  }

  if (!customerAddressDetails) {
    throw new SalesOrderContractError("customer.addressDetails");
  }

  if (!values.contract?.number?.trim() || !contractDate) {
    throw new SalesOrderContractError("contract");
  }

  if (!values.delivery?.type) {
    throw new SalesOrderContractError("delivery");
  }

  return {
    sender: {
      addressDetails: senderAddressDetails,
    },
    customer: {
      id: values.customer.id,
      tin: values.customer.tin.replace(/\D/g, '').trim(),
      name: values.customer.name.trim(),
      addressDetails: customerAddressDetails,
    },
    contract: {
      number: values.contract.number.trim(),
      date: contractDate,
    },
    fulfillment: {
      dueDate: dueDate ?? new Date().toISOString(),
      priority: values.fulfillment.priority,
      paymentMethod: values.fulfillment.paymentMethod,
    },
    delivery: {
      type: values.delivery.type,
      costPerDistanceUnit: optionalNumber(values.delivery.costPerDistanceUnit),
      totalDistance: optionalNumber(values.delivery.totalDistance),
    },
    items: values.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      packageCode: item.packageCode?.trim() || undefined,
      comment: item.comment?.trim() || undefined,
    })),
    comment: values.comment?.trim() || undefined,
  };
};
