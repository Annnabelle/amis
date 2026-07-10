import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateSystemEmployeeDto,
  DeleteSystemEmployeeResponseDto,
  GetSystemEmployeesQueryDto,
  SystemEmployeeAccessResponseDto,
  SystemEmployeeSingleResponseDto,
  SystemEmployeesResponseDto,
  UpdateSystemEmployeeDto,
} from "entities/systemEmployees/dtos";
import {
  isSystemEmployeeAccessResponseSuccess,
  isSystemEmployeeSingleResponseSuccess,
  isSystemEmployeesResponseSuccess,
} from "entities/systemEmployees/dtos";
import {
  mapSystemEmployeeAccessDtoToEntity,
  mapSystemEmployeeDtoToEntity,
} from "entities/systemEmployees/mappers";
import type {
  SystemEmployee,
  SystemEmployeeAccess,
  SystemEmployeeListQuery,
  SystemEmployeesState,
} from "entities/systemEmployees/types";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: SystemEmployeesState = {
  employees: [],
  employeeById: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

export const getSystemEmployees = createAsyncThunk<
  { data: SystemEmployee[]; total: number; page: number; limit: number },
  SystemEmployeeListQuery,
  { rejectValue: string }
>("systemEmployees/getAll", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<SystemEmployeesResponseDto>(
      "/system/employees",
      { params: params as GetSystemEmployeesQueryDto }
    );

    if (isSystemEmployeesResponseSuccess(response.data)) {
      return {
        data: response.data.data.map(mapSystemEmployeeDtoToEntity),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось загрузить системных сотрудников")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось загрузить системных сотрудников")
    );
  }
});

export const getSystemEmployeeById = createAsyncThunk<
  SystemEmployee,
  { id: string },
  { rejectValue: string }
>("systemEmployees/getById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<SystemEmployeeSingleResponseDto>(
      `/system/employees/${id}`
    );

    if (isSystemEmployeeSingleResponseSuccess(response.data)) {
      return mapSystemEmployeeDtoToEntity(response.data.data);
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось загрузить системного сотрудника")
    );
  } catch (error: unknown) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(
      getBackendErrorMessage(responseData ?? error, "Не удалось загрузить системного сотрудника")
    );
  }
});

export const createSystemEmployeeInvitation = createAsyncThunk<
  SystemEmployeeAccess,
  CreateSystemEmployeeDto,
  { rejectValue: string }
>("systemEmployees/createInvitation", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<SystemEmployeeAccessResponseDto>(
      "/system/employees",
      payload
    );

    if (isSystemEmployeeAccessResponseSuccess(response.data)) {
      return mapSystemEmployeeAccessDtoToEntity(response.data.data);
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

export const updateSystemEmployeeRoles = createAsyncThunk<
  SystemEmployeeAccess,
  { id: string; data: UpdateSystemEmployeeDto },
  { rejectValue: string }
>("systemEmployees/updateRoles", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<SystemEmployeeAccessResponseDto>(
      `/system/employees/${id}`,
      data
    );

    if (isSystemEmployeeAccessResponseSuccess(response.data)) {
      return mapSystemEmployeeAccessDtoToEntity(response.data.data);
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

export const deleteSystemEmployee = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("systemEmployees/delete", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<DeleteSystemEmployeeResponseDto>(
      `/system/employees/${id}`
    );

    if (response.data.success === true) {
      return { id };
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

export const systemEmployeesSlice = createSlice({
  name: "systemEmployees",
  initialState,
  reducers: {
    clearSystemEmployeeById(state) {
      state.employeeById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSystemEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSystemEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getSystemEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось загрузить системных сотрудников";
      })
      .addCase(getSystemEmployeeById.fulfilled, (state, action) => {
        state.employeeById = action.payload;
      })
      .addCase(createSystemEmployeeInvitation.fulfilled, (state, action: PayloadAction<SystemEmployeeAccess>) => {
        const index = state.employees.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.employees[index] = {
            ...state.employees[index],
            roles: action.payload.roles,
            state: action.payload.state,
            createdBy: action.payload.createdBy,
            updatedBy: action.payload.updatedBy,
            createdAt: action.payload.createdAt ?? state.employees[index].createdAt,
            updatedAt: action.payload.updatedAt ?? state.employees[index].updatedAt,
          };
        }
      })
      .addCase(updateSystemEmployeeRoles.fulfilled, (state, action) => {
        const applyAccess = (item: SystemEmployee): SystemEmployee =>
          item.id === action.payload.id
            ? {
                ...item,
                roles: action.payload.roles,
                state: action.payload.state,
                createdBy: action.payload.createdBy,
                updatedBy: action.payload.updatedBy,
                createdAt: action.payload.createdAt ?? item.createdAt,
                updatedAt: action.payload.updatedAt ?? item.updatedAt,
              }
            : item;

        state.employees = state.employees.map(applyAccess);
        if (state.employeeById?.id === action.payload.id) {
          state.employeeById = applyAccess(state.employeeById);
        }
      })
      .addCase(deleteSystemEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.map((item) =>
          item.id === action.payload.id
            ? { ...item, state: "disabled" }
            : item
        );
        if (state.employeeById?.id === action.payload.id) {
          state.employeeById = { ...state.employeeById, state: "disabled" };
        }
      });
  },
});

export const { clearSystemEmployeeById } = systemEmployeesSlice.actions;

export default systemEmployeesSlice.reducer;
