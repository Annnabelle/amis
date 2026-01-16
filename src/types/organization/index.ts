import type {
  AccessCodesDto,
  AddressDto,
  BankDetailsDto,
  CompanyStatus,
  CompanyType,
  ContactsDto,
  MultiLanguage
} from "../../dtos";

export type CompanyResponse = {
  id: string;
  tin: string;
  // companyType: CompanyType;
  displayName: string;
  name: MultiLanguage;
  legalName: MultiLanguage;
  productGroups: string[];
  director: string;
  address: {
    region?: string;
    district?: string;
    address?: string;
  };
  bankDetails?: {
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
    xTrace: {
      id?: string;
      token: string;
      expireDate: string; //ISO 8601
      updateDate?: string; //ISO 8601
    };
  };
  status: CompanyStatus;
  deleted: boolean;
  deletedAt: Date | null;
  isTest: boolean;
};

export type CreateCompany = {
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

export class UpdateCompany {
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
}

export type OrganizationState = {
  organization: CompanyResponse | null,
  organizationById: CompanyResponse | null,
  updateOrganization: CompanyResponse | null,
  organizations: CompanyResponse[],
  total: number,
  page: number,
  limit: number,
  isLoading: boolean,
  error: string | null,
  status: string | null,
};
