import type {
  CreateCompanyMembershipDto,
  GetCompanyMembershipsDto,
  SearchCompanyMembershipsDto,
  UpdateCompanyMembershipDto,
} from "@edem2000/amis.contracts/api/company-memberships/requests";
import type {
  CreateCompanyMembershipResponseDto,
  DeleteCompanyMembershipResponseDto,
  GetCompanyMembershipResponseDto,
  UpdateCompanyMembershipResponseDto,
} from "@edem2000/amis.contracts/api/company-memberships/responses";
import { mapCompanyMembershipDtoToEntity } from "entities/companyMemberships/mappers";
import type {
  CompanyMembership,
  CompanyMembershipList,
  CompanyMembershipListQuery,
  SearchCompanyMembershipsQuery,
} from "entities/companyMemberships/types";
import {
  ApiTags,
  LIST_TAG_ID,
  baseApi,
  request,
  toPaginated,
  type SuccessOf,
} from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const listTag = [{ type: ApiTags.CompanyMembership, id: LIST_TAG_ID }];

export const companyMembershipsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Компания передаётся заголовком: сотрудники читаются в её контуре. */
    getCompanyMemberships: build.query<
      CompanyMembershipList,
      CompanyMembershipListQuery
    >({
      query: ({ companyId, ...params }) =>
        request(endpointAccessMap.companyMembershipsList, {
          params: params as GetCompanyMembershipsDto,
          headers: { "x-company-id": companyId },
        }),
      transformResponse: toPaginated(mapCompanyMembershipDtoToEntity),
      providesTags: listTag,
    }),

    searchCompanyMemberships: build.query<
      CompanyMembershipList,
      SearchCompanyMembershipsQuery
    >({
      query: ({ companyId, query, page = 1, limit = 10, state, role }) =>
        request(endpointAccessMap.companyMembershipsSearch, {
          params: {
            query,
            page,
            limit,
            state,
            role,
          } satisfies SearchCompanyMembershipsDto,
          headers: { "x-company-id": companyId },
        }),
      transformResponse: toPaginated(mapCompanyMembershipDtoToEntity),
    }),

    getCompanyMembershipById: build.query<
      CompanyMembership,
      { companyId: string; id: string }
    >({
      query: ({ companyId, id }) =>
        request(endpointAccessMap.companyMembershipsRead, {
          pathParams: { id },
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<GetCompanyMembershipResponseDto>
      ) => mapCompanyMembershipDtoToEntity(response.data),
      providesTags: (_result, _error, { id }) => [
        { type: ApiTags.CompanyMembership, id },
      ],
    }),

    createCompanyMembershipInvitation: build.mutation<
      CompanyMembership,
      { companyId: string; data: CreateCompanyMembershipDto }
    >({
      query: ({ companyId, data }) =>
        request(endpointAccessMap.companyMembershipsCreate, {
          data,
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<CreateCompanyMembershipResponseDto>
      ) => mapCompanyMembershipDtoToEntity(response.data),
      invalidatesTags: listTag,
    }),

    updateCompanyMembershipRoles: build.mutation<
      CompanyMembership,
      { companyId: string; id: string; data: UpdateCompanyMembershipDto }
    >({
      query: ({ companyId, id, data }) =>
        request(endpointAccessMap.companyMembershipsUpdate, {
          pathParams: { id },
          data,
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<UpdateCompanyMembershipResponseDto>
      ) => mapCompanyMembershipDtoToEntity(response.data),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.CompanyMembership, id },
        ...listTag,
      ],
    }),

    deleteCompanyMembership: build.mutation<
      CompanyMembership,
      { companyId: string; id: string }
    >({
      query: ({ companyId, id }) =>
        request(endpointAccessMap.companyMembershipsDelete, {
          pathParams: { id },
          headers: { "x-company-id": companyId },
        }),
      transformResponse: (
        response: SuccessOf<DeleteCompanyMembershipResponseDto>
      ) => mapCompanyMembershipDtoToEntity(response.data),
      invalidatesTags: (_result, _error, { id }) => [
        { type: ApiTags.CompanyMembership, id },
        ...listTag,
      ],
    }),
  }),
});

export const {
  useGetCompanyMembershipsQuery,
  useSearchCompanyMembershipsQuery,
  useGetCompanyMembershipByIdQuery,
  useCreateCompanyMembershipInvitationMutation,
  useUpdateCompanyMembershipRolesMutation,
  useDeleteCompanyMembershipMutation,
} = companyMembershipsApi;
