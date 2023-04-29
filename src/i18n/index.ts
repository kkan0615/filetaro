import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enDictionary from './locales/en'
import { defaultLocale } from '@renderer/types/i18n'
// import { koDictionary } from './langs/ko'

const resources = {
  en: {
    translation: enDictionary,
  },
  // ko: {
  //   translation: koDictionary
  // }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: defaultLocale,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: resources,
  })

export default i18n
