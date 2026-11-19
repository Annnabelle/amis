export type TargetEntity = "user" | "company" | "product" | "auth";

/** Цель события аудита: набор полей зависит от сущности. */
type AuditTarget = Record<string, unknown>;

const text = (value: unknown): string => (value == null ? "" : String(value));

interface TargetRule {
  getName: (target: AuditTarget) => string | null;
  getPath: (target: AuditTarget) => string;
}

const targetRules: Record<TargetEntity, TargetRule> = {
  user: {
    getName: (t) => (t.firstName ? `${text(t.firstName)} ${text(t.lastName)}`.trim() : null),
    getPath: (t) => `/users/${text(t.id)}`,
  },
  company: {
    getName: (t) => text(t.displayName) || null,
    getPath: (t) => `/organization/${text(t.id)}`,
  },
  product: {
    getName: (t) => text(t.name) || null,
    getPath: (t) =>
      t.companyId
        ? `/organization/${text(t.companyId)}/products/${text(t.id)}`
        : "/organization",
  },
  auth: {
    getName: () => "Аутентификация",
    getPath: () => "",
  },
};

export const getTargetLink = (
  targetEntity: string,
  target: AuditTarget | null
): { name: string; path: string } | null => {
  if (!target || !(targetEntity in targetRules)) return null;

  const rule = targetRules[targetEntity as TargetEntity];
  const name = rule.getName(target);

  if (!name) return null;
  return { name, path: rule.getPath(target) };
};



