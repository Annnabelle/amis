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

