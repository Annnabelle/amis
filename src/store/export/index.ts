import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../utils/axiosInstance.ts";
import {BASE_URL} from "../../utils/consts.ts";
import type {ExportAggregationReportParams} from "../../types/export";
import {getFileNameFromDisposition} from "../../utils/utils.ts";

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
    },
    { rejectValue: string }
>(
    'export/downloadReport',
    async ({ aggregationId, params }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `${BASE_URL}/reports/aggregation/${aggregationId}/export`,
                {
                    params,
                    responseType: 'blob',
                }
            );

            console.log("HEADERS:", response.headers);
            console.log("DISPOSITION:", response.headers["content-disposition"]);

            const disposition = response.headers['content-disposition'];
            const filename =
                getFileNameFromDisposition(disposition) ?? 'report.csv';

            const blob = new Blob([response.data], {
                type: response.data.type || 'text/csv',
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;

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
