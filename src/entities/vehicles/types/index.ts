import type { VehicleOwnerDto } from '@edem2000/amis.contracts/api/vehicle/requests';
import type { VehicleOwnershipType, VehicleStatus, VehicleType } from '@edem2000/amis.contracts';
import type { Paginated } from 'shared/api';

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

export type VehicleList = Paginated<Vehicle>;
