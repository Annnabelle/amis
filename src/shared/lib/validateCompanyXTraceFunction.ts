import type { ValidateCompanyXTraceTokenResponse } from "entities/xTrace/types";
import type { MultiLanguage} from "shared/types/dtos";

/**
 * Проверяет, что пришел валидный X-Trace ответ (успешный или "успешный, но токен невалиден")
 */
export function isXTraceValidResponse(
    res: ValidateCompanyXTraceTokenResponse | null | undefined
): res is
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
    | {
    success: false;
    data: { isTokenValid: false };
} {
    return (
        typeof res === "object" &&
        res !== null &&
        "success" in res &&
        "data" in res
    );
}

/**
 * Проверяет полный успех: success=true и токен валиден
 */
export function isXTraceSuccess(
    res: ValidateCompanyXTraceTokenResponse | null | undefined
): res is {
    success: true;
    data: {
        isTokenValid: true;
        expireDate: string;
        isTest: boolean;
        name: MultiLanguage;
        fullName: MultiLanguage;
        productGroups: string[];
    };
} {
    return (
        isXTraceValidResponse(res) &&
        res.success === true &&
        res.data.isTokenValid === true
    );
}



