import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { ErrorDto } from "shared/types/dtos";
import type {
  CreateSalesOrderDto,
  CreateSalesOrderResponseDto,
  DeleteSalesOrderDto,
  DeleteSalesOrderResponseDto,
  GetSalesOrderDto,
  GetSalesOrderResponseDto,
  GetSalesOrdersDto,
  GetSalesOrdersResponseDto,
} from "entities/salesOrders/dtos";
import type { SalesOrderResponse, SalesOrdersState } from "entities/salesOrders/types";
import { mapCreateSalesOrderResponseDtoToEntity, mapSalesOrderDtoToEntity } from "entities/salesOrders/mappers";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage.ts";

const initialState: SalesOrdersState = {
  orders: [],
  orderById: null,
  total: 0,
  page: 1,
  limit: 10,
  createdOrder: null,
  isLoading: false,
  error: null,
};

function isSalesOrdersListSuccess(
  res: GetSalesOrdersResponseDto
): res is { success: boolean } & { data: any[]; total: number; page: number; limit: number } {
  return "success" in res && res.success === true && "data" in res;
}

export const getSalesOrders = createAsyncThunk(
  "salesOrders/getSalesOrders",
  async (params: GetSalesOrdersDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetSalesOrdersResponseDto>(
        `${BASE_URL}/sales-orders`,
        { params }
      );

      if (isSalesOrdersListSuccess(response.data)) {
        return {
          data: response.data.data.map(mapSalesOrderDtoToEntity),
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

function isSalesOrderSuccess(
  res: GetSalesOrderResponseDto
): res is { success: boolean; salesOrder: any } {
  return "success" in res && res.success === true && "salesOrder" in res;
}

export const getSalesOrderById = createAsyncThunk(
  "salesOrders/getSalesOrderById",
  async ({ id }: GetSalesOrderDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetSalesOrderResponseDto>(
        `${BASE_URL}/sales-orders/${id}`
      );

      if (isSalesOrderSuccess(response.data)) {
        return mapSalesOrderDtoToEntity(response.data.salesOrder);
      }

      return rejectWithValue("Ошибка загрузки заказа");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const createSalesOrder = createAsyncThunk<
  SalesOrderResponse,
  CreateSalesOrderDto,
  { rejectValue: ErrorDto }
>("salesOrders/createSalesOrder", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<CreateSalesOrderResponseDto>(
      `${BASE_URL}/sales-orders`,
      payload
    );

    const mapped = mapCreateSalesOrderResponseDtoToEntity(data);
    if (mapped.success && mapped.salesOrder) {
      return mapped.salesOrder;
    }

    if (mapped.error) {
      return rejectWithValue(mapped.error);
    }

    return rejectWithValue({
      success: false,
      errorCode: 100,
      errorMessage: {
        ru: "Неизвестный формат ответа сервера",
        en: "Unknown server response format",
        uz: "Server javobining nomaʼlum formati",
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
        ru: "Ошибка сети",
        en: "Network error",
        uz: "Tarmoq xatosi",
      },
    });
  }
});

function isDeleteSalesOrderSuccess(
  res: DeleteSalesOrderResponseDto
): res is { success: boolean } {
  return "success" in res && res.success === true;
}

export const deleteSalesOrder = createAsyncThunk(
  "salesOrders/deleteSalesOrder",
  async ({ id }: DeleteSalesOrderDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteSalesOrderResponseDto>(
        `${BASE_URL}/sales-orders/${id}`
      );

      if (isDeleteSalesOrderSuccess(response.data)) {
        return { id };
      }

      return rejectWithValue("Ошибка удаления заказа");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

export const salesOrdersSlice = createSlice({
  name: "salesOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSalesOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getSalesOrders.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: SalesOrderResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.orders = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getSalesOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getSalesOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getSalesOrderById.fulfilled,
        (state, action: PayloadAction<SalesOrderResponse>) => {
          state.isLoading = false;
          state.orderById = action.payload;
        }
      )
      .addCase(getSalesOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createSalesOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createSalesOrder.fulfilled,
        (state, action: PayloadAction<SalesOrderResponse>) => {
          state.isLoading = false;
          state.createdOrder = action.payload;
        }
      )
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getBackendErrorMessage(
          action.payload,
          "Ошибка создания заказа"
        );
      })
      .addCase(deleteSalesOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteSalesOrder.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.isLoading = false;
          state.orders = state.orders.filter((order) => order.id !== action.payload.id);
          state.total = Math.max(0, state.total - 1);
        }
      )
      .addCase(deleteSalesOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default salesOrdersSlice.reducer;


