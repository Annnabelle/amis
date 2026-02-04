import type {ValidateCompanyXTraceTokenResponseDto} from "entities/xTrace/dtos";
import type {ValidateCompanyXTraceTokenResponse} from "entities/xTrace/types";

export const mapValidateCompanyXTraceTokenResponse = (
    dto: ValidateCompanyXTraceTokenResponseDto
): ValidateCompanyXTraceTokenResponse => {
    // ErrorDto прокидываем как есть
    if ("errorCode" in dto) {
        return dto;
    }

    // success: false
    if (!dto.success) {
        return {
            success: false,
            data: {
                isTokenValid: false,
            },
        };
    }

    // success: true
    return {
        success: true,
        data: {
            isTokenValid: true,
            expireDate: dto.data.expireDate,
            isTest: dto.data.isTest,
            name: dto.data.name,
            fullName: dto.data.fullName,
            productGroups: dto.data.productGroups,
        },
    };
};




