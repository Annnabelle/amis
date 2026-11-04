import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  isOwnedCodesResponseSuccess,
  isOwnedCodesSummaryResponseSuccess,
  type GetOwnedCodesDto,
  type GetOwnedCodesResponseDto,
  type GetOwnedCodesSummaryResponseDto,
} from "entities/ownedCodes/dtos";
import type {
  OwnedCode,
  OwnedCodesState,
  OwnedCodesSummary,
} from "entities/ownedCodes/types";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: OwnedCodesState = {
  summary: null,
  summaryLoading: false,
  codes: [],
  total: 0,
  page: 1,
  limit: 20,
  gtin: null,
  isLoading: false,
  error: null,
};

type GetOwnedCodesResult = {
  codes: OwnedCode[];
  total: number;
  page: number;
  limit: number;
  gtin: string | null;
};

export const getOwnedCodes = createAsyncThunk<
  GetOwnedCodesResult,
  GetOwnedCodesDto,
  { rejectValue: string }
>("ownedCodes/get", async ({ page, limit, gtin }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetOwnedCodesResponseDto>(
      `${BASE_URL}/codes`,
      { params: { page, limit, gtin: gtin || undefined } }
    );

    if (isOwnedCodesResponseSuccess(response.data)) {
      return {
        codes: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        gtin: gtin || null,
      };
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "ownedCodes.errors.load")
    );
  } catch (error) {
    return rejectWithValue(getBackendErrorMessage(error, "ownedCodes.errors.load"));
  }
});

export const getOwnedCodesSummary = createAsyncThunk<
  OwnedCodesSummary,
  void,
  { rejectValue: string }
>("ownedCodes/getSummary", async (_params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetOwnedCodesSummaryResponseDto>(
      `${BASE_URL}/codes/summary`
    );

    if (isOwnedCodesSummaryResponseSuccess(response.data)) {
      const { products, unknownGtins, total, freshness } = response.data;

      return { products, unknownGtins, total, freshness };
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "ownedCodes.errors.loadSummary")
    );
  } catch (error) {
    return rejectWithValue(
      getBackendErrorMessage(error, "ownedCodes.errors.loadSummary")
    );
  }
});

export const ownedCodesSlice = createSlice({
  name: "ownedCodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOwnedCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOwnedCodes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.codes = action.payload.codes;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.gtin = action.payload.gtin;
      })
      .addCase(getOwnedCodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "ownedCodes.errors.load";
      })
      .addCase(getOwnedCodesSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(getOwnedCodesSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(getOwnedCodesSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload ?? "ownedCodes.errors.loadSummary";
      });
  },
});

export default ownedCodesSlice.reducer;
