import type { DeliveryTaskStatus } from "shared/types/dtos";

export type DeliveryTaskResponse = {
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
    loadingStartedAt?: Date;
    loadingCompletedAt?: Date;
    deliveryStartedAt?: Date;
    deliveryCompletedAt?: Date;
  };
  invoice?: {
    invoiceId: string;
    status?: string;
    externalId?: string;
  };
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DeliveryTasksState = {
  tasks: DeliveryTaskResponse[];
  isLoading: boolean;
  error: string | null;
};
