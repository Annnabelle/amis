import type {ErrorDto, MultiLanguage} from "shared/types/dtos";

export type ValidateCompanyXTraceTokenDto = {
    tin: string;
    token: string;
}

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
            expireDate: string; //ISO8601
            isTest: boolean;
            name: MultiLanguage;
            fullName: MultiLanguage;
            productGroups: string[];
        };
    }
    | ErrorDto;





