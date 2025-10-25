// frontend/components/AccessibilityContext.jsx - DEFINITIONS ONLY

import { createContext, useContext } from 'react';

// 1. Define the Context
export const AccessibilityContext = createContext();

// Default settings 
export const defaultSettings = {
    font: 'default',
    fontSize: 18,
    highContrast: false,
    lineSpacing: 1.8,
};

// 2. Custom hook for easy use in any component
export const useAccessibility = () => useContext(AccessibilityContext);