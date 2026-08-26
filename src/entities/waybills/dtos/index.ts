import type { ErrorDto, HexString, PaginatedDto, PaginatedResponseDto } from "shared/types/dtos";

export type ISODateString = string;

export const WaybillStatus = {
  Draft: "draft",
  Ready: "ready",
  Sending: "sending",
  Sent: "sent",
  Registered: "registered",
  Rejected: "rejected",
  SendFailed: "send_failed",
  Cancelled: "cancelled",
} as const;

export type WaybillStatus = (typeof WaybillStatus)[keyof typeof WaybillStatus];

export const WaybillExternalStatus = {
  Sent: "Sent",
  AwaitCounterparty: "AwaitCounterparty",
  AwaitAction: "AwaitAction",
  AwaitAgreement: "AwaitAgreement",
  AwaitSign: "AwaitSign",
  AwaitThirdSide: "AwaitThirdSide",
  AwaitResponsiblePerson: "AwaitResponsiblePerson",
  AwaitResponsiblePersonAccepted: "AwaitResponsiblePersonAccepted",
  Registered: "Registered",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
  Returned: "Returned",
  Deleted: "Deleted",
  Unknown: "Unknown",
} as const;

export type WaybillExternalStatus =
  (typeof WaybillExternalStatus)[keyof typeof WaybillExternalStatus];

export const SalesOrderDeliveryType = {
  WarehouseToWarehouse: "warehouse_to_warehouse",
  SellerToBuyer: "seller_to_buyer",
  ProcessingTransfer: "processing_transfer",
} as const;

export type SalesOrderDeliveryType =
  (typeof SalesOrderDeliveryType)[keyof typeof SalesOrderDeliveryType];

export const WaybillTransportType = {
  Road: "road",
  Air: "air",
  Rail: "rail",
  Water: "water",
} as const;

export type WaybillTransportType =
  (typeof WaybillTransportType)[keyof typeof WaybillTransportType];

export const WaybillWeightSource = {
  ProductLogistics: "ProductLogistics",
  Measured: "Measured",
  Manual: "Manual",
  Estimated: "Estimated",
} as const;

export type WaybillWeightSource =
  (typeof WaybillWeightSource)[keyof typeof WaybillWeightSource];

export const WaybillSortField = {
  Id: "_id",
  WaybillNumber: "waybillNumber",
  Date: "date",
  Status: "status",
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
} as const;

export type WaybillSortField =
  (typeof WaybillSortField)[keyof typeof WaybillSortField];

export type WaybillContractResponseDto = {
  number: string;
  date: ISODateString;
};

export type WaybillDeliveryResponseDto = {
  type: SalesOrderDeliveryType;
  costPerDistanceUnit?: number;
  totalDistance?: number;
  totalCost?: number;
};

export type WaybillCompanySnapshotResponseDto = {
  tin: string;
  legalName: string;
  vatCode?: string | null;
  address: {
    street: string;
  };
  phone?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    bankCode: string;
    activityCode?: string;
  };
};

export type WaybillPartySnapshotResponseDto = {
  tinOrPinfl: string;
  name: string;
  branch?: {
    code?: string;
    name?: string;
  };
};

export type WaybillContractedPartySnapshotResponseDto =
  WaybillPartySnapshotResponseDto & {
    contract?: WaybillContractResponseDto;
  };

export type WaybillPartiesResponseDto = {
  sender: WaybillCompanySnapshotResponseDto;
  receiver: {
    tin: string;
  };
  consignor: WaybillPartySnapshotResponseDto;
  consignee: WaybillPartySnapshotResponseDto;
  carrier: WaybillPartySnapshotResponseDto;
  freightForwarder?: WaybillPartySnapshotResponseDto;
  client?: WaybillContractedPartySnapshotResponseDto;
  payer?: WaybillContractedPartySnapshotResponseDto;
};

export type WaybillPersonSnapshotResponseDto = {
  pinfl?: string;
  fullName: string;
  position?: string;
};

export type WaybillSignersResponseDto = {
  approver: WaybillPersonSnapshotResponseDto;
  director: WaybillPersonSnapshotResponseDto;
  accountant: WaybillPersonSnapshotResponseDto;
};

export type WaybillDriverSnapshotResponseDto = {
  driverId: string;
  pinfl?: string;
  fullName: string;
};

export type WaybillVehicleSnapshotResponseDto = {
  vehicleId?: string;
  registrationNumber: string;
  model: string;
};

export type WaybillTransportSnapshotResponseDto = {
  type: WaybillTransportType;
  driver: WaybillDriverSnapshotResponseDto;
  truck: WaybillVehicleSnapshotResponseDto;
  trailer?: WaybillVehicleSnapshotResponseDto;
  carriages?: WaybillVehicleSnapshotResponseDto[];
};

export type WaybillLocationSnapshotResponseDto = {
  regionCode: string;
  regionName: string;
  districtCode: string;
  districtName: string;
  mahallaId?: string;
  mahallaName?: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type WaybillCargoGroupTotalsResponseDto = {
  deliverySum?: number;
  grossWeight?: number;
  netWeight?: number;
};

export type WaybillMeasurementUnitResponseDto = {
  name: string;
  code: string;
};

export type WaybillCatalogSnapshotResponseDto = {
  code: string;
  name: string;
};

export type WaybillProductWeightResponseDto = {
  gross?: number;
  net?: number;
  source?: WaybillWeightSource;
};

export type WaybillCargoProductResponseDto = {
  number: number;
  productId: string;
  title: string;
  measurementUnit?: WaybillMeasurementUnitResponseDto;
  quantity: number;
  pricePerItem?: number;
  deliveryCost?: number;
  weight?: WaybillProductWeightResponseDto;
  catalog: WaybillCatalogSnapshotResponseDto;
};

export type WaybillCargoGroupResponseDto = {
  loadingPoint: WaybillLocationSnapshotResponseDto;
  unloadingPoint: WaybillLocationSnapshotResponseDto;
  loadingTrustee?: WaybillPersonSnapshotResponseDto;
  unloadingTrustee?: WaybillPersonSnapshotResponseDto;
  products: WaybillCargoProductResponseDto[];
  totals: WaybillCargoGroupTotalsResponseDto;
};

export type WaybillTotalsResponseDto = {
  deliveryCost?: number;
  grossWeight?: number;
  netWeight?: number;
};

export type WaybillExternalResponseDto = {
  provider: "Faktura";
  id?: string;
  status?: WaybillExternalStatus;
  sentAt?: ISODateString;
  registeredAt?: ISODateString;
  error?: {
    code?: string;
    message: string;
  };
  document?: {
    fileName: string;
    programVersion: string;
    formatVersion: string;
  };
};

export type WaybillResponseDto = {
  id: string;
  companyId: string;
  deliveryRouteId: string;
  deliveryTaskId: string;
  salesOrderId: string;
  waybillNumber: string;
  date: ISODateString;
  status: WaybillStatus;
  contract: WaybillContractResponseDto;
  delivery: WaybillDeliveryResponseDto;
  parties: WaybillPartiesResponseDto;
  responsiblePerson: WaybillPersonSnapshotResponseDto;
  transport: WaybillTransportSnapshotResponseDto;
  cargoGroups: WaybillCargoGroupResponseDto[];
  signers: WaybillSignersResponseDto;
  totals: WaybillTotalsResponseDto;
  external: WaybillExternalResponseDto;
  updatedBy: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type GetWaybillsDto = Partial<PaginatedDto> & {
  sortBy?: WaybillSortField;
  companyId?: HexString;
  deliveryRouteId?: HexString;
  deliveryTaskId?: HexString;
  status?: WaybillStatus;
  waybillNumber?: string;
  dateFrom?: ISODateString;
  dateTo?: ISODateString;
};

export type GetWaybillDto = {
  id: HexString;
};

export type GetWaybillsResponseDto =
  | PaginatedResponseDto<WaybillResponseDto>
  | ({ success: boolean } & PaginatedResponseDto<WaybillResponseDto>)
  | ErrorDto;

export type GetWaybillResponseDto =
  | WaybillResponseDto
  | {
      success: boolean;
      waybill: WaybillResponseDto;
    }
  | ErrorDto;
