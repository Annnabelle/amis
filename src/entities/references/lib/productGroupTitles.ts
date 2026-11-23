import type { Reference } from "entities/references/types";
import type { LanguageKey } from "shared/lib/utils";

/**
 * Подписи товарных групп по алиасу.
 *
 * Вендор присылает алиас группы в любом регистре, поэтому в карте лежат оба
 * написания: как в справочнике и в нижнем регистре.
 */
export const buildProductGroupTitles = (
  references: Reference[],
  language: LanguageKey,
) => {
  const titles = new Map<string, string>();

  references.forEach((reference) => {
    const localizedTitle =
      reference.title?.[language] ??
      reference.title?.ru ??
      reference.title?.en ??
      reference.alias;

    titles.set(reference.alias, localizedTitle);
    titles.set(reference.alias.trim().toLowerCase(), localizedTitle);
  });

  return titles;
};
