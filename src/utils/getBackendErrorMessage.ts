import i18n from 'i18next';

type Lang = 'ru' | 'uz' | 'en';

interface BackendError {
    errorMessage?: Partial<Record<Lang, string>>;
}

export const getBackendErrorMessage = (
    error: BackendError | unknown,
    fallback: string
): string => {
    const lang = i18n.language as Lang;

    const backendError = error as BackendError;

    return (
        backendError?.errorMessage?.[lang] ||
        backendError?.errorMessage?.ru ||
        fallback
    );
};
