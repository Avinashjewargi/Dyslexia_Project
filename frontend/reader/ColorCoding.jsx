// frontend/reader/ColorCoding.jsx - FIXED VERSION

import React from 'react';
import { getCompleteColorMap } from '../config/colorCodingConfig';

const ColorCoding = ({ text, enabled = false, colorIntensity = 70 }) => {
  
  if (!text) {
    return null;
  }

  // If not enabled OR intensity is below 50%, show NORMAL BLACK TEXT
  if (!enabled || colorIntensity < 50) {
    return (
      <div className="colored-text" style={{ 
        lineHeight: '1.8', 
        fontSize: '1.2rem',
        color: '#000000' // Normal black text
      }}>
        {text}
      </div>
    );
  }

  const colorMap = getCompleteColorMap();

  // Apply color with brightness/contrast adjustment
  const applyColorWithIntensity = (baseColor, intensity) => {
    const opacity = Math.max(0.5, intensity / 100);
    const brightness = 0.7 + (intensity / 100) * 0.6;

    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    const newR = Math.min(255, Math.floor(r * brightness));
    const newG = Math.min(255, Math.floor(g * brightness));
    const newB = Math.min(255, Math.floor(b * brightness));

    return {
      color: `rgb(${newR}, ${newG}, ${newB})`,
      opacity: opacity,
      fontWeight: intensity > 70 ? 'bold' : 'normal',
      transition: 'all 0.3s ease'
    };
  };

  const renderColoredText = () => {
    return text.split('').map((char, index) => {
      const lowerChar = char.toLowerCase();
      if (colorMap[lowerChar]) {
        const style = applyColorWithIntensity(colorMap[lowerChar], colorIntensity);
        return (
          <span key={index} style={style}>
            {char}
          </span>
        );
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <div className="colored-text" style={{ lineHeight: '1.8', fontSize: '1.2rem' }}>
      {renderColoredText()}
    </div>
  );
};

export default ColorCoding;