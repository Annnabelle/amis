import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type {Company, OrganizationState} from "entities/organization/types";
import type { ActivateCompanyDto, DeleteCompanyDto, GetCompaniesDto, GetCompanyDto, UpdateCompanyDto } from '@edem2000/amis.contracts/api/companies/requests';
import type { ActivateCompanyResponseDto, DeleteCompanyResponseDto, GetCompaniesResponseDto, GetCompanyByTinResponseDto, GetCompanyResponseDto, UpdateCompanyResponseDto } from '@edem2000/amis.contracts/api/companies/responses';
import {mapCreateOrganizationDtoToEntity, mapOrganizationDtoToEntity} from "entities/organization/mappers";

const initialState: OrganizationState = {
  organization: null,
  organizationById: null,
  updateOrganization: null,
  organizations: [],
  searchedOrganizations: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  status: null,
};


export const getAllOrganizations = createAsyncThunk(
  'organizations/getAllOrganizations',
  async (params: GetCompaniesDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCompaniesResponseDto>(`${BASE_URL}/companies`, {
        params,
      });
      if (response.data.success) {
        return {
          data: response.data.data.map(mapOrganizationDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }
      return rejectWithValue("Ошибка загрузки компаний");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const createOrganization = createAsyncThunk(
  "organizations/createOrganization",
  async (payload: ActivateCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ActivateCompanyResponseDto>(
        `${BASE_URL}/companies`,
        payload
      );

      if (response.data.success) {
        return mapCreateOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue(response.data);
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: { ru: err.response?.data?.errorMessage?.ru ?? err.message, uz: err.response?.data?.errorMessage?.uz ?? err.message, en: err.response?.data?.errorMessage?.en ?? err.message },
            errorCode: 0,
        });
    }
  }
);


export const getOrganizationById = createAsyncThunk(
  "organizations/getOrganizationById",
  async (params: GetCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCompanyResponseDto>(
        `${BASE_URL}/companies/${params.id}`
      );

      if (response.data.success) {
        return mapOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue("Ошибка загрузки компании");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const updateOrganization = createAsyncThunk(
  "company/updateOrganization",
  async ({ id, data }: { id: string; data: UpdateCompanyDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UpdateCompanyResponseDto>(
        `${BASE_URL}/companies/${id}`,
        data
      );

      if (response.data.success) {
        return mapOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue("Ошибка обновления организации");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const deleteOrganization = createAsyncThunk(
  "company/deleteOrganization",
  async ({ id }: DeleteCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteCompanyResponseDto>(
        `${BASE_URL}/companies/${id}`
      );

      if (response.data.success) {
        return { id }; 
      }

      return rejectWithValue("Ошибка при удалении организации");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const searchOrganizations = createAsyncThunk(
  'organizations/searchOrganizations',
  async ({ query, page = 1, limit = 10, sortOrder = 'asc' }: { query: string; page?: number; limit?: number; sortOrder?: 'asc' | 'desc' }) => {
    const response = await axiosInstance.get<GetCompaniesResponseDto>(`/companies/search`, {
      params: { query, page, limit, sortOrder }
    });

    if (!response.data.success) {
      throw new Error(getBackendErrorMessage(response.data, "Не удалось выполнить поиск компаний"));
    }

    const { data, total, page: current, limit: perPage } = response.data;

    return { data, total, page: current, limit: perPage };
  }
);

export const getCompanyByTin = createAsyncThunk(
  'organizations/getCompanyByTin',
  async (tin: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCompanyByTinResponseDto>(
        `/companies/by-tin/${encodeURIComponent(tin)}`
      );

      if (response.data.success) {
        return mapOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "Не удалось загрузить компанию по ИНН")
      );
    } catch (error: unknown) {
      const responseData = (error as { response?: { data?: unknown } }).response?.data;

      return rejectWithValue(
        getBackendErrorMessage(responseData ?? error, "Не удалось загрузить компанию по ИНН")
      );
    }
  }
);


export const organizationsSlice = createSlice({ 
  name: 'organizations',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllOrganizations.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: Company[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.organizations = action.payload.data;
          state.searchedOrganizations = [];
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getAllOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchOrganizations.fulfilled, (state, action) => {
        const { data = [], total, page, limit } = action.payload;

        state.isLoading = false;
        state.searchedOrganizations = data.map(mapOrganizationDtoToEntity);

        state.total = total;
        state.page = page;
        state.limit = limit;
    })
    .addCase(searchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? action.error.message ?? null;
    })
    .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(createOrganization.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isLoading = false;
        state.organizations.push(action.payload); 
    })
    .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    })
    .addCase(getOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(getOrganizationById.fulfilled, (state, action: PayloadAction<Company>) => {
        state.isLoading = false;
        state.organizationById = action.payload;
    })
    .addCase(getOrganizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
    })
    .addCase(updateOrganization.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(updateOrganization.fulfilled, (state, action) => {
      state.isLoading = false;
      state.updateOrganization = action.payload; 
    })
    .addCase(updateOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })
    .addCase(deleteOrganization.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(deleteOrganization.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      state.isLoading = false;
      state.organizations = state.organizations.filter((o) => o.id !== action.payload.id);
      if (state.organizationById?.id === action.payload.id) {
        state.organizationById = null;
      }
    })
    .addCase(deleteOrganization.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })
  },
});

export default organizationsSlice.reducer;


