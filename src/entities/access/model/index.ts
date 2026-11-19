import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { accessApi } from "entities/access/api";
import type { AccessState, UserAccess } from "entities/access/types";
import { getApiErrorMessage } from "shared/api";

/**
 * Права текущего пользователя и выбранная компания. Права читаются
 * синхронно — из useCan, роутера и интерцептора запросов, — поэтому лежат в
 * сторе, а не только в кеше RTK Query. Запрос живёт в entities/access/api.
 */
const initialState: AccessState = {
  data: null,
  currentCompanyId: null,
  loading: false,
  error: null,
};

export const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAccessData(state, action: PayloadAction<UserAccess>) {
      state.data = action.payload;
      state.error = null;
    },
    setCurrentCompanyId(state, action: PayloadAction<string | null>) {
      state.currentCompanyId = action.payload;
    },
    setAccessLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAccessError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearAccess(state) {
      state.data = null;
      state.currentCompanyId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const { getCurrentUserAccess } = accessApi.endpoints;

    builder
      .addMatcher(getCurrentUserAccess.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(getCurrentUserAccess.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(getCurrentUserAccess.matchRejected, (state, action) => {
        state.loading = false;

        /**
         * Отменённый запрос — не отказ в правах: так RTK Query отвечает на
         * дубль подписки и на сброс кеша при смене компании. Стереть права
         * здесь значило бы выкинуть пользователя на вход.
         */
        if (action.meta.condition || action.meta.aborted) return;

        state.data = null;
        state.error = getApiErrorMessage(
          action.payload,
          "Не удалось загрузить права доступа пользователя"
        );
      });
  },
});

export const {
  setAccessData,
  setCurrentCompanyId,
  setAccessLoading,
  setAccessError,
  clearAccess,
} = accessSlice.actions;

export default accessSlice.reducer;
