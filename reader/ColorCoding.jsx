// frontend/reader/ColorCoding.jsx

import React from 'react';
import { Card, Form, Badge } from 'react-bootstrap';

/**
 * Color mappings for commonly confused characters in dyslexia
 * Research shows that consistent color coding helps dyslexic readers
 * distinguish between similar-looking letters and numbers
 */
const DEFAULT_COLOR_MAP = {
  // Commonly confused letter pairs
  'b': '#3498db',  // Blue
  'd': '#e74c3c',  // Red
  'p': '#2ecc71',  // Green
  'q': '#f39c12',  // Orange
  
  // Numbers that can be confused
  '6': '#9b59b6',  // Purple
  '9': '#1abc9c',  // Teal
  
  // Additional commonly confused pairs
  'n': '#34495e',  // Dark Gray
  'u': '#e67e22',  // Carrot Orange
  'm': '#16a085',  // Green Sea
  'w': '#c0392b',  // Pomegranate
};

/**
 * ColorCoding Component
 * Applies color coding to text to help dyslexic readers distinguish
 * between commonly confused letters and numbers
 * 
 * @param {string} text - The text content to color code
 * @param {object} colorMap - Custom color mappings (optional)
 * @param {boolean} enabled - Whether color coding is enabled
 * @param {object} readerSettings - Font and display settings
 */
const ColorCoding = ({ 
  text, 
  colorMap = DEFAULT_COLOR_MAP, 
  enabled = true,
  readerSettings = {}
}) => {
  
  if (!enabled || !text) {
    return (
      <div style={{
        fontFamily: readerSettings.fontFamily || 'sans-serif',
        fontSize: `${readerSettings.fontSize || 18}px`,
        lineHeight: readerSettings.lineHeight || 1.8,
        letterSpacing: `${readerSettings.letterSpacing || 0}em`,
      }}>
        {text}
      </div>
    );
  }

  /**
   * Renders text with color-coded characters
   * Each character is checked against the color map and styled accordingly
   */
  const renderColorCodedText = () => {
    const chars = text.split('');
    
    return chars.map((char, index) => {
      const lowerChar = char.toLowerCase();
      const color = colorMap[lowerChar];
      
      // Apply color if character is in the map
      if (color) {
        return (
          <span
            key={index}
            style={{
              color: color,
              fontWeight: 'bold',
              textShadow: '0 0 1px rgba(0,0,0,0.1)', // Subtle shadow for better visibility
              transition: 'color 0.2s ease',
            }}
            title={`Color-coded: ${char.toUpperCase()} (helps distinguish from similar letters)`}
          >
            {char}
          </span>
        );
      }
      
      // Return regular character
      return <span key={index}>{char}</span>;
    });
  };

  const textStyle = {
    fontFamily: readerSettings.fontFamily || 'OpenDyslexic, sans-serif',
    fontSize: `${readerSettings.fontSize || 18}px`,
    lineHeight: readerSettings.lineHeight || 1.8,
    letterSpacing: `${readerSettings.letterSpacing || 0.05}em`,
    wordSpacing: '0.3em', // Extra word spacing helps dyslexic readers
    backgroundColor: readerSettings.highContrast ? '#333' : '#fff',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={textStyle} className="color-coded-text">
      {renderColorCodedText()}
    </div>
  );
};

/**
 * ColorCodingSettings Component
 * Allows users to customize color coding preferences
 */
export const ColorCodingSettings = ({ 
  enabled, 
  onToggle, 
  colorMap = DEFAULT_COLOR_MAP
}) => {
  
  const confusedPairs = [
    { chars: ['b', 'd'], description: 'b vs d' },
    { chars: ['p', 'q'], description: 'p vs q' },
    { chars: ['6', '9'], description: '6 vs 9' },
    { chars: ['n', 'u'], description: 'n vs u' },
    { chars: ['m', 'w'], description: 'm vs w' },
  ];

  return (
    <Card className="shadow-sm p-3 mb-3 border-info">
      <h5 className="text-info mb-3">🎨 Color Coding Assistant</h5>
      
      <Form.Check 
        type="switch"
        id="color-coding-toggle"
        label="Enable Color Coding for Confused Letters"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="mb-3"
      />
      
      {enabled && (
        <div className="mt-3">
          <p className="small text-muted mb-2">
            <strong>What is this?</strong> Color coding helps you remember that similar-looking 
            letters are different by giving each one its own color. This makes reading easier!
          </p>
          
          <div className="mt-3">
            <h6 className="small fw-bold">Color Guide:</h6>
            {confusedPairs.map((pair, idx) => (
              <div key={idx} className="d-flex align-items-center mb-2 small">
                <span className="me-2 fw-bold">{pair.description}:</span>
                {pair.chars.map(char => (
                  <span
                    key={char}
                    className="me-2 px-2 py-1 rounded"
                    style={{
                      backgroundColor: colorMap[char],
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-2 bg-light rounded">
            <p className="small mb-0">
              <strong>💡 Tip:</strong> Practice reading with color coding ON, then try with it OFF 
              to see if you can remember the differences!
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ColorCoding;