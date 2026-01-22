// frontend/reader/ColorCodingEnhanced.jsx

import React, { useState } from 'react';
import { Card, Form, Badge, Button, Modal, Row, Col } from 'react-bootstrap';
import { Palette, Info, BookOpen } from 'lucide-react';
import { 
  getCompleteColorMap, 
  getMnemonic,
  COLOR_CODING_CONFIG 
} from '../config/colorCodingConfig';

/**
 * Enhanced ColorCoding Component with Interactive Learning Features
 */
const ColorCodingEnhanced = ({ 
  text, 
  enabled = true,
  colorScheme = 'default',
  readerSettings = {},
  showTooltips = true
}) => {
  const [hoveredChar, setHoveredChar] = useState(null);
  const colorMap = getCompleteColorMap(colorScheme);
  
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
   * Render text with color coding and interactive tooltips
   */
  const renderColorCodedText = () => {
    const chars = text.split('');
    
    return chars.map((char, index) => {
      const lowerChar = char.toLowerCase();
      const color = colorMap[lowerChar];
      const mnemonic = getMnemonic(lowerChar);
      
      if (color) {
        return (
          <span
            key={index}
            style={{
              color: color,
              fontWeight: 'bold',
              fontSize: hoveredChar === index ? '1.2em' : '1em',
              textShadow: '0 0 2px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              cursor: showTooltips ? 'help' : 'default',
              padding: '0 1px',
              borderRadius: '2px',
              backgroundColor: hoveredChar === index ? 'rgba(255,255,255,0.2)' : 'transparent',
            }}
            onMouseEnter={() => showTooltips && setHoveredChar(index)}
            onMouseLeave={() => setHoveredChar(null)}
            title={showTooltips && mnemonic ? `${char}: ${mnemonic}` : undefined}
          >
            {char}
          </span>
        );
      }
      
      return <span key={index}>{char}</span>;
    });
  };

  const textStyle = {
    fontFamily: readerSettings.fontFamily || 'OpenDyslexic, sans-serif',
    fontSize: `${readerSettings.fontSize || 18}px`,
    lineHeight: readerSettings.lineHeight || 1.8,
    letterSpacing: `${readerSettings.letterSpacing || 0.05}em`,
    wordSpacing: '0.3em',
    backgroundColor: readerSettings.highContrast ? '#333' : '#fff',
    color: readerSettings.highContrast && !enabled ? '#fff' : 'inherit',
    transition: 'all 0.3s ease',
    padding: '1rem',
    borderRadius: '0.5rem',
  };

  return (
    <div style={textStyle} className="color-coded-text">
      {renderColorCodedText()}
    </div>
  );
};

/**
 * Enhanced Settings Component with Multiple Features
 */
export const ColorCodingSettingsEnhanced = ({ 
  enabled, 
  onToggle, 
  colorScheme = 'default',
  onColorSchemeChange,
  showTooltips = true,
  onTooltipsToggle,
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const colorMap = getCompleteColorMap(colorScheme);

  const confusedPairs = [
    { chars: ['b', 'd'], label: 'b vs d', category: 'letters' },
    { chars: ['p', 'q'], label: 'p vs q', category: 'letters' },
    { chars: ['6', '9'], label: '6 vs 9', category: 'numbers' },
    { chars: ['n', 'u'], label: 'n vs u', category: 'letters' },
    { chars: ['m', 'w'], label: 'm vs w', category: 'letters' },
  ];

  return (
    <>
      <Card className="shadow-sm p-3 mb-3 border-info">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="text-info mb-0">
            <Palette size={20} className="me-2" />
            Color Coding Assistant
          </h5>
          <Button 
            variant="outline-info" 
            size="sm"
            onClick={() => setShowGuide(true)}
          >
            <Info size={16} className="me-1" />
            Help
          </Button>
        </div>
        
        <Form.Check 
          type="switch"
          id="color-coding-toggle"
          label="Enable Color Coding"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mb-3"
        />
        
        {enabled && (
          <>
            {/* Color Scheme Selector */}
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Color Scheme:</Form.Label>
              <Form.Select 
                size="sm"
                value={colorScheme}
                onChange={(e) => onColorSchemeChange && onColorSchemeChange(e.target.value)}
              >
                {Object.entries(COLOR_CODING_CONFIG.colorSchemes).map(([key, scheme]) => (
                  <option key={key} value={key}>
                    {scheme.name} - {scheme.description}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Tooltips Toggle */}
            <Form.Check 
              type="switch"
              id="tooltips-toggle"
              label="Show helpful hints when hovering"
              checked={showTooltips}
              onChange={(e) => onTooltipsToggle && onTooltipsToggle(e.target.checked)}
              className="mb-3 small"
            />
            
            {/* Color Guide */}
            <div className="mt-3">
              <h6 className="small fw-bold mb-2">Color Guide:</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {confusedPairs.map((pair, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-1">
                    {pair.chars.map((char) => {
                      const mnemonic = getMnemonic(char);
                      return (
                        <Badge
                          key={char}
                          bg="light"
                          text="dark"
                          className="p-2"
                          style={{ 
                            border: `2px solid ${colorMap[char]}`,
                            fontSize: '1rem',
                          }}
                          title={mnemonic}
                        >
                          <span style={{ 
                            color: colorMap[char], 
                            fontWeight: 'bold',
                            fontSize: '1.3rem',
                          }}>
                            {char}
                          </span>
                        </Badge>
                      );
                    })}
                    {idx < confusedPairs.length - 1 && (
                      <span className="text-muted mx-1">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Practice Button */}
            <Button
              variant="outline-success"
              size="sm"
              className="w-100 mt-2"
              onClick={() => setShowPractice(true)}
            >
              <BookOpen size={16} className="me-2" />
              Practice with Examples
            </Button>

            {/* Info Box */}
            <div className="mt-3 p-2 bg-light rounded">
              <p className="small mb-0">
                <strong>💡 How it helps:</strong> Each confusing letter gets its own color. 
                Your brain learns to associate the color with the shape, making it easier 
                to remember which is which!
              </p>
            </div>
          </>
        )}
      </Card>

      {/* Help Guide Modal */}
      <Modal show={showGuide} onHide={() => setShowGuide(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Color Coding Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>What is Color Coding?</h5>
          <p>
            Color coding helps you remember the difference between similar-looking letters 
            and numbers by giving each one a unique color. This makes reading easier and 
            more fun!
          </p>

          <h5 className="mt-4">Letter Pairs Explained:</h5>
          <Row>
            <Col md={6}>
              <Card className="mb-3 border-primary">
                <Card.Body>
                  <h6>
                    <span style={{ color: colorMap['b'], fontWeight: 'bold', fontSize: '1.5rem' }}>b</span>
                    {' vs '}
                    <span style={{ color: colorMap['d'], fontWeight: 'bold', fontSize: '1.5rem' }}>d</span>
                  </h6>
                  <p className="small mb-0">
                    <strong>b (blue):</strong> {getMnemonic('b')}<br />
                    <strong>d (red):</strong> {getMnemonic('d')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3 border-success">
                <Card.Body>
                  <h6>
                    <span style={{ color: colorMap['p'], fontWeight: 'bold', fontSize: '1.5rem' }}>p</span>
                    {' vs '}
                    <span style={{ color: colorMap['q'], fontWeight: 'bold', fontSize: '1.5rem' }}>q</span>
                  </h6>
                  <p className="small mb-0">
                    <strong>p (green):</strong> {getMnemonic('p')}<br />
                    <strong>q (orange):</strong> {getMnemonic('q')}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h5 className="mt-4">Teaching Tips:</h5>
          <ul>
            {COLOR_CODING_CONFIG.teachingTips.map((tip, idx) => (
              <li key={idx} className="mb-2">{tip}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowGuide(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Practice Modal */}
      <Modal show={showPractice} onHide={() => setShowPractice(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Practice with Examples</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Try reading these example sentences:</h5>
          
          <Card className="mb-3 p-3">
            <ColorCodingEnhanced
              text="The big dog ran to the bed."
              enabled={true}
              colorScheme={colorScheme}
              readerSettings={{ fontSize: 20 }}
              showTooltips={true}
            />
          </Card>

          <Card className="mb-3 p-3">
            <ColorCodingEnhanced
              text="Please be quiet and don't make noise."
              enabled={true}
              colorScheme={colorScheme}
              readerSettings={{ fontSize: 20 }}
              showTooltips={true}
            />
          </Card>

          <Card className="mb-3 p-3">
            <ColorCodingEnhanced
              text="I have 6 pencils and 9 books on my desk."
              enabled={true}
              colorScheme={colorScheme}
              readerSettings={{ fontSize: 20 }}
              showTooltips={true}
            />
          </Card>

          <div className="alert alert-info mt-3">
            <strong>Activity:</strong> Try to find all the colored letters in each sentence. 
            Hover over them to see helpful hints!
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPractice(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ColorCodingEnhanced;