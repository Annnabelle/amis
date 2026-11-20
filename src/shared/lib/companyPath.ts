/**
 * Компания из адреса страницы: /organization/:id.
 *
 * Разбор был написан в пяти местах, и в двух из них требовался третий
 * сегмент: на адресе ровно /organization/:id роутер компанию видел, а useCan
 * — нет, и кнопки гасли без причины.
 */
const COMPANY_PATH = /^\/organization\/([^/]+)(?:\/|$)/;

export const parseCompanyFromPath = (pathname: string): string | null =>
  COMPANY_PATH.exec(pathname)?.[1] ?? null;
