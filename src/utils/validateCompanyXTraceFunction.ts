import type { ValidateCompanyXTraceTokenResponse } from "../types/xTrace";
import type {ErrorDto, MultiLanguage} from "../dtos";

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
/**
 * Проверяет "успешный ответ", но токен невалиден
 */
export function isXTraceFail(
    res: ValidateCompanyXTraceTokenResponse | null | undefined
): res is {
    success: false;
    data: { isTokenValid: false };
} {
    return (
        isXTraceValidResponse(res) &&
        res.success === false
    );
}
/**
 * Проверяет ErrorDto (ошибку сервера или формата)
 */
export function isXTraceError(
    res: ValidateCompanyXTraceTokenResponse | null | undefined
): res is ErrorDto {
    return (
        typeof res === "object" &&
        res !== null &&
        !("success" in res) &&
        "errorCode" in res
    );
}

