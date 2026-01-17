import { createContext } from 'react';
import en from './en';
import ru from './ru';

export const translations = {
  en,
  ru
};

export function getTranslation(lang = 'en') {
  return translations[lang] || translations.en;
}

// Create context for language
export const LanguageContext = createContext({
  currentLang: 'en',
  setLanguage: (lang) => {},
  t: translations.en
});