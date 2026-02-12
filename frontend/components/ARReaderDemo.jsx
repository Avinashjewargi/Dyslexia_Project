// frontend/components/ARReaderDemo.jsx
// COMPLETE FIX: Hides navbar, footer, and all interfering elements

import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { CONFUSING_LETTERS } from '../config/languageConfig';
import { getCompleteColorMap } from '../config/colorCodingConfig';

const ARReaderDemo = ({ 
  text = "Reading is fun and easy!", 
  colorCodingEnabled = true,
  colorIntensity = 70,
  onClose 
}) => {
  const { t } = useTranslation();
  const { currentLanguage, languageConfig } = useLanguage();
  const [arMode, setArMode] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setCameraPermission(true);
          console.log('✅ Camera permission granted');
        })
        .catch((err) => {
          setCameraPermission(false);
          console.error('❌ Camera permission denied:', err);
        });
    } else {
      setCameraPermission(false);
      console.error('❌ MediaDevices API not supported');
    }
  }, []);

  useEffect(() => {
    if (arMode) {
      console.log('🎥 AR Mode activated - applying fullscreen styles');
      
      // ✅ CRITICAL: Hide ALL interfering elements
      const elementsToHide = [
        'nav',
        'header', 
        'footer',
        '.navbar',
        '.app-navbar',
        '.footer',
        '.app-footer',
        '.chatbot',
        '.settings',
        '.container',
        '.container-fluid'
      ];

      const hiddenElements = [];
      
      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el && !el.querySelector('a-scene')) { // Don't hide if it contains AR scene
            el.style.display = 'none';
            hiddenElements.push({ element: el, originalDisplay: el.style.display });
          }
        });
      });

      // Lock body
      const originalStyles = {
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyWidth: document.body.style.width,
        bodyHeight: document.body.style.height,
        bodyTop: document.body.style.top,
        bodyLeft: document.body.style.left,
        htmlOverflow: document.documentElement.style.overflow
      };
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.overflow = 'hidden';
      
      // Hide root container background
      const root = document.getElementById('root');
      if (root) {
        root.style.background = 'transparent';
      }
      
      setIsLoading(true);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        
        if (typeof window.AFRAME === 'undefined') {
          setError('A-Frame library failed to load. Please refresh the page.');
          console.error('❌ A-Frame not loaded');
        } else {
          console.log('✅ A-Frame loaded successfully');
          
          // Force canvas to fullscreen after A-Frame initializes
          setTimeout(() => {
            const canvas = document.querySelector('a-scene canvas.a-canvas');
            if (canvas) {
              console.log('✅ Forcing canvas to fullscreen');
              canvas.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 1 !important;
              `;
            }
          }, 500);
        }
      }, 3000);

      return () => {
        console.log('🔄 Cleaning up AR mode');
        clearTimeout(timer);
        
        // Restore hidden elements
        hiddenElements.forEach(({ element, originalDisplay }) => {
          if (element) {
            element.style.display = originalDisplay;
          }
        });
        
        // Restore body styles
        document.body.style.overflow = originalStyles.bodyOverflow;
        document.body.style.position = originalStyles.bodyPosition;
        document.body.style.width = originalStyles.bodyWidth;
        document.body.style.height = originalStyles.bodyHeight;
        document.body.style.top = originalStyles.bodyTop;
        document.body.style.left = originalStyles.bodyLeft;
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.documentElement.style.overflow = originalStyles.htmlOverflow;
        
        // Restore root
        if (root) {
          root.style.background = '';
        }
      };
    }
  }, [arMode]);

  const getColorForLetter = (letter) => {
    const langLetters = CONFUSING_LETTERS[currentLanguage] || {};
    
    if (Object.keys(langLetters).length > 0) {
      const letterConfig = langLetters[letter] || langLetters[letter.toLowerCase()];
      return letterConfig ? letterConfig.color : '#FFFFFF';
    }
    
    const colorMap = getCompleteColorMap();
    return colorMap[letter] || colorMap[letter.toLowerCase()] || '#FFFFFF';
  };

  const syllabify = (word) => {
    const vowels = /[aeiouAEIOU]/;
    let syllables = [];
    let currentSyllable = '';
    
    for (let i = 0; i < word.length; i++) {
      currentSyllable += word[i];
      
      if (vowels.test(word[i]) && i < word.length - 1) {
        if (!vowels.test(word[i + 1])) {
          syllables.push(currentSyllable);
          currentSyllable = '';
        }
      }
    }
    
    if (currentSyllable) {
      syllables.push(currentSyllable);
    }
    
    return syllables.length > 0 ? syllables : [word];
  };

  const processTextForAR = () => {
    const words = text.split(' ').slice(0, 5);
    return words.map(word => ({
      original: word,
      syllables: syllabify(word)
    }));
  };

  const startAR = async () => {
    try {
      setError(null);
      
      if (typeof window.AFRAME === 'undefined') {
        setError('AR libraries are still loading. Please wait a moment and try again.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('✅ Camera stream obtained');
      stream.getTracks().forEach(track => track.stop());
      
      setArMode(true);
    } catch (error) {
      console.error('❌ Camera error:', error);
      
      if (error.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(`Camera error: ${error.message}`);
      }
    }
  };

  const closeAR = () => {
    setArMode(false);
    setError(null);
    if (onClose) {
      onClose();
    }
  };

  if (!arMode) {
    return (
      <Container className="my-5">
        <Card className="p-4 shadow-lg">
          <h2>📱 {t('ar.title', 'AR Reading Assistant')}</h2>
          
          <Alert variant="info" className="mt-3">
            <h5>{t('ar.whatYouNeed', "What you'll need:")}</h5>
            <ol>
              <li>{t('ar.requirement1', 'A device with camera (smartphone, tablet, or webcam)')}</li>
              <li>{t('ar.requirement2', 'Printed HIRO marker (download below)')}</li>
              <li>{t('ar.requirement3', 'A well-lit room')}</li>
            </ol>
          </Alert>

          {error && (
            <Alert variant="danger" className="mt-3">
              <strong>⚠️ Error:</strong> {error}
            </Alert>
          )}

          <div className="mb-3">
            <h5>📥 {t('ar.step1', 'Step 1: Download & Print Marker')}</h5>
            <a 
              href="https://ar-js-org.github.io/AR.js/data/images/hiro.png" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary mb-2"
            >
              {t('ar.downloadMarker', 'Download HIRO Marker')}
            </a>
            <p className="text-muted">
              {t('ar.printInstructions', 'Print this marker on white paper (A4 or Letter size)')}
            </p>
          </div>

          <div className="mb-3">
            <h5>🎯 {t('ar.step2', 'Step 2: How It Works')}</h5>
            <ul>
              <li>{t('ar.howItWorks1', 'Point your camera at the printed marker')}</li>
              <li>{t('ar.howItWorks2', 'AR will display syllable-segmented words in 3D')}</li>
              <li>{t('ar.howItWorks3', 'Color coding shows confusing letters')}</li>
              <li>{t('ar.howItWorks4', 'Sequential highlighting shows reading flow')}</li>
            </ul>
          </div>

          <div className="mb-3">
            <h6 className="text-primary">
              📝 {t('ar.currentText', 'Current Text to Display:')}
            </h6>
            <div className="p-3 bg-light rounded border">
              <strong>{text.split(' ').slice(0, 5).join(' ')}</strong>
              <small className="d-block text-muted mt-1">
                (First 5 words for better AR performance)
              </small>
            </div>
          </div>

          {cameraPermission === false && (
            <Alert variant="warning">
              ⚠️ {t('ar.cameraPermissionDenied', 'Camera access denied. Please enable camera permissions in your browser settings.')}
            </Alert>
          )}

          {typeof window.AFRAME === 'undefined' && (
            <Alert variant="warning">
              ⏳ Loading AR libraries... Please wait.
            </Alert>
          )}

          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              size="lg" 
              onClick={startAR}
              disabled={cameraPermission === false || typeof window.AFRAME === 'undefined'}
            >
              🚀 {t('ar.startAR', 'Start AR Reading Assistant')}
            </Button>

            <Button 
              variant="secondary" 
              size="lg"
              onClick={closeAR}
            >
              ← {t('ar.backToReader', 'Back to Reader')}
            </Button>
          </div>

          <Alert variant="info" className="mt-3 mb-0">
            <small>
              <strong>{t('ar.language', 'Language')}:</strong> {languageConfig?.name || currentLanguage.toUpperCase()}
              <br />
              <strong>{t('ar.colorCoding', 'Color Coding')}:</strong> {colorCodingEnabled ? 'Enabled' : 'Disabled'} ({colorIntensity}%)
              <br />
              <strong>Status:</strong> {typeof window.AFRAME !== 'undefined' ? '✅ AR Ready' : '⏳ Loading...'}
            </small>
          </Alert>
        </Card>
      </Container>
    );
  }

  const processedWords = processTextForAR();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      zIndex: 999999,
      background: 'black'
    }}>
      {/* Global styles */}
      <style>{`
        /* Force fullscreen on everything */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          position: fixed !important;
        }

        /* A-Frame scene fullscreen */
        a-scene {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 999998 !important;
        }
        
        /* A-Frame canvas fullscreen */
        a-scene canvas.a-canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 999998 !important;
        }
        
        /* Hide default A-Frame UI */
        .a-loader-title,
        .a-enter-vr,
        .a-orientation-modal {
          display: none !important;
        }
      `}</style>

      {/* Loading Screen */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          zIndex: 1000000,
          pointerEvents: 'auto'
        }}>
          <Spinner animation="border" variant="light" style={{ width: '4rem', height: '4rem' }} />
          <h4 className="mt-3">Initializing AR Camera...</h4>
          <p>Please allow camera access when prompted</p>
        </div>
      )}

      {/* Error Screen */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(220, 53, 69, 0.95)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          zIndex: 1000001,
          textAlign: 'center'
        }}>
          <h5>⚠️ AR Error</h5>
          <p>{error}</p>
          <button 
            onClick={closeAR}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#dc3545',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close AR Mode
          </button>
        </div>
      )}

      {/* Instructions Overlay */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        maxWidth: '300px',
        fontSize: '13px',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
        zIndex: 1000000
      }}>
        <h6 style={{ margin: '0 0 8px 0', color: '#4CC417', fontSize: '14px' }}>
          📷 AR Reading Mode Active
        </h6>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px' }}>
          <li>Point camera at HIRO marker</li>
          <li>Words appear in 3D above marker</li>
          <li>Yellow = reading flow sequence</li>
          <li>Colors = confusing letter pairs</li>
        </ul>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #555', fontSize: '11px' }}>
          <strong>Language:</strong> {languageConfig?.name || currentLanguage}
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={closeAR}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 28px',
          fontSize: '15px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          fontWeight: 'bold',
          zIndex: 1000000,
          pointerEvents: 'auto'
        }}
      >
        ❌ Exit AR Mode
      </button>

      {/* AR Beta Badge */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        zIndex: 1000000
      }}>
        ✨ AR BETA
      </div>

      {/* A-Frame Scene */}
      <a-scene
        ref={sceneRef}
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium; alpha: true; antialias: true;"
        loading-screen="enabled: false"
      >
        <a-assets timeout="30000"></a-assets>

        <a-marker preset="hiro" id="hiro-marker">
          {processedWords.map((wordData, wordIndex) => {
            const yPosition = 1.0 - (wordIndex * 0.4);
            const syllableCount = wordData.syllables.length;
            const totalWidth = syllableCount * 0.5;
            
            return (
              <a-entity key={wordIndex} position={`0 ${yPosition} 0`}>
                {wordData.syllables.map((syllable, syllableIndex) => {
                  const xPosition = -totalWidth / 2 + (syllableIndex * 0.5) + 0.25;
                  const color = colorCodingEnabled ? getColorForLetter(syllable[0]) : '#4CC417';
                  
                  return (
                    <a-entity key={syllableIndex} position={`${xPosition} 0 0`}>
                      <a-text
                        value={syllable}
                        color={color}
                        align="center"
                        width="2"
                        scale="0.8 0.8 0.8"
                      />
                      
                      {colorCodingEnabled && (
                        <a-box
                          position="0 0 -0.05"
                          width="0.4"
                          height="0.25"
                          depth="0.02"
                          color="#FFEB3B"
                          opacity="0.2"
                          material="transparent: true"
                          animation={`property: opacity; from: 0.4; to: 0.1; dur: 1200; dir: alternate; loop: true; delay: ${syllableIndex * 400}`}
                        />
                      )}
                      
                      {syllableIndex < wordData.syllables.length - 1 && (
                        <a-text
                          value="-"
                          color="#CCCCCC"
                          position="0.2 0 0"
                          align="center"
                          width="1"
                          scale="0.5 0.5 0.5"
                        />
                      )}
                    </a-entity>
                  );
                })}
              </a-entity>
            );
          })}

          <a-entity position="0 -0.8 0">
            <a-plane
              position="0 0 -0.01"
              width="1.2"
              height="0.3"
              color="#000000"
              opacity="0.7"
              material="transparent: true"
            />
            <a-text
              value="Point at HIRO marker"
              color="#FFFFFF"
              align="center"
              width="2"
              position="0 0.05 0"
              scale="0.4 0.4 0.4"
            />
            <a-text
              value="Color = Confusing letters"
              color="#AAAAAA"
              align="center"
              width="2"
              position="0 -0.05 0"
              scale="0.3 0.3 0.3"
            />
          </a-entity>
        </a-marker>

        <a-entity camera look-controls="enabled: false"></a-entity>
      </a-scene>
    </div>
  );
};

export default ARReaderDemo;