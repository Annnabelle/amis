import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateVehicleDto,
  DeleteVehicleResponseDto,
  GetVehiclesDto,
  UpdateVehicleDto,
  VehicleResponseEnvelopeDto,
  VehicleResponseDto,
  VehiclesResponseDto,
} from "entities/vehicles/dtos";
import { mapVehicleDtoToEntity } from "entities/vehicles/mappers";
import type { Vehicle, VehiclesState } from "entities/vehicles/types";
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

const isErrorDto = (data: unknown): data is { errorMessage: unknown } =>
  typeof data === "object" && data !== null && "errorMessage" in data;

const getVehiclesData = (
  response: VehiclesResponseDto
): { data: VehicleResponseDto[]; total: number; page: number; limit: number } | null => {
  if (isErrorDto(response)) return null;

  if ("data" in response && Array.isArray(response.data)) {
    return {
      data: response.data,
      total: "total" in response ? response.total : response.data.length,
      page: "page" in response ? response.page : 1,
      limit: "limit" in response ? response.limit : response.data.length,
    };
  }

  if ("vehicles" in response && Array.isArray(response.vehicles)) {
    return {
      data: response.vehicles,
      total: response.vehicles.length,
      page: 1,
      limit: response.vehicles.length,
    };
  }

  return null;
};

const getVehicleData = (response: VehicleResponseEnvelopeDto): VehicleResponseDto | null => {
  if (isErrorDto(response)) return null;
  if ("data" in response) return response.data;
  if ("vehicle" in response) return response.vehicle;
  if ("transport" in response) return response.transport;
  return null;
};

export const getVehicles = createAsyncThunk<
  { data: Vehicle[]; total: number; page: number; limit: number },
  GetVehiclesDto | undefined,
  { rejectValue: string }
>("vehicles/getAll", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<VehiclesResponseDto>("/vehicles", {
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
    const response = await axiosInstance.get<VehiclesResponseDto>("/vehicles/search", {
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
      const response = await axiosInstance.get<VehicleResponseEnvelopeDto>(`/vehicles/${id}`);
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

export const createVehicle = createAsyncThunk<Vehicle, CreateVehicleDto, { rejectValue: string }>(
  "vehicles/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<VehicleResponseEnvelopeDto>("/vehicles", payload);
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
    const response = await axiosInstance.patch<VehicleResponseEnvelopeDto>(`/vehicles/${id}`, data);
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
