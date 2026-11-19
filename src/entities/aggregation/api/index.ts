import type {
  GetAggregationReportsParamsDto,
  GetOneAggregationReportDto,
} from "@edem2000/amis.contracts/api/reports/requests";
import type {
  CreateAggregationReportResponseDto,
  GetAggregationReportUnitsResponseDto,
  GetOneAggregationReportResponseDto,
} from "@edem2000/amis.contracts/api/reports/responses";
import {
  mapAggregationListDtoToEntity,
  mapGetAggregationDtoToEntity,
} from "entities/aggregation/mappers";
import { mapUnitsDtoToEntity } from "entities/aggregation/mappers/units";
import type {
  AggregationReport,
  AggregationReportList,
  CreateAggregationReport,
} from "entities/aggregation/types";
import type { AggregationUnitCodeList } from "entities/aggregation/types/units";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.AggregationReport, id: LIST_TAG_ID }];

export const aggregationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAggregationReports: build.query<
      AggregationReportList,
      GetAggregationReportsParamsDto
    >({
      query: (params) =>
        request(endpointAccessMap.aggregationReportsList, { params }),
      transformResponse: toPaginated(mapGetAggregationDtoToEntity),
      providesTags: listTag,
    }),

    getAggregationReportById: build.query<
      AggregationReport,
      GetOneAggregationReportDto
    >({
      query: ({ id }) =>
        request(endpointAccessMap.aggregationReportsRead, {
          pathParams: { id },
        }),
      transformResponse: (
        response: SuccessOf<GetOneAggregationReportResponseDto>
      ) => mapAggregationListDtoToEntity(response.report),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.AggregationReport, id },
      ],
    }),

    getAggregationReportUnits: build.query<
      AggregationUnitCodeList,
      { aggregationId: string; page?: number; limit?: number }
    >({
      query: ({ aggregationId, page, limit }) =>
        request(endpointAccessMap.aggregationReportUnitsRead, {
          pathParams: { id: aggregationId },
          params: { page, limit },
        }),
      transformResponse: (
        response: SuccessOf<GetAggregationReportUnitsResponseDto>
      ): AggregationUnitCodeList => ({
        items: response.data.map(mapUnitsDtoToEntity),
        total: response.total,
        page: response.page,
        limit: response.limit,
      }),
    }),

    createAggregationReport: build.mutation<
      AggregationReport,
      CreateAggregationReport
    >({
      query: (data) =>
        request(endpointAccessMap.aggregationReportsCreate, { data }),
      transformResponse: (
        response: SuccessOf<CreateAggregationReportResponseDto>
      ) => mapAggregationListDtoToEntity(response.report),
      invalidatesTags: listTag,
    }),
  }),
});

export const {
  useGetAggregationReportsQuery,
  useGetAggregationReportByIdQuery,
  useGetAggregationReportUnitsQuery,
  useCreateAggregationReportMutation,
} = aggregationApi;
