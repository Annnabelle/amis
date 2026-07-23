
import type {
  AccessCodesDto,
  AddressDto,
  BankDetailsDto,
  CompanyStatus,
  CompanyType,
  ContactsDto,
  ErrorDto,
  Identifier,
  MultiLanguage,
  PaginatedDto,
  PaginatedResponseDto,
} from "shared/types/dtos";

export type FullName = {
  first: string;
  last: string;
  middle: string;
};

export type Employee = {
  userId?: Identifier;
  tin?: string;
  pinfl?: string;
  name?: FullName;
};

export type CompanyResponseDto = {
  id: string;
  tin: string;
  displayName: string;
  name: MultiLanguage;
  legalName: string;
  responsibleEmployees: {
    director?: Employee;
    accountant?: Employee;
  };
  address: {
    region?: string;
    district?: string;
    address?: string;
  };
  bankDetails?: BankDetailsDto;
  vatCode: string | null;
  contacts: {
    phone?: string;
    email?: string;
    url?: string;
    person?: string;
  };
  status: CompanyStatus;
  deleted: boolean;
  deletedAt: Date | null;
  isTest: boolean;
};

export type CreateCompanyDto = {
  companyId: string;
};

export type ActivateCompanyResponseDto =
  | {
      success: true;
      company: CompanyResponseDto;
    }
  | ErrorDto;

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

export type GetCompanyByTinResponseDto = CompanyResponseDto;

export type UpdateCompanyResponseDto =
  | { success: boolean; company: CompanyResponseDto }
  | ErrorDto;

export type DeleteCompanyDto = {
  id: string;
};

export type DeleteCompanyResponseDto =
  | { success: boolean }
  | ErrorDto;
