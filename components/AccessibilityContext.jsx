//frontend/components/AccessibilityContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create Context
const AccessibilityContext = createContext();

// 2. Custom Hook for easy consumption
export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    // If context is undefined (component used outside provider), return a safe fallback or throw error.
    // Returning null allows us to handle it gracefully in the component if needed.
    if (!context) {
        console.warn("useAccessibility called outside of AccessibilityProvider");
        return { 
            settings: { fontSize: 20, fontFamily: 'Open Dyslexic', highContrast: false }, 
            updateSetting: () => {}, 
            resetSettings: () => {} 
        };
    }
    return context;
};

// 3. Provider Component
export const AccessibilityProvider = ({ children }) => {
    // Default state
    const [settings, setSettings] = useState({
        fontSize: 20,
        fontFamily: 'Open Dyslexic', 
        letterSpacing: 0.15,
        lineHeight: 1.8,
        highContrast: false,
    });

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('accessibility-settings');
            if (saved) setSettings(JSON.parse(saved));
        } catch (e) { console.error("Failed to load settings:", e); }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
        // Apply global class for high contrast
        if (settings.highContrast) document.body.classList.add('high-contrast-mode');
        else document.body.classList.remove('high-contrast-mode');
    }, [settings]);

    const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
    
    const resetSettings = () => setSettings({
        fontSize: 20, fontFamily: 'Open Dyslexic', letterSpacing: 0.15, lineHeight: 1.8, highContrast: false
    });

    return (
        <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

export default AccessibilityContext;