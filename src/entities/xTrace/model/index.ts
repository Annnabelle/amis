import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/lib/axiosInstance.ts";
import type {
    CompanyXTraceIntegrationResponse,
    CompanyFakturaUzIntegrationResponse,
    CreateCompanyFakturaUzIntegration,
    CreateCompanyXTraceIntegration,
    ValidateCompanyXTraceIntegrationToken,
    ValidateCompanyXTraceIntegrationTokenResponse,
    ValidateCompanyXTraceToken,
    ValidateCompanyXTraceTokenResponse,
} from "entities/xTrace/types";
import type {
    CompanyXTraceIntegrationResponseDto,
    CompanyFakturaUzIntegrationResponseDto,
    GetCompanyFakturaUzIntegrationResponseDto,
    GetCompanyXTraceIntegrationResponseDto,
    ValidateCompanyXTraceIntegrationTokenResponseDto,
    ValidateCompanyXTraceTokenResponseDto,
} from "entities/xTrace/dtos";
import { mapValidateCompanyXTraceTokenResponse } from "entities/xTrace/mappers";

interface XTraceState {
    data: ValidateCompanyXTraceTokenResponse | null;
    integrationValidation: ValidateCompanyXTraceIntegrationTokenResponse | null;
    integration: CompanyXTraceIntegrationResponse | null;
    fakturaUzIntegration: CompanyFakturaUzIntegrationResponse | null;
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

const isErrorDto = (value: unknown): value is { success: boolean; errorMessage: unknown; errorCode: number } =>
    value !== null &&
    typeof value === "object" &&
    "errorCode" in value &&
    "errorMessage" in value;

export const getCompanyXTraceIntegration = createAsyncThunk<
    CompanyXTraceIntegrationResponse | null,
    { companyId: string }
>(
    "xTraceSlice/getXTraceIntegration",
    async ({ companyId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<GetCompanyXTraceIntegrationResponseDto>(
                `/integrations/x-trace`,
                { headers: { "x-company-id": String(companyId) } }
            );

            if (isErrorDto(res.data)) {
                return rejectWithValue(res.data);
            }

            return res.data as CompanyXTraceIntegrationResponse;
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
        }
    }
);

export const getCompanyFakturaUzIntegration = createAsyncThunk<
    CompanyFakturaUzIntegrationResponse | null,
    { companyId: string }
>(
    "xTraceSlice/getFakturaUzIntegration",
    async ({ companyId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get<GetCompanyFakturaUzIntegrationResponseDto>(
                `/integrations/faktura-uz`,
                { headers: { "x-company-id": String(companyId) } }
            );

            if (isErrorDto(res.data)) {
                return rejectWithValue(res.data);
            }

            return res.data as CompanyFakturaUzIntegrationResponse;
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
        }
    }
);

export const validateCompanyXTraceToken = createAsyncThunk(
    "xTraceSlice/validateXTrace",
    async (
        params: ValidateCompanyXTraceToken,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get<ValidateCompanyXTraceTokenResponseDto>(
                `/companies/x-trace/validate`,
                { params }
            );

            return mapValidateCompanyXTraceTokenResponse(res.data);
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
        }
    }
);

export const validateCompanyXTraceIntegrationToken = createAsyncThunk<
    ValidateCompanyXTraceIntegrationTokenResponse,
    ValidateCompanyXTraceIntegrationToken
>(
    "xTraceSlice/validateIntegrationToken",
    async (
        params: ValidateCompanyXTraceIntegrationToken,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.get<ValidateCompanyXTraceIntegrationTokenResponseDto>(
                `/integrations/x-trace/validate`,
                {
                    params: { token: params.token },
                    headers: { "x-company-id": String(params.companyId) },
                }
            );

            return res.data as ValidateCompanyXTraceIntegrationTokenResponse;
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
        }
    }
);

export const createCompanyXTraceIntegration = createAsyncThunk<
    CompanyXTraceIntegrationResponse,
    CreateCompanyXTraceIntegration
>(
    "xTraceSlice/createIntegration",
    async (
        params: CreateCompanyXTraceIntegration,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post<CompanyXTraceIntegrationResponseDto>(
                `/integrations/x-trace`,
                {
                    token: params.token,
                    businessPlaceId: params.businessPlaceId,
                },
                { headers: { "x-company-id": String(params.companyId) } }
            );

            return res.data as CompanyXTraceIntegrationResponse;
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
        }
    }
);

export const createCompanyFakturaUzIntegration = createAsyncThunk<
    CompanyFakturaUzIntegrationResponse,
    CreateCompanyFakturaUzIntegration
>(
    "xTraceSlice/createFakturaUzIntegration",
    async (
        params: CreateCompanyFakturaUzIntegration,
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.post<CompanyFakturaUzIntegrationResponseDto>(
                `/integrations/faktura-uz`,
                {
                    username: params.username,
                    password: params.password,
                    clientId: params.clientId,
                    clientSecret: params.clientSecret,
                },
                { headers: { "x-company-id": String(params.companyId) } }
            );

            return res.data as CompanyFakturaUzIntegrationResponse;
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? err.message);
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
                (state, action: PayloadAction<ValidateCompanyXTraceTokenResponse>) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )
            .addCase(validateCompanyXTraceToken.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Unknown error";
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
                state.error = (action.payload as string) || "Unknown error";
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
                state.error = (action.payload as string) || "Unknown error";
            })
            .addCase(validateCompanyXTraceIntegrationToken.pending, (state) => {
                state.integrationValidationLoading = true;
                state.integrationValidation = null;
                state.error = null;
            })
            .addCase(
                validateCompanyXTraceIntegrationToken.fulfilled,
                (state, action: PayloadAction<ValidateCompanyXTraceIntegrationTokenResponse>) => {
                    state.integrationValidationLoading = false;
                    state.integrationValidation = action.payload;
                }
            )
            .addCase(validateCompanyXTraceIntegrationToken.rejected, (state, action) => {
                state.integrationValidationLoading = false;
                state.error = (action.payload as string) || "Unknown error";
            })
            .addCase(createCompanyXTraceIntegration.pending, (state) => {
                state.integrationCreateLoading = true;
                state.error = null;
            })
            .addCase(
                createCompanyXTraceIntegration.fulfilled,
                (state, action: PayloadAction<CompanyXTraceIntegrationResponse>) => {
                    state.integrationCreateLoading = false;
                    state.integration = action.payload;
                }
            )
            .addCase(createCompanyXTraceIntegration.rejected, (state, action) => {
                state.integrationCreateLoading = false;
                state.error = (action.payload as string) || "Unknown error";
            })
            .addCase(createCompanyFakturaUzIntegration.pending, (state) => {
                state.fakturaUzCreateLoading = true;
                state.error = null;
            })
            .addCase(
                createCompanyFakturaUzIntegration.fulfilled,
                (state, action: PayloadAction<CompanyFakturaUzIntegrationResponse>) => {
                    state.fakturaUzCreateLoading = false;
                    state.fakturaUzIntegration = action.payload;
                }
            )
            .addCase(createCompanyFakturaUzIntegration.rejected, (state, action) => {
                state.fakturaUzCreateLoading = false;
                state.error = (action.payload as string) || "Unknown error";
            });
    },
});

export const { clearXTrace, clearXTraceIntegrationValidation } = xTraceSlice.actions;
export default xTraceSlice.reducer;
