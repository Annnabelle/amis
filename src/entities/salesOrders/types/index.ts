import type { HexString, SalesOrderPriority, SalesOrderStatus } from "shared/types/dtos";

export type SalesOrderResponse = {
  id: string;
  companyId: string;
  status: SalesOrderStatus;
  customer: {
    companyId?: string;
    tin: string;
    name: string;
    address?: string;
  };
  contract?: {
    number: string;
    date: Date;
  };
  fulfillment: {
    dueDate: Date;
    priority: SalesOrderPriority;
  };
  items: {
    id: string;
    product: {
      id: string;
      name: string;
      shortName?: string;
    };
    quantities: {
      ordered: number;
      assigned: number;
      delivered: number;
    };
    commercial?: {
      unitPrice?: number;
      amount?: number;
    };
    comment?: string;
  }[];
  totals: {
    orderedQuantity: number;
    assignedQuantity: number;
    deliveredQuantity: number;
    amount?: number;
  };
  comment?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSalesOrderItem = {
  productId: HexString;
  quantity: number;
  unitPrice: number;
  comment?: string;
};

export type CreateSalesOrderPayload = {
  companyId: HexString;
  customer: {
    companyId?: HexString;
    tin: string;
    name: string;
    address?: string;
  };
  contract?: {
    number: string;
    date: string;
  };
  fulfillment: {
    dueDate: string;
    priority: SalesOrderPriority;
  };
  items: CreateSalesOrderItem[];
  comment?: string;
};

export type SalesOrdersState = {
  orders: SalesOrderResponse[];
  orderById: SalesOrderResponse | null;
  total: number;
  page: number;
  limit: number;
  createdOrder: SalesOrderResponse | null;
  isLoading: boolean;
  error: string | null;
};
