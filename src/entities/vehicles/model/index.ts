import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VehicleResponseDto } from '@edem2000/amis.contracts/api/common/responses';
import type { GetVehiclesDto, UpdateVehicleDto, VerifyVehicleOwnershipDto } from '@edem2000/amis.contracts/api/vehicle/requests';
import type { DeleteVehicleResponseDto, GetVehicleResponseDto, GetVehiclesResponseDto, VerifyVehicleOwnershipResponseDto } from '@edem2000/amis.contracts/api/vehicle/responses';
import type { CreateVehicleRequestDto } from 'entities/vehicles/dtos';
import { VEHICLE_OWNERSHIP_NOT_FOUND_ERROR_CODE } from 'entities/vehicles/lib/errorCodes';
import {
  mapVehicleDtoToEntity,
  mapVehicleOwnershipDtoToEntity,
} from "entities/vehicles/mappers";
import type {
  Vehicle,
  VehicleOwnershipCheck,
  VehiclesState,
} from "entities/vehicles/types";
import axiosInstance from "shared/lib/axiosInstance";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

const initialState: VehiclesState = {
  vehicles: [],
  vehicleById: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  loadingById: false,
  error: null,
};

const getVehiclesData = (
  response: GetVehiclesResponseDto
): { data: VehicleResponseDto[]; total: number; page: number; limit: number } | null => {
  if (!response.success) return null;

  return {
    data: response.data,
    total: response.total,
    page: response.page,
    limit: response.limit,
  };
};

const getVehicleData = (response: GetVehicleResponseDto): VehicleResponseDto | null =>
  response.success ? response.transport : null;

export const getVehicles = createAsyncThunk<
  { data: Vehicle[]; total: number; page: number; limit: number },
  GetVehiclesDto | undefined,
  { rejectValue: string }
>("vehicles/getAll", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetVehiclesResponseDto>("/vehicles", {
      params,
    });
    const payload = getVehiclesData(response.data);

    if (payload) {
      return {
        data: payload.data.map(mapVehicleDtoToEntity),
        total: payload.total,
        page: payload.page,
        limit: payload.limit,
      };
    }

    return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось загрузить транспорт"));
  } catch (error) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось загрузить транспорт"));
  }
});

export const searchVehicles = createAsyncThunk<
  { data: Vehicle[]; total: number; page: number; limit: number },
  GetVehiclesDto,
  { rejectValue: string }
>("vehicles/search", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetVehiclesResponseDto>("/vehicles/search", {
      params,
    });
    const payload = getVehiclesData(response.data);

    if (payload) {
      return {
        data: payload.data.map(mapVehicleDtoToEntity),
        total: payload.total,
        page: payload.page,
        limit: payload.limit,
      };
    }

    return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось найти транспорт"));
  } catch (error) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось найти транспорт"));
  }
});

export const getVehicleById = createAsyncThunk<Vehicle, string, { rejectValue: string }>(
  "vehicles/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetVehicleResponseDto>(`/vehicles/${id}`);
      const vehicle = getVehicleData(response.data);

      if (vehicle) {
        return mapVehicleDtoToEntity(vehicle);
      }

      return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось загрузить транспорт"));
    } catch (error) {
      const responseData = (error as { response?: { data?: unknown } }).response?.data;
      return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось загрузить транспорт"));
    }
  }
);

export const verifyVehicleOwnership = createAsyncThunk<
  VehicleOwnershipCheck,
  VerifyVehicleOwnershipDto,
  { rejectValue: string }
>("vehicles/verifyOwnership", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<VerifyVehicleOwnershipResponseDto>(
      "/vehicles/ownership",
      { params }
    );

    if ("ownership" in response.data && response.data.ownership) {
      return {
        status: "found",
        ownership: mapVehicleOwnershipDtoToEntity(response.data.ownership),
      };
    }

    return rejectWithValue(
      getBackendErrorMessage(response.data, "Не удалось проверить владельца транспорта")
    );
  } catch (error) {
    const response = (error as {
      response?: { status?: number; data?: { errorCode?: number } };
    }).response;

    if (
      response?.status === 404 ||
      response?.data?.errorCode === VEHICLE_OWNERSHIP_NOT_FOUND_ERROR_CODE
    ) {
      return {
        status: "not-registered",
        message: getBackendErrorMessage(response?.data, "Транспорт не найден в государственном реестре"),
      };
    }

    return rejectWithValue(
      getBackendErrorMessage(response?.data ?? error, "Не удалось проверить владельца транспорта")
    );
  }
});

export const createVehicle = createAsyncThunk<Vehicle, CreateVehicleRequestDto, { rejectValue: string }>(
  "vehicles/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<GetVehicleResponseDto>("/vehicles", payload);
      const vehicle = getVehicleData(response.data);

      if (vehicle) {
        return mapVehicleDtoToEntity(vehicle);
      }

      return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось создать транспорт"));
    } catch (error) {
      const responseData = (error as { response?: { data?: unknown } }).response?.data;
      return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось создать транспорт"));
    }
  }
);

export const updateVehicle = createAsyncThunk<
  Vehicle,
  { id: string; data: UpdateVehicleDto },
  { rejectValue: string }
>("vehicles/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<GetVehicleResponseDto>(`/vehicles/${id}`, data);
    const vehicle = getVehicleData(response.data);

    if (vehicle) {
      return mapVehicleDtoToEntity(vehicle);
    }

    return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось обновить транспорт"));
  } catch (error) {
    const responseData = (error as { response?: { data?: unknown } }).response?.data;
    return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось обновить транспорт"));
  }
});

export const deleteVehicle = createAsyncThunk<string, string, { rejectValue: string }>(
  "vehicles/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteVehicleResponseDto>(`/vehicles/${id}`);

      if (response.data.success) {
        return id;
      }

      return rejectWithValue(getBackendErrorMessage(response.data, "Не удалось удалить транспорт"));
    } catch (error) {
      const responseData = (error as { response?: { data?: unknown } }).response?.data;
      return rejectWithValue(getBackendErrorMessage(responseData ?? error, "Не удалось удалить транспорт"));
    }
  }
);

export const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    clearVehicleById(state) {
      state.vehicleById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Не удалось загрузить транспорт";
      })
      .addCase(searchVehicles.fulfilled, (state, action) => {
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getVehicleById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.loadingById = false;
        state.vehicleById = action.payload;
      })
      .addCase(getVehicleById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload ?? "Не удалось загрузить транспорт";
      })
      .addCase(createVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
        state.vehicles = [action.payload, ...state.vehicles];
        state.total += 1;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.vehicleById = action.payload;
        state.vehicles = state.vehicles.map((vehicle) =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        );
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter((vehicle) => vehicle.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.vehicleById?.id === action.payload) {
          state.vehicleById = null;
        }
      });
  },
});

export const { clearVehicleById } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
