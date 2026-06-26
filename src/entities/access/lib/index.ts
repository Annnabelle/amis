import { useAppSelector } from "app/store";
import type {
  Permission,
  UserAccess,
} from "entities/access/types";

export type PermissionScope = "GLOBAL" | "COMPANY" | "ANY";

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

  if (scope === "GLOBAL") {
    return access.system.permissions.includes(permission);
  }

  if (scope === "ANY") {
    if (!companyId) {
      return access.system.permissions.includes(permission);
    }

    const companyAccess = access.companies.find(
      (company) => company.companyId === companyId
    );

    return companyAccess?.permissions.includes(permission) ?? false;
  }

  if (access.system.permissions.includes(permission)) {
    return true;
  }

  if (!companyId) {
    return false;
  }

  const companyAccess = access.companies.find(
    (company) => company.companyId === companyId
  );

  return companyAccess?.permissions.includes(permission) ?? false;
};

export const useCan = (
  permission: Permission,
  scope: PermissionScope
): boolean => {
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

  return canAccess({
    access,
    permission,
    scope,
    companyId: routeCompanyId ?? companyId,
  });
};
