import type {
  CompanyMembershipDto,
  CompanyMembershipWithUserDto,
} from "entities/companyMemberships/dtos";
import type { CompanyMembership } from "entities/companyMemberships/types";

export const mapCompanyMembershipDtoToEntity = (
  dto: CompanyMembershipDto | CompanyMembershipWithUserDto
): CompanyMembership => ({
  id: dto.id,
  userId: dto.userId,
  companyId: dto.companyId,
  user: "user" in dto
    ? {
        id: dto.user.id,
        firstName: dto.user.name.first,
        lastName: dto.user.name.last,
        email: dto.user.email,
        phone: dto.user.phone,
        status: dto.user.status,
      }
    : undefined,
  roles: dto.roles,
  state: dto.state,
  createdBy: dto.createdBy,
  updatedBy: dto.updatedBy,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
