import type { ErrorDto, PaginatedDto, PaginatedResponseDto } from "shared/types/dtos";

export type VehicleResponseDto = {
  id: string;
  companyId: string;
  type: VehicleType;
  plateNumber: string;
  displayName: string;
  identification: VehicleIdentificationDto;
  characteristics: VehicleCharacteristicsDto;
  status: VehicleStatus;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type GetVehiclesDto = Partial<PaginatedDto> & {
  query?: string;
  type?: VehicleType;
  status?: VehicleStatus;
};

export const VehicleType = {
  Sedan: "sedan",
  Van: "van",
  Truck: "truck",
  SemiTruck: "semi_truck",
  Pickup: "pickup",
  Other: "other",
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleStatus = {
  Active: "active",
  Maintenance: "maintenance",
  OutOfService: "out_of_service",
  Archived: "archived",
} as const;

export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus];

export type VehicleIdentificationDto = {
  vin?: string;
  registrationCertificateNumber?: string;
};

export type VehicleCharacteristicsDto = {
  brand: string;
  model: string;
  year?: number;
  loadCapacityKg?: number;
  volumeCapacityM3?: number;
};

export type CreateVehicleDto = {
  companyId: string;
  type: VehicleType;
  plateNumber: string;
  displayName: string;
  identification?: VehicleIdentificationDto;
  characteristics: VehicleCharacteristicsDto;
};

export type UpdateVehicleDto = Partial<Omit<CreateVehicleDto, "companyId">> & {
  status?: VehicleStatus;
};

export type VehiclesResponseDto =
  | ({
      success: boolean;
    } & PaginatedResponseDto<VehicleResponseDto>)
  | {
      success: boolean;
      data: VehicleResponseDto[];
    }
  | {
      success: boolean;
      vehicles: VehicleResponseDto[];
    }
  | ErrorDto;

export type VehicleResponseEnvelopeDto =
  | {
      success: boolean;
      data: VehicleResponseDto;
    }
  | {
      success: boolean;
      vehicle: VehicleResponseDto;
    }
  | {
      success: boolean;
      transport: VehicleResponseDto;
    }
  | ErrorDto;

export type DeleteVehicleResponseDto =
  | {
      success: boolean;
    }
  | ErrorDto;
