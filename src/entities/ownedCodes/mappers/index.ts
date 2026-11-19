import type {
  GetOwnedCodesSummaryResponseDto,
  OwnedCodeRowDto,
} from "@edem2000/amis.contracts/api/codes/responses";
import type { OwnedCode, OwnedCodesSummary } from "entities/ownedCodes/types";
import type { SuccessOf } from "shared/api";

export const mapOwnedCodeDtoToEntity = (dto: OwnedCodeRowDto): OwnedCode => ({
  code: dto.code,
  gtin: dto.gtin,
  packageType: dto.packageType,
  parentCode: dto.parentCode,
  status: dto.status,
  ownerTin: dto.ownerTin,
  lastSyncedAt: dto.lastSyncedAt,
});

export const mapOwnedCodesSummaryDtoToEntity = (
  dto: SuccessOf<GetOwnedCodesSummaryResponseDto>
): OwnedCodesSummary => ({
  products: dto.products,
  unknownGtins: dto.unknownGtins,
  total: dto.total,
  freshness: dto.freshness,
});
