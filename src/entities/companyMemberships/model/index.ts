import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CompanyMembershipResponseDto,
  CompanyMembershipsResponseDto,
  CreateCompanyMembershipDto,
  GetCompanyMembershipsQueryDto,
  UpdateCompanyMembershipDto,
} from "entities/companyMemberships/dtos";
import {
  isCompanyMembershipResponseSuccess,
  isCompanyMembershipsResponseSuccess,
} from "entities/companyMemberships/dtos";
import { mapCompanyMembershipDtoToEntity } from "entities/companyMemberships/mappers";
import type {
  CompanyMembership,
  CompanyMembershipListQuery,
  CompanyMembershipsState,
} from "entities/companyMemberships/types";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: CompanyMembershipsState = {
  memberships: [],
  membershipById: null,
  total: 0,
  page: 1,
  limit: 10,
  listRequestKey: null,
  isLoading: false,
  error: null,
};

const getCompanyMembershipsRequestKey = ({
  companyId,
  page,
  limit,
  state,
  role,
}: CompanyMembershipListQuery) =>
  [companyId, page, limit, state ?? "", role ?? ""].join("|");

export const getCompanyMemberships = createAsyncThunk<
  { data: CompanyMembership[]; total: number; page: number; limit: number },
  CompanyMembershipListQuery,
  { rejectValue: string }
>("companyMemberships/getAll", async ({ companyId, ...params }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CompanyMembershipsResponseDto>(
      "/company-memberships",
      {
        params: params as GetCompanyMembershipsQueryDto,
        headers: { "x-company-id": companyId },
      }
    );

    if (isCompanyMembershipsResponseSuccess(response.data)) {
      return {
        data: response.data.data.map(mapCompanyMembershipDtoToEntity),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось загрузить сотрудников компании")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось загрузить сотрудников компании")
    );
  }
}, {
  condition: (query, { getState }) => {
    const state = getState() as { companyMemberships: CompanyMembershipsState };
    const requestKey = getCompanyMembershipsRequestKey(query);
    const membershipsState = state.companyMemberships;

    return !(
      membershipsState.isLoading &&
      membershipsState.listRequestKey === requestKey
    );
  },
});

export const getCompanyMembershipById = createAsyncThunk<
  CompanyMembership,
  { companyId: string; id: string },
  { rejectValue: string }
>("companyMemberships/getById", async ({ companyId, id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<CompanyMembershipResponseDto>(
      `/company-memberships/${id}`,
      { headers: { "x-company-id": companyId } }
    );

    if (isCompanyMembershipResponseSuccess(response.data)) {
      return mapCompanyMembershipDtoToEntity(response.data.data);
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось загрузить сотрудника компании")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось загрузить сотрудника компании")
    );
  }
});

export const createCompanyMembershipInvitation = createAsyncThunk<
  CompanyMembership,
  { companyId: string; data: CreateCompanyMembershipDto },
  { rejectValue: string }
>("companyMemberships/createInvitation", async ({ companyId, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<CompanyMembershipResponseDto>(
      "/company-memberships",
      data,
      { headers: { "x-company-id": companyId } }
    );

    if (isCompanyMembershipResponseSuccess(response.data)) {
      return mapCompanyMembershipDtoToEntity(response.data.data);
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось отправить приглашение")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось отправить приглашение")
    );
  }
});

export const updateCompanyMembershipRoles = createAsyncThunk<
  CompanyMembership,
  { companyId: string; id: string; data: UpdateCompanyMembershipDto },
  { rejectValue: string }
>("companyMemberships/updateRoles", async ({ companyId, id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<CompanyMembershipResponseDto>(
      `/company-memberships/${id}`,
      data,
      { headers: { "x-company-id": companyId } }
    );

    if (isCompanyMembershipResponseSuccess(response.data)) {
      return mapCompanyMembershipDtoToEntity(response.data.data);
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось обновить роли")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось обновить роли")
    );
  }
});

export const deleteCompanyMembership = createAsyncThunk<
  CompanyMembership,
  { companyId: string; id: string },
  { rejectValue: string }
>("companyMemberships/delete", async ({ companyId, id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<CompanyMembershipResponseDto>(
      `/company-memberships/${id}`,
      { headers: { "x-company-id": companyId } }
    );

    if (isCompanyMembershipResponseSuccess(response.data)) {
      return mapCompanyMembershipDtoToEntity(response.data.data);
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось отозвать доступ")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось отозвать доступ")
    );
  }
});

export const companyMembershipsSlice = createSlice({
  name: "companyMemberships",
  initialState,
  reducers: {
    clearCompanyMembershipById(state) {
      state.membershipById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyMemberships.pending, (state, action) => {
        state.isLoading = true;
        state.listRequestKey = getCompanyMembershipsRequestKey(action.meta.arg);
        state.error = null;
      })
      .addCase(getCompanyMemberships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listRequestKey = null;
        state.memberships = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getCompanyMemberships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось загрузить сотрудников компании";
      })
      .addCase(getCompanyMembershipById.fulfilled, (state, action) => {
        state.membershipById = action.payload;
      })
      .addCase(createCompanyMembershipInvitation.fulfilled, (state, action: PayloadAction<CompanyMembership>) => {
        const index = state.memberships.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.memberships[index] = {
            ...state.memberships[index],
            ...action.payload,
            user: action.payload.user ?? state.memberships[index].user,
          };
        }
      })
      .addCase(updateCompanyMembershipRoles.fulfilled, (state, action) => {
        state.membershipById = {
          ...action.payload,
          user: state.membershipById?.id === action.payload.id
            ? state.membershipById.user
            : action.payload.user,
        };
        state.memberships = state.memberships.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload, user: action.payload.user ?? item.user }
            : item
        );
      })
      .addCase(deleteCompanyMembership.fulfilled, (state, action) => {
        state.membershipById = {
          ...action.payload,
          user: state.membershipById?.id === action.payload.id
            ? state.membershipById.user
            : action.payload.user,
        };
        state.memberships = state.memberships.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload, user: action.payload.user ?? item.user }
            : item
        );
      });
  },
});

export const { clearCompanyMembershipById } = companyMembershipsSlice.actions;

export default companyMembershipsSlice.reducer;
