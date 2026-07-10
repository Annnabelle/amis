import type { ErrorDto, UserStatus } from "shared/types/dtos";
import type {
  CompanyMembershipState,
  CompanyRole,
} from "entities/companyMemberships/types";

export type CompanyMembershipDto = {
  id: string;
  userId: string;
  companyId: string;
  roles: CompanyRole[];
  state: CompanyMembershipState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyMembershipWithUserDto = CompanyMembershipDto & {
  user: {
    id: string;
    name: {
      first: string;
      last: string;
    };
    email: string;
    phone: string;
    status: UserStatus;
  };
};

export type CreateCompanyMembershipDto = {
  userId: string;
  roles: CompanyRole[];
};

export type UpdateCompanyMembershipDto = {
  roles: CompanyRole[];
};

export type RespondCompanyMembershipInvitationDto = {
  decision: "accept" | "decline";
};

export type GetCompanyMembershipsQueryDto = {
  page: number;
  limit: number;
  state?: CompanyMembershipState;
  role?: CompanyRole;
};

export type CompanyMembershipsResponseDto =
  | {
      success: true;
      data: CompanyMembershipWithUserDto[];
      page: number;
      limit: number;
      total: number;
    }
  | ErrorDto;

export type CompanyMembershipResponseDto =
  | {
      success: true;
      data: CompanyMembershipDto;
    }
  | ErrorDto;

export type RespondCompanyMembershipInvitationResponseDto =
  CompanyMembershipResponseDto;

export const isCompanyMembershipsResponseSuccess = (
  dto: CompanyMembershipsResponseDto
): dto is Extract<CompanyMembershipsResponseDto, { success: true }> =>
  dto.success === true && "data" in dto;

export const isCompanyMembershipResponseSuccess = (
  dto: CompanyMembershipResponseDto
): dto is Extract<CompanyMembershipResponseDto, { success: true }> =>
  dto.success === true && "data" in dto;
