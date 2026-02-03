import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { UtilizationReportResponse} from "entities/utilization/types";
import type {CreateUtilizationReportDto, CreateUtilizationReportResponseDto} from "entities/utilization/dtos";
import {mapCreateUtilizationReportResponse} from "entities/utilization/mappers";
import type {ErrorDto} from "shared/types/dtos";


export type UtilizationState = {
    utilization: UtilizationReportResponse[];
    isLoading: boolean;
    error: string | null;
    status: string | null;
    total: number,
    page: number,
    limit: number,
}
const initialState: UtilizationState = {
    utilization: [],
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null,
    status: null,
};

export const createUtilizationReport = createAsyncThunk<
    UtilizationReportResponse[], // успешный результат — массив entity
    CreateUtilizationReportDto,
    { rejectValue: ErrorDto } // ошибка
>(
    "utilization/createUtilizationReport",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<CreateUtilizationReportResponseDto>(
                `${BASE_URL}/reports/utilization`,
                payload
            );

            const mapped = mapCreateUtilizationReportResponse(data);

            if (!mapped.success) {
                return rejectWithValue(mapped.error!);
            }

            return mapped.reports!; // точно есть, потому что success = true
        } catch (err: any) {
            return rejectWithValue(err.response?.data ?? {
                errorMessage: {
                    ru: "Ошибка сервера",
                    uz: "Server xatosi",
                    en: "Server error",
                },
            });
        }
    }
);



export const utilizationSlice = createSlice({
    name: 'utilization',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUtilizationReport.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUtilizationReport.fulfilled, (state, action: PayloadAction<UtilizationReportResponse[]>) => {
                state.isLoading = false;
                state.utilization.push(...action.payload); // добавляем все отчёты
            })
            .addCase(createUtilizationReport.rejected, (state, action) => {
                state.isLoading = false;
                // action.payload теперь ErrorDto, можно взять сообщение на нужном языке
                state.error = action.payload?.errorMessage?.ru ?? "Unknown error";
            });
    },
});

export default utilizationSlice.reducer;



