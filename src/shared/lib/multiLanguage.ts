import { Language, type MultiLanguage } from "shared/types/dtos";

const LANGUAGE_FALLBACK_ORDER = [
  Language.Russian,
  Language.English,
  Language.Uzbek,
] as const;

/** Забираем текст на языке интерфейса, с откатом на любой заполненный. */
export const resolveMultiLanguage = (
  value: MultiLanguage | null | undefined,
  language: string
): string | null => {
  if (!value) return null;

  const preferred = value[language as Language];
  if (preferred) return preferred;

  for (const fallback of LANGUAGE_FALLBACK_ORDER) {
    if (value[fallback]) return value[fallback];
  }

  return null;
};
