import { Permission as PermissionContract } from '@edem2000/amis.contracts';

/**
 * companies.validate-xtrace-token в пакете нет: он закрывает
 * GET /companies/x-trace/validate, которого на бэкенде нет.
 */
export const Permissions = {
  ...PermissionContract,
  CompaniesValidateXTraceToken: "companies.validate-xtrace-token",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
