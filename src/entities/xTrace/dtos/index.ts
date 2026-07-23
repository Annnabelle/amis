import type { ErrorDto, HexString, MultiLanguage } from "shared/types/dtos";

export type ValidateCompanyXTraceTokenDto = {
    tin: string;
    token: string;
};

export type ValidateCompanyXTraceTokenResponseDto =
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

export type ValidateCompanyXTraceIntegrationTokenDto = {
    companyId: HexString;
    token: string;
};

export type ValidateCompanyXTraceIntegrationTokenResponseDto =
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

export type CreateCompanyXTraceIntegrationDto = {
    companyId: HexString;
    token: string;
    businessPlaceId: number;
};

export type CompanyXTraceIntegrationStatus = string;

export type CompanyXTraceIntegrationResponseDto = {
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

export type GetCompanyXTraceIntegrationResponseDto =
    | CompanyXTraceIntegrationResponseDto
    | ErrorDto;

export type CreateCompanyFakturaUzIntegrationDto = {
    companyId: HexString;
    username: string;
    password: string;
    clientId: string;
    clientSecret: string;
};

export type CompanyFakturaUzIntegrationStatus = string;

export type CompanyFakturaUzIntegrationResponseDto = {
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

export type GetCompanyFakturaUzIntegrationResponseDto =
    | CompanyFakturaUzIntegrationResponseDto
    | ErrorDto;
