import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from 'shared/localization/index.ts';
import { getStoredLanguage } from 'shared/lib/languagePreference';
import { applyDateLocale } from 'shared/lib/formatDate';
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

/** Названия месяцев и дней у dayjs идут за языком интерфейса. */
applyDateLocale(i18n.language);
i18n.on('languageChanged', applyDateLocale);

export default i18n;

