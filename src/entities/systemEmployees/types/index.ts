import {
  SystemRoles,
  UserSystemAccessStates,
} from '@edem2000/amis.contracts';
import type {
  SystemRole,
  UserSystemAccessState,
} from '@edem2000/amis.contracts';

export { SystemRoles, UserSystemAccessStates };
export type {
  SystemRole,
  UserSystemAccessState,
};

import type { UserStatus } from "shared/types/dtos";

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
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type SystemEmployeeAccess = {
  id: string;
  userId: string;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
