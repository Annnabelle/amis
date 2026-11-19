import type { CompanyImportResponseDto } from "@edem2000/amis.contracts/api/company-import/responses";
import { mapCompanyImportDtoToEntity } from "entities/companyImport/mappers";
import type {
  CompanyImport,
  CompanyImportStage,
} from "entities/companyImport/types";
import { ApiTags, baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

/** Общий ключ состояния запуска: кнопки разделов и панель видят один прогон. */
export const COMPANY_IMPORT_START_CACHE_KEY = "companyImportStart";

export const companyImportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Прогонов у компании может не быть вовсе — сервер отвечает на это 404. */
    getCurrentCompanyImport: build.query<CompanyImport, void>({
      query: () => request(endpointAccessMap.companyImportCurrent),
      transformResponse: (response: SuccessOf<CompanyImportResponseDto>) =>
        mapCompanyImportDtoToEntity(response),
      providesTags: [{ type: ApiTags.CompanyImport, id: "CURRENT" }],
    }),

    startCompanyImport: build.mutation<
      CompanyImport,
      { stages?: CompanyImportStage[] }
    >({
      query: ({ stages }) =>
        request(endpointAccessMap.companyImportStart, {
          data: stages?.length ? { stages } : {},
        }),
      transformResponse: (response: SuccessOf<CompanyImportResponseDto>) =>
        mapCompanyImportDtoToEntity(response),
      invalidatesTags: [{ type: ApiTags.CompanyImport, id: "CURRENT" }],
    }),
  }),
});

export const {
  useGetCurrentCompanyImportQuery,
  useStartCompanyImportMutation,
} = companyImportApi;
