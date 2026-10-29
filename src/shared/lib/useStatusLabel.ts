import { useTranslation } from "react-i18next";
import {
  getStatusLabelKey,
  hasStatusInCatalog,
  StatusScope,
  type StatusEntity,
} from "shared/config/statusCatalog";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Не-хуковая версия: нужна в фабриках колонок таблиц, куда `t` приходит
 * аргументом и хук вызвать негде.
 */
export const getStatusLabel = (
  t: TranslateFn,
  entity: StatusEntity | undefined,
  scope: StatusScope | undefined,
  status?: string | null,
  fallbackLabel?: string | null
): string => {
  const resolvedScope = scope ?? StatusScope.Internal;

  if (entity && hasStatusInCatalog(entity, resolvedScope, status)) {
    return t(getStatusLabelKey(entity, resolvedScope, status as string));
  }

  return fallbackLabel || status || "-";
};

/**
 * Подпись статуса из единого каталога. Если кода в каталоге ещё нет —
 * отдаём запасной текст (например toLabel из lifecycle) либо сам код,
 * но никогда не ключ i18n.
 */
export const useStatusLabel = (
  entity: StatusEntity | undefined,
  scope: StatusScope | undefined,
  status?: string | null,
  fallbackLabel?: string | null
): string => {
  const { t } = useTranslation();

  return getStatusLabel(t, entity, scope, status, fallbackLabel);
};
