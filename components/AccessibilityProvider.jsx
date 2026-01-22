// frontend/components/AccessibilityProvider.jsx - COMPONENT ONLY

import React, { useState, useEffect } from 'react';
// Import definitions from the other file
import { AccessibilityContext, defaultSettings } from './AccessibilityContext'; 

// This function applies global CSS styles to the document body
const applyStyles = (currentSettings) => {
    const root = document.documentElement; // The <html> element

    // Apply font and size
    const font = currentSettings.font === 'default' ? 'sans-serif' : currentSettings.font;
    root.style.setProperty('--main-font', font);
    root.style.setProperty('--main-font-size', `${currentSettings.fontSize}px`);
    root.style.setProperty('--main-line-spacing', currentSettings.lineSpacing);

    // Apply high contrast/color scheme
    if (currentSettings.highContrast) {
        root.style.setProperty('filter', 'invert(100%) hue-rotate(180deg)');
        root.style.setProperty('background-color', 'black');
        root.style.setProperty('color', 'white');
    } else {
        root.style.setProperty('filter', 'none');
        root.style.setProperty('background-color', 'white');
        root.style.setProperty('color', 'black');
    }
};


// Define the Provider Component
export const AccessibilityProvider = ({ children }) => {
    // Use localStorage to persist settings between sessions
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    // Effect to update CSS variables (styles) and localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        applyStyles(settings);
    }, [settings]);

    // Function to update the settings
    const updateSetting = (name, value) => {
        setSettings(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSetting }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

// Note: The file that imports this (App.jsx) must be updated.