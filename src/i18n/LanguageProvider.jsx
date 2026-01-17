import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageContext, getTranslation } from './index';

export default function LanguageProvider({ children, initialLang }) {
  // State management
  const [currentLang, setCurrentLang] = useState(initialLang || 'en');
  const [translations, setTranslations] = useState(getTranslation(initialLang || 'en'));

  // Always use URL-based language
  useEffect(() => {
    try {
      // Always use the URL-provided initialLang if it's different from current
      if (initialLang && initialLang !== currentLang) {
        setCurrentLang(initialLang);
        setTranslations(getTranslation(initialLang));
      }
    } catch (error) {
      // keep current state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLang, currentLang]);

  // Language change handler
  const handleSetLanguage = useCallback((lang) => {
    if (lang === currentLang) return;

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
