import type { RespondCompanyMembershipInvitationDto } from "@edem2000/amis.contracts/api/company-memberships/requests";
import type { GetRoleReferencesResponseDto } from "@edem2000/amis.contracts/api/reference-book/responses";
import type { RespondSystemAccessInvitationDto } from "@edem2000/amis.contracts/api/users/requests";
import type { GetMeAccessResponseDto } from "@edem2000/amis.contracts/api/users/responses";
import { mapCurrentUserAccessDtoToEntity } from "entities/access/mappers";
import type {
  RoleReference,
  RoleScope,
  UserAccess,
} from "entities/access/types";
import { ApiTags, baseApi, request, type SuccessOf } from "shared/api";
import { endpointAccessMap } from "shared/config/endpointAccessMap";

const accessTag = [{ type: ApiTags.Access, id: "ME" }];

export type RoleReferencesArgs = {
  scope: RoleScope;
  /** Роли компании читаются в её контуре, системные — без него. */
  companyId?: string;
};

const roleReferencesHeaders = (companyId?: string) =>
  companyId ? { "x-company-id": companyId } : undefined;

export const accessApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUserAccess: build.query<UserAccess, void>({
      query: () => request(endpointAccessMap.currentAccess),
      transformResponse: (response: SuccessOf<GetMeAccessResponseDto>) =>
        mapCurrentUserAccessDtoToEntity(response),
      providesTags: accessTag,
    }),

    getAssignableRoles: build.query<RoleReference[], RoleReferencesArgs>({
      query: ({ scope, companyId }) =>
        request(endpointAccessMap.assignableRoleReferencesRead, {
          pathParams: { scope },
          headers: roleReferencesHeaders(companyId),
        }),
      transformResponse: (response: SuccessOf<GetRoleReferencesResponseDto>) =>
        response.roles,
    }),

    getRoleReferences: build.query<RoleReference[], RoleReferencesArgs>({
      query: ({ scope, companyId }) =>
        request(endpointAccessMap.roleReferencesRead, {
          pathParams: { scope },
          headers: roleReferencesHeaders(companyId),
        }),
      transformResponse: (response: SuccessOf<GetRoleReferencesResponseDto>) =>
        response.roles,
    }),

    /** Решение по приглашению меняет права: доступ перечитывается по тегу. */
    decideSystemAccessInvitation: build.mutation<
      void,
      { id: string; decision: RespondSystemAccessInvitationDto["decision"] }
    >({
      query: ({ id, decision }) =>
        request(endpointAccessMap.decideSystemAccessInvitation, {
          pathParams: { id },
          data: { decision } satisfies RespondSystemAccessInvitationDto,
        }),
      transformResponse: (): void => undefined,
      invalidatesTags: accessTag,
    }),

    respondCompanyMembershipInvitation: build.mutation<
      void,
      { id: string; decision: RespondCompanyMembershipInvitationDto["decision"] }
    >({
      query: ({ id, decision }) =>
        request(endpointAccessMap.respondCompanyMembershipInvitation, {
          pathParams: { id },
          data: { decision } satisfies RespondCompanyMembershipInvitationDto,
        }),
      transformResponse: (): void => undefined,
      invalidatesTags: accessTag,
    }),
  }),
});

export const {
  useGetCurrentUserAccessQuery,
  useGetAssignableRolesQuery,
  useGetRoleReferencesQuery,
  useLazyGetRoleReferencesQuery,
  useDecideSystemAccessInvitationMutation,
  useRespondCompanyMembershipInvitationMutation,
} = accessApi;
