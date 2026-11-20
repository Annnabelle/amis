import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from 'shared/localization/index';
import { getStoredLanguage } from 'shared/lib/languagePreference';
import { AllLanguages } from '@edem2000/amis.contracts';

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getStoredLanguage(),
    fallbackLng: AllLanguages,
    interpolation: {
      escapeValue: false, 
    },
    resources
  });

export default i18n;

