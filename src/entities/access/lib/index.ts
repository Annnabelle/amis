import { useAppSelector } from "app/store";
import type {
  Permission,
  UserAccess,
} from "entities/access/types";
import {
  DynamicEndpointScopes,
  EndpointScopes,
  type CheckableEndpointAccess,
  type DynamicEndpointAccess,
  type DynamicEndpointScope,
  type StaticEndpointAccess,
} from "shared/config/endpointAccessMap";

export type PermissionScope =
  | typeof EndpointScopes.Global
  | typeof EndpointScopes.Company
  | typeof EndpointScopes.Any;

type CanAccessParams = {
  access: UserAccess | null;
  permission: Permission;
  scope: PermissionScope;
  companyId?: string | null;
};

export const canAccess = ({
  access,
  permission,
  scope,
  companyId,
}: CanAccessParams): boolean => {
  if (!access) return false;

  if (scope === EndpointScopes.Global) {
    return access.system.permissions.includes(permission);
  }

  const companyAccess = access.companies.find(
    (company) => company.companyId === companyId
  );

  return (
    (companyAccess?.permissions.includes(permission) ?? false) ||
    access.system.permissions.includes(permission)
  );
};

type CanAccessEndpointParams = {
  access: UserAccess | null;
  endpoint: StaticEndpointAccess;
  companyId?: string | null;
};

export const canAccessEndpoint = ({
  access,
  endpoint,
  companyId,
}: CanAccessEndpointParams) =>
  canAccess({
    access,
    permission: endpoint.permission,
    scope: endpoint.scope,
    companyId,
  });

export function useCan(endpoint: StaticEndpointAccess): boolean;
export function useCan(
  endpoint: DynamicEndpointAccess,
  dynamicScope: DynamicEndpointScope
): boolean;
export function useCan(
  endpoint: CheckableEndpointAccess,
  dynamicScope?: DynamicEndpointScope
): boolean {
  const access = useAppSelector((state) => state.access.data);
  const companyId = useAppSelector(
    (state) => state.access.currentCompanyId
  );
  const pathSegments =
    typeof window === "undefined"
      ? []
      : window.location.pathname.split("/").filter(Boolean);
  const routeCompanyId =
    pathSegments[0] === "organization" && pathSegments.length > 2
      ? pathSegments[1]
      : null;

  const scope: PermissionScope =
    endpoint.scope === EndpointScopes.Dynamic
      ? dynamicScope === DynamicEndpointScopes.System
        ? EndpointScopes.Global
        : EndpointScopes.Company
      : endpoint.scope;

  return canAccess({
    access,
    permission: endpoint.permission,
    scope,
    companyId: routeCompanyId ?? companyId,
  });
}
