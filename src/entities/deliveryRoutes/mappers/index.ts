import type { Dayjs } from "dayjs";
import type {
  CreateDeliveryRouteDto,
  CreateDeliveryRouteResponseDto,
  DeliveryRouteResponseDto,
} from "entities/deliveryRoutes/dtos";
import type { ErrorDto } from "shared/types/dtos";
import type { DeliveryRouteResponse } from "entities/deliveryRoutes/types";

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

export const mapDeliveryRouteDtoToEntity = (
  dto: DeliveryRouteResponseDto
): DeliveryRouteResponse => ({
  id: dto.id,
  companyId: dto.companyId,
  routeNumber: dto.routeNumber,
  status: dto.status,
  schedule: {
    routeDate: toDate(dto.schedule.routeDate) ?? new Date(),
  },
  vehicle: {
    vehicleId: dto.vehicle.vehicleId,
    name: dto.vehicle.name,
    plateNumber: dto.vehicle.plateNumber,
  },
  crew: dto.crew
    ? {
        driverId: dto.crew.driverId,
        driverName: dto.crew.driverName,
        agentId: dto.crew.agentId,
        agentName: dto.crew.agentName,
      }
    : undefined,
  products: dto.products.map((product) => ({
    id: product.id,
    name: product.name,
    shortName: product.shortName,
    quantities: {
      plannedQuantity: product.quantities.plannedQuantity,
      loadedQuantity: product.quantities.loadedQuantity,
      deliveredQuantity: product.quantities.deliveredQuantity,
      returnedQuantity: product.quantities.returnedQuantity,
    },
  })),
  totals: {
    taskCount: dto.totals.taskCount,
    plannedQuantity: dto.totals.plannedQuantity,
    loadedQuantity: dto.totals.loadedQuantity,
    deliveredQuantity: dto.totals.deliveredQuantity,
    returnedQuantity: dto.totals.returnedQuantity,
  },
  timestamps: {
    registeredAt: toDate(dto.timestamps.registeredAt) ?? new Date(),
    loadingStartedAt: toDate(dto.timestamps.loadingStartedAt),
    loadingCompletedAt: toDate(dto.timestamps.loadingCompletedAt),
    departedAt: toDate(dto.timestamps.departedAt),
    returnStartedAt: toDate(dto.timestamps.returnStartedAt),
    returnCompletedAt: toDate(dto.timestamps.returnCompletedAt),
    closedAt: toDate(dto.timestamps.closedAt),
  },
  comment: dto.comment,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: toDate(dto.createdAt) ?? new Date(),
  updatedAt: toDate(dto.updatedAt) ?? new Date(),
});

export const mapDeliveryRoutesDtoToEntities = (
  dtos: DeliveryRouteResponseDto[]
): DeliveryRouteResponse[] => dtos.map(mapDeliveryRouteDtoToEntity);

export const mapCreateDeliveryRouteResponseDtoToEntity = (
  dto: CreateDeliveryRouteResponseDto
): { success: boolean; deliveryRoute?: DeliveryRouteResponse; error?: ErrorDto } => {
  if ("errorCode" in dto) {
    return { success: false, error: dto };
  }

  if (!dto.success || !("deliveryRoute" in dto)) {
    return {
      success: false,
      error: {
        success: false,
        errorCode: 100,
        errorMessage: {
          ru: "Неизвестный формат ответа сервера",
          en: "Unknown server response format",
          uz: "Server javobining noma'lum formati",
        },
      },
    };
  }

  return {
    success: dto.success,
    deliveryRoute: mapDeliveryRouteDtoToEntity(dto.deliveryRoute),
  };
};

export type DeliveryRouteFormValues = {
  companyId?: string;
  schedule: {
    routeDate: string | Date | Dayjs;
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
  comment?: string;
  salesOrderIds?: string[];
};

export const mapDeliveryRouteFormToCreateDto = (
  values: DeliveryRouteFormValues,
  companyId: string
): CreateDeliveryRouteDto => {
  const routeDate = toDateString(values.schedule?.routeDate);
  const driverName = values.crew?.driverName?.trim();
  const agentName = values.crew?.agentName?.trim();
  const hasCrew =
    Boolean(values.crew?.driverId) ||
    Boolean(values.crew?.agentId) ||
    Boolean(driverName) ||
    Boolean(agentName);

  return {
    companyId,
    schedule: {
      routeDate: routeDate ?? new Date().toISOString(),
    },
    vehicle: {
      vehicleId: values.vehicle?.vehicleId,
      name: values.vehicle?.name?.trim() ?? "",
      plateNumber: values.vehicle?.plateNumber?.trim() || undefined,
    },
    crew: hasCrew
      ? {
          driverId: values.crew?.driverId,
          driverName: driverName || undefined,
          agentId: values.crew?.agentId,
          agentName: agentName || undefined,
        }
      : undefined,
    comment: values.comment?.trim() || undefined,
    salesOrders: values.salesOrderIds?.length
      ? values.salesOrderIds.map((id) => ({ salesOrderId: id }))
      : [],
  };
};
