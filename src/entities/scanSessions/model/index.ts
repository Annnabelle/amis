import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "shared/lib/axiosInstance";
import { BASE_URL } from "shared/lib/consts";
import { getBackendErrorMessage } from "shared/lib/getBackendErrorMessage";
import type { AvailablePackageType } from "shared/types/dtos";
import type {
  CancelScanDto,
  CancelScanResponseDto,
  CompleteScanSessionResponseDto,
  CreateScanSessionDto,
  CreateScanSessionResponseDto,
  ScanCodeResponseDto,
} from "entities/scanSessions/dtos";
import { ScanSessionType, type ScanSessionResponse, type ScanSessionsState } from "entities/scanSessions/types";
import {
  mapCancelScanResponseDtoToEntity,
  mapCompleteScanSessionResponseDtoToEntity,
  mapCreateScanSessionResponseDtoToEntity,
  mapScanCodeResponseDtoToEntity,
} from "entities/scanSessions/mappers";
import type { ScanAttempt } from "entities/scanSessions/types";
import type { ErrorDto } from "shared/types/dtos";

const initialState: ScanSessionsState = {
  currentSession: null,
  recentScans: [],
  isCreating: false,
  isScanning: false,
  isCompleting: false,
  error: null,
};

type ScanCodePayload = {
  sessionId: string;
  code: string;
};

type ScanCodeSuccessPayload = {
  code: string;
  productId: string;
  gtin: string;
  packageType: AvailablePackageType;
};

type CancelScanSuccessPayload = {
  code: string;
};

const createScanAttempt = (payload: {
  code: string;
  status: "accepted" | "rejected";
  reason?: string;
  productId?: string;
  gtin?: string;
  packageType?: AvailablePackageType;
}): ScanAttempt => ({
  code: payload.code,
  status: payload.status,
  reason: payload.reason,
  productId: payload.productId,
  gtin: payload.gtin,
  packageType: payload.packageType,
  ts: new Date().toISOString(),
});

const extractErrorDto = (error: any): ErrorDto => {
  if (error?.response?.data && "errorCode" in error.response.data) {
    return error.response.data;
  }

  return {
    success: false,
    errorCode: 500,
    errorMessage: {
      ru: "Ошибка сети",
      en: "Network error",
      uz: "Tarmoq xatosi",
    },
  };
};

export const createScanSession = createAsyncThunk<
  ScanSessionResponse,
  CreateScanSessionDto,
  { rejectValue: ErrorDto }
>("scanSessions/createScanSession", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<CreateScanSessionResponseDto>(
      `${BASE_URL}/scan-sessions`,
      payload
    );

    const mapped = mapCreateScanSessionResponseDtoToEntity(data);
    if (mapped.success && mapped.scanSession) {
      return mapped.scanSession;
    }

    return rejectWithValue(
      mapped.error ?? {
        success: false,
        errorCode: 100,
        errorMessage: {
          ru: "Неизвестный формат ответа сервера",
          en: "Unknown server response format",
          uz: "Server javobining noma'lum formati",
        },
      }
    );
  } catch (error: any) {
    return rejectWithValue(extractErrorDto(error));
  }
});

export const completeScanSession = createAsyncThunk<
  ScanSessionResponse,
  string,
  { rejectValue: ErrorDto }
>("scanSessions/completeScanSession", async (sessionId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch<CompleteScanSessionResponseDto>(
      `${BASE_URL}/scan-sessions/${sessionId}/complete`
    );

    const mapped = mapCompleteScanSessionResponseDtoToEntity(data);
    if (mapped.success && mapped.scanSession) {
      return mapped.scanSession;
    }

    return rejectWithValue(
      mapped.error ?? {
        success: false,
        errorCode: 100,
        errorMessage: {
          ru: "Неизвестный формат ответа сервера",
          en: "Unknown server response format",
          uz: "Server javobining noma'lum formati",
        },
      }
    );
  } catch (error: any) {
    return rejectWithValue(extractErrorDto(error));
  }
});

export const scanSessionCode = createAsyncThunk<
  ScanCodeSuccessPayload,
  ScanCodePayload,
  { rejectValue: { code: string; error: ErrorDto } }
>("scanSessions/scanSessionCode", async ({ sessionId, code }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<ScanCodeResponseDto>(
      `${BASE_URL}/scan-sessions/${sessionId}/scan`,
      { code }
    );

    const mapped = mapScanCodeResponseDtoToEntity(data);
    if (mapped.success && mapped.markingCode) {
      return {
        code,
        productId: mapped.markingCode.productId,
        gtin: mapped.markingCode.gtin,
        packageType: mapped.markingCode.packageType,
      };
    }

    return rejectWithValue({
      code,
      error:
        mapped.error ?? {
          success: false,
          errorCode: 100,
          errorMessage: {
            ru: "Неизвестный формат ответа сервера",
            en: "Unknown server response format",
            uz: "Server javobining noma'lum formati",
          },
        },
    });
  } catch (error: any) {
    return rejectWithValue({
      code,
      error: extractErrorDto(error),
    });
  }
});

export const cancelScan = createAsyncThunk<
  CancelScanSuccessPayload,
  CancelScanDto,
  { rejectValue: { code: string; error: ErrorDto } }
>("scanSessions/cancelScan", async ({ code, routeId, taskId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post<CancelScanResponseDto>(
      `${BASE_URL}/scan-sessions/cancel-scan`,
      {
        code,
        routeId,
        taskId,
      }
    );

    const mapped = mapCancelScanResponseDtoToEntity(data);
    if (mapped.success) {
      return { code };
    }

    return rejectWithValue({
      code,
      error:
        mapped.error ?? {
          success: false,
          errorCode: 100,
          errorMessage: {
            ru: "Неизвестный формат ответа сервера",
            en: "Unknown server response format",
            uz: "Server javobining noma'lum formati",
          },
        },
    });
  } catch (error: any) {
    return rejectWithValue({
      code,
      error: extractErrorDto(error),
    });
  }
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
    builder
      .addCase(createScanSession.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createScanSession.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentSession = action.payload;
      })
      .addCase(createScanSession.rejected, (state, action) => {
        state.isCreating = false;
        state.error = getBackendErrorMessage(action.payload, "Не удалось создать сессию сканирования");
      })
      .addCase(completeScanSession.pending, (state) => {
        state.isCompleting = true;
        state.error = null;
      })
      .addCase(completeScanSession.fulfilled, (state, action) => {
        state.isCompleting = false;
        state.currentSession = action.payload;
      })
      .addCase(completeScanSession.rejected, (state, action) => {
        state.isCompleting = false;
        state.error = getBackendErrorMessage(action.payload, "Не удалось завершить сессию сканирования");
      })
      .addCase(scanSessionCode.pending, (state) => {
        state.isScanning = true;
        state.error = null;
      })
      .addCase(scanSessionCode.fulfilled, (state, action) => {
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
        ].slice(0, 20);

        if (state.currentSession) {
          state.currentSession.counters.accepted += 1;
        }
      })
      .addCase(scanSessionCode.rejected, (state, action) => {
        const payload = action.payload as { code: string; error: ErrorDto } | undefined;
        state.isScanning = false;
        state.error = getBackendErrorMessage(payload?.error, "Error scanning code");

        if (payload) {
          state.recentScans = [
            createScanAttempt({
              code: payload.code,
              status: "rejected",
              reason: getBackendErrorMessage(payload.error, "Error scanning code"),
            }),
            ...state.recentScans,
          ].slice(0, 20);
        }

        if (state.currentSession) {
          state.currentSession.counters.rejected += 1;
        }
      })
      .addCase(cancelScan.fulfilled, (state, action) => {
        state.recentScans = state.recentScans.filter((item) => item.code !== action.payload.code);
      });
  },
});

export const { resetScanSessionState, clearScanAttempts, replaceScanAttempts, setScanSessionType } = scanSessionsSlice.actions;

export default scanSessionsSlice.reducer;
