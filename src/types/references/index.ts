import type { Identifier, MultiLanguage } from "../../dtos";

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
} as const;

export type ReferenceBookType =
  typeof ReferenceBookType[keyof typeof ReferenceBookType];


export interface GetReferenceDto {
  type: ReferenceBookType;
}

export type Reference = {
    alias: string;
    title: MultiLanguage
};

export type GetReferenceByTypeResponse = {
    references: Reference[],
}
