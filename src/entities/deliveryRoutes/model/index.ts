import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { ErrorDto } from "shared/types/dtos";
import type {
  CreateDeliveryRouteDto,
  CreateDeliveryRouteResponseDto,
  GetDeliveryRoutesDto,
  GetDeliveryRoutesResponseDto,
  DeliveryRouteResponseDto,
} from "entities/deliveryRoutes/dtos";
import type { DeliveryRouteResponse, DeliveryRoutesState } from "entities/deliveryRoutes/types";
import { mapCreateDeliveryRouteResponseDtoToEntity, mapDeliveryRouteDtoToEntity } from "entities/deliveryRoutes/mappers";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage.ts";

const initialState: DeliveryRoutesState = {
  routes: [],
  routeById: null,
  total: 0,
  page: 1,
  limit: 10,
  createdRoute: null,
  isLoading: false,
  loadingById: false,
  error: null,
};

export const getDeliveryRoutes = createAsyncThunk(
  "deliveryRoutes/getDeliveryRoutes",
  async (params: GetDeliveryRoutesDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetDeliveryRoutesResponseDto>(
        `${BASE_URL}/delivery-routes`,
        { params }
      );

      if (
        "success" in response.data &&
        response.data.success === true &&
        "data" in response.data
      ) {
        const data = response.data.data.map(mapDeliveryRouteDtoToEntity);
        return {
          data,
          total: data.length,
          page: 1,
          limit: data.length,
        };
      }

      return rejectWithValue("Ошибка загрузки рейсов");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const createDeliveryRoute = createAsyncThunk<
  DeliveryRouteResponse,
  CreateDeliveryRouteDto,
  { rejectValue: ErrorDto }
>("deliveryRoutes/createDeliveryRoute", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<CreateDeliveryRouteResponseDto>(
      `${BASE_URL}/delivery-routes`,
      payload
    );

    const mapped = mapCreateDeliveryRouteResponseDtoToEntity(data);
    if (mapped.success && mapped.deliveryRoute) {
      return mapped.deliveryRoute;
    }

    if (mapped.error) {
      return rejectWithValue(mapped.error);
    }

    return rejectWithValue({
      success: false,
      errorCode: 100,
      errorMessage: {
        ru: "ÐÐµÐ¸Ð·Ð²ÐµÑÑ‚Ð½Ñ‹Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚ Ð¾Ñ‚Ð²ÐµÑ‚Ð° ÑÐµÑ€Ð²ÐµÑ€Ð°",
        en: "Unknown server response format",
        uz: "Server javobining nomaÊ¼lum formati",
      },
    });
  } catch (err: any) {
    if (err.response?.data && "errorCode" in err.response.data) {
      return rejectWithValue(err.response.data);
    }

    return rejectWithValue({
      success: false,
      errorCode: 403,
      errorMessage: {
        ru: "ÐžÑˆÐ¸Ð±ÐºÐ° ÑÐµÑ‚Ð¸",
        en: "Network error",
        uz: "Tarmoq xatosi",
      },
    });
  }
});

export const getDeliveryRouteById = createAsyncThunk(
  "deliveryRoutes/getDeliveryRouteById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        deliveryRoute?: DeliveryRouteResponseDto;
        errorCode?: number;
        errorMessage?: any;
      }>(`${BASE_URL}/delivery-routes/${id}`);

      if (response.data.success && response.data.deliveryRoute) {
        const data = mapDeliveryRouteDtoToEntity(response.data.deliveryRoute);
        return data;
      }

      return rejectWithValue(response.data.errorMessage || "Ошибка при загрузке маршрута");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const deliveryRoutesSlice = createSlice({
  name: "deliveryRoutes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryRoutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getDeliveryRoutes.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: DeliveryRouteResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.routes = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getDeliveryRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createDeliveryRoute.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createDeliveryRoute.fulfilled,
        (state, action: PayloadAction<DeliveryRouteResponse>) => {
          state.isLoading = false;
          state.createdRoute = action.payload;
        }
      )
      .addCase(createDeliveryRoute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getBackendErrorMessage(
          action.payload,
          "Error creating delivery route"
        );
      })
      .addCase(getDeliveryRouteById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(
        getDeliveryRouteById.fulfilled,
        (state, action: PayloadAction<DeliveryRouteResponse>) => {
          state.loadingById = false;
          state.routeById = action.payload;
        }
      )
      .addCase(getDeliveryRouteById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload as string;
      });
  },
});

export default deliveryRoutesSlice.reducer;
