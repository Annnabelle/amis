import type { Permission } from "shared/config/permissions";
import type { MultiLanguage } from "shared/types/dtos";
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

export const AccessModules = {
  Companies: "companies",
  Users: "users",
  Employees: "system-employees",
  CompanyMemberships: "company-memberships",
  Products: "products",
  Orders: "orders",
  Codes: "codes",
  SalesOrders: "sales-orders",
  DeliveryRoutes: "delivery-routes",
  DeliveryTasks: "delivery-tasks",
  ScanSessions: "scan-sessions",
  Invoices: "invoices",
  Integrations: "integrations",
  Reports: "reports",
  Audit: "audit",
} as const;

export type AccessModule =
  (typeof AccessModules)[keyof typeof AccessModules];

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

export const RoleReferenceScope = {
  System: "system",
  Company: "company",
} as const;

export type RoleReferenceScope =
  (typeof RoleReferenceScope)[keyof typeof RoleReferenceScope];

export type RoleReferenceCacheKey = string;

export const getRoleReferenceCacheKey = (
  scope: RoleReferenceScope,
  companyId?: string
): RoleReferenceCacheKey =>
  scope === RoleReferenceScope.Company && companyId
    ? `${scope}:${companyId}`
    : scope;

export type RoleReference<TAlias extends string = string> = {
  alias: TAlias;
  name: MultiLanguage;
  description: MultiLanguage;
};

export type AccessState = {
  data: UserAccess | null;
  currentCompanyId: string | null;
  roleReferences: Partial<Record<RoleReferenceCacheKey, RoleReference[]>>;
  roleReferencesLoading: Partial<Record<RoleReferenceCacheKey, boolean>>;
  roleReferencesLoaded: Partial<Record<RoleReferenceCacheKey, boolean>>;
  roleReferencesError: Partial<Record<RoleReferenceCacheKey, string | null>>;
  assignableRoles: Partial<Record<RoleReferenceCacheKey, RoleReference[]>>;
  assignableRolesLoading: Partial<Record<RoleReferenceCacheKey, boolean>>;
  assignableRolesLoaded: Partial<Record<RoleReferenceCacheKey, boolean>>;
  assignableRolesError: Partial<Record<RoleReferenceCacheKey, string | null>>;
  loading: boolean;
  error: string | null;
};
