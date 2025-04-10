import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

// Language switcher component that allows manual language selection
// The initial language is automatically detected from browser settings
export default function QuickLanguageSwitcher() {
  const { currentLang, setLanguage } = useTranslation();
  
  return (
    <div className="flex gap-2 print:hidden">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'en' 
            ? 'bg-primary text-text-primary' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } transition-colors`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLang === 'ru' 
            ? 'bg-primary text-text-primary' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        } transition-colors`}
      >
        РУС
      </button>
    </div>
  );
} 