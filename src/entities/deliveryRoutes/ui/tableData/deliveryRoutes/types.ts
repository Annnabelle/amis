import type { DeliveryRouteStatus } from "shared/types/dtos";

export type DeliveryRoutesTableDataType = {
  key: string;
  routeNumber: string;
  status: DeliveryRouteStatus;
  routeDate: string;
  vehicleName: string;
  plateNumber?: string;
  driver?: string;
  agent?: string;
  taskCount: number;
  plannedQuantity: number;
  loadedQuantity: number;
  deliveredQuantity: number;
  returnedQuantity: number;
  registeredAt: string;
};
