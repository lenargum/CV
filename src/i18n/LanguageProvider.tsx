import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { LanguageContext, getTranslation } from './index';
import type { Lang } from './types';

interface LanguageProviderProps {
  children: ReactNode;
  initialLang?: Lang;
}

export default function LanguageProvider({ children, initialLang }: LanguageProviderProps) {
  const [currentLang, setCurrentLang] = useState<Lang>(initialLang || 'en');
  const [translations, setTranslations] = useState(getTranslation(initialLang || 'en'));

  useEffect(() => {
    try {
      if (initialLang && initialLang !== currentLang) {
        setCurrentLang(initialLang);
        setTranslations(getTranslation(initialLang));
      }
    } catch {
      // keep current state
    }
  }, [initialLang, currentLang]);

  const handleSetLanguage = useCallback((lang: Lang) => {
    if (lang === currentLang) return;
    setCurrentLang(lang);
    setTranslations(getTranslation(lang));
  }, [currentLang]);

  const contextValue = useMemo(() => ({
    currentLang,
    setLanguage: handleSetLanguage,
    t: translations
  }), [currentLang, handleSetLanguage, translations]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
