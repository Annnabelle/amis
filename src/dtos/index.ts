import type { CompanyResponseDto } from "./organization";
import type { ProductResponseDto } from "./products";
import type { UserResponseDto } from "./users/login";

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
  region: string;
  district: string;
  address: string;
}

export type BankDetailsDto = {
  bankName: string;
  ccea: string;
  account: string;
  mfo: string;
}

export type ContactsDto = {
  phone: string;
  email: string;
  url: string;
  person: string;
}

export type AccessCodesDto = {
  gcpCode: string;
  omsId: string;
  turonToken: string;
}


export const CompanySortField = {
  Id: '_id',
  Name: 'name',
} as const;

export const CompanySortFields = Object.values(CompanySortField);

export type CompanySortField = typeof CompanySortField[keyof typeof CompanySortField];


export type MeasurementDto = {
  unit: string;
  amount: number;
}

export type WeightDto = {
  net: number;
  gross: number;
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
} as const;

export const AuditCategory = {
  Auth: 'auth',
  User: 'user',
  Product: 'product',
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

  // ...
} as const;

export type AuditType = typeof AuditType[keyof typeof AuditType];

type TargetResponseMap = {
  [TargetEntity.User]: UserResponseDto;
  [TargetEntity.Company]: CompanyResponseDto;
  [TargetEntity.Product]: ProductResponseDto;
};

export type TargetResponseDto = UserResponseDto | CompanyResponseDto | ProductResponseDto | null;

export type Identifier = {
  type: 'Identifier';

  toString(): string;
}

