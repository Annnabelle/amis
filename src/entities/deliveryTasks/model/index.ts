import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type {
  CompleteDeliveryTaskDto,
  GetDeliveryTaskResponseDto,
  GetDeliveryTasksDto,
  GetDeliveryTasksResponseDto,
} from "entities/deliveryTasks/dtos";
import type { DeliveryTaskResponse, DeliveryTasksState } from "entities/deliveryTasks/types";
import { mapDeliveryTaskDtoToEntity, mapDeliveryTasksDtoToEntities } from "entities/deliveryTasks/mappers";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import type { ErrorDto } from "shared/types/dtos";

const initialState: DeliveryTasksState = {
  tasks: [],
  taskById: null,
  isLoading: false,
  loadingById: false,
  error: null,
};

function isDeliveryTasksListSuccess(
  res: GetDeliveryTasksResponseDto
): res is { success: boolean; data: any[] } {
  return "success" in res && res.success === true && "data" in res;
}

const mapSingleTaskResponse = (
  data: GetDeliveryTaskResponseDto
): { success: boolean; deliveryTask?: DeliveryTaskResponse; error?: ErrorDto } => {
  if ("errorCode" in data) {
    return { success: false, error: data };
  }

  if (data.success && data.deliveryTask) {
    return {
      success: true,
      deliveryTask: mapDeliveryTaskDtoToEntity(data.deliveryTask),
    };
  }

  return {
    success: false,
    error: {
      success: false,
      errorCode: 100,
      errorMessage: {
        ru: "Неизвестный формат ответа сервера",
        en: "Unknown server response format",
        uz: "Server javobining noma'lum formati",
      },
    },
  };
};

export const getDeliveryTasks = createAsyncThunk(
  "deliveryTasks/getDeliveryTasks",
  async ({ routeId }: GetDeliveryTasksDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetDeliveryTasksResponseDto>(
        `${BASE_URL}/delivery-routes/${routeId}/tasks`
      );

      if (isDeliveryTasksListSuccess(response.data)) {
        return mapDeliveryTasksDtoToEntities(response.data.data);
      }

      return rejectWithValue("Ошибка загрузки задач доставки");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const getDeliveryTaskById = createAsyncThunk(
  "deliveryTasks/getDeliveryTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetDeliveryTaskResponseDto>(
        `${BASE_URL}/delivery-tasks/${id}`
      );

      const mapped = mapSingleTaskResponse(response.data);
      if (mapped.success && mapped.deliveryTask) {
        return mapped.deliveryTask;
      }

      return rejectWithValue(mapped.error);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data ?? {
          success: false,
          errorCode: 500,
          errorMessage: {
            ru: "Ошибка сервера",
            en: "Server error",
            uz: "Server xatosi",
          },
        }
      );
    }
  }
);

export const startDeliveryTaskDelivery = createAsyncThunk<
  DeliveryTaskResponse,
  string,
  { rejectValue: ErrorDto }
>("deliveryTasks/startDeliveryTaskDelivery", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<GetDeliveryTaskResponseDto>(
      `${BASE_URL}/delivery-tasks/${id}/start-handover`
    );

    const mapped = mapSingleTaskResponse(data);
    if (mapped.success && mapped.deliveryTask) {
      return mapped.deliveryTask;
    }

    return rejectWithValue(mapped.error as ErrorDto);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data ?? {
        success: false,
        errorCode: 500,
        errorMessage: {
          ru: "Ошибка сервера",
          en: "Server error",
          uz: "Server xatosi",
        },
      }
    );
  }
});

export const completeDeliveryTaskDelivery = createAsyncThunk<
  DeliveryTaskResponse,
  { id: string; payload?: CompleteDeliveryTaskDto },
  { rejectValue: ErrorDto }
>("deliveryTasks/completeDeliveryTaskDelivery", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<GetDeliveryTaskResponseDto>(
      `${BASE_URL}/delivery-tasks/${id}/complete-handover`,
      payload ?? {}
    );

    const mapped = mapSingleTaskResponse(data);
    if (mapped.success && mapped.deliveryTask) {
      return mapped.deliveryTask;
    }

    return rejectWithValue(mapped.error as ErrorDto);
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data ?? {
        success: false,
        errorCode: 500,
        errorMessage: {
          ru: "Ошибка сервера",
          en: "Server error",
          uz: "Server xatosi",
        },
      }
    );
  }
});

export const deliveryTasksSlice = createSlice({
  name: "deliveryTasks",
  initialState,
  reducers: {
    clearDeliveryTaskById: (state) => {
      state.taskById = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getDeliveryTasks.fulfilled,
        (state, action: PayloadAction<DeliveryTaskResponse[]>) => {
          state.isLoading = false;
          state.tasks = action.payload;
        }
      )
      .addCase(getDeliveryTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.tasks = [];
      })
      .addCase(getDeliveryTaskById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(getDeliveryTaskById.fulfilled, (state, action: PayloadAction<DeliveryTaskResponse>) => {
        state.loadingById = false;
        state.taskById = action.payload;
      })
      .addCase(getDeliveryTaskById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = getBackendErrorMessage(action.payload, "Error loading delivery task");
      })
      .addCase(startDeliveryTaskDelivery.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(startDeliveryTaskDelivery.fulfilled, (state, action: PayloadAction<DeliveryTaskResponse>) => {
        state.loadingById = false;
        state.taskById = action.payload;
        state.tasks = state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task));
      })
      .addCase(startDeliveryTaskDelivery.rejected, (state, action) => {
        state.loadingById = false;
        state.error = getBackendErrorMessage(action.payload, "Не удалось начать доставку");
      })
      .addCase(completeDeliveryTaskDelivery.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(
        completeDeliveryTaskDelivery.fulfilled,
        (state, action: PayloadAction<DeliveryTaskResponse>) => {
          state.loadingById = false;
          state.taskById = action.payload;
          state.tasks = state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task));
        }
      )
      .addCase(completeDeliveryTaskDelivery.rejected, (state, action) => {
        state.loadingById = false;
        state.error = getBackendErrorMessage(action.payload, "Не удалось завершить доставку");
      });
  },
});

export const { clearDeliveryTaskById } = deliveryTasksSlice.actions;
export default deliveryTasksSlice.reducer;
