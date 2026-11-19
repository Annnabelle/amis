import type { UpdateLeadStatusDto } from "@edem2000/amis.contracts/api/leads/requests";
import type {
  GetLeadResponseDto,
  UpdateLeadStatusResponseDto,
} from "@edem2000/amis.contracts/api/leads/responses";
import { mapLeadDtoToEntity } from "entities/leads/mappers";
import type { Lead, LeadList, LeadListQuery } from "entities/leads/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

export const leadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeads: build.query<LeadList, LeadListQuery>({
      query: (params) => request(endpointAccessMap.leadsList, { params }),
      transformResponse: toPaginated(mapLeadDtoToEntity),
      providesTags: [{ type: ApiTags.Lead, id: LIST_TAG_ID }],
    }),

    getLeadById: build.query<Lead, { id: string }>({
      query: ({ id }) =>
        request(endpointAccessMap.leadsRead, { pathParams: { id } }),
      transformResponse: (response: SuccessOf<GetLeadResponseDto>) =>
        mapLeadDtoToEntity(response.data),
      providesTags: (_result, _error, { id }) => [{ type: ApiTags.Lead, id }],
    }),

    updateLeadStatus: build.mutation<Lead, { id: string; data: UpdateLeadStatusDto }>({
      query: ({ id, data }) =>
        request(endpointAccessMap.leadsUpdateStatus, {
          pathParams: { id },
          data,
        }),
      transformResponse: (response: SuccessOf<UpdateLeadStatusResponseDto>) =>
        mapLeadDtoToEntity(response.data),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.Lead, id },
        { type: ApiTags.Lead, id: LIST_TAG_ID },
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useUpdateLeadStatusMutation,
} = leadsApi;
