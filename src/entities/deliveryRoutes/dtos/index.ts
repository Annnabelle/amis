import type { DeliveryRouteStatus, ErrorDto, HexString } from "shared/types/dtos";

export type DeliveryRouteResponseDto = {
  id: string;
  companyId: string;
  routeNumber: string;
  status: DeliveryRouteStatus;
  schedule: {
    routeDate: Date | string;
  };
  vehicle: {
    vehicleId?: string;
    name: string;
    plateNumber?: string;
  };
  crew?: {
    driverId?: string;
    driverName?: string;
    agentId?: string;
    agentName?: string;
  };
  totals: {
    taskCount: number;
    plannedQuantity: number;
    loadedQuantity: number;
    deliveredQuantity: number;
    returnedQuantity: number;
  };
  timestamps: {
    registeredAt: Date | string;
    loadingStartedAt?: Date | string;
    loadingCompletedAt?: Date | string;
    departedAt?: Date | string;
    returnStartedAt?: Date | string;
    returnCompletedAt?: Date | string;
    closedAt?: Date | string;
  };
  comment?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type GetDeliveryRoutesDto = {
  companyId?: HexString;
};

export type GetDeliveryRoutesResponseDto =
  | {
      success: boolean;
      data: DeliveryRouteResponseDto[];
    }
  | ErrorDto;

export type CreateDeliveryRouteSalesOrderDto = {
  salesOrderId: HexString;
};

export type CreateDeliveryRouteDto = {
  companyId: HexString;
  schedule: {
    routeDate: string;
  };
  vehicle: {
    vehicleId?: HexString;
    name: string;
    plateNumber?: string;
  };
  crew?: {
    driverId?: HexString;
    driverName?: string;
    agentId?: HexString;
    agentName?: string;
  };
  salesOrders: CreateDeliveryRouteSalesOrderDto[];
  comment?: string;
};

export type CreateDeliveryRouteResponseDto =
  | {
      success: boolean;
      deliveryRoute: DeliveryRouteResponseDto;
    }
  | ErrorDto;
