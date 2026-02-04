import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "shared/lib/axiosInstance.ts";
import {BASE_URL} from "shared/lib/consts.ts";
import type {ExportAggregationReportParams} from "entities/export/types";
import {getFileNameFromDisposition} from "shared/lib";
import type {ApiErrorResponse} from "entities/aggregation/model";

interface ExportState {
    loading: boolean;
    error: ApiErrorResponse | null;
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
    { rejectValue: ApiErrorResponse }
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
        } catch (err: any) {
            const backendError = err?.response?.data;

            if (backendError?.errorMessage) {
                return rejectWithValue(backendError);
            }

            return rejectWithValue({
                success: false,
                errorCode: err?.response?.status ?? -500,
                errorMessage: {
                    ru: 'Ошибка при скачивании файла',
                    en: 'Error while downloading file',
                    uz: 'Faylni yuklab olishda xatolik',
                },
            });
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
                state.error = action.payload ?? {
                    success: false,
                    errorCode: -1,
                    errorMessage: {
                        ru: 'Неизвестная ошибка',
                        en: 'Unknown error',
                        uz: 'Noma’lum xatolik',
                    },
                };
            });
    },
});

export default exportSlice.reducer;




