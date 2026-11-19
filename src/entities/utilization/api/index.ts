import type { CreateUtilizationReportDto } from "@edem2000/amis.contracts/api/reports/requests";
import type { CreateUtilizationReportResponseDto } from "@edem2000/amis.contracts/api/reports/responses";
import { mapUtilizationDtoToEntity } from "entities/utilization/mappers";
import type { UtilizationReport } from "entities/utilization/types";
import { baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const utilizationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createUtilizationReport: build.mutation<
      UtilizationReport[],
      CreateUtilizationReportDto
    >({
      query: (data) => request(endpointAccessMap.utilizationReportsCreate, { data }),
      transformResponse: (
        response: SuccessOf<CreateUtilizationReportResponseDto>
      ) => response.reports.map(mapUtilizationDtoToEntity),
    }),
  }),
});

export const { useCreateUtilizationReportMutation } = utilizationApi;
