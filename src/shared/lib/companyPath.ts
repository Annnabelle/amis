/**
 * Компания из адреса страницы: /organization/:id.
 *
 * Один разбор на всех потребителей: интерцептор запросов, роутер, проверка
 * прав и оболочка. Компания есть и на адресе ровно /organization/:id, без
 * вложенного раздела.
 */
const COMPANY_PATH = /^\/organization\/([^/]+)(?:\/|$)/;

export const parseCompanyFromPath = (pathname: string): string | null =>
  COMPANY_PATH.exec(pathname)?.[1] ?? null;
