import i18n from 'i18next';

type Lang = 'ru' | 'uz' | 'en';

interface BackendError {
    errorMessage?: Partial<Record<Lang, string>>;
    message?: string | string[];
    response?: {
        data?: BackendError;
    };
}

export const getBackendErrorMessage = (
    error: BackendError | unknown,
    fallback: string
): string => {
    const lang = i18n.language as Lang;

    const backendError = error as BackendError;
    const responseError = backendError?.response?.data;
    const message = responseError?.message ?? backendError?.message;

    return (
        responseError?.errorMessage?.[lang] ||
        responseError?.errorMessage?.ru ||
        backendError?.errorMessage?.[lang] ||
        backendError?.errorMessage?.ru ||
        (Array.isArray(message) ? message.join(", ") : message) ||
        fallback
    );
};



