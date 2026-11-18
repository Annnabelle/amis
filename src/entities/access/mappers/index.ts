import type { GetMeAccessResponseDto } from '@edem2000/amis.contracts/api/users/responses';
import type { UserAccess } from "entities/access/types";

export const mapCurrentUserAccessDtoToEntity = (
  dto: Extract<GetMeAccessResponseDto, { success: true }>
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
