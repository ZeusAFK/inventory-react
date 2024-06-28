import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './es/translation.json';

i18next.use(initReactI18next).init({
  lng: 'es',
  debug: true,
  resources: {
    es: {
      translation,
    },
  },
});
