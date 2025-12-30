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
    GetAggregationReportsParamsDto,
    GetAggregationReportsResponse,
    GetAggregationReportsResponseDto
} from "../../dtos/aggregation";
import type {PaginatedResponseDto} from "../../dtos";

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
    isLoading: boolean;
    error: ApiErrorResponse | null; // ✅ всегда объект
    status: string | null;
    total: number;
    page: number;
    limit: number;
};

const initialState: AggregationState = {
    aggregation: [],
    aggregations: [],
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null,
    status: null,
};


export const createAggregationReport = createAsyncThunk<
    AggregationReportResponse,
    CreateAggregationReport,
    { rejectValue: ApiErrorResponse }
>(
    "aggregation/createAggregationReport",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}/reports/aggregation`, payload);

            if (data.success && data.report) {
                return mapAggregationListDtoToEntity(data.report);
            }

            return rejectWithValue(data as ApiErrorResponse);
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
    { data: GetAggregationReportsResponseTypes[]; total: number; page: number; limit: number },
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

export const  aggregationSlice = createSlice({
    name: 'aggregation',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
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
                state.error = action.payload ?? {
                    success: false,
                    errorCode: -1,
                    errorMessage: { ru: "Неизвестная ошибка", en: "Unknown error", uz: "Noma’lum xatolik" },
                };
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
            });
    },
});

export default aggregationSlice.reducer;