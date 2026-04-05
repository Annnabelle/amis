import type {
  ErrorDto,
  HexString,
  PaginatedDto,
  PaginatedResponseDto,
  SalesOrderPriority,
  SalesOrderStatus,
} from "shared/types/dtos";

export type SalesOrderResponseDto = {
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
    date: Date | string;
  };
  fulfillment: {
    dueDate: Date | string;
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
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateSalesOrderDto = {
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
  items: {
    productId: HexString;
    quantity: number;
    unitPrice: number;
    comment?: string;
  }[];
  comment?: string;
};

export type CreateSalesOrderResponseDto =
  | {
      success: boolean;
      salesOrder: SalesOrderResponseDto;
    }
  | ErrorDto;

export type GetSalesOrdersDto = PaginatedDto & {
  companyId?: HexString;
  status?: SalesOrderStatus;
};

export type GetSalesOrdersResponseDto =
  | ({ success: boolean } & PaginatedResponseDto<SalesOrderResponseDto>)
  | ErrorDto;

export type GetSalesOrderDto = {
  id: HexString;
};

export type GetSalesOrderResponseDto =
  | { success: boolean; salesOrder: SalesOrderResponseDto }
  | ErrorDto;

export type DeleteSalesOrderDto = {
  id: HexString;
};

export type DeleteSalesOrderResponseDto =
  | { success: boolean }
  | ErrorDto;
