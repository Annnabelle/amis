import type { CompanyResponseDto } from "entities/organization/dtos";
import type { ProductResponseDto } from "entities/products/dtos";
import type { UserResponseDto } from "entities/users/dtos/login";
import type {OrderResponseDto} from "entities/markingCodes/dtos";

export type HexString = string;

export const Language = {
  Russian: 'ru',
  English: 'en',
  Uzbek: 'uz',
} as const;

export const AllLanguages = Object.values(Language);

export const isLanguage = (value: string): value is Language =>
  (AllLanguages as string[]).includes(value);

export type Language = (typeof Language)[keyof typeof Language];

export type MultiLanguage = Record<Language, string>;

export type ErrorDto = {
  success: boolean,
  errorMessage: MultiLanguage,
  errorCode: number,
}

export const UserStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export const UserStatuses = Object.values(UserStatus);

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];


export type PaginatedResponseDto<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type PaginatedDto = {
  page: number;
  limit: number;
  sortOrder: 'asc' | 'desc';
}

export const UserSortField = {
  Id: '_id',
  Name: 'name',
  Email: 'email',
  Phone: 'phone',
} as const;

export const UserSortFields = Object.values(UserSortField);

export type UserSortField = typeof UserSortField[keyof typeof UserSortField];

export const CompanyStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export const CompanyStatuses = Object.values(CompanyStatus);

export type CompanyStatus = typeof CompanyStatus[keyof typeof CompanyStatus];

export const CompanyType = {
  Type1: "type1",
  Inactive: "inactive",
} as const;

export const CompanyTypes = Object.values(CompanyType);

export type CompanyType = typeof CompanyType[keyof typeof CompanyType];

export type AddressDto = {
  region?: string;
  district?: string;
  address?: string;
}

export type BankDetailsDto = {
  bankName?: string;
  ccea?: string;
  account?: string;
  mfo?: string;
}

export type ContactsDto = {
  phone?: string;
  email?: string;
  url?: string;
  person?: string;
}

export type XTraceTokenData = {
  id?: string;
  token: string;
  expireDate: string | Date;
  updateDate?: string;
}

export type AccessCodesDto = {
  gcpCode?: string;
  xTrace: XTraceTokenData;
}


export const CompanySortField = {
  Id: '_id',
  Name: 'name',
} as const;

export const CompanySortFields = Object.values(CompanySortField);

export type CompanySortField = typeof CompanySortField[keyof typeof CompanySortField];


export type MeasurementDto = {
  unit?: string;
  amount?: number;
}

export type WeightDto = {
  net?: number;
  gross?: number;
}

export const ProductStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export const ProductStatuses = Object.values(ProductStatus);

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export const ProductSortField = {
  Id: '_id',
  Name: 'name',
  Gtin: 'gtin',
  Price: 'price',
} as const;

export const ProductSortFields = Object.values(ProductSortField);

export type ProductSortField = typeof ProductSortField[keyof typeof ProductSortField];

export type Actor = {
  User: "user",
  System: "system",
} ;

export type TargetEntity = {
  User: "user",
  Company: "company",
  Product: "product",
};

export const TargetEntity = {
  User: "user",
  Company: "company",
  Product: "product",
  MarkingCodeOrder: "markingCodeOrder",
} as const;

export const AuditCategory = {
  Auth: 'auth',
  User: 'user',
  Product: 'product',
  Order: 'order',
  Company: 'company',
} as const;

export type AuditCategory = typeof AuditCategory[keyof typeof AuditCategory];

export const AuditType = {
  Login: 'login',
  Logout: 'logout',
  UserRegistration: 'userRegistration',
  PasswordChange: 'passwordChange',
  UserDelete: 'userDelete',
  UserUpdate: 'userUpdate',
  AssignCompanyToUser: 'assignCompanyToUser',
  UnassignCompanyFromUser: 'unassignCompanyFromUser',

  ProductCreate: 'productCreate',
  ProductUpdate: 'productUpdate',
  ProductDelete: 'productDelete',

  // ...

  CompanyCreate: 'companyCreate',
  CompanyUpdate: 'companyUpdate',
  CompanyDelete: 'companyDelete',

  OrderCreate: 'orderCreate',
  OrderStatusChanged: 'orderStatusChanged',
  OrderBatchStatusChanged: 'orderBatchStatusChanged',
  OrderCodesRegistered: 'orderCodesRegistered',
  OrderCodesUtilized: 'orderCodesUtilized',
  OrderReportCreated: 'orderReportCreated',
  OrderClosed: 'orderClosed',
  OrderRejected: 'orderRejected',

  // ...
} as const;

export type AuditType = typeof AuditType[keyof typeof AuditType];

export type TargetResponseDto = UserResponseDto | CompanyResponseDto | ProductResponseDto | OrderResponseDto | null;

export type Identifier = {
  type: 'Identifier';

  toString(): string;
}


export const AvailablePackageType = {
  Unit: "unit",
  Group: "group",
  BoxLv1: "box_lv_1",
  BoxLv2: "box_lv_2",
} as const;

export type AvailablePackageType = (typeof AvailablePackageType)[keyof typeof AvailablePackageType];



export const UtilizationReportStatus = {
  New: "new",
  Requested: 'requested',
  Created: "created",
  Validating: "validating",
  InProgress: "in_process",
  PartiallyProcessed: "partially_processed",
  Success: "success",
  Error: "error",
} as const;

export type UtilizationReportStatus = (typeof UtilizationReportStatus)[keyof typeof UtilizationReportStatus];

export const UtilizationReportExternalStatus = {
  Created: "CREATED", // Создан
  Validating: "VALIDATING", // Проверяется
  InProgress: "IN_PROCESS", // Обрабатывается
  PartiallyProcessed: "PARTIALLY_PROCESSED", // Обработан частично (по одному или нескольким кодам выполнение операции было отклонено)
  Success: "SUCCESS", // Обработан полностью (операции выполнены по всемкодам)
  Error: "ERROR", // Отклонен (операции по кодам не выполнялись)
} as const;

export type UtilizationReportExternalStatus = (typeof UtilizationReportExternalStatus)[keyof typeof UtilizationReportExternalStatus];


export const MarkingCodeStatus = {
  // trash
  Uploaded: 'UPLOADED',
  Aggregated: 'AGGREGATED',


  // actual
  Received: "RECEIVED", // Получен
  Applied: "APPLIED", // Нанесен
  Introduced: "INTRODUCED", // В обороте
  Withdrawn: "WITHDRAWN", // Выведен из оборота
  WrittenOff: "WRITTEN_OFF", // Списан

} as const;
export type MarkingCodeStatus = typeof MarkingCodeStatus[keyof typeof MarkingCodeStatus];

export const MarkingCodeState = {
  Used: 'used',
  NotUsed: 'notUsed',
} as const;
export type MarkingCodeState = typeof MarkingCodeState[keyof typeof MarkingCodeState];


export const BatchStatus = {
  New: "new",
  Created: 'created',
  VendorPending: 'vendor_pending',
  ReadyForCodes: 'ready_for_codes',
  CodesReceived: 'codes_received',
  CodesUtilizationRequested: 'codes_utilization_requested',
  CodesUtilized: 'codes_utilized',
  CodesAggregated: 'codes_aggregated',
  Rejected: 'rejected',
  Closed: 'closed',
  Error: 'error',
} as const;

export type BatchStatus = typeof BatchStatus[keyof typeof BatchStatus];

export const ExternalBatchStatus = {
  Pending: "PENDING",
  Active: "ACTIVE",
  Exhausted: "EXHAUSTED",
  Rejected: "REJECTED",
  Closed: "CLOSED",
} as const;

export type ExternalBatchStatus = typeof ExternalBatchStatus[keyof typeof ExternalBatchStatus];

export const ExternalOrderStatus = {
  Created: "CREATED",
  Pending: "PENDING",
  Ready: "READY",
  Rejected: "REJECTED",
  Closed: "CLOSED",
  Outsourced: "OUTSOURCED",
} as const;

export type ExternalOrderStatus = typeof ExternalOrderStatus[keyof typeof ExternalOrderStatus];

export const AggregationReportExternalStatus = {
  Created: "CREATED", // Создан
  Validating: "VALIDATING", // Проверяется
  InProgress: "IN_PROCESS", // Обрабатывается
  Success: "SUCCESS", // Обработан полностью
  Error: "ERROR", // Отклонен
} as const;

export type AggregationReportExternalStatus = (typeof AggregationReportExternalStatus)[keyof typeof AggregationReportExternalStatus];

export const AggregationReportStatus = {
  New: "new",
  Requested: 'requested',
  VendorPending: "vendor_pending",
  PartiallyProcessed: 'partially_processed',
  Success: "success",
  Error: "error",
} as const;

export type AggregationReportStatus = (typeof AggregationReportStatus)[keyof typeof AggregationReportStatus];



