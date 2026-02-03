
import type {
  AccessCodesDto,
  AddressDto,
  BankDetailsDto,
  CompanyStatus,
  CompanyType,
  ContactsDto,
  ErrorDto,
  MultiLanguage,
  PaginatedDto,
  PaginatedResponseDto,
} from "shared/types/dtos";

export type CompanyResponseDto = {
  id: string;
  tin: string;
  companyType?: CompanyType;
  displayName: string;
  name: MultiLanguage;
  legalName: MultiLanguage;
  productGroups: string[];
  director: string;
  address?: AddressDto;
  bankDetails?: BankDetailsDto;
  contacts?: ContactsDto;
  accessCodes: AccessCodesDto;
  businessPlaceId: number;
  status: CompanyStatus;
  deleted: boolean;
  deletedAt: Date | string | null;
  isTest: boolean;
};

export type CreateCompanyDto = {
  companyType: CompanyType;
  displayName: string;
  name: MultiLanguage;
  legalName: MultiLanguage;
  tin: string;
  productGroups: string[];
  isTest: boolean;
  businessPlaceId: number;
  director?: string;
  address?: AddressDto;
  bankDetails?: BankDetailsDto;
  contacts?: ContactsDto;
  accessCodes?: AccessCodesDto;
};

export type UpdateCompanyDto = {
  companyType?: CompanyType;
  displayName?: string;
  productGroup?: string;
  tin?: string;
  director?: string;
  address?: AddressDto;
  bankDetails?: BankDetailsDto;
  contacts?: ContactsDto;
  accessCodes?: AccessCodesDto;
  status?: CompanyStatus;
};

export type GetCompaniesDto = PaginatedDto & {
  status?: CompanyStatus;
};

export type GetCompaniesResponseDto =
  | ({ success: boolean } & PaginatedResponseDto<CompanyResponseDto>)
  | ErrorDto;

export type GetCompanyDto = {
  id: string;
};

export type GetCompanyResponseDto =
  | { success: boolean; company: CompanyResponseDto }
  | ErrorDto;

export type UpdateCompanyResponseDto =
  | { success: boolean; company: CompanyResponseDto }
  | ErrorDto;

export type DeleteCompanyDto = {
  id: string;
};

export type DeleteCompanyResponseDto =
  | { success: boolean }
  | ErrorDto;
