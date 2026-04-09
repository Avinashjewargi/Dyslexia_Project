// frontend/components/ARReaderDemo.jsx
// Marker-based AR (HIRO) with A-Frame + AR.js — scene portaled to <body> for stable WebGL/camera.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Container, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { CONFUSING_LETTERS } from '../config/languageConfig';
import { getCompleteColorMap } from '../config/colorCodingConfig';

function isAframeArReady() {
  return typeof window !== 'undefined' && typeof window.AFRAME !== 'undefined';
}

const ARReaderDemo = ({
  text = 'Reading is fun and easy!',
  colorCodingEnabled = true,
  colorIntensity: _colorIntensity = 70,
  onClose,
}) => {
  const { t } = useTranslation();
  const { currentLanguage, languageConfig } = useLanguage();
  const [arMode, setArMode] = useState(false);
  const [cameraOk, setCameraOk] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arScriptsReady, setArScriptsReady] = useState(() => isAframeArReady());
  const sceneRef = useRef(null);
  const loadFallbackTimerRef = useRef(null);
  const sceneListenerRef = useRef(null);

  useEffect(() => {
    if (arScriptsReady) return undefined;
    const id = setInterval(() => {
      if (isAframeArReady()) setArScriptsReady(true);
    }, 200);
    return () => clearInterval(id);
  }, [arScriptsReady]);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraOk(false);
      return;
    }
    setCameraOk(null);
  }, []);

  const lockChromeUi = useCallback(() => {
    const selectors = [
      'nav',
      'header',
      'footer',
      '.navbar',
      '.app-navbar',
      '.footer',
      '.app-footer',
      '[class*="chatbot"]',
      '[class*="Chatbot"]',
      '.chatbot-widget',
    ];
    const hidden = [];
    selectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (!el || el.tagName === 'A-SCENE' || el.closest('a-scene')) return;
          hidden.push({ el, display: el.style.display });
          el.style.display = 'none';
        });
      } catch (_) {
        /* ignore invalid selectors */
      }
    });

    const root = document.getElementById('root');
    const prevRootBg = root ? root.style.background : '';
    if (root) root.style.background = 'transparent';

    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
      htmlOverflow: document.documentElement.style.overflow,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      hidden.forEach(({ el, display }) => {
        el.style.display = display;
      });
      if (root) root.style.background = prevRootBg;
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.position = prev.bodyPosition;
      document.body.style.top = prev.bodyTop;
      document.body.style.width = prev.bodyWidth;
      document.documentElement.style.overflow = prev.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    if (!arMode) return undefined;
    return lockChromeUi();
  }, [arMode, lockChromeUi]);

  useEffect(() => {
    if (!arMode) {
      if (loadFallbackTimerRef.current) {
        clearTimeout(loadFallbackTimerRef.current);
        loadFallbackTimerRef.current = null;
      }
      return undefined;
    }

    setIsLoading(true);
    setError(null);

    const attachSceneListeners = () => {
      const scene =
        sceneRef.current ||
        document.querySelector('a-scene.ar-reader-scene');
      if (!scene) return;

      const onLoaded = () => {
        if (loadFallbackTimerRef.current) {
          clearTimeout(loadFallbackTimerRef.current);
          loadFallbackTimerRef.current = null;
        }
        setIsLoading(false);
      };

      sceneListenerRef.current = { scene, onLoaded };

      if (scene.hasLoaded) {
        onLoaded();
      } else {
        scene.addEventListener('loaded', onLoaded);
      }
    };

    let rafOuter;
    let rafInner;
    rafOuter = requestAnimationFrame(() => {
      rafInner = requestAnimationFrame(attachSceneListeners);
    });

    loadFallbackTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => {
      cancelAnimationFrame(rafOuter);
      if (rafInner != null) cancelAnimationFrame(rafInner);
      if (loadFallbackTimerRef.current) {
        clearTimeout(loadFallbackTimerRef.current);
        loadFallbackTimerRef.current = null;
      }
      const sl = sceneListenerRef.current;
      if (sl?.scene && sl?.onLoaded) {
        sl.scene.removeEventListener('loaded', sl.onLoaded);
      }
      sceneListenerRef.current = null;
    };
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
    const clean = word.replace(/[^\w\u0900-\u097F\u0C80-\u0DFF]/gi, '');
    if (!clean) return [word];
    const vowels = /[aeiouAEIOU\u0904-\u094F\u0C80-\u0DFF]/;
    const syllables = [];
    let current = '';
    for (let i = 0; i < clean.length; i++) {
      current += clean[i];
      if (vowels.test(clean[i]) && i < clean.length - 1 && !vowels.test(clean[i + 1])) {
        syllables.push(current);
        current = '';
      }
    }
    if (current) syllables.push(current);
    return syllables.length > 0 ? syllables : [word];
  };

  const processTextForAR = () => {
    const words = text.split(/\s+/).filter(Boolean).slice(0, 5);
    return words.map((word) => ({ original: word, syllables: syllabify(word) }));
  };

  const startAR = async () => {
    setError(null);
    if (!isAframeArReady()) {
      setError(
        t(
          'ar.libMissing',
          'AR libraries failed to load. Check your network, use HTTPS or localhost, then refresh.'
        )
      );
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t('ar.noCameraApi', 'Camera is not available in this browser.'));
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setCameraOk(true);
    } catch (err) {
      console.warn('Camera preflight:', err);
      if (err.name === 'NotAllowedError') {
        setError(t('ar.denied', 'Camera access denied. Allow the camera and try again.'));
        setCameraOk(false);
        return;
      }
      if (err.name === 'NotFoundError') {
        setError(t('ar.noDevice', 'No camera found. Try another device.'));
        setCameraOk(false);
        return;
      }
    }

    setArMode(true);
  };

  const closeAR = () => {
    setArMode(false);
    setError(null);
    setIsLoading(false);
    onClose?.();
  };

  if (!arMode) {
    return (
      <Container className="my-5">
        <Card className="p-4 shadow-lg">
          <h2>📱 {t('ar.title', 'AR Reading Assistant')}</h2>

          <Alert variant="info" className="mt-3">
            <h5>{t('ar.whatYouNeed', "What you'll need:")}</h5>
            <ol className="mb-0">
              <li>{t('ar.need1', 'Phone, tablet, or laptop with a camera')}</li>
              <li>{t('ar.need2', 'Printed HIRO marker (download below) — flat, good lighting')}</li>
              <li>{t('ar.need3', 'Chrome or Safari; use HTTPS or localhost for camera access')}</li>
            </ol>
          </Alert>

          {error && (
            <Alert variant="danger" className="mt-3">
              <strong>⚠️</strong> {error}
            </Alert>
          )}

          <div className="mb-3">
            <h5>📥 {t('ar.step1', 'Step 1: Download & print marker')}</h5>
            <a
              href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mb-2"
            >
              {t('ar.downloadMarker', 'Download HIRO marker')}
            </a>
            <p className="text-muted small mb-0">
              {t('ar.printHint', 'Print without scaling; matte paper works best.')}
            </p>
          </div>

          <div className="mb-3">
            <h6 className="text-primary">📝 {t('ar.previewText', 'Text in AR (first 5 words)')}</h6>
            <div className="p-3 bg-light rounded border">
              <strong>{text.split(/\s+/).filter(Boolean).slice(0, 5).join(' ')}</strong>
            </div>
          </div>

          {cameraOk === false && (
            <Alert variant="warning">{t('ar.enableCamera', 'Enable camera permissions for this site.')}</Alert>
          )}

          {!arScriptsReady && (
            <Alert variant="warning" className="small">
              {t('ar.loadingLibs', 'Loading AR libraries… If this stays a long time, refresh the page.')}
            </Alert>
          )}

          <div className="d-flex flex-wrap gap-2">
            <Button variant="success" size="lg" onClick={startAR} disabled={!arScriptsReady}>
              🚀 {t('ar.start', 'Start AR')}
            </Button>
            <Button variant="outline-secondary" size="lg" onClick={closeAR}>
              ← {t('ar.back', 'Back')}
            </Button>
          </div>

          <Alert variant="secondary" className="mt-3 mb-0 small">
            <strong>{t('ar.status', 'Status')}:</strong>{' '}
            {arScriptsReady ? '✅ A-Frame + AR.js' : '⏳ …'} ·{' '}
            {cameraOk === true
              ? t('ar.camOk', 'Camera allowed')
              : cameraOk === false
                ? t('ar.camBlocked', 'Camera blocked')
                : t('ar.camUnknown', 'Camera not checked yet')}
          </Alert>
        </Card>
      </Container>
    );
  }

  const processedWords = processTextForAR();

  const arLayer = (
    <div
      className="ar-reader-portal-root"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 2147483000,
        background: '#000',
      }}
    >
      <style>{`
        .ar-reader-portal-root a-scene.ar-reader-scene {
          width: 100vw !important;
          height: 100vh !important;
          display: block !important;
        }
        .ar-reader-portal-root a-scene.ar-reader-scene canvas.a-canvas {
          width: 100% !important;
          height: 100% !important;
        }
        .a-enter-vr,
        .a-enter-ar,
        .a-orientation-modal,
        .a-loader-title {
          display: none !important;
        }
      `}</style>

      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.92)',
            color: '#fff',
            zIndex: 2147483640,
          }}
        >
          <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
          <h4 className="mt-3">{t('ar.startingCamera', 'Starting camera…')}</h4>
          <p className="small text-center px-3">{t('ar.pointAtMarker', 'Point at your HIRO marker when the view opens.')}</p>
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(220, 53, 69, 0.95)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            zIndex: 2147483641,
            textAlign: 'center',
          }}
        >
          <h5>⚠️ {t('ar.errorTitle', 'AR error')}</h5>
          <p>{error}</p>
          <button
            type="button"
            onClick={closeAR}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#dc3545',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {t('ar.close', 'Close')}
          </button>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          maxWidth: 280,
          padding: 12,
          borderRadius: 10,
          background: 'rgba(0,0,0,0.82)',
          color: '#fff',
          fontSize: 12,
          zIndex: 2147483600,
          pointerEvents: 'none',
        }}
      >
        <div style={{ color: '#86efac', fontWeight: 700, marginBottom: 6 }}>📷 AR</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>{t('ar.tip1', 'Fill the frame with the HIRO marker')}</li>
          <li>{t('ar.tip2', 'Hold steady; text locks above the marker')}</li>
        </ul>
        <div style={{ marginTop: 8, opacity: 0.85 }}>
          {languageConfig?.name || currentLanguage}
        </div>
      </div>

      <button
        type="button"
        onClick={closeAR}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 28px',
          fontSize: 15,
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 700,
          zIndex: 2147483600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.45)',
        }}
      >
        ❌ {t('ar.exit', 'Exit AR')}
      </button>

      <a-scene
        ref={sceneRef}
        className="ar-reader-scene"
        embedded
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true; colorManagement: true;"
        loading-screen="enabled: false"
        device-orientation-permission-ui="enabled: false"
        arjs="trackingMethod: best; sourceType: webcam; videoTexture: true; debugUIEnabled: false;"
      >
        <a-marker preset="hiro" emitevents="true">
          {processedWords.map((wordData, wordIndex) => {
            const yPosition = 0.9 - wordIndex * 0.35;
            const syllableCount = wordData.syllables.length;
            const totalWidth = Math.max(syllableCount * 0.45, 0.3);

            return (
              <a-entity key={`w-${wordIndex}`} position={`0 ${yPosition} 0`}>
                {wordData.syllables.map((syllable, syllableIndex) => {
                  const xPosition = -totalWidth / 2 + syllableIndex * 0.45 + 0.2;
                  const ch = syllable[0] || syllable.charAt(0) || '?';
                  const color = colorCodingEnabled ? getColorForLetter(ch) : '#4ade80';

                  return (
                    <a-entity key={`s-${wordIndex}-${syllableIndex}`} position={`${xPosition} 0 0`}>
                      <a-text value={syllable} color={color} align="center" width="4" wrap-count="24" />

                      {colorCodingEnabled && (
                        <a-plane
                          position="0 0 -0.02"
                          width="0.42"
                          height="0.2"
                          color="#fbbf24"
                          opacity="0.25"
                          material="transparent: true; shader: flat"
                        />
                      )}

                      {syllableIndex < wordData.syllables.length - 1 && (
                        <a-text
                          value="-"
                          color="#cbd5e1"
                          position="0.22 0 0"
                          align="center"
                          width="1"
                          scale="0.45 0.45 0.45"
                        />
                      )}
                    </a-entity>
                  );
                })}
              </a-entity>
            );
          })}

          <a-entity position="0 -0.65 0">
            <a-plane
              position="0 0 -0.01"
              width="1.1"
              height="0.28"
              color="#0f172a"
              opacity="0.75"
              material="transparent: true; shader: flat"
            />
            <a-text
              value={t('ar.markerHint', 'HIRO marker')}
              color="#f8fafc"
              align="center"
              width="2.2"
              position="0 0.04 0"
              scale="0.35 0.35 0.35"
            />
          </a-entity>
        </a-marker>

        <a-entity camera />
      </a-scene>
    </div>
  );

  return createPortal(arLayer, document.body);
};

export default ARReaderDemo;
