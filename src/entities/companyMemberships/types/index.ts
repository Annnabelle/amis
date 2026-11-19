import {
  CompanyMembershipState,
  CompanyRole,
} from '@edem2000/amis.contracts'
import type { Paginated } from 'shared/api'

export {
  CompanyMembershipState,
  CompanyRole,
}

import type { UserStatus } from "shared/types/dtos";


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

export type CompanyMembershipList = Paginated<CompanyMembership>;

export type CompanyMembershipUserPreview = {
  id: string;
  firstName: string;
  lastName: string;
  status: UserStatus | string;
  email: string;
  phone: string;
};
