import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/consts";
import axiosInstance from "../../utils/axiosInstance"
import type {
    AggregationReportResponse,
    CreateAggregationReport,
    GetAggregationReportsResponseTypes
} from "../../types/aggregation";
import {mapAggregationListDtoToEntity, mapGetAggregationDtoToEntity} from "../../mappers/aggregation";
import type {
    AggregationReportResponseDto,
    GetAggregationReportsParamsDto,
    GetAggregationReportsResponse,
    GetAggregationReportsResponseDto, GetOneAggregationReportDto, GetOneAggregationReportResponseDto
} from "../../dtos/aggregation";
import type {PaginatedResponseDto} from "../../dtos";
import type {AggregationUnitCodeResponse} from "../../types/aggregation/units";
import type {AggregationUnitCodeResponseDto} from "../../dtos/aggregation/units";
import {mapUnitsDtoToEntity} from "../../mappers/aggregation/units.ts";

export interface ApiErrorResponse {
    success: false;
    errorCode: number;
    errorMessage: {
        ru: string;
        en: string;
        uz: string;
    };
}


export type AggregationState = {
    aggregation: AggregationReportResponse[];
    aggregations: GetAggregationReportsResponseTypes[];
    oneAggregation: AggregationReportResponse | null;
    isLoading: boolean;
    error: ApiErrorResponse | null; // ✅ всегда объект
    status: string | null;
    total: number;
    page: number;
    limit: number;
    units: Record<
        string, // aggregationId
        {
            data: AggregationUnitCodeResponse[];
            total: number;
            page: number;
            limit: number;
        }
    >;
};

const initialState: AggregationState = {
    aggregation: [],
    aggregations: [],
    oneAggregation: null,
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null,
    status: null,
    units: {},
};

interface FetchAggregationUnitsParams {
    aggregationId: string;
    page?: number;
    limit?: number;
}

export const fetchAggregationUnits = createAsyncThunk<
    { data: AggregationUnitCodeResponseDto[]; total: number; page: number; limit: number; aggregationId: string }, // TS выведет тип
    FetchAggregationUnitsParams,
    { rejectValue: ApiErrorResponse }
>(
    'aggregation/fetchAggregationUnits',
    async (params, { rejectWithValue }) => {
        try {
            const { aggregationId, page = 1, limit = 10 } = params;

            const response = await axiosInstance.get<{
                data: AggregationUnitCodeResponseDto[];
                total: number;
                page: number;
                limit: number;
            }>(
                `${BASE_URL}/reports/aggregation/${aggregationId}/units`,
                { params: { page, limit } }
            );

            if (Array.isArray(response.data.data)) {
                return {
                    data: response.data.data.map(mapUnitsDtoToEntity),
                    total: response.data.total,
                    page: response.data.page,
                    limit: response.data.limit,
                    aggregationId,
                };
            }

            return rejectWithValue({
                success: false,
                errorCode: -1,
                errorMessage: {
                    ru: "Ошибка загрузки единиц агрегации",
                    en: "Failed to load aggregation units",
                    uz: "Agregatsiya birliklarini yuklashda xatolik",
                },
            });
        } catch (err: any) {
            return rejectWithValue({
                success: false,
                errorCode: err.response?.status ?? -500,
                errorMessage: {
                    ru: "Ошибка сервера",
                    en: "Server error",
                    uz: "Server xatosi",
                },
            });
        }
    }
);

export const createAggregationReport = createAsyncThunk<
    AggregationReportResponse,
    CreateAggregationReport,
    { rejectValue: ApiErrorResponse }
>(
    "aggregation/createAggregationReport",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `${BASE_URL}/reports/aggregation`,
                payload
            );

            if (data.success && data.report) {
                return mapAggregationListDtoToEntity(data.report);
            }

            return rejectWithValue(data as ApiErrorResponse);
        } catch (err: any) {
            const backendError = err?.response?.data;

            if (backendError?.errorMessage) {
                return rejectWithValue(backendError as ApiErrorResponse);
            }

            return rejectWithValue({
                success: false,
                errorCode: err?.response?.status ?? -500,
                errorMessage: {
                    ru: "Ошибка сервера",
                    en: "Server error",
                    uz: "Server xatosi",
                },
            });
        }
    }
);

export function isGetAggregationReportsSuccess(
    res: GetAggregationReportsResponseDto
): res is { success: true } & PaginatedResponseDto<GetAggregationReportsResponse> {
    return (
        typeof res === 'object' &&
        res !== null &&
        'success' in res &&
        res.success === true
    );
}

export const fetchAggregations = createAsyncThunk<
    { data: GetAggregationReportsResponseTypes[]; total: number; page: number; limit: number, companyId: string },
    GetAggregationReportsParamsDto,
    { rejectValue: ApiErrorResponse }
>(
    'aggregation/fetchAggregations',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<GetAggregationReportsResponseDto>(`${BASE_URL}/reports/aggregation`, {
                params: {
                    ...params,
                    dateFrom: params.dateFrom?.toISOString(),
                    dateTo: params.dateTo?.toISOString(),
                },
            });

            if (isGetAggregationReportsSuccess(response.data)) {
                return {
                    data: response.data.data.map(mapGetAggregationDtoToEntity),
                    total: response.data.total,
                    page: response.data.page,
                    limit: response.data.limit,
                    companyId: params.companyId,
                };
            }

            return rejectWithValue({
                success: false,
                errorCode: -1,
                errorMessage: {
                    ru: "Ошибка загрузки агрегаций",
                    en: "Failed to load aggregations",
                    uz: "Agregatsiyalarni yuklashda xatolik",
                },
            });
        } catch (err: any) {
            return rejectWithValue({
                success: false,
                errorCode: err.response?.status ?? -500,
                errorMessage: {
                    ru: "Ошибка сервера",
                    en: "Server error",
                    uz: "Server xatosi",
                },
            });
        }
    }
);


function isGetOneAggregationSuccess(
    data: GetOneAggregationReportResponseDto
): data is { success: true; report: AggregationReportResponseDto } {
    return (data as any).success === true && 'report' in data;
}

export const fetchOneAggregationReport = createAsyncThunk<
    AggregationReportResponse,
    GetOneAggregationReportDto,
    { rejectValue: ApiErrorResponse }
>(
    "aggregation/fetchOneAggregationReport",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<GetOneAggregationReportResponseDto>(
                `${BASE_URL}/reports/aggregation/${id}`
            );

            if (isGetOneAggregationSuccess(data)) {
                return mapAggregationListDtoToEntity(data.report);
            }

            return rejectWithValue({
                success: false,
                errorCode: -1,
                errorMessage: {
                    ru: "Ошибка загрузки агрегации",
                    en: "Failed to load aggregation",
                    uz: "Agregatsiyani yuklashda xatolik",
                },
            });
        } catch (err: any) {
            return rejectWithValue({
                success: false,
                errorCode: err.response?.status ?? -500,
                errorMessage: {
                    ru: "Ошибка сервера",
                    en: "Server error",
                    uz: "Server xatosi",
                },
            });
        }
    }
);



export const  aggregationSlice = createSlice({
    name: 'aggregation',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAggregationUnits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAggregationUnits.fulfilled, (state, action) => {
                const { aggregationId, data, total, page, limit } = action.payload;

                state.units[aggregationId] = {
                    data,
                    total,
                    page,
                    limit,
                };

                state.isLoading = false;
            })
            .addCase(fetchAggregationUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(createAggregationReport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createAggregationReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.aggregation.push(action.payload);
            })
            .addCase(createAggregationReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? null;
            })
            .addCase(fetchAggregations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAggregations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.aggregations = action.payload.data;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
            })
            .addCase(fetchAggregations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? {
                    success: false,
                    errorCode: -1,
                    errorMessage: { ru: "Неизвестная ошибка", en: "Unknown error", uz: "Noma’lum xatolik" },
                };
            })
            .addCase(fetchOneAggregationReport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.oneAggregation = null; // сброс предыдущего
            })
            .addCase(fetchOneAggregationReport.fulfilled, (state, action) => {
                state.isLoading = false;
                state.oneAggregation = action.payload;
            })
            .addCase(fetchOneAggregationReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? {
                    success: false,
                    errorCode: -1,
                    errorMessage: {
                        ru: "Неизвестная ошибка",
                        en: "Unknown error",
                        uz: "Noma’lum xatolik",
                    },
                };
                state.oneAggregation = null;
            })
    },
});

export default aggregationSlice.reducer;