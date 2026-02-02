import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getLanguageConfig } from '../config/languageConfig';

// Create context
const LanguageContext = createContext();

// Provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Get initial language from localStorage or use default
  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || DEFAULT_LANGUAGE;
  };

  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage());
  const [languageConfig, setLanguageConfig] = useState(getLanguageConfig(currentLanguage));

  // Change language function
  const changeLanguage = (languageCode) => {
    // Validate language code
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
    
    if (!isSupported) {
      console.error(`Language ${languageCode} is not supported`);
      return;
    }

    // Update state
    setCurrentLanguage(languageCode);
    setLanguageConfig(getLanguageConfig(languageCode));
    
    // Update i18n
    i18n.changeLanguage(languageCode);
    
    // Save to localStorage
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Update document language attribute
    document.documentElement.lang = languageCode;
    
    // Update document direction (for RTL languages if needed in future)
    const config = getLanguageConfig(languageCode);
    document.documentElement.dir = config.direction;
  };

  // Initialize language on mount
  useEffect(() => {
    changeLanguage(currentLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const value = {
    currentLanguage,
    languageConfig,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    isRTL: languageConfig.direction === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};

export default LanguageContext;