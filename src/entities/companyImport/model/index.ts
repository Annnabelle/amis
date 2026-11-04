import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import {
  isCompanyImportResponseSuccess,
  readBackendErrorCode,
  type CompanyImportResponseDto,
} from "entities/companyImport/dtos";
import { mapCompanyImportDtoToEntity } from "entities/companyImport/mappers";
import {
  COMPANY_IMPORT_POLL_INTERVAL_MS,
  CompanyImportErrorCode,
  type CompanyImport,
  type CompanyImportStage,
  type CompanyImportState,
} from "entities/companyImport/types";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";

/**
 * Опрашивающих несколько — кнопка раздела и панель на странице интеграций, —
 * и у каждого свой интервал. Чтобы их число не превращалось в число запросов,
 * повторный опрос в пределах половины шага отбрасываем.
 */
const MIN_FETCH_INTERVAL_MS = COMPANY_IMPORT_POLL_INTERVAL_MS / 2;

const initialState: CompanyImportState = {
  companyId: null,
  current: null,
  loaded: false,
  loading: false,
  lastFetchedAt: null,
  error: null,
  startingStages: null,
};

type CompanyImportArgs = {
  companyId: string;
};

type GetCurrentCompanyImportResult = {
  companyId: string;
  /** null — прогонов у компании ещё не было: сервер отвечает на это 404. */
  companyImport: CompanyImport | null;
};

type StartCompanyImportArgs = CompanyImportArgs & {
  /** Не задано — весь конвейер. */
  stages?: CompanyImportStage[];
};

type StartCompanyImportResult = GetCurrentCompanyImportResult & {
  /** Прогон уже шёл: показываем его вместо ошибки. */
  alreadyRunning: boolean;
};

const fetchCurrent = async (): Promise<
  Extract<CompanyImportResponseDto, { success: true }>
> => {
  const response = await axiosInstance.get<CompanyImportResponseDto>(
    `${BASE_URL}/company-imports/current`
  );

  if (isCompanyImportResponseSuccess(response.data)) {
    return response.data;
  }

  throw response.data;
};

export const getCurrentCompanyImport = createAsyncThunk<
  GetCurrentCompanyImportResult,
  CompanyImportArgs,
  { rejectValue: string; state: RootState }
>(
  "companyImport/getCurrent",
  async ({ companyId }, { rejectWithValue }) => {
    try {
      return {
        companyId,
        companyImport: mapCompanyImportDtoToEntity(await fetchCurrent()),
      };
    } catch (error) {
      /** Прогонов не было — это не сбой, а пустое состояние раздела. */
      if (readBackendErrorCode(error) === CompanyImportErrorCode.NotFound) {
        return { companyId, companyImport: null };
      }

      return rejectWithValue(
        getBackendErrorMessage(error, "companyImport.errors.load")
      );
    }
  },
  {
    condition: ({ companyId }, { getState }) => {
      const state = getState().companyImport;

      if (state.loading) return false;
      if (state.companyId !== companyId) return true;

      return (
        !state.lastFetchedAt ||
        Date.now() - state.lastFetchedAt >= MIN_FETCH_INTERVAL_MS
      );
    },
  }
);

export const startCompanyImport = createAsyncThunk<
  StartCompanyImportResult,
  StartCompanyImportArgs,
  { rejectValue: string }
>(
  "companyImport/start",
  async ({ companyId, stages }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<CompanyImportResponseDto>(
        `${BASE_URL}/company-imports`,
        stages?.length ? { stages } : {}
      );

      if (isCompanyImportResponseSuccess(response.data)) {
        return {
          companyId,
          companyImport: mapCompanyImportDtoToEntity(response.data),
          alreadyRunning: false,
        };
      }

      throw response.data;
    } catch (error) {
      /**
       * Запуск второго прогона запрещён уникальностью: нажавшему интереснее
       * увидеть тот, что уже идёт, чем сообщение об отказе.
       */
      if (readBackendErrorCode(error) === CompanyImportErrorCode.AlreadyRunning) {
        try {
          return {
            companyId,
            companyImport: mapCompanyImportDtoToEntity(await fetchCurrent()),
            alreadyRunning: true,
          };
        } catch {
          return rejectWithValue("companyImport.errors.alreadyRunning");
        }
      }

      return rejectWithValue(
        getBackendErrorMessage(error, "companyImport.errors.start")
      );
    }
  }
);

export const companyImportSlice = createSlice({
  name: "companyImport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentCompanyImport.pending, (state, action) => {
        state.loading = true;
        state.error = null;

        /** Сменилась организация — прошлый прогон к делу не относится. */
        if (state.companyId !== action.meta.arg.companyId) {
          state.companyId = action.meta.arg.companyId;
          state.current = null;
          state.loaded = false;
        }
      })
      .addCase(getCurrentCompanyImport.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.lastFetchedAt = Date.now();
        state.companyId = action.payload.companyId;
        state.current = action.payload.companyImport;
      })
      .addCase(getCurrentCompanyImport.rejected, (state, action) => {
        state.loading = false;
        state.lastFetchedAt = Date.now();
        state.error = action.payload ?? "companyImport.errors.load";
      })
      .addCase(startCompanyImport.pending, (state, action) => {
        state.startingStages = action.meta.arg.stages ?? [];
      })
      .addCase(startCompanyImport.fulfilled, (state, action) => {
        state.startingStages = null;
        state.loaded = true;
        state.lastFetchedAt = Date.now();
        state.companyId = action.payload.companyId;
        state.current = action.payload.companyImport;
      })
      // Отказ запуска показывает тот, кто нажал: санк отдаёт его вызывающему,
      // и в состоянии ему делать нечего.
      .addCase(startCompanyImport.rejected, (state) => {
        state.startingStages = null;
      });
  },
});

export default companyImportSlice.reducer;
