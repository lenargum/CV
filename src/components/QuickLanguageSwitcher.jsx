import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

// A simple language switcher component for debugging
export default function QuickLanguageSwitcher() {
  const { currentLang, setLanguage } = useTranslation();
  
  return (
    <div className="absolute top-4 right-4 flex gap-2 print:hidden z-10">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } transition-colors`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'ru' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } transition-colors`}
      >
        RU
      </button>
    </div>
  );
} 