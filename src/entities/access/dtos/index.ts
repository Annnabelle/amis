import type { ErrorDto, MultiLanguage } from "shared/types/dtos";
import type { AccessModule, Permission, RoleReferenceScope } from "entities/access/types";
import type {
  SystemRole,
  UserSystemAccessState,
} from "entities/systemEmployees/types";
import type {
  CompanyMembershipState,
  CompanyRole,
} from "entities/companyMemberships/types";
import type { CompanyMembershipDto } from "entities/companyMemberships/dtos";

export type AccessRoleAlias = string;

export type AccessScopeDto = {
  roles: AccessRoleAlias[];
  permissions: Permission[];
  modules: AccessModule[];
};

export type CompanyAccessDto = AccessScopeDto & {
  id: string;
  name: string;
};

export type GetCurrentUserAccessSuccessResponseDto = {
  success: boolean;
  system: AccessScopeDto;
  companies: CompanyAccessDto[];
  invitations?: {
    systemAccess: SystemAccessInvitationResponseDto[];
    companyMemberships: CompanyMembershipInvitationResponseDto[];
  };
};

export type SystemAccessInvitationResponseDto = {
  id: string;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyMembershipInvitationResponseDto = {
  id: string;
  company: {
    id: string;
    name: string;
  };
  roles: CompanyRole[];
  state: CompanyMembershipState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SystemAccessInvitationActionResponseDto =
  | {
      success: true;
      data: SystemAccessInvitationResponseDto;
    }
  | ErrorDto;

export type SystemAccessInvitationDecisionDto = {
  decision: "accept" | "decline";
};

export type CompanyMembershipInvitationActionResponseDto =
  | {
      success: true;
      data: CompanyMembershipDto;
    }
  | ErrorDto;

export type CompanyMembershipInvitationDecisionDto = {
  decision: "accept" | "decline";
};

export type RoleReferenceDto = {
  alias: string;
  name: MultiLanguage;
  description: MultiLanguage;
};

export type GetRoleReferencesSuccessResponseDto = {
  roles: RoleReferenceDto[];
};

export type GetRoleReferencesResponseDto =
  | GetRoleReferencesSuccessResponseDto
  | ErrorDto;

export type GetRoleReferencesQueryDto = {
  scope: RoleReferenceScope;
};

export const isSystemAccessInvitationActionSuccessResponse = (
  dto: SystemAccessInvitationActionResponseDto
): dto is Extract<SystemAccessInvitationActionResponseDto, { success: true }> =>
  dto.success === true && "data" in dto;

export const isCompanyMembershipInvitationActionSuccessResponse = (
  dto: CompanyMembershipInvitationActionResponseDto
): dto is Extract<CompanyMembershipInvitationActionResponseDto, { success: true }> =>
  dto.success === true && "data" in dto;

export const isGetRoleReferencesSuccessResponse = (
  dto: GetRoleReferencesResponseDto
): dto is GetRoleReferencesSuccessResponseDto =>
  "roles" in dto && Array.isArray(dto.roles);

export type GetCurrentUserAccessResponseDto =
  | GetCurrentUserAccessSuccessResponseDto
  | ErrorDto;

export const isGetCurrentUserAccessSuccessResponse = (
  dto: GetCurrentUserAccessResponseDto
): dto is GetCurrentUserAccessSuccessResponseDto =>
  dto.success === true && "system" in dto && "companies" in dto;
