import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from 'shared/localization/index.ts';
import { getStoredLanguage } from 'shared/lib/languagePreference';


export const Language = {
  Russian: 'ru',
  Uzbek: 'uz',
  English: 'en',
} as const;

const Languages = Object.values(Language);

export type Language = typeof Language[keyof typeof Language];

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getStoredLanguage(),
    fallbackLng: Languages,
    interpolation: {
      escapeValue: false, 
    },
    resources
  });

export default i18n;


