import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Fetch from 'i18next-fetch-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LOCALES = ['en', 'ru'];

i18n
  .use(Fetch)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    fallbackLng: 'en',
    debug: true,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;
