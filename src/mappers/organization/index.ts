import type { CompanyResponseDto, CreateCompanyDto, UpdateCompanyDto } from "../../dtos/organization";
import type { CompanyResponse, CreateCompany, UpdateCompany } from "../../types/organization";


export function mapCreateUserToCreateUserDto(form: CreateCompany ) : CreateCompanyDto {
    return {
        companyType: form.companyType,
        displayName: form.displayName,
        productGroup: form.productGroup,
        tin: form.tin,
        legalName: form.legalName,
        director: form.director,
        address: form.address,
        bankDetails: form.bankDetails,
        contacts: form.contacts,
        accessCodes: form.accessCodes
    }
}

export const mapOrganizationDtoToEntity = (dto: CompanyResponseDto): CompanyResponse => ({
  id: dto.id,
  companyType: dto.companyType,
  displayName: dto.displayName,
  productGroup: dto.productGroup,
  tin: dto.tin,
  legalName: dto.legalName,
  director: dto.director,
  address: dto.address ? {
    region: dto.address.region,
    district: dto.address.district,
    address: dto.address.address
  } : {},
  bankDetails: dto.bankDetails ? {
    bankName: dto.bankDetails.bankName,
    ccea: dto.bankDetails.ccea,
    account: dto.bankDetails.account,
    mfo: dto.bankDetails.mfo
  } : {},
  contacts: dto.contacts ? {
    phone: dto.contacts.phone,
    email: dto.contacts.email,
    url: dto.contacts.url,
    person: dto.contacts.person
  } : {},
  accessCodes: dto.accessCodes ? {
    gcpCode: dto.accessCodes.gcpCode,
    omsId: dto.accessCodes.omsId,
    turonToken: dto.accessCodes.turonToken
  } : {},
  deleted: dto.deleted,
  status: dto.status,
  deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
});

export const mapUpdateOrganizationDtoToEntity = (dto: UpdateCompanyDto) : UpdateCompany => ({
  companyType: dto.companyType,
  displayName: dto.displayName,  
  productGroup: dto.productGroup,
  tin: dto.tin,
  legalName: dto.legalName,
  director: dto.director,
  address: dto.address ? {
    region: dto.address.region,
    district: dto.address.district,
    address: dto.address.address
  }: undefined,
  bankDetails: dto.bankDetails ? {
    bankName: dto.bankDetails.bankName,
    ccea: dto.bankDetails.ccea,
    account: dto.bankDetails.account,
    mfo: dto.bankDetails.mfo,
  }: undefined,
  contacts: dto.contacts ? {
    phone: dto.contacts.phone,
    email: dto.contacts.email,
    url: dto.contacts.url,
    person: dto.contacts.person,
  }: undefined,
  accessCodes: dto.accessCodes ? {
    gcpCode: dto.accessCodes.gcpCode,
    omsId: dto.accessCodes.omsId,
    turonToken: dto.accessCodes.turonToken,
  }: undefined,
  status: dto.status,
})


export const mapCompanyResponseDtoToEntity = (dto: CompanyResponseDto): UpdateCompany => ({
  companyType: dto.companyType,
  displayName: dto.displayName,
  productGroup: dto.productGroup,
  tin: dto.tin,
  legalName: dto.legalName,
  director: dto.director,
  address: dto.address ? {
    region: dto.address.region ?? "",
    district: dto.address.district ?? "",
    address: dto.address.address ?? ""
  } : undefined,
  bankDetails: dto.bankDetails ? {
    bankName: dto.bankDetails.bankName ?? "",
    ccea: dto.bankDetails.ccea ?? "",
    account: dto.bankDetails.account ?? "",
    mfo: dto.bankDetails.mfo ?? "",
  } : undefined,
  contacts: dto.contacts ? {
    phone: dto.contacts.phone ?? "",
    email: dto.contacts.email ?? "",
    url: dto.contacts.url ?? "",
    person: dto.contacts.person ?? "",
  } : undefined,
  accessCodes: dto.accessCodes ? {
    gcpCode: dto.accessCodes.gcpCode ?? "",
    omsId: dto.accessCodes.omsId ?? "",
    turonToken: dto.accessCodes.turonToken ?? "",
  } : undefined,
  status: dto.status,
});
