import type { DeliveryRouteStatus, HexString, Identifier } from "shared/types/dtos";

export interface BaseModel {
  id?: Identifier;
}

export interface DeliveryRouteSchedule {
  routeDate: Date;
}

export interface DeliveryRouteVehicle {
  vehicleId?: string;
  name: string;
  plateNumber?: string;
}

export interface DeliveryRouteCrew {
  driverId?: string;
  driverName?: string;
  agentId?: string;
  agentName?: string;
}

export interface DeliveryRouteTotals {
  taskCount: number;
  plannedQuantity: number;
  loadedQuantity: number;
  deliveredQuantity: number;
  returnedQuantity: number;
}

export interface DeliveryRouteTimestamps {
  registeredAt: Date;
  loadingStartedAt?: Date;
  loadingCompletedAt?: Date;
  departedAt?: Date;
  returnStartedAt?: Date;
  returnCompletedAt?: Date;
  closedAt?: Date;
}

export interface DeliveryRouteModel extends BaseModel {
  companyId: Identifier;
  routeNumber: string;
  status: DeliveryRouteStatus;
  schedule: DeliveryRouteSchedule;
  vehicle: DeliveryRouteVehicle;
  crew?: DeliveryRouteCrew;
  totals: DeliveryRouteTotals;
  timestamps: DeliveryRouteTimestamps;
  comment?: string;
  createdBy: Identifier;
  updatedBy?: Identifier;
  createdAt: Date;
  updatedAt: Date;
}

export type DeliveryRouteResponse = {
  id: string;
  companyId: string;
  routeNumber: string;
  status: DeliveryRouteStatus;
  schedule: {
    routeDate: Date;
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
    registeredAt: Date;
    loadingStartedAt?: Date;
    loadingCompletedAt?: Date;
    departedAt?: Date;
    returnStartedAt?: Date;
    returnCompletedAt?: Date;
    closedAt?: Date;
  };
  comment?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDeliveryRoutePayload = {
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
  comment?: string;
  salesOrderIds?: HexString[];
};

export type DeliveryRoutesState = {
  routes: DeliveryRouteResponse[];
  routeById: DeliveryRouteResponse | null;
  total: number;
  page: number;
  limit: number;
  createdRoute: DeliveryRouteResponse | null;
  isLoading: boolean;
  loadingById: boolean;
  error: string | null;
};
