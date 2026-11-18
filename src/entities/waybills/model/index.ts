import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GetWaybillDto, GetWaybillsDto } from '@edem2000/amis.contracts/api/waybills/requests';
import type { GetWaybillResponseDto, GetWaybillsResponseDto } from '@edem2000/amis.contracts/api/waybills/responses';
import { mapWaybillDtoToEntity } from "entities/waybills/mappers";
import type { Waybill, WaybillsState } from "entities/waybills/types";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";

const initialState: WaybillsState = {
  waybills: [],
  waybillById: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  loadingById: false,
  error: null,
};

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Server error";

export const getWaybills = createAsyncThunk(
  "waybills/getWaybills",
  async (params: GetWaybillsDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetWaybillsResponseDto>(
        `${BASE_URL}/waybills`,
        { params }
      );

      if (response.data.success) {
        return {
          data: response.data.data.map(mapWaybillDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }

      return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось загрузить ТТН"));
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const getWaybillById = createAsyncThunk(
  "waybills/getWaybillById",
  async ({ id }: GetWaybillDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetWaybillResponseDto>(
        `${BASE_URL}/waybills/${id}`
      );

      if (response.data.success) {
        return mapWaybillDtoToEntity(response.data.waybill);
      }

      return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось загрузить ТТН"));
    } catch (err: unknown) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const waybillsSlice = createSlice({
  name: "waybills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWaybills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getWaybills.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Waybill[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.waybills = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getWaybills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.waybills = [];
      })
      .addCase(getWaybillById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(getWaybillById.fulfilled, (state, action: PayloadAction<Waybill>) => {
        state.loadingById = false;
        state.waybillById = action.payload;
      })
      .addCase(getWaybillById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload as string;
        state.waybillById = null;
      });
  },
});

export default waybillsSlice.reducer;
