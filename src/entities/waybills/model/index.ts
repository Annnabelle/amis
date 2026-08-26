import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  GetWaybillDto,
  GetWaybillResponseDto,
  GetWaybillsDto,
  GetWaybillsResponseDto,
} from "entities/waybills/dtos";
import { mapWaybillDtoToEntity } from "entities/waybills/mappers";
import type { WaybillResponse, WaybillsState } from "entities/waybills/types";
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

function isWaybillsListSuccess(
  res: GetWaybillsResponseDto
): res is { data: WaybillResponse[]; total: number; page: number; limit: number } {
  return "data" in res && Array.isArray(res.data);
}

function isWaybillEnvelopeSuccess(
  res: GetWaybillResponseDto
): res is { success: boolean; waybill: WaybillResponse } {
  return typeof res === "object" && res !== null && "waybill" in res;
}

function isWaybillDirectSuccess(
  res: GetWaybillResponseDto
): res is WaybillResponse {
  return typeof res === "object" && res !== null && "id" in res && "waybillNumber" in res;
}

export const getWaybills = createAsyncThunk(
  "waybills/getWaybills",
  async (params: GetWaybillsDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetWaybillsResponseDto>(
        `${BASE_URL}/waybills`,
        { params }
      );

      if (isWaybillsListSuccess(response.data)) {
        return {
          data: response.data.data.map(mapWaybillDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }

      return rejectWithValue("Error loading waybills");
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

      if (isWaybillEnvelopeSuccess(response.data)) {
        return mapWaybillDtoToEntity(response.data.waybill);
      }

      if (isWaybillDirectSuccess(response.data)) {
        return mapWaybillDtoToEntity(response.data);
      }

      return rejectWithValue("Error loading waybill");
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
            data: WaybillResponse[];
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
      .addCase(getWaybillById.fulfilled, (state, action: PayloadAction<WaybillResponse>) => {
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
