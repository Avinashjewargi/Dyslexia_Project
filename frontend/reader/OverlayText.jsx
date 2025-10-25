// frontend/reader/OverlayText.jsx

import React from 'react';

/**
 * Component to display text with adaptive, overlaid styling based on analysis.
 * @param {string} text - The full text to be displayed.
 * @param {Array<string>} challengingWords - List of words to be highlighted/modified.
 * @param {object} readerSettings - Current accessibility settings (font, contrast, etc.).
 */
function OverlayText({ text, challengingWords = [], readerSettings = {} }) {

  const words = text.split(/\s+/); // Split text into words, preserving spaces/punc is harder
  const challengingSet = new Set(challengingWords.map(w => w.toLowerCase()));

  // Apply global styles from settings
  const textStyle = {
    fontFamily: readerSettings.font || 'sans-serif',
    fontSize: `${readerSettings.fontSize || 18}px`,
    lineHeight: readerSettings.lineSpacing || 1.8, // Increased line height is key for dyslexia
    // High contrast logic could be applied here
  };

  return (
    <div style={textStyle} className="p-4 border rounded bg-light">
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const isChallenging = challengingSet.has(cleanWord);

        // Style for challenging words: bolding and a subtle underline/dot
        const wordStyle = isChallenging ? {
          fontWeight: 'bolder',
          color: '#dc3545', // Bootstrap red/danger color
          borderBottom: '2px solid #dc3545', // Subtle overlay indicator
          cursor: 'help'
        } : {};

        return (
          <span 
            key={index} 
            style={wordStyle}
            // Placeholder for interaction (e.g., clicking opens a dictionary)
            title={isChallenging ? `Challenging word! Click for help.` : undefined}
            className="me-1"
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export default OverlayText;