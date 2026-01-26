// frontend/reader/ColorCoding.jsx
import React, { useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { getCompleteColorMap } from '../config/colorCodingConfig';

const ColorCoding = ({ text, enabled = false }) => {
  const [colorIntensity, setColorIntensity] = useState(100); // 0-100%

  if (!enabled || !text) {
    return <span>{text}</span>;
  }

  const colorMap = getCompleteColorMap();

  // Apply color with brightness adjustment
  const applyColorWithIntensity = (baseColor, intensity) => {
    // Convert intensity (0-100) to opacity and brightness
    const opacity = intensity / 100;
    const brightness = 0.7 + (intensity / 100) * 0.6; // Range: 0.7 to 1.3

    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Apply brightness
    const newR = Math.min(255, Math.floor(r * brightness));
    const newG = Math.min(255, Math.floor(g * brightness));
    const newB = Math.min(255, Math.floor(b * brightness));

    return {
      color: `rgb(${newR}, ${newG}, ${newB})`,
      opacity: opacity,
      fontWeight: intensity > 70 ? 'bold' : 'normal'
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
    <div>
      {/* Color Intensity Control */}
      <Card className="mb-3 shadow-sm">
        <Card.Body className="py-2">
          <Form.Group className="mb-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label className="mb-0 small">
                <strong>Color Brightness/Contrast</strong>
              </Form.Label>
              <span className="badge bg-primary">{colorIntensity}%</span>
            </div>
            
            <Form.Range
              min="20"
              max="100"
              step="10"
              value={colorIntensity}
              onChange={(e) => setColorIntensity(parseInt(e.target.value))}
              className="mb-2"
            />
            
            <div className="d-flex justify-content-between small text-muted">
              <span>🌙 Subtle (Advanced)</span>
              <span>⚡ Bold (Beginner)</span>
            </div>
            
            <Form.Text className="text-muted d-block mt-2">
              {colorIntensity <= 40 && '💡 Low contrast - for students who know the letters well'}
              {colorIntensity > 40 && colorIntensity <= 70 && '📚 Medium - good for practice'}
              {colorIntensity > 70 && '🎯 High contrast - clear and bold for learning'}
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Colored Text Display */}
      <div className="colored-text" style={{ lineHeight: '1.8' }}>
        {renderColoredText()}
      </div>
    </div>
  );
};

export default ColorCoding;