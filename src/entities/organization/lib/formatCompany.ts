import type { Company } from "entities/organization/types";
import { FormatUzbekPhoneNumber } from "shared/lib/utils";

/** Имя ответственного одной строкой: фамилия, имя, отчество. */
export const formatEmployeeName = (
  employee?: Company["responsibleEmployees"]["director"],
) => {
  if (!employee?.name) return "";

  return [employee.name.last, employee.name.first, employee.name.middle]
    .filter(Boolean)
    .join(" ");
};

/** Телефон и почта компании одной строкой. */
export const formatCompanyContacts = (contacts: Company["contacts"]) =>
  [contacts.phone ? FormatUzbekPhoneNumber(contacts.phone) : "", contacts.email]
    .filter(Boolean)
    .join(" / ");
