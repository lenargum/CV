import { createContext } from 'react';
import en from './en';
import ru from './ru';
import type { Lang, Translation } from './types';

export const translations: Record<Lang, Translation> = {
  en,
  ru
};

export function getTranslation(lang: Lang = 'en'): Translation {
  return translations[lang] || translations.en;
}

export interface LanguageContextValue {
  currentLang: Lang;
  setLanguage: (lang: Lang) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextValue>({
  currentLang: 'en',
  setLanguage: () => {},
  t: translations.en
});
