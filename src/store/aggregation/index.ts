import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
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


export type AggregationState = {
    aggregation: AggregationReportResponse[];
    aggregations: GetAggregationReportsResponseTypes[];
    isLoading: boolean;
    error: string | null;
    status: string | null;
    total: number,
    page: number,
    limit: number,
}
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

export interface ApiErrorResponse {
    success: false;
    errorCode: number;
    errorMessage: {
        ru: string;
        en: string;
        uz: string;
    };
}


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

            // ❗ бизнес-ошибка от сервера
            if (data.success === false) {
                return rejectWithValue(data as ApiErrorResponse);
            }

            return rejectWithValue({
                success: false,
                errorCode: -1,
                errorMessage: {
                    ru: "Неизвестная ошибка",
                    en: "Unknown error",
                    uz: "Noma’lum xatolik",
                },
            });
        } catch (err: any) {
            // ❗ HTTP / network ошибка
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

export const fetchAggregations = createAsyncThunk(
    'aggregation/fetchAggregations',
    async (
        params: GetAggregationReportsParamsDto,
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.get<GetAggregationReportsResponseDto>(
                `${BASE_URL}/reports/aggregation`,
                {
                    params: {
                        ...params,
                        dateFrom: params.dateFrom?.toISOString(),
                        dateTo: params.dateTo?.toISOString(),
                    },
                }
            );

            if (isGetAggregationReportsSuccess(response.data)) {
                return {
                    data: response.data.data.map(mapGetAggregationDtoToEntity),
                    total: response.data.total,
                    page: response.data.page,
                    limit: response.data.limit,
                };
            }

            return rejectWithValue('Ошибка загрузки агрегаций');
        } catch (err: any) {
            return rejectWithValue(err.message || 'Ошибка сервера');
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
            .addCase(createAggregationReport.fulfilled, (state, action: PayloadAction<AggregationReportResponse>) => {
                state.isLoading = false;
                state.aggregation.push(action.payload);
            })
            .addCase(createAggregationReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchAggregations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(
                fetchAggregations.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        data: GetAggregationReportsResponseTypes[];
                        total: number;
                        page: number;
                        limit: number;
                    }>
                ) => {
                    state.isLoading = false;
                    state.aggregations = action.payload.data;
                    state.total = action.payload.total;
                    state.page = action.payload.page;
                    state.limit = action.payload.limit;
                }
            )
            .addCase(fetchAggregations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default aggregationSlice.reducer;