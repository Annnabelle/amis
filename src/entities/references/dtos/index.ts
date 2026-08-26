import type { Identifier, MultiLanguage } from "shared/types/dtos";

export interface BaseModel {
  id?: Identifier;
}

export interface ReferenceBookModel extends BaseModel {
  alias: string;
  transcript: string;
  title: MultiLanguage;
}

export const ReferenceBookType = {
  cisType: "cisType",
  countryCode: "countryCode",
  productGroup: "productGroup",
  releaseMethodType: "releaseMethodType",
  serialNumberType: "serialNumberType",
  orderStatus: "orderStatus",
  regions: "regions",
} as const;

export type ReferenceBookType =
  typeof ReferenceBookType[keyof typeof ReferenceBookType];


export interface GetReferenceDto {
  type: ReferenceBookType;
}


export type ReferenceDto = {
    alias: string;
    title: MultiLanguage
};

export type GetReferenceByTypeDto = {
    references: ReferenceDto[],
}

export type AddressReferenceDto = {
    id: string;
    alias: string;
    title: MultiLanguage;
};

export type GetRegionsResponseDto = {
    regions: AddressReferenceDto[];
};

export type GetDistrictsResponseDto = {
    districts: AddressReferenceDto[];
};







