import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

// Language switcher component that allows manual language selection
// The initial language is automatically detected from browser settings
export default function QuickLanguageSwitcher() {
  const { currentLang, setLanguage } = useTranslation();

  const activeClasses = 'bg-white text-black';
  const inactiveClasses = 'bg-black hover:bg-white/10';
  
  return (
    <div className="flex gap-2 p-1 md:p-0 rounded-md md:padding-0 bg-black md:bg-transparent">
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