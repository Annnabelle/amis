import { isLanguage, type Language } from "shared/types/dtos";

const LANGUAGE_STORAGE_KEY = "amis-language";
const DEFAULT_LANGUAGE: Language = "ru";

const readStoredUserLanguage = (): Language | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const language = (JSON.parse(raw) as { preferences?: { language?: unknown } })
      ?.preferences?.language;
    return typeof language === "string" && isLanguage(language) ? language : null;
  } catch {
    return null;
  }
};

// used to set i18n lng on boot so the UI doesn't flash the fallback language
export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isLanguage(stored)) return stored;
  } catch {
    /* ignore */
  }
  return readStoredUserLanguage() ?? DEFAULT_LANGUAGE;
};

export const persistLanguage = (language: Language) => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    /* ignore */
  }
};
