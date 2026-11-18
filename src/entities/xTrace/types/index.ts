import type {
  CompanyFakturaUzIntegrationStatus,
  CompanyXTraceIntegrationStatus,
} from '@edem2000/amis.contracts';

export type {
  CompanyFakturaUzIntegrationStatus,
  CompanyXTraceIntegrationStatus,
};

import type { HexString, MultiLanguage } from "shared/types/dtos";

export type ValidateCompanyXTraceToken = {
    tin: string;
    token: string;
};

export type XTraceTokenValidation = {
    expireDate: string;
    isTest: boolean;
    name: MultiLanguage;
    fullName: MultiLanguage;
    productGroups: string[];
};

export type ValidateCompanyXTraceIntegrationToken = {
    companyId: HexString;
    token: string;
};

export type XTraceIntegrationTokenValidation = XTraceTokenValidation;

export type CreateCompanyXTraceIntegration = {
    companyId: HexString;
    token: string;
    businessPlaceId: number;
};

export type UpdateCompanyXTraceIntegration = CreateCompanyXTraceIntegration;

export type CompanyXTraceIntegration = {
    id: string;
    companyId: HexString;
    status: CompanyXTraceIntegrationStatus;
    tokenInfo: {
        tokenId?: string;
        token: string;
        expireDate: string;
        updateDate?: string;
    };
    productGroups: string[];
    businessPlaceId: number;
    isTest: boolean;
    productsSynchronizedAt: string | null;
    lastSynchronizedAt: string | null;
    createdAt: string;
};

export type CreateCompanyFakturaUzIntegration = {
    companyId: HexString;
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
};

export type CompanyFakturaUzIntegration = {
    id: string;
    companyId: HexString;
    status: CompanyFakturaUzIntegrationStatus;
    credentials: {
        username: string;
        password: string;
        clientId: string;
        clientSecret: string;
    };
    isTest: boolean;
    createdAt: string;
};
