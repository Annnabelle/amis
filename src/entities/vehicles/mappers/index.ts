import type { VehicleResponseDto } from "entities/vehicles/dtos";
import type { Vehicle } from "entities/vehicles/types";

const toDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  return value instanceof Date ? value : new Date(value);
};

export const mapVehicleDtoToEntity = (dto: VehicleResponseDto): Vehicle => ({
  id: dto.id,
  companyId: dto.companyId,
  type: dto.type,
  name: dto.displayName,
  plateNumber: dto.plateNumber,
  identification: dto.identification,
  characteristics: dto.characteristics,
  status: dto.status,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: toDate(dto.createdAt),
  updatedAt: toDate(dto.updatedAt),
});
