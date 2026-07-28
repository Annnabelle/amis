import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from 'shared/lib/axiosInstance';
import { BASE_URL } from 'shared/lib/consts';
import type {
  ApiErrorResponse,
  CreateCustomsCodePayload,
  CreateCustomsCodeResponseDto,
  CustomsCodeOrder,
  GetCustomsCodeResponseDto,
  GetCustomsCodesParams,
  GetCustomsCodesResponseDto,
  SignCustomsCodePayload,
  SignCustomsCodeResponseDto,
} from 'entities/customsCodes/types';

type CustomsCodesState = {
  data: CustomsCodeOrder[];
  selected: CustomsCodeOrder | null;
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  creating: boolean;
  signing: boolean;
  error: ApiErrorResponse | null;
};

const initialState: CustomsCodesState = {
  data: [],
  selected: null,
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  creating: false,
  signing: false,
  error: null,
};

const fallbackError = (status = -500): ApiErrorResponse => ({
  success: false,
  errorCode: status,
  errorMessage: {
    ru: 'Ошибка сервера',
    en: 'Server error',
    uz: 'Server xatosi',
  },
});

const getErrorPayload = (err: unknown): ApiErrorResponse => {
  const response = err as { response?: { status?: number; data?: ApiErrorResponse } };

  if (response.response?.data?.errorMessage) {
    return response.response.data;
  }

  return fallbackError(response.response?.status);
};

export const fetchCustomsCodes = createAsyncThunk<
  { data: CustomsCodeOrder[]; total: number; page: number; limit: number },
  GetCustomsCodesParams,
  { rejectValue: ApiErrorResponse }
>('customsCodes/fetchCustomsCodes', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetCustomsCodesResponseDto>(
      `${BASE_URL}/customs-code-orders`,
      { params }
    );

    if (response.data.success) {
      return {
        data: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    }

    return rejectWithValue(fallbackError(-1));
  } catch (err) {
    return rejectWithValue(getErrorPayload(err));
  }
});

export const fetchCustomsCodeById = createAsyncThunk<
  CustomsCodeOrder,
  string,
  { rejectValue: ApiErrorResponse }
>('customsCodes/fetchCustomsCodeById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetCustomsCodeResponseDto>(
      `${BASE_URL}/customs-code-orders/${id}`
    );

    if (response.data.success) {
      return response.data.accOrder;
    }

    return rejectWithValue(fallbackError(-1));
  } catch (err) {
    return rejectWithValue(getErrorPayload(err));
  }
});

export const createCustomsCode = createAsyncThunk<
  CustomsCodeOrder,
  CreateCustomsCodePayload,
  { rejectValue: ApiErrorResponse }
>('customsCodes/createCustomsCode', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<CreateCustomsCodeResponseDto>(
      `${BASE_URL}/customs-code-orders`,
      payload
    );

    if (response.data.success) {
      return response.data.aggregatedCustomsCode;
    }

    return rejectWithValue(fallbackError(-1));
  } catch (err) {
    return rejectWithValue(getErrorPayload(err));
  }
});

export const signCustomsCode = createAsyncThunk<
  CustomsCodeOrder,
  SignCustomsCodePayload,
  { rejectValue: ApiErrorResponse }
>('customsCodes/signCustomsCode', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<SignCustomsCodeResponseDto>(
      `${BASE_URL}/customs-code-orders/sign`,
      payload
    );

    if (response.data.success) {
      return response.data.aggregatedCustomsCode;
    }

    return rejectWithValue(fallbackError(-1));
  } catch (err) {
    return rejectWithValue(getErrorPayload(err));
  }
});

export const customsCodesSlice = createSlice({
  name: 'customsCodes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomsCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomsCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchCustomsCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? fallbackError(-1);
      })
      .addCase(fetchCustomsCodeById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createCustomsCode.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCustomsCode.fulfilled, (state, action) => {
        state.creating = false;
        state.data = [action.payload, ...state.data];
        state.total += 1;
      })
      .addCase(createCustomsCode.rejected, (state, action) => {
        state.creating = false;
        if (!action.payload) return;
      })
      .addCase(signCustomsCode.pending, (state) => {
        state.signing = true;
        state.error = null;
      })
      .addCase(signCustomsCode.fulfilled, (state, action) => {
        state.signing = false;
        state.selected = action.payload;
        state.data = state.data.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(signCustomsCode.rejected, (state, action) => {
        state.signing = false;
        if (!action.payload) return;
      });
  },
});

export default customsCodesSlice.reducer;
