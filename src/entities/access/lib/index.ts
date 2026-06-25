import { useAppSelector } from "app/store";
import type {
  Permission,
  UserAccess,
} from "entities/access/types";

export type PermissionScope = "GLOBAL" | "COMPANY";

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

  if (access.system.permissions.includes(permission)) {
    return true;
  }

  if (scope === "GLOBAL" || !companyId) {
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

  return canAccess({
    access,
    permission,
    scope,
    companyId,
  });
};
