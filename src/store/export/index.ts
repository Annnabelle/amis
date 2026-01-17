import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../utils/axiosInstance.ts";
import {BASE_URL} from "../../utils/consts.ts";
import type {ExportAggregationReportParams} from "../../types/export";

interface ExportState {
    loading: boolean;
    error: string | null;
}

const initialState: ExportState = {
    loading: false,
    error: null,
};

export const downloadReport = createAsyncThunk<
    void,
    {
        aggregationId: string;
        params: ExportAggregationReportParams;
        fileName: string; // ← добавили
    },
    { rejectValue: string }
>(
    'export/downloadReport',
    async ({ aggregationId, params, fileName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/reports/aggregation/${aggregationId}/export`,
                {
                    params,
                    responseType: 'blob',
                }
            );

            const filename = `${fileName}.${params.ext}`;

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: response.data.type })
            );

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            return rejectWithValue('Ошибка при скачивании файла');
        }
    }
);


export const exportSlice = createSlice({
    name: 'export',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(downloadReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadReport.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(downloadReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при скачивании файла';
            });
    },
});

export default exportSlice.reducer;
