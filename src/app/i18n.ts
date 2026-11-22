import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { AllLanguages } from '@edem2000/amis.contracts';

import { translationLoaders } from 'shared/localization';
import { getStoredLanguage } from 'shared/lib/languagePreference';
import { applyDateLocale } from 'shared/lib/formatDate';
import { normalizeLanguage } from 'shared/lib/language';

/**
 * Переводы приходят отдельным чанком по запросу i18next. changeLanguage сам
 * дожидается загрузки, поэтому переключатель языка остаётся однострочным, а
 * экран не успевает показать ключи.
 */
const translationsBackend = resourcesToBackend(
  (language: string, _namespace: string, callback) => {
    translationLoaders[normalizeLanguage(language)]()
      .then((module) => callback(null, module.default))
      .catch((error: Error) => callback(error, null));
  },
);

/** Первый язык нужен до первого рендера: main.tsx ждёт этот промис. */
export const i18nReady = i18n
  .use(translationsBackend)
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getStoredLanguage(),
    fallbackLng: AllLanguages,
    /** Загрузка идёт промисом, который ждёт main.tsx: Suspense не нужен. */
    react: { useSuspense: false },
    interpolation: {
      escapeValue: false,
    },
  });

/** Названия месяцев и дней у dayjs идут за языком интерфейса. */
applyDateLocale(i18n.language);
i18n.on('languageChanged', applyDateLocale);

export default i18n;
