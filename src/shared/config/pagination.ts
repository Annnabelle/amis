/** Страница и размер страницы по умолчанию для всех списков. */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export type PaginationState = {
  page: number;
  limit: number;
};

export const DEFAULT_PAGINATION: PaginationState = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
};
