// frontend/components/AccessibilityContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Context
const AccessibilityContext = createContext();

// Default settings
const defaultSettings = {
  fontSize: 20,
  fontFamily: 'OpenDyslexic',
  letterSpacing: 0.15,
  lineHeight: 1.8,
  highContrast: false,
};

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
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
      return defaultSettings;
    }
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  // Apply styles to document root
  useEffect(() => {
    const root = document.documentElement;

    // Apply font settings
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--accessibility-font-family', settings.fontFamily);
    root.style.setProperty('--accessibility-letter-spacing', `${settings.letterSpacing}em`);
    root.style.setProperty('--accessibility-line-height', settings.lineHeight);

    // Apply high contrast mode
    if (settings.highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
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

// Only export named exports for Fast Refresh compatibility
export { AccessibilityContext };