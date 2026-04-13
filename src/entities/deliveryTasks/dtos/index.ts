import type { DeliveryTaskStatus, ErrorDto, HexString } from "shared/types/dtos";

export type DeliveryTaskResponseDto = {
  id: string;
  companyId: string;
  taskNumber: string;
  status: DeliveryTaskStatus;
  deliveryRouteId: string;
  salesOrderId: string;
  customer: {
    companyId?: string;
    tin: string;
    name: string;
  };
  items: {
    salesOrderItemId: string;
    product: {
      id: string;
      name: string;
      shortName?: string;
    };
    quantities: {
      planned: number;
      loaded: number;
      delivered: number;
    };
    commercial?: {
      unitPrice: number;
      amount: number;
    };
  }[];
  totals: {
    plannedQuantity: number;
    loadedQuantity: number;
    deliveredQuantity: number;
    amount?: number;
  };
  timestamps: {
    loadingStartedAt?: Date | string;
    loadingCompletedAt?: Date | string;
    deliveryStartedAt?: Date | string;
    deliveryCompletedAt?: Date | string;
  };
  invoice?: {
    invoiceId: string;
    status?: string;
    externalId?: string;
  };
  comment?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type GetDeliveryTasksDto = {
  routeId: HexString;
};

export type GetDeliveryTasksResponseDto =
  | {
      success: boolean;
      data: DeliveryTaskResponseDto[];
    }
  | ErrorDto;
