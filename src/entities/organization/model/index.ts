import type { PaginatedResponseDto } from "shared/types/dtos";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type {CompanyResponse, OrganizationState} from "entities/organization/types";
import type {
    CompanyResponseDto,
    CreateCompanyDto,
    DeleteCompanyDto,
    DeleteCompanyResponseDto,
    GetCompaniesDto,
    GetCompaniesResponseDto,
    GetCompanyDto,
    GetCompanyResponseDto,
    UpdateCompanyDto,
    UpdateCompanyResponseDto,
} from "entities/organization/dtos";
import {mapCreateOrganizationDtoToEntity, mapOrganizationDtoToEntity} from "entities/organization/mappers";

const initialState: OrganizationState = {
  organization: null,
  organizationById: null,
  updateOrganization: null,
  organizations: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  status: null,
};


function isSuccessResponse(res: GetCompaniesResponseDto): res is { success: boolean } & PaginatedResponseDto<CompanyResponseDto> {
  return "success" in res && res.success === true;
}

export const getAllOrganizations = createAsyncThunk(
  'organizations/getAllOrganizations',
  async (params: GetCompaniesDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCompaniesResponseDto>(`${BASE_URL}/companies`, {
        params,
      });
      if (isSuccessResponse(response.data)) {
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


function isCompanyCreateSuccessResponse(
  res: CompanyResponseDto
): res is CompanyResponseDto & { success: boolean; company: CompanyResponseDto } {
  return "success" in res && res.success === true && "company" in res;
}

export const createOrganization = createAsyncThunk(
  "organizations/createOrganization",
  async (payload: CreateCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CompanyResponseDto>(
        `${BASE_URL}/companies`,
        payload
      );

        console.log("CreateCompany response:", response.data);

      if (isCompanyCreateSuccessResponse(response.data)) {
        return mapCreateOrganizationDtoToEntity(response.data);
      }

      return rejectWithValue("Ошибка регистрации компании");
    } catch (err: any) {
        return rejectWithValue({
            errorMessage: { ru: err.message, uz: err.message, en: err.message },
            errorCode: 0,
        });
    }
  }
);


function isGetCompanySuccessResponse(
  res: GetCompanyResponseDto
): res is { success: boolean; company: CompanyResponseDto } {
  return "success" in res && res.success === true && "company" in res;
}

export const getOrganizationById = createAsyncThunk(
  "organizations/getOrganizationById",
  async (params: GetCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetCompanyResponseDto>(
        `${BASE_URL}/companies/${params.id}`
      );

      if (isGetCompanySuccessResponse(response.data)) {
        return mapOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue("Ошибка загрузки компании");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isUpdateOrganizationSuccessResponse(
  res: UpdateCompanyResponseDto
): res is { success: boolean; company: CompanyResponseDto } {
  return "success" in res && res.success === true && "company" in res;
}

export const updateOrganization = createAsyncThunk(
  "company/updateOrganization",
  async ({ id, data }: { id: string; data: UpdateCompanyDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UpdateCompanyResponseDto>(
        `${BASE_URL}/companies/${id}`,
        data
      );

      if (isUpdateOrganizationSuccessResponse(response.data)) {
        return mapOrganizationDtoToEntity(response.data.company);
      }

      return rejectWithValue("Ошибка обновления организации");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isDeleteOrganizationSuccessResponse(
  res: DeleteCompanyResponseDto
): res is { success: boolean } {
  return "success" in res && res.success === true;
}

export const deleteOrganization = createAsyncThunk(
  "company/deleteOrganization",
  async ({ id }: DeleteCompanyDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteCompanyResponseDto>(
        `${BASE_URL}/companies/${id}`
      );

      if (isDeleteOrganizationSuccessResponse(response.data)) {
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
    const response = await axiosInstance.get(`/companies/search`, {
      params: { query, page, limit, sortOrder }
    });
    return response.data;
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
            data: CompanyResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.organizations = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getAllOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(searchOrganizations.fulfilled, (state, action) => {
        const { data = [], total, page, limit } = action.payload;

        state.organizations = data.map((organization: any) => ({
            id: organization.id,
            displayName: organization.displayName,
            director: organization.director,
            legalName: organization.legalName,
            contacts: organization.contacts ? {
                phone: organization.contacts.phone
            } : {},
            status: organization.status,
        }));

        state.total = total;
        state.page = page;
        state.limit = limit;
    })
    .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
    })
    .addCase(createOrganization.fulfilled, (state, action: PayloadAction<CompanyResponse>) => {
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
    .addCase(getOrganizationById.fulfilled, (state, action: PayloadAction<CompanyResponse>) => {
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



