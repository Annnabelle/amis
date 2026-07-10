import type { UserStatus } from "shared/types/dtos";

export const CompanyMembershipState = {
  Active: "active",
  Invited: "invited",
  Declined: "declined",
  Disabled: "disabled",
} as const;

export type CompanyMembershipState =
  (typeof CompanyMembershipState)[keyof typeof CompanyMembershipState];

export const CompanyRole = {
  Admin: "admin",
  Manager: "manager",
  Member: "member",
  Auditor: "auditor",
} as const;

export type CompanyRole = (typeof CompanyRole)[keyof typeof CompanyRole];

export type CompanyMembership = {
  id: string;
  userId: string;
  companyId: string;
  user?: CompanyMembershipUserPreview;
  roles: CompanyRole[];
  state: CompanyMembershipState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyMembershipListQuery = {
  companyId: string;
  page: number;
  limit: number;
  state?: CompanyMembershipState;
  role?: CompanyRole;
};

export type CompanyMembershipsState = {
  memberships: CompanyMembership[];
  membershipById: CompanyMembership | null;
  total: number;
  page: number;
  limit: number;
  listRequestKey: string | null;
  isLoading: boolean;
  error: string | null;
};

export type CompanyMembershipUserPreview = {
  id: string;
  firstName: string;
  lastName: string;
  status: UserStatus | string;
  email: string;
  phone: string;
};
