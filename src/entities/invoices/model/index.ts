import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";
import type { GetInvoicesDto, GetInvoicesResponseDto } from "entities/invoices/dtos";
import type {
  GetInvoiceDto,
  GetInvoiceItemsDto,
  GetInvoiceItemsResponseDto,
  GetInvoiceResponseDto,
} from "entities/invoices/dtos";
import { mapInvoiceDtoToEntity, mapInvoiceItemDtoToEntity } from "entities/invoices/mappers";
import type { InvoiceItemResponse, InvoiceResponse, InvoicesState } from "entities/invoices/types";

const initialState: InvoicesState = {
  invoices: [],
  invoiceById: null,
  items: [],
  itemsTotal: 0,
  itemsPage: 1,
  itemsLimit: 10,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  loadingById: false,
  itemsLoading: false,
  error: null,
};

function isInvoicesListSuccess(
  res: GetInvoicesResponseDto
): res is { success: boolean; data: any[]; total: number; page: number; limit: number } {
  return "success" in res && res.success === true && "data" in res;
}

export const getInvoices = createAsyncThunk(
  "invoices/getInvoices",
  async (params: GetInvoicesDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetInvoicesResponseDto>(
        `${BASE_URL}/invoices`,
        { params }
      );

      if (isInvoicesListSuccess(response.data)) {
        return {
          data: response.data.data.map(mapInvoiceDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }

      return rejectWithValue("Error loading invoices");
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

function isInvoiceSuccess(
  res: GetInvoiceResponseDto
): res is { success: boolean; invoice: any } {
  return "success" in res && res.success === true && "invoice" in res;
}

export const getInvoiceById = createAsyncThunk(
  "invoices/getInvoiceById",
  async ({ id }: GetInvoiceDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetInvoiceResponseDto>(
        `${BASE_URL}/invoices/${id}`
      );

      if (isInvoiceSuccess(response.data)) {
        return mapInvoiceDtoToEntity(response.data.invoice);
      }

      return rejectWithValue("Error loading invoice");
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

function isInvoiceItemsSuccess(
  res: GetInvoiceItemsResponseDto
): res is { success: boolean; data: any[]; total: number; page: number; limit: number } {
  return "success" in res && res.success === true && "data" in res;
}

export const getInvoiceItems = createAsyncThunk(
  "invoices/getInvoiceItems",
  async ({ id, ...params }: GetInvoiceItemsDto, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetInvoiceItemsResponseDto>(
        `${BASE_URL}/invoices/${id}/items`,
        { params }
      );

      if (isInvoiceItemsSuccess(response.data)) {
        return {
          data: response.data.data.map(mapInvoiceItemDtoToEntity),
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };
      }

      return rejectWithValue("Error loading invoice items");
    } catch (err: any) {
      return rejectWithValue(err.message || "Server error");
    }
  }
);

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getInvoices.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: InvoiceResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.isLoading = false;
          state.invoices = action.payload.data;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        }
      )
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.invoices = [];
      })
      .addCase(getInvoiceById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action: PayloadAction<InvoiceResponse>) => {
        state.loadingById = false;
        state.invoiceById = action.payload;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload as string;
        state.invoiceById = null;
      })
      .addCase(getInvoiceItems.pending, (state) => {
        state.itemsLoading = true;
        state.error = null;
      })
      .addCase(
        getInvoiceItems.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: InvoiceItemResponse[];
            total: number;
            page: number;
            limit: number;
          }>
        ) => {
          state.itemsLoading = false;
          state.items = action.payload.data;
          state.itemsTotal = action.payload.total;
          state.itemsPage = action.payload.page;
          state.itemsLimit = action.payload.limit;
        }
      )
      .addCase(getInvoiceItems.rejected, (state, action) => {
        state.itemsLoading = false;
        state.error = action.payload as string;
        state.items = [];
        state.itemsTotal = 0;
      });
  },
});

export default invoicesSlice.reducer;
