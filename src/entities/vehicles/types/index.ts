import type { VehicleOwnerDto, VehicleOwnershipType, VehicleStatus, VehicleType } from "entities/vehicles/dtos";

export type VehicleIdentification = {
  vin?: string;
  registrationCertificateNumber?: string;
};

export type VehicleCharacteristics = {
  brand: string;
  model: string;
  year?: number;
  loadCapacityKg?: number;
  volumeCapacityM3?: number;
};

export type VehicleOwnership = {
  regNumber: string;
  model: string;
  ownershipType: number;
  transportType: number;
};

export type VehicleOwnershipCheck =
  | { status: "found"; ownership: VehicleOwnership }
  | { status: "not-registered"; message: string };

export type Vehicle = {
  id: string;
  companyId: string;
  type: VehicleType;
  name: string;
  plateNumber: string;
  identification: VehicleIdentification;
  characteristics: VehicleCharacteristics;
  status: VehicleStatus;
  stateRegistrationModel?: string;
  ownershipType?: VehicleOwnershipType;
  owner?: VehicleOwnerDto;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type VehicleListQuery = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  query?: string;
};

export type VehiclesState = {
  vehicles: Vehicle[];
  vehicleById: Vehicle | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  loadingById: boolean;
  error: string | null;
};
