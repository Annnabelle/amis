import type {
  GetWaybillDto,
  GetWaybillsDto,
} from "@edem2000/amis.contracts/api/waybills/requests";
import type { GetWaybillResponseDto } from "@edem2000/amis.contracts/api/waybills/responses";
import { mapWaybillDtoToEntity } from "entities/waybills/mappers";
import type { Waybill, WaybillList } from "entities/waybills/types";
import { baseApi, request, toPaginated, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const waybillsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWaybills: build.query<WaybillList, GetWaybillsDto>({
      query: (params) => request(endpointAccessMap.waybillsList, { params }),
      transformResponse: toPaginated(mapWaybillDtoToEntity),
    }),

    getWaybillById: build.query<Waybill, GetWaybillDto>({
      query: ({ id }) =>
        request(endpointAccessMap.waybillsRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetWaybillResponseDto>) =>
        mapWaybillDtoToEntity(response.waybill),
    }),
  }),
});

export const { useGetWaybillsQuery, useGetWaybillByIdQuery } = waybillsApi;
