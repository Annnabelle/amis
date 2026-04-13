import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { GetDeliveryTasksDto, GetDeliveryTasksResponseDto } from "entities/deliveryTasks/dtos";
import type { DeliveryTaskResponse, DeliveryTasksState } from "entities/deliveryTasks/types";
import { mapDeliveryTasksDtoToEntities } from "entities/deliveryTasks/mappers";

const initialState: DeliveryTasksState = {
  tasks: [],
  isLoading: false,
  error: null,
};

function isDeliveryTasksListSuccess(
  res: GetDeliveryTasksResponseDto
): res is { success: boolean; data: any[] } {
  return "success" in res && res.success === true && "data" in res;
}

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

export const deliveryTasksSlice = createSlice({
  name: "deliveryTasks",
  initialState,
  reducers: {},
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
      });
  },
});

export default deliveryTasksSlice.reducer;
