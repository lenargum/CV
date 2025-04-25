import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

// Language switcher component that allows manual language selection
// The initial language is automatically detected from browser settings
export default function QuickLanguageSwitcher() {
  const { currentLang, setLanguage } = useTranslation();

  const activeClasses = 'bg-gray-200 text-gray-600 md:bg-primary md:text-text-primary';
  const inactiveClasses = 'bg-primary text-text-primary md:bg-gray-200 md:text-gray-600 hover:bg-gray-100 md:hover:bg-primary/60';
  
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'en' 
            ? activeClasses 
            : inactiveClasses
        } transition-colors duration-300`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'ru' 
            ? activeClasses 
            : inactiveClasses
        } transition-colors duration-300`}
      >
        РУС
      </button>
    </div>
  );
} 