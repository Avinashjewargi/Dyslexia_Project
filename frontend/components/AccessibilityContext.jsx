// frontend/components/AccessibilityContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Extended default settings with new features
const defaultSettings = {
  fontSize: 20,
  fontFamily: 'OpenDyslexic',
  letterSpacing: 0.15,
  lineHeight: 1.8,
  highContrast: false,
  brightness: 100,        // NEW: Screen brightness (50-150%)
  wordSpacing: 0.3,       // NEW: Word spacing
  cursorSize: 1,          // NEW: Cursor size multiplier
  readingGuide: false,    // NEW: Reading guide line
  textAlign: 'left',      // NEW: Text alignment
  colorTheme: 'default',  // NEW: Color themes
};

// Create the Context
const AccessibilityContext = createContext();

// Custom Hook for consuming context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Provider Component
export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;

    // Apply all CSS variables
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--accessibility-font-family', settings.fontFamily);
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}em`);
    root.style.setProperty('--accessibility-line-height', settings.lineHeight);
    root.style.setProperty('--accessibility-word-spacing', `${settings.wordSpacing}em`);
    root.style.setProperty('--accessibility-brightness', `${settings.brightness}%`);
    root.style.setProperty('--accessibility-cursor-size', settings.cursorSize);
    root.style.setProperty('--accessibility-text-align', settings.textAlign);

    // Apply brightness filter
    document.body.style.filter = `brightness(${settings.brightness}%)`;

    // High contrast mode
    if (settings.highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }

    // Apply color theme
    document.body.className = document.body.className
      .split(' ')
      .filter(c => !c.startsWith('theme-'))
      .join(' ');
    
    if (settings.colorTheme !== 'default') {
      document.body.classList.add(`theme-${settings.colorTheme}`);
    }

    // Cursor size
    if (settings.cursorSize > 1) {
      root.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${24 * settings.cursorSize}" height="${24 * settings.cursorSize}" viewBox="0 0 24 24"><path fill="black" stroke="white" stroke-width="1" d="M5 3l14 9-6 1-2 6z"/></svg>') ${12 * settings.cursorSize} ${12 * settings.cursorSize}, auto`;
    } else {
      root.style.cursor = 'auto';
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Default export for Fast Refresh compatibility
export default AccessibilityProvider;