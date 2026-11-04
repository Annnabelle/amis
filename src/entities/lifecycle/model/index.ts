import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import {
  isLifecycleEventsResponseSuccess,
  isLifecycleSummaryResponseSuccess,
  type GetLifecycleEventsResponseDto,
  type GetLifecycleSummaryResponseDto,
} from "entities/lifecycle/dtos";
import {
  mapLifecycleEventDtoToEntity,
  mapLifecycleSummaryDtoToEntity,
} from "entities/lifecycle/mappers";
import { buildLifecycleFeedKey } from "entities/lifecycle/lib";
import type {
  LifecycleEvent,
  LifecycleFeedFilters,
  LifecycleState,
  LifecycleSummary,
} from "entities/lifecycle/types";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import {
  CompanyScopeOptions,
  type CompanyScopeOption,
} from "shared/lib/requestScope";

export const LIFECYCLE_DEFAULT_LIMIT = 10;
export const LIFECYCLE_MAX_LIMIT = 100;

const initialState: LifecycleState = {
  targetId: null,
  summary: null,
  summaryLoading: false,
  summaryError: null,
  feedKey: null,
  events: [],
  page: 0,
  limit: LIFECYCLE_DEFAULT_LIMIT,
  total: 0,
  asOf: null,
  eventsLoading: false,
  eventsError: null,
  eventsRequestId: null,
};

type GetLifecycleSummaryArgs = {
  targetId: string;
  companyScope?: CompanyScopeOption;
};

type GetLifecycleEventsArgs = LifecycleFeedFilters & {
  targetId: string;
  page: number;
  limit?: number;
  companyScope?: CompanyScopeOption;
};

type GetLifecycleEventsResult = {
  feedKey: string;
  page: number;
  limit: number;
  total: number;
  data: LifecycleEvent[];
  asOf: string | null;
};

export const getLifecycleSummary = createAsyncThunk<
  { targetId: string; summary: LifecycleSummary },
  GetLifecycleSummaryArgs,
  { rejectValue: string }
>(
  "lifecycle/getSummary",
  async ({ targetId, companyScope = CompanyScopeOptions.Auto }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<GetLifecycleSummaryResponseDto>(
        `${BASE_URL}/lifecycle/summary`,
        { params: { targetId }, companyScope }
      );

      if (isLifecycleSummaryResponseSuccess(response.data)) {
        return {
          targetId,
          summary: mapLifecycleSummaryDtoToEntity(response.data),
        };
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "lifecycle.errors.loadSummary")
      );
    } catch (error) {
      return rejectWithValue(
        getBackendErrorMessage(error, "lifecycle.errors.loadSummary")
      );
    }
  }
);

export const getLifecycleEvents = createAsyncThunk<
  GetLifecycleEventsResult,
  GetLifecycleEventsArgs,
  { rejectValue: string; state: RootState }
>(
  "lifecycle/getEvents",
  async (
    {
      targetId,
      scope,
      vendor,
      kind,
      page,
      limit = LIFECYCLE_DEFAULT_LIMIT,
      companyScope = CompanyScopeOptions.Auto,
    },
    { getState, rejectWithValue }
  ) => {
    const feedKey = buildLifecycleFeedKey(targetId, { scope, vendor, kind });
    const state = getState().lifecycle;
    /**
     * Фоновый процесс дописывает события, сортировка — от новых к старым.
     * Первую страницу всегда берём «как есть» и запоминаем её верхнюю границу,
     * дальше листаем относительно неё, иначе часть записей уедет на страницу назад.
     */
    const asOf =
      page > 1 && state.feedKey === feedKey ? state.asOf ?? undefined : undefined;

    try {
      const response = await axiosInstance.get<GetLifecycleEventsResponseDto>(
        `${BASE_URL}/lifecycle`,
        {
          params: {
            targetId,
            scope,
            vendor,
            kind,
            page,
            limit: Math.min(limit, LIFECYCLE_MAX_LIMIT),
            asOf,
          },
          companyScope,
        }
      );

      if (isLifecycleEventsResponseSuccess(response.data)) {
        const data = response.data.data.map(mapLifecycleEventDtoToEntity);

        return {
          feedKey,
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          data,
          asOf: asOf ?? data[0]?.occurredAt ?? null,
        };
      }

      return rejectWithValue(
        getBackendErrorMessage(response.data, "lifecycle.errors.loadEvents")
      );
    } catch (error) {
      return rejectWithValue(
        getBackendErrorMessage(error, "lifecycle.errors.loadEvents")
      );
    }
  }
);

export const lifecycleSlice = createSlice({
  name: "lifecycle",
  initialState,
  reducers: {
    resetLifecycle() {
      return initialState;
    },
    /** Смена вкладки: сводка живёт дальше, лента набирается заново. */
    resetLifecycleFeed(state) {
      state.feedKey = null;
      state.events = [];
      state.page = 0;
      state.total = 0;
      state.asOf = null;
      state.eventsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLifecycleSummary.pending, (state, action) => {
        state.summaryLoading = true;
        state.summaryError = null;

        if (state.targetId !== action.meta.arg.targetId) {
          state.targetId = action.meta.arg.targetId;
          state.summary = null;
          state.feedKey = null;
          state.events = [];
          state.page = 0;
          state.total = 0;
          state.asOf = null;
        }
      })
      .addCase(
        getLifecycleSummary.fulfilled,
        (
          state,
          action: PayloadAction<{ targetId: string; summary: LifecycleSummary }>
        ) => {
          state.summaryLoading = false;
          state.targetId = action.payload.targetId;
          state.summary = action.payload.summary;
        }
      )
      .addCase(getLifecycleSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload ?? "lifecycle.errors.loadSummary";
      })
      .addCase(getLifecycleEvents.pending, (state, action) => {
        const { targetId, scope, vendor, kind, page } = action.meta.arg;
        const feedKey = buildLifecycleFeedKey(targetId, { scope, vendor, kind });

        state.eventsLoading = true;
        state.eventsError = null;
        state.eventsRequestId = action.meta.requestId;

        /**
         * Сменилась вкладка или фильтр — прошлая лента к делу не относится.
         * Чистим сразу, иначе на время запроса на экране висят события чужой
         * вкладки без единого признака загрузки, и переключение выглядит
         * зависшим ровно на круг до сервера.
         */
        if (page === 1 && state.feedKey !== feedKey) {
          state.events = [];
          state.page = 0;
          state.total = 0;
          state.asOf = null;
        }
      })
      .addCase(
        getLifecycleEvents.fulfilled,
        (state, action) => {
          /** Пока ждали ответ, пользователь ушёл на другую вкладку. */
          if (state.eventsRequestId !== action.meta.requestId) return;

          const { feedKey, page, limit, total, data, asOf } = action.payload;
          const isSameFeed = state.feedKey === feedKey;

          state.eventsLoading = false;
          state.eventsRequestId = null;
          state.feedKey = feedKey;
          state.page = page;
          state.limit = limit;
          state.total = total;
          state.asOf = asOf;
          state.events =
            isSameFeed && page > 1 ? [...state.events, ...data] : data;
        }
      )
      .addCase(getLifecycleEvents.rejected, (state, action) => {
        if (state.eventsRequestId !== action.meta.requestId) return;

        state.eventsLoading = false;
        state.eventsRequestId = null;
        state.eventsError = action.payload ?? "lifecycle.errors.loadEvents";
      });
  },
});

export const { resetLifecycle, resetLifecycleFeed } = lifecycleSlice.actions;
export default lifecycleSlice.reducer;
