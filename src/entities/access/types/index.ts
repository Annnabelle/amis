import type {
  RoleReference,
} from '@edem2000/amis.contracts';

export type {
  RoleReference,
};

import {
  AccessModules,
  RoleScope,
} from '@edem2000/amis.contracts'

import type { AccessModule } from '@edem2000/amis.contracts'
export type { AccessModule }

export {
  AccessModules,
  RoleScope,
}

import type { Permission } from "shared/config/permissions";
import type {
  SystemRole,
  UserSystemAccessState,
} from "entities/systemEmployees/types";
import type {
  CompanyMembershipState,
  CompanyRole,
} from "entities/companyMemberships/types";

export { Permissions } from "shared/config/permissions";
export type { Permission } from "shared/config/permissions";


export type AccessScope = {
  roles: string[];
  permissions: Permission[];
  modules: AccessModule[];
};

export type CompanyAccess = AccessScope & {
  companyId: string;
  name: string;
};

export type UserAccess = {
  system: AccessScope;
  companies: CompanyAccess[];
  invitations: {
    systemAccess: SystemAccessInvitation[];
    companyMemberships: CompanyMembershipInvitation[];
  };
};

export type SystemAccessInvitation = {
  id: string;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CompanyMembershipInvitation = {
  id: string;
  company: {
    id: string;
    name: string;
  };
  roles: CompanyRole[];
  state: CompanyMembershipState;
  createdBy: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};


export type RoleReferenceCacheKey = string;

export const getRoleReferenceCacheKey = (
  scope: RoleScope,
  companyId?: string
): RoleReferenceCacheKey =>
  scope === RoleScope.Company && companyId
    ? `${scope}:${companyId}`
    : scope;

export type AccessState = {
  data: UserAccess | null;
  currentCompanyId: string | null;
  loading: boolean;
  error: string | null;
};
