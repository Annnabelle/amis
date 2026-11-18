import type { DeliveryTaskStatus } from "shared/types/dtos";

export type DeliveryTask = {
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
      delivered: number;
    };
    commercial?: {
      unitPrice: number;
      amount: number;
    };
  }[];
  totals: {
    plannedQuantity: number;
    deliveredQuantity: number;
    amount?: number;
  };
  timestamps: {
    handoverStartedAt?: Date;
    handoverCompletedAt?: Date;
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
  tasks: DeliveryTask[];
  taskById: DeliveryTask | null;
  isLoading: boolean;
  loadingById: boolean;
  error: string | null;
};
