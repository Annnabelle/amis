import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  isGetCurrentUserAccessSuccessResponse,
  type GetCurrentUserAccessResponseDto,
} from "entities/access/dtos";
import { mapCurrentUserAccessDtoToEntity } from "entities/access/mappers";
import type { AccessState, UserAccess } from "entities/access/types";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: AccessState = {
  data: null,
  currentCompanyId: null,
  loading: false,
  error: null,
};

export const fetchCurrentUserAccess = createAsyncThunk<
  UserAccess,
  void,
  { rejectValue: string }
>(
  "access/fetchCurrentUserAccess",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCurrentUserAccessResponseDto>(
        "/users/me/access"
      );

      if (isGetCurrentUserAccessSuccessResponse(response.data)) {
        return mapCurrentUserAccessDtoToEntity(response.data);
      }

      return rejectWithValue(
        getBackendErrorMessage(
          response.data,
          "Не удалось загрузить права доступа пользователя"
        )
      );
    } catch (error: unknown) {
      const responseData = (
        error as { response?: { data?: unknown } }
      ).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(
          responseData ?? error,
          "Не удалось загрузить права доступа пользователя"
        )
      );
    }
  }
);

export const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAccessData(state, action: PayloadAction<UserAccess>) {
      state.data = action.payload;
      state.error = null;
    },
    setCurrentCompanyId(state, action: PayloadAction<string | null>) {
      state.currentCompanyId = action.payload;
    },
    setAccessLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAccessError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearAccess(state) {
      state.data = null;
      state.currentCompanyId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserAccess.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUserAccess.rejected, (state, action) => {
        state.data = null;
        state.loading = false;
        state.error =
          action.payload ?? "Не удалось загрузить права доступа пользователя";
      });
  },
});

export const {
  setAccessData,
  setCurrentCompanyId,
  setAccessLoading,
  setAccessError,
  clearAccess,
} = accessSlice.actions;

export default accessSlice.reducer;
