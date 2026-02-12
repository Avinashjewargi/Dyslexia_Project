import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = ({ showLabel = true, compact = false }) => {
  const { currentLanguage, supportedLanguages, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLangConfig = supportedLanguages.find(lang => lang.code === currentLanguage);

  if (compact) {
    // Compact dropdown version
    return (
      <div className="language-selector-compact">
        <select 
          value={currentLanguage} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-dropdown"
        >
          {supportedLanguages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Full version with custom dropdown
  return (
    <div className="language-selector">
      {showLabel && <label className="language-label">{t('common.labels.language') || 'Language'}:</label>}
      
      <div className="language-dropdown-container">
        <button 
          className="language-current"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="language-flag">{currentLangConfig?.flag}</span>
          <span className="language-name">{currentLangConfig?.nativeName}</span>
          <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="language-options">
            {supportedLanguages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${lang.code === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="language-flag">{lang.flag}</span>
                <span className="language-name">{lang.nativeName}</span>
                {lang.code === currentLanguage && <span className="checkmark">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;