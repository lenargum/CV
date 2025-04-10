import { createContext } from 'react';
import en from './en';
import ru from './ru';

export const translations = {
  en,
  ru
};

// Function to detect browser locale
function detectBrowserLocale() {
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = window.navigator.language || window.navigator.userLanguage;
    
    // Debug log
    console.log(`Detected browser language: ${browserLang}`);
    
    // Check if the browser language starts with 'ru'
    if (browserLang && browserLang.toLowerCase().startsWith('ru')) {
      console.log('Setting language to Russian based on browser locale');
      return 'ru';
    }
  }
  
  // Default to English if not Russian
  console.log('Defaulting to English language');
  return 'en';
}

// Function to get initial language from localStorage or browser locale
export function getInitialLanguage() {
  if (typeof window !== 'undefined') {
    try {
      // First try to get from localStorage
      const storedLang = localStorage.getItem('cv-language');
      
      // If language is stored in localStorage and valid, use that
      if (storedLang && (storedLang === 'en' || storedLang === 'ru')) {
        return storedLang;
      }
      
      // Otherwise, detect from browser
      return detectBrowserLocale();
    } catch (error) {
      // If localStorage fails, detect from browser
      return detectBrowserLocale();
    }
  }
  
  // Default to English for SSR
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