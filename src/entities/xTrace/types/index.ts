import type { ErrorDto, HexString, MultiLanguage } from "shared/types/dtos";

export type ValidateCompanyXTraceToken = {
    tin: string;
    token: string;
};

export type ValidateCompanyXTraceTokenResponse =
    | {
        success: false;
        data: {
            isTokenValid: false;
        };
    }
    | {
        success: true;
        data: {
            isTokenValid: true;
            expireDate: string;
            isTest: boolean;
            name: MultiLanguage;
            fullName: MultiLanguage;
            productGroups: string[];
        };
    }
    | ErrorDto;

export type ValidateCompanyXTraceIntegrationToken = {
    companyId: HexString;
    token: string;
};

export type ValidateCompanyXTraceIntegrationTokenResponse =
    | {
        success: true;
        data: {
            isTokenValid: true;
            expireDate: string;
            isTest: boolean;
            name: MultiLanguage;
            fullName: MultiLanguage;
            productGroups: string[];
        };
    }
    | ErrorDto;

export type CreateCompanyXTraceIntegration = {
    companyId: HexString;
    token: string;
    businessPlaceId: number;
};

export type CompanyXTraceIntegrationStatus = string;

export type CompanyXTraceIntegrationResponse = {
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

export type CompanyFakturaUzIntegrationStatus = string;

export type CompanyFakturaUzIntegrationResponse = {
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
