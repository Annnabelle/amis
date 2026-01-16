import {
  type CompanyResponseDto,
  UpdateCompanyDto,
} from "../../dtos/organization";
import {type CompanyResponse, UpdateCompany} from "../../types/organization";

export const mapOrganizationDtoToEntity = (dto: CompanyResponseDto): CompanyResponse => ({
  id: dto.id,
  tin: dto.tin,
  displayName: dto.displayName,
  name: {
    ru: dto.name.ru,
    en: dto.name.en,
    uz: dto.name.uz
  },
  legalName: {
    ru: dto.legalName.ru,
    en: dto.legalName.en,
    uz: dto.legalName.uz
  },
  productGroups: dto.productGroups,
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
  accessCodes: {
    gcpCode: dto.accessCodes.gcpCode,
    xTrace: {
      id: dto.accessCodes.xTrace.id,
      token: dto.accessCodes.xTrace.token,
      expireDate: dto.accessCodes.xTrace.expireDate,
      updateDate: dto.accessCodes.xTrace.updateDate
    }
  },
  status: dto.status,
  deleted: dto.deleted,
  deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
  isTest: dto.isTest
});

export const mapUpdateCompanyResponseToUpdateEntity = (
    dto: UpdateCompany
): UpdateCompanyDto => {
  const result: UpdateCompanyDto = {};

  // Поля, которые почти всегда приходят
  if (dto.displayName !== undefined) result.displayName = dto.displayName;
  if (dto.tin !== undefined)         result.tin         = dto.tin;
  if (dto.director !== undefined)    result.director    = dto.director;
  if (dto.status !== undefined)      result.status      = dto.status;

  // companyType — если оно есть в ответе
  if ("companyType" in dto) {
    result.companyType = (dto as any).companyType;
  }

  // productGroup — предполагаем, что берём первый элемент, если массив
  if (dto.productGroup) {
    result.productGroup = dto.productGroup;
  }

  // Вложенные объекты — только если они существуют
  if (dto.address) {
    result.address = {
      region:  dto.address.region  ?? "",
      district: dto.address.district ?? "",
      address:  dto.address.address  ?? "",
    };
  }

  if (dto.bankDetails) {
    result.bankDetails = {
      bankName: dto.bankDetails.bankName ?? "",
      ccea:     dto.bankDetails.ccea     ?? "",
      account:  dto.bankDetails.account  ?? "",
      mfo:      dto.bankDetails.mfo      ?? "",
    };
  }

  if (dto.contacts) {
    result.contacts = {
      phone:  dto.contacts.phone  ?? "",
      email:  dto.contacts.email  ?? "",
      url:    dto.contacts.url    ?? "",
      person: dto.contacts.person ?? "",
    };
  }

  if (dto.accessCodes) {
    result.accessCodes = {
      gcpCode: dto.accessCodes.gcpCode ?? "",
      xTrace:
          {
            id:         dto.accessCodes.xTrace.id,
            token:      dto.accessCodes.xTrace.token,
            expireDate: new Date(dto.accessCodes.xTrace.expireDate),
          }
    };
  }

  return result;
};

export const mapCreateOrganizationDtoToEntity = (dto: CompanyResponseDto): CompanyResponse => ({
  id: dto.id,
  tin: dto.tin,
  displayName: dto.displayName ?? "",
  name: {
    ru: dto.name?.ru ?? "",
    en: dto.name?.en ?? "",
    uz: dto.name?.uz ?? ""
  },
  legalName: {
    ru: dto.legalName?.ru ?? "",
    en: dto.legalName?.en ?? "",
    uz: dto.legalName?.uz ?? ""
  },
  productGroups: dto.productGroups ?? [],
  director: dto.director ?? "",
  address: dto.address ? {
    region: dto.address.region ?? "",
    district: dto.address.district ?? "",
    address: dto.address.address ?? ""
  } : {},
  bankDetails: dto.bankDetails ? {
    bankName: dto.bankDetails.bankName ?? "",
    ccea: dto.bankDetails.ccea ?? "",
    account: dto.bankDetails.account ?? "",
    mfo: dto.bankDetails.mfo ?? ""
  } : {},
  contacts: dto.contacts ? {
    phone: dto.contacts.phone ?? "",
    email: dto.contacts.email ?? "",
    url: dto.contacts.url ?? "",
    person: dto.contacts.person ?? ""
  } : {},
  accessCodes: {
    gcpCode: dto.accessCodes?.gcpCode ?? "",
    xTrace: {
      id: dto.accessCodes?.xTrace?.id ?? "",
      token: dto.accessCodes?.xTrace?.token ?? "",
      expireDate: dto.accessCodes?.xTrace?.expireDate ?? "",
      updateDate: dto.accessCodes?.xTrace?.updateDate ?? ""
    }
  },
  status: dto.status ?? "",
  deleted: dto.deleted ?? false,
  deletedAt: dto.deletedAt ? new Date(dto.deletedAt) : null,
  isTest: dto.isTest ?? false
});


