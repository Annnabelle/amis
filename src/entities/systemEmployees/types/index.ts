import type { UserStatus } from "shared/types/dtos";

export const UserSystemAccessState = {
  Active: "active",
  Invited: "invited",
  Declined: "declined",
  Disabled: "disabled",
} as const;

export type UserSystemAccessState =
  (typeof UserSystemAccessState)[keyof typeof UserSystemAccessState];

export const SystemRole = {
  Owner: "system_owner",
  Admin: "system_admin",
  Support: "system_support",
  Auditor: "system_auditor",
} as const;

export type SystemRole = (typeof SystemRole)[keyof typeof SystemRole];

export type SystemEmployeeUser = {
  id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  status: UserStatus | string;
};

export type SystemEmployee = {
  id: string;
  user: SystemEmployeeUser;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdAt: string;
  updatedAt: string;
};

export type SystemEmployeeListQuery = {
  page: number;
  limit: number;
  sortBy?: "createdAt" | "updatedAt" | "firstName" | "lastName" | "email";
  sortOrder?: "asc" | "desc";
  state?: UserSystemAccessState;
  role?: SystemRole;
  query?: string;
};

export type SystemEmployeesState = {
  employees: SystemEmployee[];
  employeeById: SystemEmployee | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
};
