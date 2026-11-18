import type {
  CompanyAddressResponseDto as AddressDto,
  CompanyBankDetailsResponseDto as BankDetailsDto,
  CompanyContactsResponseDto as ContactsDto,
  PaginatedResponseDto,
  TargetResponseDto,
} from '@edem2000/amis.contracts/api/common/responses';
import type { AccessCodesDto } from '@edem2000/amis.contracts/api/companies/requests';

export type {
  AccessCodesDto,
  AddressDto,
  BankDetailsDto,
  ContactsDto,
  PaginatedResponseDto,
  TargetResponseDto,
};

import type {
  HexString,
  MultiLanguage,
  UserPreferences,
} from '@edem2000/amis.contracts';

export type {
  HexString,
  MultiLanguage,
  UserPreferences,
};

import type {
  ErrorDto,
  PaginatedDto,
} from '@edem2000/amis.contracts/api/common/requests';

export type {
  ErrorDto,
  PaginatedDto,
};

import {
  Actor,
  AllLanguages,
  AggregationReportExternalStatus,
  AggregationReportStatus,
  AppTheme,
  AuditCategory,
  AuditType,
  BatchStatus,
  CompanySortField,
  CompanyStatus,
  CompanyType,
  DeliveryRouteStatus,
  DeliveryTaskStatus,
  ExternalBatchStatus,
  ExternalOrderStatus,
  Language,
  MarkingCodeExternalStatus,
  MarkingCodeStatus,
  PackageType,
  ProductSortField,
  ProductStatus,
  SalesOrderPaymentMethod,
  SalesOrderPriorities,
  SalesOrderPriority,
  SalesOrderStatus,
  TargetEntity,
  UserSortField,
  UserStatus,
  UtilizationReportExternalStatus,
  UtilizationReportStatus,
} from '@edem2000/amis.contracts'

export {
  Actor,
  AllLanguages,
  AggregationReportExternalStatus,
  AggregationReportStatus,
  AppTheme,
  AuditCategory,
  AuditType,
  BatchStatus,
  CompanySortField,
  CompanyStatus,
  CompanyType,
  DeliveryRouteStatus,
  DeliveryTaskStatus,
  ExternalBatchStatus,
  ExternalOrderStatus,
  Language,
  MarkingCodeExternalStatus,
  MarkingCodeStatus,
  PackageType,
  ProductSortField,
  ProductStatus,
  SalesOrderPaymentMethod,
  SalesOrderPriorities,
  SalesOrderPriority,
  SalesOrderStatus,
  TargetEntity,
  UserSortField,
  UserStatus,
  UtilizationReportExternalStatus,
  UtilizationReportStatus,
}


export const isLanguage = (value: string): value is Language =>
  (AllLanguages as string[]).includes(value);


export type Identifier = {
  type: 'Identifier';

  toString(): string;
}

