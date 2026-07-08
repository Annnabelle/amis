import type { Permission } from "shared/config/permissions";
import type { MultiLanguage } from "shared/types/dtos";
import type {
  SystemRole,
  UserSystemAccessState,
} from "entities/systemEmployees/types";

export { Permissions } from "shared/config/permissions";
export type { Permission } from "shared/config/permissions";

export const AccessModules = {
  Companies: "companies",
  Users: "users",
  Employees: "system-employees",
  Products: "products",
  Orders: "orders",
  Codes: "codes",
  SalesOrders: "sales-orders",
  DeliveryRoutes: "delivery-routes",
  DeliveryTasks: "delivery-tasks",
  ScanSessions: "scan-sessions",
  Invoices: "invoices",
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
  };
};

export type SystemAccessInvitation = {
  id: string;
  roles: SystemRole[];
  state: UserSystemAccessState;
  createdBy?: string;
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

export type RoleReference<TAlias extends string = string> = {
  alias: TAlias;
  name: MultiLanguage;
  description: MultiLanguage;
};

export type AccessState = {
  data: UserAccess | null;
  currentCompanyId: string | null;
  roleReferences: Partial<Record<RoleReferenceScope, RoleReference[]>>;
  roleReferencesLoading: Partial<Record<RoleReferenceScope, boolean>>;
  roleReferencesLoaded: Partial<Record<RoleReferenceScope, boolean>>;
  roleReferencesError: Partial<Record<RoleReferenceScope, string | null>>;
  assignableRoles: Partial<Record<RoleReferenceScope, RoleReference[]>>;
  assignableRolesLoading: Partial<Record<RoleReferenceScope, boolean>>;
  assignableRolesLoaded: Partial<Record<RoleReferenceScope, boolean>>;
  assignableRolesError: Partial<Record<RoleReferenceScope, string | null>>;
  loading: boolean;
  error: string | null;
};
