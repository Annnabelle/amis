import type { ValidateCompanyXTraceTokenResponseDto } from '@edem2000/amis.contracts/api/companies/responses';
import type {
    CompanyFakturaUzIntegrationResponseDto,
    CompanyXTraceIntegrationResponseDto,
} from '@edem2000/amis.contracts/api/common/responses';
import type {
    CompanyFakturaUzIntegration,
    CompanyXTraceIntegration,
    XTraceTokenValidation,
} from "entities/xTrace/types";

type ValidatedToken = Extract<ValidateCompanyXTraceTokenResponseDto, { success: true }>["data"];

export const mapValidateCompanyXTraceTokenResponse = (
    data: ValidatedToken
): XTraceTokenValidation => ({
    expireDate: data.expireDate,
    isTest: data.isTest,
    name: data.name,
    fullName: data.fullName,
    productGroups: data.productGroups,
});

export const mapCompanyXTraceIntegrationDtoToEntity = (
    dto: CompanyXTraceIntegrationResponseDto
): CompanyXTraceIntegration => ({
    id: dto.id,
    companyId: dto.companyId,
    status: dto.status,
    tokenInfo: {
        tokenId: dto.tokenInfo.tokenId,
        token: dto.tokenInfo.token,
        expireDate: dto.tokenInfo.expireDate,
        updateDate: dto.tokenInfo.updateDate,
    },
    productGroups: dto.productGroups,
    businessPlaceId: dto.businessPlaceId,
    isTest: dto.isTest,
    productsSynchronizedAt: dto.productsSynchronizedAt,
    lastSynchronizedAt: dto.lastSynchronizedAt,
    createdAt: dto.createdAt,
});

export const mapCompanyFakturaUzIntegrationDtoToEntity = (
    dto: CompanyFakturaUzIntegrationResponseDto
): CompanyFakturaUzIntegration => ({
    id: dto.id,
    companyId: dto.companyId,
    status: dto.status,
    credentials: {
        username: dto.credentials.username,
        password: dto.credentials.password,
        clientId: dto.credentials.clientId,
        clientSecret: dto.credentials.clientSecret,
    },
    isTest: dto.isTest,
    createdAt: dto.createdAt,
});
