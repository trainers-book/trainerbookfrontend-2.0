import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationHE from "./locales/he/translation.json";
import translationHeEn from "./locales/heEn/translation.json"
// טיפוסים ל־resources
const resources = {
  en: { translation: translationEN },
  he: { translation: translationHE },
  heEn: {translation: translationHeEn}
} as const;

i18n
  //   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "he",
    fallbackLng: "he",
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ["en", "he", "heEn"],
  });

export default i18n;
