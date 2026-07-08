import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateSystemEmployeeDto,
  DeleteSystemEmployeeResponseDto,
  GetSystemEmployeesQueryDto,
  SystemEmployeeSingleResponseDto,
  SystemEmployeesResponseDto,
  UpdateSystemEmployeeDto,
} from "entities/systemEmployees/dtos";
import {
  isSystemEmployeeSingleResponseSuccess,
  isSystemEmployeesResponseSuccess,
} from "entities/systemEmployees/dtos";
import { mapSystemEmployeeDtoToEntity } from "entities/systemEmployees/mappers";
import type {
  SystemEmployee,
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
  SystemEmployee,
  CreateSystemEmployeeDto,
  { rejectValue: string }
>("systemEmployees/createInvitation", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<SystemEmployeeSingleResponseDto>(
      "/system/employees",
      payload
    );

    if (isSystemEmployeeSingleResponseSuccess(response.data)) {
      return mapSystemEmployeeDtoToEntity(response.data.data);
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
  SystemEmployee,
  { id: string; data: UpdateSystemEmployeeDto },
  { rejectValue: string }
>("systemEmployees/updateRoles", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<SystemEmployeeSingleResponseDto>(
      `/system/employees/${id}`,
      data
    );

    if (isSystemEmployeeSingleResponseSuccess(response.data)) {
      return mapSystemEmployeeDtoToEntity(response.data.data);
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
      .addCase(createSystemEmployeeInvitation.fulfilled, (state, action: PayloadAction<SystemEmployee>) => {
        const index = state.employees.findIndex((item) => item.id === action.payload.id);
        if (index >= 0) {
          state.employees[index] = action.payload;
          return;
        }
        state.employees.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateSystemEmployeeRoles.fulfilled, (state, action) => {
        state.employeeById = action.payload;
        state.employees = state.employees.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
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
