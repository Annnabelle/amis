import type { GetCurrentUserAccessSuccessResponseDto } from "entities/access/dtos";
import type { UserAccess } from "entities/access/types";

export const mapCurrentUserAccessDtoToEntity = (
  dto: GetCurrentUserAccessSuccessResponseDto
): UserAccess => ({
  system: {
    roles: dto.system.roles,
    permissions: dto.system.permissions,
    modules: dto.system.modules,
  },
  companies: dto.companies.map((company) => ({
    companyId: company.id,
    name: company.name,
    roles: company.roles,
    permissions: company.permissions,
    modules: company.modules,
  })),
  invitations: {
    systemAccess: dto.invitations?.systemAccess ?? [],
    companyMemberships: dto.invitations?.companyMemberships ?? [],
  },
});
