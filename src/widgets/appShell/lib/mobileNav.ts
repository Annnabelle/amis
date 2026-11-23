/** Переход в мобильном меню. */
export type MobileNavItem = {
  key: string;
  label: string;
  meta: string;
  isActive: boolean;
  onClick: () => void | Promise<void>;
  status?: string;
};

/** Мобильное меню раздела: заголовок, возврат и список переходов. */
export type MobileNavConfig = {
  title: string;
  subtitle: string;
  backPath: string | null;
  items: MobileNavItem[];
};
