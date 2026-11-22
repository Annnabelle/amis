import i18n from "i18next";

import { Language, isLanguage } from "shared/types/dtos";

/** Язык по умолчанию: на нём заполнены все справочники бэкенда. */
const DEFAULT_LANGUAGE: Language = Language.Russian;

/**
 * Код языка без региона: браузер и i18next отдают ru-RU или en-US, а
 * контракты и переводы знают только ru, uz и en.
 */
export const normalizeLanguage = (value: string | undefined | null): Language => {
  const base = (value ?? "").split("-")[0];

  return isLanguage(base) ? base : DEFAULT_LANGUAGE;
};

/** Активный язык интерфейса, пригодный для ключей контрактов. */
export const getCurrentLanguage = (): Language => normalizeLanguage(i18n.language);
