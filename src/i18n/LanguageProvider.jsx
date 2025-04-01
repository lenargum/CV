import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageContext, getInitialLanguage, setLanguage as setLangInStorage, getTranslation } from './index';

export default function LanguageProvider({ children }) {
  // State management
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState(getTranslation('en'));
  const [forceUpdate, setForceUpdate] = useState(0);

  // Initialize from localStorage after component mounts
  useEffect(() => {
    try {
      const initialLang = getInitialLanguage();
      const initialTranslations = getTranslation(initialLang);
      
      setCurrentLang(initialLang);
      setTranslations(initialTranslations);
    } catch (error) {
      // Fallback to default language
      setCurrentLang('en');
      setTranslations(getTranslation('en'));
    }
  }, []);

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
    
    // Force update to ensure components re-render
    setForceUpdate(prev => prev + 1);
  }, [currentLang]);

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentLang,
    setLanguage: handleSetLanguage,
    t: translations,
    _forceUpdateCounter: forceUpdate
  }), [currentLang, handleSetLanguage, translations, forceUpdate]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
} 