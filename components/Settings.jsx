// frontend/components/Settings.jsx

import React from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
// Import the custom hook
import { useAccessibility } from './AccessibilityContext'; 

function Settings() {
  // 1. Get the current settings and the update function from the global context
  const { settings, updateSetting } = useAccessibility();

  // 2. Handler to update any setting field using the global function
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Ensure values for range inputs are numbers
    let newValue = type === 'checkbox' ? checked : value;
    if (type === 'range') {
        // Convert range values (which are strings) to numbers
        newValue = parseFloat(value); 
    }

    // Call the global update function
    updateSetting(name, newValue);
  };

  const availableFonts = [
    { name: 'Default Sans-Serif', value: 'default' },
    { name: 'OpenDyslexic (Recommended)', value: 'OpenDyslexic, sans-serif' },
    { name: 'Arial (Clear)', value: 'Arial, sans-serif' },
  ];

  return (
    <Card className="p-4 shadow-sm">
      <Card.Title as="h2" className="mb-4">Accessibility Settings</Card.Title>
      <Form>

        {/* Font Selection */}
        <Form.Group as={Row} className="mb-3" controlId="formFont">
          <Form.Label column sm="4" style={{ fontWeight: 'bold' }}>Dyslexia-Friendly Font</Form.Label>
          <Col sm="8">
            <Form.Select 
              name="font" 
              // Read current value from global state
              value={settings.font} 
              // Use global handler
              onChange={handleSettingChange}
            >
              {availableFonts.map(f => (
                <option key={f.value} value={f.value}>{f.name}</option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Font Size Adjustment */}
        <Form.Group as={Row} className="mb-3" controlId="formFontSize">
          <Form.Label column sm="4" style={{ fontWeight: 'bold' }}>Text Size ({settings.fontSize}px)</Form.Label>
          <Col sm="8">
            <Form.Range
              name="fontSize"
              min="14"
              max="24"
              step="2"
              // Read current value from global state
              value={settings.fontSize}
              // Use global handler
              onChange={handleSettingChange}
            />
          </Col>
        </Form.Group>

        {/* High Contrast Mode */}
        <Form.Group as={Row} className="mb-3" controlId="formHighContrast">
          <Col sm="4">
            <Form.Check 
              type="switch"
              id="highContrastSwitch"
              label={<span style={{ fontWeight: 'bold' }}>High Contrast Mode</span>}
              name="highContrast"
              // Read current value from global state
              checked={settings.highContrast}
              // Use global handler
              onChange={handleSettingChange}
            />
          </Col>
        </Form.Group>

        {/* Line Spacing (Crucial for Dyslexia) */}
        <Form.Group as={Row} className="mb-3" controlId="formLineSpacing">
          <Form.Label column sm="4" style={{ fontWeight: 'bold' }}>Line Spacing ({settings.lineSpacing}x)</Form.Label>
          <Col sm="8">
            <Form.Range
              name="lineSpacing"
              min="1.0"
              max="2.5"
              step="0.5"
              // Read current value from global state
              value={settings.lineSpacing}
              // Use global handler
              onChange={handleSettingChange}
            />
          </Col>
        </Form.Group>

        {/* The save button is now mostly redundant since state updates live, but kept for UX */}
        <Button variant="success" className="mt-4 w-100" onClick={() => alert("Settings saved to browser storage!")}>
            Save Settings
        </Button>
      </Form>
    </Card>
  );
}

export default Settings;