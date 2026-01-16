import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance.ts";
import type {ValidateCompanyXTraceToken, ValidateCompanyXTraceTokenResponse} from "../../types/xTrace";
import type {ValidateCompanyXTraceTokenResponseDto} from "../../dtos/xTrace";
import {mapValidateCompanyXTraceTokenResponse} from "../../mappers/xTrace";

interface XTraceState {
    data: ValidateCompanyXTraceTokenResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: XTraceState = {
    data: null,
    loading: false,
    error: null,
};


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

export const xTraceSlice = createSlice({
    name: "xTrace",
    initialState,
    reducers: {
        clearXTrace: (state) => {
            state.data = null;
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
            });
    },
});

export const { clearXTrace } = xTraceSlice.actions;
export default xTraceSlice.reducer;
