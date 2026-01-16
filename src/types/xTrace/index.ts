import type {ErrorDto, MultiLanguage} from "../../dtos";

export type ValidateCompanyXTraceToken = {
    tin: string;
    token: string;
}

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
        expireDate: string; //ISO8601
        isTest: boolean;
        name: MultiLanguage;
        fullName: MultiLanguage;
        productGroups: string[];
    };
}
    | ErrorDto;