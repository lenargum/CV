import { useContext } from 'react';
import { LanguageContext } from './index';

export function useTranslation() {
  const { currentLang, setLanguage, t } = useContext(LanguageContext);
  
  return {
    t,
    currentLang,
    setLanguage,
    isEn: currentLang === 'en',
    isRu: currentLang === 'ru'
  };
} 