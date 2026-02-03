import type {ErrorDto, PaginatedResponseDto} from "shared/types/dtos";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { ProductResponse, ProductState } from "entities/products/types";
import type {
    CreateProductDto,
    CreateProductResponseDto,
    DeleteProductDto,
    DeleteProductResponseDto,
    GetProductDto,
    GetProductResponseDto,
    GetProductsDto,
    GetProductsResponseDto,
    ProductResponseDto,
    UpdateProductDto,
    UpdateProductResponseDto
} from "entities/products/dtos";
import {
    mapProductDtoToEntity
} from "entities/products/mappers";
import {getBackendErrorMessage} from "shared/lib/getBackendErrorMessage.ts";

const initialState: ProductState = {
  product: null,
  productById: null,
  updateProduct: null,
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  status: null,
};


function isSuccessResponse(res: GetProductsResponseDto): res is { success: boolean } & PaginatedResponseDto<ProductResponseDto> {
  return "success" in res && res.success === true;
}

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (params: GetProductsDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetProductsResponseDto>(`${BASE_URL}/products`, {
        params,
      });
      if (isSuccessResponse(response.data)) {
        return {
          data: response.data.data.map(mapProductDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }
      return rejectWithValue("Ошибка загрузки продуктов");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);

function isCreateProductSuccess(
    data: CreateProductResponseDto
): data is { success: true; product: ProductResponseDto } {
    return (
        'success' in data &&
        data.success === true &&
        'product' in data
    );
}

function isErrorDto(data: unknown): data is ErrorDto {
    return (
        typeof data === 'object' &&
        data !== null &&
        'errorMessage' in data
    );
}

export const createProduct = createAsyncThunk<
    ProductResponse,
    CreateProductDto,
    { rejectValue: ErrorDto }
>(
    'products/createProduct',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<CreateProductResponseDto>(
                `${BASE_URL}/products`,
                payload
            );

            if (isCreateProductSuccess(data)) {
                return mapProductDtoToEntity(data.product);
            }

            if (isErrorDto(data)) {
                return rejectWithValue(data);
            }

            return rejectWithValue({
                success: false,
                errorCode: 100,
                errorMessage: {
                    ru: 'Неизвестный формат ответа сервера',
                    en: 'Unknown server response format',
                    uz: 'Server javobining nomaʼlum formati',
                },
            });
        } catch (err: any) {
            if (err.response?.data && isErrorDto(err.response.data)) {
                return rejectWithValue(err.response.data);
            }

            return rejectWithValue({
                success: false,
                errorCode: 403,
                errorMessage: {
                    ru: 'Ошибка сети',
                    en: 'Network error',
                    uz: 'Tarmoq xatosi',
                },
            });
        }
    }
);


function isGetProductSuccessResponse(
  res: GetProductResponseDto
): res is { success: boolean; product: ProductResponseDto } {
  return "success" in res && res.success === true && "product" in res;
}

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (params: GetProductDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetProductResponseDto>(
        `${BASE_URL}/products/${params.id}`
      );

      if (isGetProductSuccessResponse(response.data)) {
        return mapProductDtoToEntity(response.data.product  );
      }

      return rejectWithValue("Ошибка загрузки продукта");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isUpdateOrganizationSuccessResponse(
  res: UpdateProductResponseDto
): res is { success: boolean; product: ProductResponseDto } {
  return "success" in res && res.success === true && "product" in res;
}

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: UpdateProductDto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<UpdateProductResponseDto>(
        `${BASE_URL}/products/${id}`,
        data
      );

      if (isUpdateOrganizationSuccessResponse(response.data)) {
        return mapProductDtoToEntity(response.data.product);
      }

      return rejectWithValue("Ошибка обновления продкута");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


function isDeleteProductSuccessResponse(
  res: DeleteProductResponseDto
): res is { success: boolean } {
  return "success" in res && res.success === true;
}

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id }: DeleteProductDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<DeleteProductResponseDto>(
        `${BASE_URL}/products/${id}`
      );

      if (isDeleteProductSuccessResponse(response.data)) {
        return { id }; 
      }

      return rejectWithValue("Ошибка при удалении продукта");
    } catch (err: any) {
      return rejectWithValue(err.message || "Ошибка сервера");
    }
  }
);


export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ query, page = 1, limit = 10, sortOrder = 'asc', companyId }: { query: string; page?: number; limit?: number; sortOrder?: 'asc' | 'desc';  companyId?: string; }) => {
    const response = await axiosInstance.get(`/products/search`, {
      params: { query, page, limit, sortOrder, companyId }
    });
    return response.data;
  }
);

export const productsSlice = createSlice({ 
  name: 'products',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
        .addCase(getAllProducts.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getAllProducts.fulfilled, ( state,
            action: PayloadAction<{
                data: ProductResponse[];
                total: number;
                page: number;
                limit: number;
            }>
            ) => {
            state.isLoading = false;
            state.products = action.payload.data;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            }
        )
        .addCase(getAllProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(searchProducts.fulfilled, (state, action) => {
          const { data = [], total, page, limit } = action.payload;

          state.products = data.map((product: any) => ({
            id: product.id,
            name: product.name,
            productType: product.productType,
            icps: product.icps,
            gtin: product.gtin,
            measurement: product.measurement,
            status: product.status,
          }));

          state.total = total;
          state.page = page;
          state.limit = limit;
        })

        .addCase(createProduct.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
            state.isLoading = false;
            state.products.push(action.payload); 
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.error = getBackendErrorMessage(
                action.payload,
                "Ошибка создания заказа"
            );
        })
        .addCase(getProductById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getProductById.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
            state.isLoading = false;
            state.productById = action.payload;
        })
        .addCase(getProductById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(updateProduct.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.updateProduct = action.payload; 
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })
        .addCase(deleteProduct.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
          state.isLoading = false;
          state.products = state.products.filter((p) => p.id !== action.payload.id);
          if (state.productById?.id === action.payload.id) {
            state.productById = null;
          }
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })
  },
});

export default productsSlice.reducer;



