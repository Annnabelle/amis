import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderDto,
  GetOrderListResponseDto,
  GetOrderResponseDto,
  OrderListRow,
  OrderStatus,
  OrderResponseDto,
} from "../../dtos/markingCodes";
import type { PaginatedResponseDto } from "../../dtos";
import { BASE_URL } from "../../utils/consts";
import {
  mapMarkingCodeDtoToEntity,
  mapMarkingCodesDtoToEntity,
} from "../../mappers/markingCodes";
import type { OrderResponse } from "../../types/markingCodes";
import axiosInstance from "../../utils/axiosInstance";


type MarkingCodesState = {
  data: OrderListRow[];
  markingCodeById?: OrderResponse;
  createdOrder?: OrderResponse;
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  error: string | null;
};

const initialState: MarkingCodesState = {
  data: [],
  markingCodeById: undefined,
  createdOrder: undefined,
  page: 1,
  total: 0,
  limit: 10,
  loading: false,
  error: null,
};


export type OrderListQueryParams = {
  page: number;
  limit: number;
  userId?: string;
  productId?: string;
  packageType?: string;
  status?: OrderStatus;
};

function isOrderListSuccess(
  res: GetOrderListResponseDto
): res is { success: true } & PaginatedResponseDto<OrderListRow> {
  return "success" in res && res.success === true;
}

export const fetchMarkingCodes = createAsyncThunk<
  { data: OrderListRow[]; total: number; page: number; limit: number },
  OrderListQueryParams,
  { rejectValue: string }
>(
  "markingCodes/fetchMarkingCodes",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetOrderListResponseDto>(
        `${BASE_URL}/orders`,
        { params }
      );

      if (isOrderListSuccess(response.data)) {
        return {
          data: response.data.data.map(mapMarkingCodesDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }

      return rejectWithValue("Ошибка загрузки заказов");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isGetOrderSuccess(
  res: GetOrderResponseDto
): res is { success: true; order: OrderResponseDto } {
  return "success" in res && res.success === true && "order" in res;
}

export const getMarkingCodeById = createAsyncThunk<
  OrderResponse,
  GetOrderDto,
  { rejectValue: string }
>(
  "markingCodes/getMarkingCodeById",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetOrderResponseDto>(
        `${BASE_URL}/orders/${id}`
      );

      if (isGetOrderSuccess(response.data)) {
        return mapMarkingCodeDtoToEntity(response.data.order);
      }

      return rejectWithValue("Ошибка загрузки заказа");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isCreateOrderSuccess(
  res: CreateOrderResponseDto
): res is { success: true; order: OrderResponseDto } {
  return "success" in res && res.success === true && "order" in res;
}

export const createOrder = createAsyncThunk<
  OrderResponse,
  CreateOrderDto,
  { rejectValue: string }
>(
  "markingCodes/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CreateOrderResponseDto>(
        `${BASE_URL}/orders`,
        payload
      );

      if (isCreateOrderSuccess(response.data)) {
        return mapMarkingCodeDtoToEntity(response.data.order);
      }

      return rejectWithValue("Ошибка создания заказа");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const markingCodesSlice = createSlice({
  name: "markingCodes",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.data = [];
      state.page = 1;
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.loading = false;
          state.createdOrder = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка создания заказа";
      })
      .addCase(fetchMarkingCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarkingCodes.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.page = action.payload.page;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchMarkingCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки заказов";
      })
      .addCase(getMarkingCodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMarkingCodeById.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.loading = false;
          state.markingCodeById = action.payload;
        }
      )
      .addCase(getMarkingCodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки заказа";
      });
  },
});

export default markingCodesSlice.reducer;
