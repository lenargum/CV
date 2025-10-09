import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageContext, setLanguage as setLangInStorage, getTranslation } from './index';

export default function LanguageProvider({ children, initialLang }) {
  // State management
  const [currentLang, setCurrentLang] = useState(initialLang || 'en');
  const [translations, setTranslations] = useState(getTranslation(initialLang || 'en'));

  // Sync from localStorage after mount, but do NOT override SSR unless storage explicitly set
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('cv-language');
        if (storedLang === 'en' || storedLang === 'ru') {
          if (storedLang !== currentLang) {
            setCurrentLang(storedLang);
            setTranslations(getTranslation(storedLang));
          }
          return;
        }
      }
      // No stored language; ensure SSR-provided initialLang is applied
      if (initialLang && initialLang !== currentLang) {
        setCurrentLang(initialLang);
        setTranslations(getTranslation(initialLang));
      }
    } catch (error) {
      // keep current state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLang]);

  // Language change handler
  const handleSetLanguage = useCallback((lang) => {
    if (lang === currentLang) return;
    
    // Update localStorage
    setLangInStorage(lang);
    
    // Get new translations
    const newTranslations = getTranslation(lang);
    
    // Update state
    setCurrentLang(lang);
    setTranslations(newTranslations);
  }, [currentLang]);

  // Create a memoized context value to prevent unnecessary re-renders
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