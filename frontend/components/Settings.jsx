// frontend/components/Settings.jsx
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAccessibility } from './AccessibilityContext';

const Settings = ({ show, handleClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  const handleFontSizeChange = (e) => {
    updateSetting('fontSize', parseInt(e.target.value));
  };

  const handleFontFamilyChange = (e) => {
    updateSetting('fontFamily', e.target.value);
  };

  const handleLetterSpacingChange = (e) => {
    updateSetting('letterSpacing', parseFloat(e.target.value));
  };

  const handleLineHeightChange = (e) => {
    updateSetting('lineHeight', parseFloat(e.target.value));
  };

  const handleHighContrastToggle = (e) => {
    updateSetting('highContrast', e.target.checked);
  };

  const handleReset = () => {
    resetSettings();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Accessibility Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Font Size */}
        <Form.Group className="mb-3">
          <Form.Label>Font Size: {settings.fontSize}px</Form.Label>
          <Form.Range
            min="14"
            max="32"
            step="2"
            value={settings.fontSize}
            onChange={handleFontSizeChange}
          />
        </Form.Group>

        {/* Font Family */}
        <Form.Group className="mb-3">
          <Form.Label>Font Family</Form.Label>
          <Form.Select 
            value={settings.fontFamily} 
            onChange={handleFontFamilyChange}
          >
            <option value="OpenDyslexic">OpenDyslexic (Recommended)</option>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="'Comic Sans MS'">Comic Sans MS</option>
            <option value="'Courier New'">Courier New</option>
          </Form.Select>
        </Form.Group>

        {/* Letter Spacing */}
        <Form.Group className="mb-3">
          <Form.Label>Letter Spacing: {settings.letterSpacing}em</Form.Label>
          <Form.Range
            min="0"
            max="0.5"
            step="0.05"
            value={settings.letterSpacing}
            onChange={handleLetterSpacingChange}
          />
        </Form.Group>

        {/* Line Height */}
        <Form.Group className="mb-3">
          <Form.Label>Line Height: {settings.lineHeight}</Form.Label>
          <Form.Range
            min="1.2"
            max="2.5"
            step="0.1"
            value={settings.lineHeight}
            onChange={handleLineHeightChange}
          />
        </Form.Group>

        {/* High Contrast */}
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="high-contrast-switch"
            label="High Contrast Mode"
            checked={settings.highContrast}
            onChange={handleHighContrastToggle}
          />
        </Form.Group>

        {/* Preview Text */}
        <div 
          className="p-3 border rounded mt-4"
          style={{
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily,
            letterSpacing: `${settings.letterSpacing}em`,
            lineHeight: settings.lineHeight,
            backgroundColor: settings.highContrast ? '#121212' : '#ffffff',
            color: settings.highContrast ? '#ffffff' : '#000000',
            transition: 'all 0.3s ease'
          }}
        >
          <strong>Preview:</strong> The quick brown fox jumps over the lazy dog. 
          This text shows how your settings will look.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save & Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Settings;