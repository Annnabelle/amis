import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/lib/axiosInstance.ts";
import type {
    CompanyXTraceIntegration,
    CompanyFakturaUzIntegration,
    CreateCompanyFakturaUzIntegration,
    CreateCompanyXTraceIntegration,
    UpdateCompanyXTraceIntegration,
    ValidateCompanyXTraceIntegrationToken,
    XTraceIntegrationTokenValidation,
    ValidateCompanyXTraceToken,
    XTraceTokenValidation,
} from "entities/xTrace/types";
import type {
    CreateCompanyFakturaUzIntegrationResponseDto,
    CreateCompanyXTraceIntegrationResponseDto,
    GetCompanyFakturaUzIntegrationResponseDto,
    GetCompanyXTraceIntegrationResponseDto,
    UpdateCompanyXTraceIntegrationResponseDto,
} from '@edem2000/amis.contracts/api/common/responses';
import type { ValidateCompanyXTraceTokenResponseDto } from '@edem2000/amis.contracts/api/companies/responses';
import {
    mapCompanyFakturaUzIntegrationDtoToEntity,
    mapCompanyXTraceIntegrationDtoToEntity,
    mapValidateCompanyXTraceTokenResponse,
} from "entities/xTrace/mappers";

interface XTraceState {
    data: XTraceTokenValidation | null;
    integrationValidation: XTraceIntegrationTokenValidation | null;
    integration: CompanyXTraceIntegration | null;
    fakturaUzIntegration: CompanyFakturaUzIntegration | null;
    integrationsLoading: boolean;
    loading: boolean;
    integrationValidationLoading: boolean;
    integrationCreateLoading: boolean;
    fakturaUzCreateLoading: boolean;
    error: string | null;
}

const initialState: XTraceState = {
    data: null,
    integrationValidation: null,
    integration: null,
    fakturaUzIntegration: null,
    integrationsLoading: false,
    loading: false,
    integrationValidationLoading: false,
    integrationCreateLoading: false,
    fakturaUzCreateLoading: false,
    error: null,
};

export const getCompanyXTraceIntegration = createAsyncThunk<
    CompanyXTraceIntegration,
    { companyId: string },
    { rejectValue: string }
>(
    "xTraceSlice/getXTraceIntegration",
    async ({ companyId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<GetCompanyXTraceIntegrationResponseDto>(
                `/integrations/x-trace`,
                { headers: { "x-company-id": String(companyId) } }
            );

            if (!res.data.success) {
                return rejectWithValue(
                    getBackendErrorMessage(res.data, "Не удалось загрузить интеграцию X-Trace")
                );
            }

            return mapCompanyXTraceIntegrationDtoToEntity(res.data.integration);
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось загрузить интеграцию X-Trace")
            );
        }
    }
);

export const getCompanyFakturaUzIntegration = createAsyncThunk<
    CompanyFakturaUzIntegration,
    { companyId: string },
    { rejectValue: string }
>(
    "xTraceSlice/getFakturaUzIntegration",
    async ({ companyId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<GetCompanyFakturaUzIntegrationResponseDto>(
                `/integrations/faktura-uz`,
                { headers: { "x-company-id": String(companyId) } }
            );

            if (!res.data.success) {
                return rejectWithValue(
                    getBackendErrorMessage(res.data, "Не удалось загрузить интеграцию Faktura.uz")
                );
            }

            return mapCompanyFakturaUzIntegrationDtoToEntity(res.data.integration);
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось загрузить интеграцию Faktura.uz")
            );
        }
    }
);

export const validateCompanyXTraceToken = createAsyncThunk<
    XTraceTokenValidation,
    ValidateCompanyXTraceToken,
    { rejectValue: string }
>(
    "xTraceSlice/validateXTrace",
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<ValidateCompanyXTraceTokenResponseDto>(
                `/companies/x-trace/validate`,
                { params }
            );

            if (res.data.success) {
                return mapValidateCompanyXTraceTokenResponse(res.data.data);
            }

            return rejectWithValue(
                getBackendErrorMessage(res.data, "Не удалось проверить токен X-Trace")
            );
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось проверить токен X-Trace")
            );
        }
    }
);

export const validateCompanyXTraceIntegrationToken = createAsyncThunk<
    XTraceIntegrationTokenValidation,
    ValidateCompanyXTraceIntegrationToken,
    { rejectValue: string }
>(
    "xTraceSlice/validateIntegrationToken",
    async (
        params: ValidateCompanyXTraceIntegrationToken,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get<ValidateCompanyXTraceTokenResponseDto>(
                `/integrations/x-trace/validate`,
                {
                    params: { token: params.token },
                    headers: { "x-company-id": String(params.companyId) },
                }
            );

            if (res.data.success) {
                return mapValidateCompanyXTraceTokenResponse(res.data.data);
            }

            return rejectWithValue(
                getBackendErrorMessage(res.data, "Не удалось проверить токен интеграции X-Trace")
            );
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось проверить токен интеграции X-Trace")
            );
        }
    }
);

export const createCompanyXTraceIntegration = createAsyncThunk<
    CompanyXTraceIntegration,
    CreateCompanyXTraceIntegration,
    { rejectValue: string }
>(
    "xTraceSlice/createIntegration",
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post<CreateCompanyXTraceIntegrationResponseDto>(
                `/integrations/x-trace`,
                {
                    token: params.token,
                    businessPlaceId: params.businessPlaceId,
                },
                { headers: { "x-company-id": String(params.companyId) } }
            );

            if (!res.data.success) {
                return rejectWithValue(
                    getBackendErrorMessage(res.data, "Не удалось загрузить интеграцию X-Trace")
                );
            }

            return mapCompanyXTraceIntegrationDtoToEntity(res.data.integration);
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось подключить интеграцию X-Trace")
            );
        }
    }
);

export const updateCompanyXTraceIntegration = createAsyncThunk<
    CompanyXTraceIntegration,
    UpdateCompanyXTraceIntegration,
    { rejectValue: string }
>(
    "xTraceSlice/updateIntegration",
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch<UpdateCompanyXTraceIntegrationResponseDto>(
                `/integrations/x-trace`,
                {
                    token: params.token,
                    businessPlaceId: params.businessPlaceId,
                },
                { headers: { "x-company-id": String(params.companyId) } }
            );

            if (!res.data.success) {
                return rejectWithValue(
                    getBackendErrorMessage(res.data, "Не удалось загрузить интеграцию X-Trace")
                );
            }

            return mapCompanyXTraceIntegrationDtoToEntity(res.data.integration);
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось обновить интеграцию X-Trace")
            );
        }
    }
);

export const createCompanyFakturaUzIntegration = createAsyncThunk<
    CompanyFakturaUzIntegration,
    CreateCompanyFakturaUzIntegration,
    { rejectValue: string }
>(
    "xTraceSlice/createFakturaUzIntegration",
    async (params, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post<CreateCompanyFakturaUzIntegrationResponseDto>(
                `/integrations/faktura-uz`,
                {
                    username: params.username,
                    password: params.password,
                    clientId: params.clientId,
                    clientSecret: params.clientSecret,
                },
                { headers: { "x-company-id": String(params.companyId) } }
            );

            if (!res.data.success) {
                return rejectWithValue(
                    getBackendErrorMessage(res.data, "Не удалось загрузить интеграцию Faktura.uz")
                );
            }

            return mapCompanyFakturaUzIntegrationDtoToEntity(res.data.integration);
        } catch (error: unknown) {
            const responseData = (error as { response?: { data?: unknown } }).response?.data;

            return rejectWithValue(
                getBackendErrorMessage(responseData ?? error, "Не удалось подключить интеграцию Faktura.uz")
            );
        }
    }
);

export const xTraceSlice = createSlice({
    name: "xTrace",
    initialState,
    reducers: {
        clearXTrace: (state) => {
            state.data = null;
            state.integrationValidation = null;
            state.integration = null;
            state.fakturaUzIntegration = null;
            state.error = null;
        },
        clearXTraceIntegrationValidation: (state) => {
            state.integrationValidation = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateCompanyXTraceToken.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = null;
            })
            .addCase(
                validateCompanyXTraceToken.fulfilled,
                (state, action: PayloadAction<XTraceTokenValidation>) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )
            .addCase(validateCompanyXTraceToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(getCompanyXTraceIntegration.pending, (state) => {
                state.integrationsLoading = true;
                state.error = null;
            })
            .addCase(getCompanyXTraceIntegration.fulfilled, (state, action) => {
                state.integrationsLoading = false;
                state.integration = action.payload;
            })
            .addCase(getCompanyXTraceIntegration.rejected, (state, action) => {
                state.integrationsLoading = false;
                state.integration = null;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(getCompanyFakturaUzIntegration.pending, (state) => {
                state.integrationsLoading = true;
                state.error = null;
            })
            .addCase(getCompanyFakturaUzIntegration.fulfilled, (state, action) => {
                state.integrationsLoading = false;
                state.fakturaUzIntegration = action.payload;
            })
            .addCase(getCompanyFakturaUzIntegration.rejected, (state, action) => {
                state.integrationsLoading = false;
                state.fakturaUzIntegration = null;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(validateCompanyXTraceIntegrationToken.pending, (state) => {
                state.integrationValidationLoading = true;
                state.integrationValidation = null;
                state.error = null;
            })
            .addCase(
                validateCompanyXTraceIntegrationToken.fulfilled,
                (state, action: PayloadAction<XTraceIntegrationTokenValidation>) => {
                    state.integrationValidationLoading = false;
                    state.integrationValidation = action.payload;
                }
            )
            .addCase(validateCompanyXTraceIntegrationToken.rejected, (state, action) => {
                state.integrationValidationLoading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(createCompanyXTraceIntegration.pending, (state) => {
                state.integrationCreateLoading = true;
                state.error = null;
            })
            .addCase(
                createCompanyXTraceIntegration.fulfilled,
                (state, action: PayloadAction<CompanyXTraceIntegration>) => {
                    state.integrationCreateLoading = false;
                    state.integration = action.payload;
                }
            )
            .addCase(createCompanyXTraceIntegration.rejected, (state, action) => {
                state.integrationCreateLoading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(updateCompanyXTraceIntegration.pending, (state) => {
                state.integrationCreateLoading = true;
                state.error = null;
            })
            .addCase(
                updateCompanyXTraceIntegration.fulfilled,
                (state, action: PayloadAction<CompanyXTraceIntegration>) => {
                    state.integrationCreateLoading = false;
                    state.integration = action.payload;
                }
            )
            .addCase(updateCompanyXTraceIntegration.rejected, (state, action) => {
                state.integrationCreateLoading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(createCompanyFakturaUzIntegration.pending, (state) => {
                state.fakturaUzCreateLoading = true;
                state.error = null;
            })
            .addCase(
                createCompanyFakturaUzIntegration.fulfilled,
                (state, action: PayloadAction<CompanyFakturaUzIntegration>) => {
                    state.fakturaUzCreateLoading = false;
                    state.fakturaUzIntegration = action.payload;
                }
            )
            .addCase(createCompanyFakturaUzIntegration.rejected, (state, action) => {
                state.fakturaUzCreateLoading = false;
                state.error = action.payload ?? "Unknown error";
            });
    },
});

export const { clearXTrace, clearXTraceIntegrationValidation } = xTraceSlice.actions;
export default xTraceSlice.reducer;
