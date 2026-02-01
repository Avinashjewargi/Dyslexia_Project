// frontend/components/Settings.jsx (ADVANCED VERSION WITH TRANSLATIONS)

import React, { useState } from 'react';
import { Modal, Form, Button, Card, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import { 
  Type, Sun, Moon, Eye, Contrast, Move, Palette, 
  RotateCcw, ZoomIn, ZoomOut, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Circle, Globe
} from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

// Custom Range Slider Component with Beautiful UI
const BeautifulSlider = ({ 
  label, 
  icon: Icon, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  unit = '', 
  color = '#667eea',
  showValue = true,
  valueFormatter = (v) => v
}) => {
  // Ensure value is a number and fallback to min if undefined
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : min;
  const percentage = ((safeValue - min) / (max - min)) * 100;
  
  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="d-flex align-items-center fw-semibold">
          {Icon && <Icon size={18} className="me-2" style={{ color }} />}
          {label}
        </label>
        {showValue && (
          <Badge bg="light" text="dark" className="fs-6">
            {valueFormatter(safeValue)}{unit}
          </Badge>
        )}
      </div>
      
      <div className="position-relative">
        <input
          type="range"
          className="beautiful-range"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`
          }}
        />
        
        {/* Tick marks */}
        <div className="d-flex justify-content-between px-2 mt-1">
          <small className="text-muted">{min}{unit}</small>
          <small className="text-muted">{max}{unit}</small>
        </div>
      </div>
    </div>
  );
};

// Font Family Selector
const FontSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const fonts = [
    { name: 'OpenDyslexic', label: t('settings.fonts.openDyslexic', 'OpenDyslexic'), recommended: true },
    { name: 'Arial', label: 'Arial' },
    { name: 'Comic Sans MS', label: 'Comic Sans MS' },
    { name: 'Verdana', label: 'Verdana' },
    { name: 'Georgia', label: 'Georgia' },
    { name: 'Times New Roman', label: 'Times New Roman' },
  ];

  return (
    <div className="mb-4">
      <label className="d-flex align-items-center fw-semibold mb-2">
        <Type size={18} className="me-2" style={{ color: '#667eea' }} />
        {t('settings.fontFamily', 'Font Family')}
      </label>
      <div className="d-grid gap-2">
        {fonts.map((font) => (
          <Button
            key={font.name}
            variant={value === font.name ? 'primary' : 'outline-secondary'}
            onClick={() => onChange(font.name)}
            className="text-start d-flex align-items-center justify-content-between"
            style={{ fontFamily: font.name }}
          >
            <span>{font.label}</span>
            {font.recommended && (
              <Badge bg="success">{t('settings.recommended', 'Recommended')}</Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

// Text Alignment Selector
const AlignmentSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const alignments = [
    { value: 'left', icon: AlignLeft, label: t('settings.alignment.left', 'Left') },
    { value: 'center', icon: AlignCenter, label: t('settings.alignment.center', 'Center') },
    { value: 'right', icon: AlignRight, label: t('settings.alignment.right', 'Right') },
    { value: 'justify', icon: AlignJustify, label: t('settings.alignment.justify', 'Justify') },
  ];

  return (
    <div className="mb-4">
      <label className="d-flex align-items-center fw-semibold mb-2">
        <AlignLeft size={18} className="me-2" style={{ color: '#667eea' }} />
        {t('settings.textAlignment', 'Text Alignment')}
      </label>
      <div className="btn-group w-100" role="group">
        {alignments.map(({ value: val, icon: Icon, label }) => (
          <Button
            key={val}
            variant={value === val ? 'primary' : 'outline-secondary'}
            onClick={() => onChange(val)}
            className="d-flex flex-column align-items-center py-2"
          >
            <Icon size={20} />
            <small className="mt-1">{label}</small>
          </Button>
        ))}
      </div>
    </div>
  );
};

// Color Theme Selector
const ThemeSelector = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  const themes = [
    { value: 'default', label: t('settings.themes.default', 'Default'), bg: '#ffffff', text: '#000000' },
    { value: 'dark', label: t('settings.themes.dark', 'Dark Mode'), bg: '#1a1a1a', text: '#ffffff' },
    { value: 'sepia', label: t('settings.themes.sepia', 'Sepia'), bg: '#f4ecd8', text: '#5c4a2f' },
    { value: 'blue', label: t('settings.themes.blue', 'Blue Tint'), bg: '#e8f4f8', text: '#1a3a4a' },
    { value: 'green', label: t('settings.themes.green', 'Green Tint'), bg: '#e8f8e8', text: '#1a4a1a' },
  ];

  return (
    <div className="mb-4">
      <label className="d-flex align-items-center fw-semibold mb-2">
        <Palette size={18} className="me-2" style={{ color: '#667eea' }} />
        {t('settings.colorTheme', 'Color Theme')}
      </label>
      <Row className="g-2">
        {themes.map((theme) => (
          <Col xs={6} key={theme.value}>
            <Button
              variant={value === theme.value ? 'primary' : 'outline-secondary'}
              onClick={() => onChange(theme.value)}
              className="w-100 p-3 d-flex flex-column align-items-center"
            >
              <div
                className="rounded mb-2"
                style={{
                  width: '50px',
                  height: '30px',
                  backgroundColor: theme.bg,
                  border: `2px solid ${theme.text}`,
                }}
              />
              <small>{theme.label}</small>
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Main Settings Modal
const Settings = ({ show, handleClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { t } = useTranslation();
  const { currentLanguage, languageConfig } = useLanguage();
  const [activeTab, setActiveTab] = useState('typography');

  const handleReset = () => {
    if (window.confirm(t('settings.confirmReset', 'Are you sure you want to reset all settings to default?'))) {
      resetSettings();
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg"
      className="accessibility-modal"
      scrollable
      backdrop="static"
      dialogClassName="modal-top"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <Eye size={24} className="me-2" />
          {t('settings.title', 'Accessibility Settings')}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          fill
        >
          {/* Typography Tab */}
          <Tab 
            eventKey="typography" 
            title={
              <span>
                <Type size={16} className="me-2" />
                {t('settings.tabs.typography', 'Typography')}
              </span>
            }
          >
            <div className="pt-3">
              <FontSelector
                value={settings.fontFamily}
                onChange={(val) => updateSetting('fontFamily', val)}
              />

              <BeautifulSlider
                label={t('settings.fontSize', 'Font Size')}
                icon={Type}
                value={settings.fontSize}
                min={14}
                max={32}
                step={1}
                onChange={(val) => updateSetting('fontSize', val)}
                unit="px"
                color="#667eea"
              />

              <BeautifulSlider
                label={t('settings.letterSpacing', 'Letter Spacing')}
                icon={Move}
                value={settings.letterSpacing}
                min={0}
                max={0.5}
                step={0.05}
                onChange={(val) => updateSetting('letterSpacing', val)}
                unit="em"
                color="#764ba2"
                valueFormatter={(v) => v.toFixed(2)}
              />

              <BeautifulSlider
                label={t('settings.wordSpacing', 'Word Spacing')}
                icon={Move}
                value={settings.wordSpacing}
                min={0}
                max={1}
                step={0.1}
                onChange={(val) => updateSetting('wordSpacing', val)}
                unit="em"
                color="#f093fb"
                valueFormatter={(v) => v.toFixed(1)}
              />

              <BeautifulSlider
                label={t('settings.lineHeight', 'Line Height')}
                icon={AlignLeft}
                value={settings.lineHeight}
                min={1}
                max={3}
                step={0.1}
                onChange={(val) => updateSetting('lineHeight', val)}
                color="#4facfe"
                valueFormatter={(v) => v.toFixed(1)}
              />

              <AlignmentSelector
                value={settings.textAlign}
                onChange={(val) => updateSetting('textAlign', val)}
              />
            </div>
          </Tab>

          {/* Display Tab */}
          <Tab 
            eventKey="display" 
            title={
              <span>
                <Sun size={16} className="me-2" />
                {t('settings.tabs.display', 'Display')}
              </span>
            }
          >
            <div className="pt-3">
              <BeautifulSlider
                label={t('settings.brightness', 'Screen Brightness')}
                icon={Sun}
                value={settings.brightness}
                min={50}
                max={150}
                step={5}
                onChange={(val) => updateSetting('brightness', val)}
                unit="%"
                color="#f6d365"
              />

              <BeautifulSlider
                label={t('settings.cursorSize', 'Cursor Size')}
                icon={Circle}
                value={settings.cursorSize}
                min={1}
                max={3}
                step={0.5}
                onChange={(val) => updateSetting('cursorSize', val)}
                unit="x"
                color="#fa709a"
                valueFormatter={(v) => v.toFixed(1)}
              />

              <div className="mb-4">
                <Form.Check
                  type="switch"
                  id="highContrast"
                  label={
                    <span className="d-flex align-items-center">
                      <Contrast size={18} className="me-2" style={{ color: '#667eea' }} />
                      <strong>{t('settings.highContrast', 'High Contrast Mode')}</strong>
                    </span>
                  }
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="fs-5"
                />
                <small className="text-muted ms-4 ps-2">
                  {t('settings.highContrastDesc', 'Increases contrast for better visibility')}
                </small>
              </div>

              <div className="mb-4">
                <Form.Check
                  type="switch"
                  id="readingGuide"
                  label={
                    <span className="d-flex align-items-center">
                      <AlignLeft size={18} className="me-2" style={{ color: '#667eea' }} />
                      <strong>{t('settings.readingGuide', 'Reading Guide Line')}</strong>
                    </span>
                  }
                  checked={settings.readingGuide}
                  onChange={(e) => updateSetting('readingGuide', e.target.checked)}
                  className="fs-5"
                />
                <small className="text-muted ms-4 ps-2">
                  {t('settings.readingGuideDesc', 'Shows a line to help track reading position')}
                </small>
              </div>

              <ThemeSelector
                value={settings.colorTheme}
                onChange={(val) => updateSetting('colorTheme', val)}
              />
            </div>
          </Tab>

          {/* Language & Preview Tab */}
          <Tab 
            eventKey="preview" 
            title={
              <span>
                <Eye size={16} className="me-2" />
                {t('settings.tabs.preview', 'Preview')}
              </span>
            }
          >
            <div className="pt-3">
              {/* Current Language Display */}
              <Card className="border-info mb-3">
                <Card.Body>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Globe size={20} className="me-2 text-primary" />
                      <div>
                        <strong>{t('settings.currentLanguage', 'Current Language')}:</strong>
                        <div className="text-muted small">
                          {languageConfig.nativeName} ({languageConfig.name})
                        </div>
                      </div>
                    </div>
                    <Badge bg="primary" className="fs-6">
                      {currentLanguage.toUpperCase()}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Preview Text */}
              <Card className="border-primary">
                <Card.Body>
                  <h5 className="mb-3">{t('settings.previewText', 'Preview Text')}</h5>
                  <div
                    style={{
                      fontFamily: settings.fontFamily,
                      fontSize: `${settings.fontSize}px`,
                      letterSpacing: `${settings.letterSpacing}em`,
                      wordSpacing: `${settings.wordSpacing}em`,
                      lineHeight: settings.lineHeight,
                      textAlign: settings.textAlign,
                      padding: '20px',
                      backgroundColor: settings.highContrast ? '#000' : '#fff',
                      color: settings.highContrast ? '#fff' : '#000',
                    }}
                  >
                    <p>
                      {t('settings.previewSentence1', 'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.')}
                    </p>
                    <p>
                      {t('settings.previewSentence2', 'Reading should be comfortable and easy. These settings help you customize the text to your preferences.')}
                    </p>
                    <p className="mb-0">
                      {t('settings.previewSentence3', 'Adjust the settings until the text feels just right for you!')}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Current Settings Summary */}
              <div className="mt-3 p-3 bg-light rounded">
                <h6 className="text-muted">{t('settings.currentSettings', 'Current Settings')}:</h6>
                <Row>
                  <Col xs={6}>
                    <small><strong>{t('settings.font', 'Font')}:</strong> {settings.fontFamily}</small>
                  </Col>
                  <Col xs={6}>
                    <small><strong>{t('settings.size', 'Size')}:</strong> {settings.fontSize}px</small>
                  </Col>
                  <Col xs={6}>
                    <small><strong>{t('settings.brightness', 'Brightness')}:</strong> {settings.brightness}%</small>
                  </Col>
                  <Col xs={6}>
                    <small><strong>{t('settings.theme', 'Theme')}:</strong> {settings.colorTheme}</small>
                  </Col>
                  <Col xs={12} className="mt-2">
                    <small><strong>{t('settings.language', 'Language')}:</strong> {languageConfig.nativeName}</small>
                  </Col>
                </Row>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        <Button 
          variant="outline-danger" 
          onClick={handleReset}
          className="me-auto"
        >
          <RotateCcw size={16} className="me-2" />
          {t('settings.resetDefault', 'Reset to Default')}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          {t('settings.close', 'Close')}
        </Button>
        <Button variant="primary" onClick={handleClose}>
          {t('settings.saveChanges', 'Save Changes')}
        </Button>
      </Modal.Footer>

      {/* Custom CSS for beautiful sliders */}
      <style>{`
        .modal-top {
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .modal-top .modal-content {
          max-height: calc(100vh - 4rem);
          overflow: hidden;
        }

        .accessibility-modal .modal-dialog {
          pointer-events: auto;
        }

        .accessibility-modal .modal-content {
          pointer-events: auto;
        }

        .beautiful-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .beautiful-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        .beautiful-range::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }

        .beautiful-range::-webkit-slider-thumb:active {
          transform: scale(1.1);
        }

        .beautiful-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        .beautiful-range::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }

        .accessibility-modal .modal-content {
          border-radius: 15px;
          overflow: hidden;
          pointer-events: auto;
        }

        .accessibility-modal .modal-body {
          pointer-events: auto;
          user-select: auto;
        }

        .accessibility-modal .nav-tabs {
          border-bottom: 2px solid #e0e0e0;
        }

        .accessibility-modal .nav-tabs .nav-link {
          color: #666;
          font-weight: 500;
          padding: 12px 20px;
          border: none;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .accessibility-modal .nav-tabs .nav-link:hover {
          border-bottom-color: #667eea;
          color: #667eea;
        }

        .accessibility-modal .nav-tabs .nav-link.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: none;
        }

        /* Theme styles */
        .theme-dark {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }

        .theme-sepia {
          background-color: #f4ecd8 !important;
          color: #5c4a2f !important;
        }

        .theme-blue {
          background-color: #e8f4f8 !important;
          color: #1a3a4a !important;
        }

        .theme-green {
          background-color: #e8f8e8 !important;
          color: #1a4a1a !important;
        }
      `}</style>
    </Modal>
  );
};

export default Settings;
