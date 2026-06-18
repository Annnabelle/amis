import type { UserResponse } from "entities/users/types";

const normalizeRoleValue = (value?: string) => value?.trim().toLowerCase() ?? "";

const hasAnyRoleToken = (user: UserResponse | null, tokens: string[]) => {
  if (!user) return false;

  // Production can still return users without role data. Keep the legacy
  // delivery flow available until role responses are fully deployed.
  if (!user.role) return true;

  const alias = normalizeRoleValue(user.role.alias);
  const names = Object.values(user.role.name ?? {}).map((value) => normalizeRoleValue(value));

  return tokens.some((token) => {
    const normalizedToken = normalizeRoleValue(token);
    return alias.includes(normalizedToken) || names.some((name) => name.includes(normalizedToken));
  });
};

export const isWarehouseRole = (user: UserResponse | null) =>
  hasAnyRoleToken(user, ["warehouse", "склад", "ombor", "superadmin"]);

export const isAgentRole = (user: UserResponse | null) =>
  hasAnyRoleToken(user, ["agent", "агент", "superadmin"]);
