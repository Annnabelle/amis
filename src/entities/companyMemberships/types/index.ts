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
  Owner: "owner",
  Admin: "admin",
  Operator: "operator",
  Accountant: "accountant",
  Logistician: "logistician",
  WarehouseManager: "warehouse_manager",
  DeliveryAgent: "delivery_agent",
  Driver: "driver",
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

export type SearchCompanyMembershipsQuery = {
  companyId: string;
  query: string;
  page?: number;
  limit?: number;
  state?: CompanyMembershipState;
  role?: CompanyRole;
};

export type CompanyMembershipsState = {
  memberships: CompanyMembership[];
  searchedMemberships: CompanyMembership[];
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
