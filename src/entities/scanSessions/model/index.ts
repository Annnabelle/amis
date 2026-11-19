import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { scanSessionsApi } from "entities/scanSessions/api";
import type {
  ScanAttempt,
  ScanSessionType,
  ScanSessionsState,
} from "entities/scanSessions/types";
import { getApiErrorMessage } from "shared/api";
import type { PackageType } from "shared/types/dtos";

/**
 * Сессия сканирования на экране: сам журнал сканов и счётчики — состояние
 * приложения, а не серверный кеш, поэтому слайс остался. Запросы живут в
 * entities/scanSessions/api, а слайс слушает их результаты.
 */
const initialState: ScanSessionsState = {
  currentSession: null,
  recentScans: [],
  isCreating: false,
  isScanning: false,
  isCompleting: false,
  error: null,
};

/** Сколько последних сканов держим на экране. */
const RECENT_SCANS_LIMIT = 20;

const createScanAttempt = (payload: {
  code: string;
  status: "accepted" | "rejected";
  reason?: string;
  productId?: string;
  gtin?: string;
  packageType?: PackageType;
}): ScanAttempt => ({
  code: payload.code,
  status: payload.status,
  reason: payload.reason,
  productId: payload.productId,
  gtin: payload.gtin,
  packageType: payload.packageType,
  ts: new Date().toISOString(),
});

export const scanSessionsSlice = createSlice({
  name: "scanSessions",
  initialState,
  reducers: {
    resetScanSessionState: (state) => {
      state.currentSession = null;
      state.recentScans = [];
      state.isCreating = false;
      state.isScanning = false;
      state.isCompleting = false;
      state.error = null;
    },
    clearScanAttempts: (state) => {
      state.recentScans = [];
    },
    replaceScanAttempts: (state, action: PayloadAction<ScanAttempt[]>) => {
      state.recentScans = action.payload;
    },
    setScanSessionType: (state, action: PayloadAction<ScanSessionType | null>) => {
      if (state.currentSession && action.payload) {
        state.currentSession.type = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    const { createScanSession, completeScanSession, scanSessionCode, cancelScan } =
      scanSessionsApi.endpoints;

    builder
      .addMatcher(createScanSession.matchPending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addMatcher(createScanSession.matchFulfilled, (state, action) => {
        state.isCreating = false;
        state.currentSession = action.payload;
      })
      .addMatcher(createScanSession.matchRejected, (state, action) => {
        state.isCreating = false;
        state.error = getApiErrorMessage(
          action.payload,
          "Не удалось создать сессию сканирования"
        );
      })
      .addMatcher(completeScanSession.matchPending, (state) => {
        state.isCompleting = true;
        state.error = null;
      })
      .addMatcher(completeScanSession.matchFulfilled, (state, action) => {
        state.isCompleting = false;
        state.currentSession = action.payload;
      })
      .addMatcher(completeScanSession.matchRejected, (state, action) => {
        state.isCompleting = false;
        state.error = getApiErrorMessage(
          action.payload,
          "Не удалось завершить сессию сканирования"
        );
      })
      .addMatcher(scanSessionCode.matchPending, (state) => {
        state.isScanning = true;
        state.error = null;
      })
      .addMatcher(scanSessionCode.matchFulfilled, (state, action) => {
        state.isScanning = false;
        state.recentScans = [
          createScanAttempt({
            code: action.payload.code,
            status: "accepted",
            productId: action.payload.productId,
            gtin: action.payload.gtin,
            packageType: action.payload.packageType,
          }),
          ...state.recentScans,
        ].slice(0, RECENT_SCANS_LIMIT);

        if (state.currentSession) {
          state.currentSession.counters.accepted += 1;
        }
      })
      .addMatcher(scanSessionCode.matchRejected, (state, action) => {
        const message = getApiErrorMessage(action.payload, "Error scanning code");
        /** Код отклонённого скана известен из аргумента запроса. */
        const code = action.meta.arg.originalArgs.code;

        state.isScanning = false;
        state.error = message;
        state.recentScans = [
          createScanAttempt({ code, status: "rejected", reason: message }),
          ...state.recentScans,
        ].slice(0, RECENT_SCANS_LIMIT);

        if (state.currentSession) {
          state.currentSession.counters.rejected += 1;
        }
      })
      .addMatcher(cancelScan.matchFulfilled, (state, action) => {
        state.recentScans = state.recentScans.filter(
          (item) => item.code !== action.payload.code
        );
      });
  },
});

export const {
  resetScanSessionState,
  clearScanAttempts,
  replaceScanAttempts,
  setScanSessionType,
} = scanSessionsSlice.actions;

export default scanSessionsSlice.reducer;
