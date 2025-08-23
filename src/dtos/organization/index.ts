import type { AccessCodesDto, AddressDto, BankDetailsDto, CompanySortField, CompanyStatus, CompanyType, ContactsDto, ErrorDto, HexString, PaginatedDto, PaginatedResponseDto } from "..";
import type { UserResponseDto } from "../users/login";

export type CompanyResponseDto = {
  id: string;
  companyType: CompanyType;
  displayName: string;
  productGroup: string;
  tin: string;
  legalName: string;
  director: string;
  address: {
    region?: string;
    district?: string;
    address?: string;
  };
  bankDetails: {
    bankName?: string;
    ccea?: string;
    account?: string;
    mfo?: string;
  };
  contacts: {
    phone?: string;
    email?: string;
    url?: string;
    person?: string;
  };
  accessCodes: {
    gcpCode?: string;
    omsId?: string;
    turonToken?: string;
  };
  status: CompanyStatus;
  deleted: boolean;
  deletedAt: Date | null;
};

export type CreateCompanyDto = {
  companyType: CompanyType;
  displayName: string;
  productGroup: string;
  tin: string;
  legalName: string;
  director: string;
  address: AddressDto;
  bankDetails: BankDetailsDto;
  contacts: ContactsDto;
  accessCodes: AccessCodesDto;
}

export type GetUserResponseDto = {
  success: boolean,
  user: UserResponseDto,
} | ErrorDto;

export type DeleteCompanyDto = {
  id: string;
}

export type DeleteCompanyResponseDto = {
  success: boolean,
} | ErrorDto;

export type GetCompanyDto = {
  id: HexString;
}

export type GetCompaniesResponseDto = {
  success: boolean;
} & PaginatedResponseDto<CompanyResponseDto> | ErrorDto;

export type SearchCompaniesDto = PaginatedDto & {
    query: string;
}

export type GetCompanyResponseDto = {
  success: boolean;
  company: CompanyResponseDto;
} | ErrorDto;

export type GetCompaniesDto = PaginatedDto & {
  status?: CompanyStatus;
  sortBy?: CompanySortField;
}

export class UpdateCompanyDto {
  companyType?: CompanyType;
  displayName?: string;
  productGroup?: string;
  tin?: string;
  legalName?: string;
  director?: string;
  address?: AddressDto;
  bankDetails?: BankDetailsDto;
  contacts?: ContactsDto;
  accessCodes?: AccessCodesDto;
  status?: CompanyStatus;
}

export type UpdateCompanyResponseDto = {
  success: boolean;
  company: CompanyResponseDto;
} | ErrorDto;