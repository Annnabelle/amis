// src/utils/targetMapper.ts
export type TargetEntity = "user" | "company" | "product" | "auth";

interface TargetRule {
  getName: (target: any) => string | null;
  getPath: (target: any) => string;
}

const targetRules: Record<TargetEntity, TargetRule> = {
  user: {
    getName: (t) => (t.firstName ? `${t.firstName} ${t.lastName || ""}` : null),
    getPath: (t) => `/users/${t.id}`,
  },
  company: {
    getName: (t) => t.displayName || null,
    getPath: (t) => `/organization/${t.id}`,
  },
  product: {
    getName: (t) => t.name || null,
    getPath: (t) => `/organization/${t.companyId}/products/${t.id}`,
  },
  auth: {
    getName: () => "Аутентификация",
    getPath: () => "",
  },
};

export const getTargetLink = (
  targetEntity: string,
  target: any
): { name: string; path: string } | null => {
  if (!target || !(targetEntity in targetRules)) return null;

  const rule = targetRules[targetEntity as TargetEntity];
  const name = rule.getName(target);

  if (!name) return null;
  return { name, path: rule.getPath(target) };
};
