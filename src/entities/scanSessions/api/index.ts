import type {
  CancelScanDto,
  CreateScanSessionDto,
} from "@edem2000/amis.contracts/api/scan-sessions/requests";
import type {
  CancelScanResponseDto,
  CompleteScanSessionResponseDto,
  CreateScanSessionResponseDto,
  ScanCodeResponseDto,
} from "@edem2000/amis.contracts/api/scan-sessions/responses";
import { mapScanSessionDtoToEntity } from "entities/scanSessions/mappers";
import type { ScanSession } from "entities/scanSessions/types";
import { baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";
import type { PackageType } from "shared/types/dtos";

export type ScanCodeResult = {
  code: string;
  productId: string;
  gtin: string;
  packageType: PackageType;
};

type ScanCodeArgs = { sessionId: string; code: string };

export const scanSessionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createScanSession: build.mutation<ScanSession, CreateScanSessionDto>({
      query: (data) => request(endpointAccessMap.scanSessionsCreate, { data }),
      transformResponse: (response: SuccessOf<CreateScanSessionResponseDto>) =>
        mapScanSessionDtoToEntity(response.scanSession),
    }),

    completeScanSession: build.mutation<ScanSession, string>({
      query: (id) =>
        request(endpointAccessMap.scanSessionsComplete, { pathParams: { id } }),
      transformResponse: (
        response: SuccessOf<CompleteScanSessionResponseDto>
      ) => mapScanSessionDtoToEntity(response.scanSession),
    }),

    /** Код в результате тот же, что в запросе: по нему страница находит скан. */
    scanSessionCode: build.mutation<ScanCodeResult, ScanCodeArgs>({
      query: ({ sessionId, code }) =>
        request(endpointAccessMap.scanSessionsScan, {
          pathParams: { sessionId },
          data: { code },
        }),
      transformResponse: (
        response: SuccessOf<ScanCodeResponseDto>,
        _meta: unknown,
        { code }: ScanCodeArgs
      ): ScanCodeResult => ({
        code,
        productId: response.markingCode.productId,
        gtin: response.markingCode.gtin,
        packageType: response.markingCode.packageType,
      }),
    }),

    cancelScan: build.mutation<{ code: string }, CancelScanDto>({
      query: (data) =>
        request(endpointAccessMap.scanSessionsCancelScan, { data }),
      transformResponse: (
        _response: SuccessOf<CancelScanResponseDto>,
        _meta: unknown,
        { code }: CancelScanDto
      ) => ({ code }),
    }),
  }),
});

export const {
  useCreateScanSessionMutation,
  useCompleteScanSessionMutation,
  useScanSessionCodeMutation,
  useCancelScanMutation,
} = scanSessionsApi;
