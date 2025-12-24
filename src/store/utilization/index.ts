import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/consts";
import axiosInstance from "../../utils/axiosInstance";
import type { UtilizationReportResponse} from "../../types/utilization";
import type {CreateUtilizationReportDto} from "../../dtos/utilization";
import {mapUtilizationDtoToEntity} from "../../mappers/utilization";


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

export const createUtilizationReport = createAsyncThunk(
    "utilization/createUtilizationReport",
    async (payload: CreateUtilizationReportDto, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `${BASE_URL}/reports/utilization`,
                payload
            );

            if (data.success && data.report) {
                return mapUtilizationDtoToEntity(data);
            }

            return rejectWithValue("Ошибка регистрации отчета");
        } catch (err: any) {
            return rejectWithValue(err.message || "Ошибка сервера");
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
            .addCase(createUtilizationReport.fulfilled, (state, action: PayloadAction<UtilizationReportResponse>) => {
                state.isLoading = false;
                state.utilization.push(action.payload);
            })
            .addCase(createUtilizationReport.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export default utilizationSlice.reducer;