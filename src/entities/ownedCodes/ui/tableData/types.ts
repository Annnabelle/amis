import type { CodeExternalStatus, PackageType } from "entities/ownedCodes/types";

export type OwnedCodesTableDataType = {
  key: string;
  code: string;
  gtin: string;
  packageType: PackageType;
  parentCode: string;
  status?: CodeExternalStatus;
  lastSyncedAt: string;
};
