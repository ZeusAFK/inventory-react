import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translation_es from "./es/translation.json";
import translation_en from "./en/translation.json";

const savedLanguage = localStorage.getItem("language") || "es";

i18next.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: "en",
  debug: true,
  resources: {
    es: { translation: translation_es },
    en: { translation: translation_en },
  },
});

export default i18next;
