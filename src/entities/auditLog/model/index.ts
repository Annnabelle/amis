import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GetAuditLogsDto } from '@edem2000/amis.contracts/api/audit-logs/requests';
import type { GetAuditLogsResponseDto } from '@edem2000/amis.contracts/api/audit-logs/responses';
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import { mapAuditLogResponseDtoToEntity } from "entities/auditLog/mappers";
import type { AuditLog } from "entities/auditLog/types";


// 🔹 AsyncThunk возвращает уже отмапленный удобный формат
export const fetchAuditLogs = createAsyncThunk<
  { data: AuditLog[]; total: number; page: number; limit: number }, // return type
  GetAuditLogsDto, // аргументы
  { rejectValue: string } // ошибки
>(
  "auditLogs/fetchAuditLogs",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetAuditLogsResponseDto>(`${BASE_URL}/audit`, {
        params,
      });

      if (response.data.success) {
        return {
          data: response.data.data.map(mapAuditLogResponseDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }
      return rejectWithValue("Ошибка загрузки логов аудита");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

type AuditLogsState = {
  data: AuditLog[];
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  error: string | null;
};

const initialState: AuditLogsState = {
  data: [],
  page: 1,
  total: 10,
  limit: 10,
  loading: false,
  error: null,
};

export const auditLogsSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    resetAuditLogs: (state) => {
      state.data = [];
      state.page = 1;
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuditLogs.fulfilled,
        (
          state,
          action: PayloadAction<{ data: AuditLog[]; total: number; page: number; limit: number }>
        ) => {
          state.data = action.payload.data;
          state.page = action.payload.page;
          state.total = action.payload.total;
          state.limit = action.payload.limit;
          state.loading = false;
        }
      )
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при загрузке";
      });
  },
});

export const { resetAuditLogs } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;


