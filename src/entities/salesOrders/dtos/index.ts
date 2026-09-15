import type {
  ErrorDto,
  HexString,
  PaginatedDto,
  PaginatedResponseDto,
  SalesOrderPaymentMethod,
  SalesOrderPriority,
  SalesOrderStatus,
} from "shared/types/dtos";
import type { SalesOrderDeliveryType } from "entities/waybills/dtos";

export type SalesOrderResponseDto = {
  id: string;
  companyId: string;
  salesOrderNumber: string;
  status: SalesOrderStatus;
  sender: {
    addressDetails: SalesOrderAddressResponseDto;
  };
  customer: {
    companyId?: string;
    tin: string;
    name: string;
    address?: string;
    addressDetails: SalesOrderAddressResponseDto;
  };
  contract?: {
    number: string;
    date: Date;
  };
  fulfillment: {
    dueDate: Date;
    priority: SalesOrderPriority;
    paymentMethod: SalesOrderPaymentMethod;
  };
  delivery?: {
    type: string;
    costPerDistanceUnit?: number;
    totalDistance?: number;
    totalCost?: number;
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
    packageCode?: string;
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

export type CreateSalesOrderDto = {
  sender: {
    addressDetails: SalesOrderAddressDto;
  };
  customer: {
    id?: HexString;
    tin: string;
    name: string;
    addressDetails: SalesOrderAddressDto;
  };
  contract: {
    number: string;
    date: string;
  };
  fulfillment: {
    dueDate: string;
    priority: SalesOrderPriority;
    paymentMethod: SalesOrderPaymentMethod;
  };
  delivery: {
    type: SalesOrderDeliveryType;
    costPerDistanceUnit?: number;
    totalDistance?: number;
  };
  items: {
    productId: HexString;
    quantity: number;
    unitPrice: number;
    packageCode?: string;
    comment?: string;
  }[];
  comment?: string;
};

export type SalesOrderLocationDto = {
  latitude: number;
  longitude: number;
};

export type SalesOrderAddressDto = {
  regionId: HexString;
  districtId: HexString;
  address: string;
  location: SalesOrderLocationDto;
};

export type SalesOrderAddressResponseDto = SalesOrderAddressDto;

export type CreateSalesOrderResponseDto =
  | {
      success: boolean;
      salesOrder: SalesOrderResponseDto;
    }
  | ErrorDto;

export type GetSalesOrdersDto = PaginatedDto & {
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

