import type { ErrorDto } from "shared/types/dtos";
import type { AccessModule, Permission } from "entities/access/types";

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
};

export type GetCurrentUserAccessResponseDto =
  | GetCurrentUserAccessSuccessResponseDto
  | ErrorDto;

export const isGetCurrentUserAccessSuccessResponse = (
  dto: GetCurrentUserAccessResponseDto
): dto is GetCurrentUserAccessSuccessResponseDto =>
  dto.success === true && "system" in dto && "companies" in dto;
