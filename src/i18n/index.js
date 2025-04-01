import { createContext } from 'react';
import en from './en';
import ru from './ru';

export const translations = {
  en,
  ru
};

// Function to get initial language from localStorage or default to 'en'
export function getInitialLanguage() {
  if (typeof window !== 'undefined') {
    try {
      const storedLang = localStorage.getItem('cv-language');
      return storedLang && (storedLang === 'en' || storedLang === 'ru') ? storedLang : 'en';
    } catch (error) {
      return 'en';
    }
  }
  return 'en';
}

// Function to set language in localStorage
export function setLanguage(lang) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cv-language', lang);
    } catch (error) {
      // Silent fail
    }
  }
}

export function getTranslation(lang = 'en') {
  return translations[lang] || translations.en;
}

// Create context for language
export const LanguageContext = createContext({
  currentLang: 'en',
  setLanguage: (lang) => {},
  t: translations.en,
  _forceUpdateCounter: 0
}); 