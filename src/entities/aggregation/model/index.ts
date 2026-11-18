import type {
  AggregationUnitCodeResponseDto,
  CreateAggregationReportResponseDto,
  GetAggregationReportUnitsResponseDto,
  GetAggregationReportsResponseDto,
  GetOneAggregationReportResponseDto,
} from '@edem2000/amis.contracts/api/reports/responses';
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import type { AggregationReportStatus } from "shared/types/dtos";
import axiosInstance from "shared/lib/axiosInstance";
import type {
  AggregationReport,
  CreateAggregationReport,
  GetAggregationReportsResponseTypes,
} from "entities/aggregation/types";
import {
  mapAggregationListDtoToEntity,
  mapGetAggregationDtoToEntity,
} from "entities/aggregation/mappers";
import type { GetAggregationReportsParamsDto, GetOneAggregationReportDto } from '@edem2000/amis.contracts/api/reports/requests';
import type { ErrorDto } from "@edem2000/amis.contracts/api/common/requests";
import type { AggregationUnitCode } from "entities/aggregation/types/units";
import { mapUnitsDtoToEntity } from "entities/aggregation/mappers/units.ts";


export type { ErrorDto };

export type AggregationState = {
  aggregation: AggregationReport[];
  aggregations: GetAggregationReportsResponseTypes[];
  oneAggregation: AggregationReport | null;
  isLoading: boolean;
  error: ErrorDto | null; // ✅ всегда объект
  status: string | null;
  total: number;
  page: number;
  limit: number;
  units: Record<
    string, // aggregationId
    {
      data: AggregationUnitCode[];
      total: number;
      page: number;
      limit: number;
    }
  >;
};

const initialState: AggregationState = {
  aggregation: [],
  aggregations: [],
  oneAggregation: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
  status: null,
  units: {},
};

interface FetchAggregationUnitsParams {
  aggregationId: string;
  page?: number;
  limit?: number;
}

export const fetchAggregationUnits = createAsyncThunk<
  {
    data: AggregationUnitCodeResponseDto[];
    total: number;
    page: number;
    limit: number;
    aggregationId: string;
  }, // TS выведет тип
  FetchAggregationUnitsParams,
  { rejectValue: ErrorDto }
>("aggregation/fetchAggregationUnits", async (params, { rejectWithValue }) => {
  try {
    const { aggregationId, page, limit } = params;
    const queryParams: Record<string, number> = {};

    if (typeof page === "number") {
      queryParams.page = page;
    }

    if (typeof limit === "number") {
      queryParams.limit = limit;
    }

    const response = await axiosInstance.get<GetAggregationReportUnitsResponseDto>(
      `${BASE_URL}/reports/aggregation/${aggregationId}/units`,
      { params: queryParams },
    );

    if (response.data.success) {
      return {
        data: response.data.data.map(mapUnitsDtoToEntity),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        aggregationId,
      };
    }

    return rejectWithValue({
      success: false,
      errorCode: -1,
      errorMessage: {
        ru: "Ошибка загрузки единиц агрегации",
        en: "Failed to load aggregation units",
        uz: "Agregatsiya birliklarini yuklashda xatolik",
      },
    });
  } catch (err: any) {
    return rejectWithValue({
      success: false,
      errorCode: err.response?.status ?? -500,
      errorMessage: {
        ru: "Ошибка сервера",
        en: "Server error",
        uz: "Server xatosi",
      },
    });
  }
});

export const createAggregationReport = createAsyncThunk<
  AggregationReport,
  CreateAggregationReport,
  { rejectValue: ErrorDto }
>(
  "aggregation/createAggregationReport",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post<CreateAggregationReportResponseDto>(
        `${BASE_URL}/reports/aggregation`,
        payload,
      );

      if (data.success) {
        return mapAggregationListDtoToEntity(data.report);
      }

      return rejectWithValue(data as ErrorDto);
    } catch (err: any) {
      const backendError = err?.response?.data;

      if (backendError?.errorMessage) {
        return rejectWithValue(backendError as ErrorDto);
      }

      return rejectWithValue({
        success: false,
        errorCode: err?.response?.status ?? -500,
        errorMessage: {
          ru: "Ошибка сервера",
          en: "Server error",
          uz: "Server xatosi",
        },
      });
    }
  },
);

export const fetchAggregations = createAsyncThunk<
  {
    data: GetAggregationReportsResponseTypes[];
    total: number;
    page: number;
    limit: number;
  },
  GetAggregationReportsParamsDto,
  { rejectValue: ErrorDto }
>("aggregation/fetchAggregations", async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<GetAggregationReportsResponseDto>(
      `${BASE_URL}/reports/aggregation`,
      {
        // Даты приходят строками.
        params,
      },
    );

    if (response.data.success) {
      return {
        data: response.data.data.map(mapGetAggregationDtoToEntity),
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
    }

    return rejectWithValue({
      success: false,
      errorCode: -1,
      errorMessage: {
        ru: "Ошибка загрузки агрегаций",
        en: "Failed to load aggregations",
        uz: "Agregatsiyalarni yuklashda xatolik",
      },
    });
  } catch (err: any) {
    return rejectWithValue({
      success: false,
      errorCode: err.response?.status ?? -500,
      errorMessage: {
        ru: "Ошибка сервера",
        en: "Server error",
        uz: "Server xatosi",
      },
    });
  }
});


export const fetchOneAggregationReport = createAsyncThunk<
  AggregationReport,
  GetOneAggregationReportDto,
  { rejectValue: ErrorDto }
>(
  "aggregation/fetchOneAggregationReport",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } =
        await axiosInstance.get<GetOneAggregationReportResponseDto>(
          `${BASE_URL}/reports/aggregation/${id}`,
        );

      if (data.success) {
        return mapAggregationListDtoToEntity(data.report);
      }

      return rejectWithValue({
        success: false,
        errorCode: -1,
        errorMessage: {
          ru: "Ошибка загрузки агрегации",
          en: "Failed to load aggregation",
          uz: "Agregatsiyani yuklashda xatolik",
        },
      });
    } catch (err: any) {
      return rejectWithValue({
        success: false,
        errorCode: err.response?.status ?? -500,
        errorMessage: {
          ru: "Ошибка сервера",
          en: "Server error",
          uz: "Server xatosi",
        },
      });
    }
  },
);

export const aggregationSlice = createSlice({
  name: "aggregation",
  initialState,
  reducers: {
    /** Статус отчёта пришёл сокетом: правим строку, не перечитывая список. */
    reportStatusChanged: (
      state,
      action: PayloadAction<{ id: string; status: AggregationReportStatus }>,
    ) => {
      state.aggregations.forEach((report) => {
        if (report.id === action.payload.id) {
          report.status = action.payload.status;
        }
      });

      if (state.oneAggregation?.id === action.payload.id) {
        state.oneAggregation.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAggregationUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAggregationUnits.fulfilled, (state, action) => {
        const { aggregationId, data, total, page, limit } = action.payload;

        state.units[aggregationId] = {
          data,
          total,
          page,
          limit,
        };

        state.isLoading = false;
      })
      .addCase(fetchAggregationUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(createAggregationReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAggregationReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aggregation.push(action.payload);
      })
      .addCase(createAggregationReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchAggregations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAggregations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.aggregations = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAggregations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? {
          success: false,
          errorCode: -1,
          errorMessage: {
            ru: "Неизвестная ошибка",
            en: "Unknown error",
            uz: "Noma’lum xatolik",
          },
        };
      })
      .addCase(fetchOneAggregationReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.oneAggregation = null; // сброс предыдущего
      })
      .addCase(fetchOneAggregationReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.oneAggregation = action.payload;
      })
      .addCase(fetchOneAggregationReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? {
          success: false,
          errorCode: -1,
          errorMessage: {
            ru: "Неизвестная ошибка",
            en: "Unknown error",
            uz: "Noma’lum xatolik",
          },
        };
        state.oneAggregation = null;
      });
  },
});

export default aggregationSlice.reducer;
