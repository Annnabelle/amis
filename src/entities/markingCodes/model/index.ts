import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrderDto,
  GetOrderListResponseDto,
  GetOrderResponseDto,
  OrderStatus,
  OrderResponseDto, GetBatchResponseDto, BatchResponseDto, GetBatchDto,
} from "entities/markingCodes/dtos";
import type { PaginatedResponseDto } from "shared/types/dtos";
import { BASE_URL } from "shared/lib/consts";
import {
  mapBatchesDtoToEntity,
  mapGetOrderProductCodesDtoToEntity,
  mapMarkingCodeDtoToEntity,
  mapMarkingCodesDtoToEntity,
} from "entities/markingCodes/mappers";
import type {
  BatchResponse,
  OrderBatchPopulatedResponse,
  OrderProductResponse,
  OrderResponse
} from "entities/markingCodes/types";
import axiosInstance from "shared/lib/axiosInstance";
import type {
  CodeRowDto,
  GetBatchCodesParamDto,
  GetOrderProductCodesResponseDto
} from "entities/markingCodes/dtos/order-product.ts";
import type { GetOrderProductCodesResponse} from "entities/markingCodes/types/order-product.ts";
import type {BackendError} from "shared/types/backendError";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";


type MarkingCodesState = {
  data: OrderBatchPopulatedResponse[];
  markingCodeById?: OrderResponse;
  createdOrder?: OrderResponse;
  orderProduct: OrderProductResponse | null;
  orderProductCodes: GetOrderProductCodesResponse | null;
  batch: BatchResponse | null;
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
  orderProduct: null,
  orderProductCodes: null,
  batch: null,
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
  companyId?: string;
  status?: OrderStatus;
};

function isOrderListSuccess( res: GetOrderListResponseDto): res is { success: true } & PaginatedResponseDto<OrderBatchPopulatedResponse> {
  return "success" in res && res.success === true;
}


export const fetchMarkingCodes = createAsyncThunk(
  'markingCodes/fetchMarkingCodes',
  async (params: OrderListQueryParams, { rejectWithValue }) => {
    try {
       const response = await axiosInstance.get<GetOrderListResponseDto>(`${BASE_URL}/orders`, {
        params,
      });

      if (isOrderListSuccess(response.data)) {
        return {
          data: response.data.data.map(mapMarkingCodesDtoToEntity),
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
    { rejectValue: Partial<BackendError> | string }
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

        // Ошибка от бэкенда со статусом success: false
        return rejectWithValue(response.data as Partial<BackendError>);
      } catch (err: any) {
        if (err.response?.data) {
          return rejectWithValue(err.response.data as Partial<BackendError>);
        }
        return rejectWithValue({ errorMessage: { ru: err.message || "Ошибка сервера" } });
      }
    }
);

function isGetOrderProductCodesSuccess(
    dto: GetOrderProductCodesResponseDto
): dto is { success: true } & PaginatedResponseDto<CodeRowDto> {
  return (
      typeof dto === "object" &&
      dto !== null &&
      'success' in dto &&
      dto.success === true &&
      'data' in dto
  );
}


export const getOrderProduct = createAsyncThunk<
    GetOrderProductCodesResponse,
    GetBatchCodesParamDto,
    { rejectValue: string }
>(
    "markingCodes/getOrderProduct",
    async ({ orderId, batchId }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get<GetOrderProductCodesResponseDto>(
            `${BASE_URL}/codes/batches`,
            {
              params: {
                orderId,
                batchId,
                page: 1,
                limit: 10,
              },
            }
        );

        if (!isGetOrderProductCodesSuccess(response.data)) {
          return rejectWithValue("Ошибка загрузки кодов продукта");
        }

        return mapGetOrderProductCodesDtoToEntity(response.data);
      } catch (err: any) {
        return rejectWithValue(err.message || "Ошибка сервера");
      }
    }
);

export const isGetBatchSuccess = (
    data: GetBatchResponseDto
): data is { success: true; batch: BatchResponseDto } => {
  return (
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      data.success === true &&
      "batch" in data
  );
};

export const getBatch = createAsyncThunk<
    BatchResponse,          // ✅ entity
    GetBatchDto,            // params
    { rejectValue: string }
>(
    "markingCodes/getBatch",
    async ({ orderId, batchId }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get<GetBatchResponseDto>(
            `${BASE_URL}/orders/${orderId}/batches/${batchId}`
        );

        if (!isGetBatchSuccess(response.data)) {
          return rejectWithValue("Ошибка загрузки партии");
        }

        return mapBatchesDtoToEntity(response.data.batch);
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
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    }

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
          state.error = getBackendErrorMessage(
              action.payload,
              "Ошибка создания заказа"
          );
        })
      .addCase(fetchMarkingCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarkingCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchMarkingCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })

      .addCase(getOrderProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.orderProductCodes = action.payload; // ✅ payload типа GetOrderProductCodesResponse
      })
      .addCase(getOrderProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка загрузки кодов продукта";
      })
      .addCase(getBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batch = action.payload;
      })
      .addCase(getBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка загрузки партии";
      });

  },
});

export const { resetOrders, setPage, setLimit } = markingCodesSlice.actions;
export default markingCodesSlice.reducer;




