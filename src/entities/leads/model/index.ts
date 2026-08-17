import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  GetLeadResponseDto,
  GetLeadsResponseDto,
  UpdateLeadStatusDto,
  UpdateLeadStatusResponseDto,
} from "entities/leads/dtos";
import { mapLeadDtoToEntity } from "entities/leads/mappers";
import type { Lead, LeadListQuery, LeadsState } from "entities/leads/types";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";

const initialState: LeadsState = {
  leads: [],
  leadById: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

const isLeadListSuccess = (
  response: GetLeadsResponseDto
): response is Extract<GetLeadsResponseDto, { success: true }> =>
  "success" in response && response.success === true && "data" in response;

const isLeadSuccess = (
  response: GetLeadResponseDto | UpdateLeadStatusResponseDto
): response is Extract<GetLeadResponseDto | UpdateLeadStatusResponseDto, { success: true }> =>
  "success" in response && response.success === true && "data" in response;

export const getLeads = createAsyncThunk<
  { data: Lead[]; total: number; page: number; limit: number },
  LeadListQuery,
  { rejectValue: string }
>("leads/getLeads", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetLeadsResponseDto>(
      `${BASE_URL}/leads`,
      { params }
    );

    if (isLeadListSuccess(response.data)) {
      return {
        data: response.data.data.map(mapLeadDtoToEntity),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    }

    return rejectWithValue("Ошибка загрузки заявок");
  } catch (err: any) {
    return rejectWithValue(err.message || "Ошибка сервера");
  }
});

export const getLeadById = createAsyncThunk<
  Lead,
  { id: string },
  { rejectValue: string }
>("leads/getLeadById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetLeadResponseDto>(
      `${BASE_URL}/leads/${id}`
    );

    if (isLeadSuccess(response.data)) {
      return mapLeadDtoToEntity(response.data.data);
    }

    return rejectWithValue("Ошибка загрузки заявки");
  } catch (err: any) {
    return rejectWithValue(err.message || "Ошибка сервера");
  }
});

export const updateLeadStatus = createAsyncThunk<
  Lead,
  { id: string; data: UpdateLeadStatusDto },
  { rejectValue: string }
>("leads/updateLeadStatus", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<UpdateLeadStatusResponseDto>(
      `${BASE_URL}/leads/${id}/status`,
      data
    );

    if (isLeadSuccess(response.data)) {
      return mapLeadDtoToEntity(response.data.data);
    }

    return rejectWithValue("Ошибка обновления статуса заявки");
  } catch (err: any) {
    return rejectWithValue(err.message || "Ошибка сервера");
  }
});

export const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearLeadById(state) {
      state.leadById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getLeads.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Lead[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.leads = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка загрузки заявок";
      })
      .addCase(getLeadById.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.leadById = action.payload;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.leadById = action.payload;
        state.leads = state.leads.map((lead) =>
          lead.id === action.payload.id ? action.payload : lead
        );
      });
  },
});

export const { clearLeadById } = leadsSlice.actions;
export default leadsSlice.reducer;
