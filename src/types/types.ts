export type BackendError = {
    success: false;
    errorCode: number;
    errorMessage: {
        ru?: string;
        uz?: string;
        en?: string;
    };
};
