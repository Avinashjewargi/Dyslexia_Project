// frontend/reader/ColorCoding.jsx - COMPLETE WITH INTERACTIVE FEATURES

import React, { useState } from 'react';
import { getCompleteColorMap } from '../config/colorCodingConfig';

const ColorCoding = ({ 
  text, 
  enabled = false, 
  colorIntensity = 70,
  onWordClick = null,
  highlightDifficultWords = false,
  difficultWords = []
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  
  if (!text) {
    return null;
  }

  // If not enabled OR intensity below 50%, show normal black text
  if (!enabled || colorIntensity < 50) {
    return (
      <div className="colored-text" style={{ 
        lineHeight: '1.8', 
        fontSize: '1.2rem',
        color: '#000000'
      }}>
        {text}
      </div>
    );
  }

  const colorMap = getCompleteColorMap();

  // Apply color with brightness/contrast adjustment - SMOOTH TRANSITION TO BLACK
  const applyColorWithIntensity = (baseColor, intensity) => {
    // Calculate opacity based on intensity (smoothly fades from colored to black)
    const colorStrength = intensity / 100; // 0.2 to 1.0
    
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Interpolate between the color and black based on intensity
    // At 100%: full color
    // At 50%: 50% color, 50% black
    // At 20%: 20% color, 80% black (very dark)
    const finalR = Math.round(r * colorStrength);
    const finalG = Math.round(g * colorStrength);
    const finalB = Math.round(b * colorStrength);

    return {
      color: `rgb(${finalR}, ${finalG}, ${finalB})`,
      opacity: 1, // Keep full opacity, color itself fades to black
      fontWeight: intensity > 70 ? 'bold' : (intensity > 50 ? '600' : 'normal'),
      transition: 'all 0.3s ease'
    };
  };

  // Render single word with color coding and hover effects
  const renderColoredWord = (word, wordIndex) => {
    const cleanWord = word.trim().replace(/[.,!?;:'"]/g, '');
    const isHovered = hoveredWord === wordIndex;
    const isDifficult = difficultWords.includes(cleanWord.toLowerCase());
    
    // Speak word on click if handler provided
    const handleWordClick = () => {
      if (onWordClick && cleanWord) {
        onWordClick(cleanWord);
      }
    };
    
    return (
      <span
        key={wordIndex}
        className="word-wrapper"
        onMouseEnter={() => setHoveredWord(wordIndex)}
        onMouseLeave={() => setHoveredWord(null)}
        onClick={handleWordClick}
        style={{
          display: 'inline-block',
          cursor: onWordClick ? 'pointer' : 'default',
          padding: '2px 4px',
          margin: '0 2px',
          borderRadius: '4px',
          backgroundColor: isHovered ? '#FFF9C4' : (isDifficult && highlightDifficultWords ? '#FFE0E0' : 'transparent'),
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease',
          position: 'relative',
          boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {word.split('').map((char, charIndex) => {
          const lowerChar = char.toLowerCase();
          if (colorMap[lowerChar]) {
            const style = applyColorWithIntensity(colorMap[lowerChar], colorIntensity);
            return (
              <span key={charIndex} style={style}>
                {char}
              </span>
            );
          }
          return <span key={charIndex}>{char}</span>;
        })}
        {isDifficult && highlightDifficultWords && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>!</span>
        )}
        {isHovered && onWordClick && (
          <span style={{
            position: 'absolute',
            bottom: '-24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>🔊 Click to hear</span>
        )}
      </span>
    );
  };

  // Split text into words while preserving spaces
  const words = text.split(/(\s+)/);

  return (
    <div className="colored-text" style={{ lineHeight: '1.8', fontSize: '1.2rem' }}>
      {words.map((word, index) => {
        // Preserve whitespace
        if (word.match(/^\s+$/)) {
          return <span key={index}>{word}</span>;
        }
        return renderColoredWord(word, index);
      })}
    </div>
  );
};

export default ColorCoding;