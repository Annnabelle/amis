import { Language } from "shared/types/dtos";

/**
 * Форма переводов: русский — образец. Остальные языки проверяются на
 * соответствие ему компилятором, поэтому пропущенный ключ валит сборку.
 */
export type Translations = typeof import("./ru").default;

/**
 * Переводы по языкам, каждый — своим чанком: в бандл попадает только тот
 * язык, которым пользуются. Все три файла вместе весят 354 КБ.
 */
export const translationLoaders: Record<
  Language,
  () => Promise<{ default: Translations }>
> = {
  [Language.Russian]: () => import("./ru"),
  [Language.English]: () => import("./en"),
  [Language.Uzbek]: () => import("./uz"),
};
