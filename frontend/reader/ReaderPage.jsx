// frontend/reader/ReaderPage.jsx - FIXED: Translation back to original language

import React, { useState, useRef, useEffect } from "react";
import { Container, Card, Alert, Row, Col, Button, Spinner, ProgressBar, Form } from "react-bootstrap";
import { Play, Square, Eye } from "lucide-react";
import TextToSpeech from "./TextToSpeech";
import Gamification from "./Gamification";
import OCRUploader from "./OCRUploader";
import OCRSideBySidePreview from "./OCRSideBySidePreview";
import ColorCoding from "./ColorCoding";
import { useAccessibility } from "../components/AccessibilityContext";
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { getCompleteColorMap } from '../config/colorCodingConfig';
import { CONFUSING_LETTERS } from '../config/languageConfig';
import { translateText } from '../utils/translationService';
import ARReaderDemo from '../components/ARReaderDemo';

// ✅ Language-specific default content
const DEFAULT_TEXTS = {
  en: "The boy and dog played with the ball in the park. They had fun together.",
  hi: "लड़का और कुत्ता पार्क में गेंद से खेले। उन्होंने साथ में खूब मजे किए।",
  kn: "ಹುಡುಗ ಮತ್ತು ನಾಯಿ ಉದ್ಯಾನವನದಲ್ಲಿ ಚೆಂಡಿನೊಂದಿಗೆ ಆಟವಾಡಿದರು. ಅವರು ಒಟ್ಟಿಗೆ ಆನಂದಿಸಿದರು."
};

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z]/g, "");

const STT_CONFIG = {
  MAX_ATTEMPTS: 3,
  TIMEOUT_MS: 6000,
  RETRY_DELAY_MS: 1200,
  SUCCESS_DELAY_MS: 800,
  SPEECH_RATE: 0.8
};

const POINT_SYSTEM = {
  CORRECT_PRONUNCIATION: 10,
  COMPLETE_READING: 50,
  PRACTICE_WORD: 5,
  COMPLETE_STORY: 100,
  DAILY_STREAK: 20
};

const ReaderPage = ({ userId }) => {
  const { settings } = useAccessibility();
  const { currentLanguage, languageConfig } = useLanguage();
  const { t } = useTranslation();

  // ✅ Initialize with language-specific default
  const [currentReadingContent, setCurrentReadingContent] = useState(
    DEFAULT_TEXTS[currentLanguage] || DEFAULT_TEXTS.en
  );
  const [colorCodingEnabled, setColorCodingEnabled] = useState(true);
  const [colorIntensity, setColorIntensity] = useState(70);
  const [pronunciationMode, setPronunciationMode] = useState(false);
  const [contentSource, setContentSource] = useState("Default Sample");
  
  // ✅ Translation states (hidden - no UI changes)
  const [originalText, setOriginalText] = useState(null);
  const [originalLanguage, setOriginalLanguage] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // ✅ NEW: AR Mode state
  const [showAR, setShowAR] = useState(false);
  
  // OCR Preview states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isViewingPreview, setIsViewingPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(null);
  
  // STT mode states
  const [isSTTActive, setIsSTTActive] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [wordsArray, setWordsArray] = useState([]);

  // Game stats state
  const [gameStats, setGameStats] = useState({
    score: 1250,
    badges: ["Focus Star"],
    streak: 7,
    sessionPoints: 0,
    pointsBreakdown: {
      reading: 300,
      pronunciation: 450,
      stories: 400,
      games: 100
    }
  });

  const [pointsPopup, setPointsPopup] = useState(null);
  const [difficultWords, setDifficultWords] = useState([]);
  const [readingLevel, setReadingLevel] = useState('Unknown');
  const [difficultyScore, setDifficultyScore] = useState(0);

  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(true);
  const userLoadedTextRef = useRef(false);

  // ✅ Update words array when content changes
  useEffect(() => {
    setWordsArray(currentReadingContent.split(" ").filter(w => w.trim()));
  }, [currentReadingContent]);

  // ✅ Update default text when language changes (only if user hasn't loaded custom text)
  useEffect(() => {
    if (!userLoadedTextRef.current) {
      setCurrentReadingContent(DEFAULT_TEXTS[currentLanguage] || DEFAULT_TEXTS.en);
      setContentSource("Default Sample");
    }
  }, [currentLanguage]);

  // ✅ FIXED: Auto-translate when language changes (SILENT - no UI changes)
  useEffect(() => {
    const handleLanguageChange = async () => {
      // Only auto-translate if user has loaded their own text and original text exists
      if (!userLoadedTextRef.current || !originalText || !originalLanguage || isTranslating) {
        return;
      }

      console.log(`🌍 Language changed to: ${currentLanguage}`);
      console.log(`📝 Original language: ${originalLanguage}`);
      
      // ✅ FIX: If switching back to original language, just show original text
      if (originalLanguage === currentLanguage) {
        console.log(`✅ Switching back to original ${originalLanguage.toUpperCase()} text`);
        setCurrentReadingContent(originalText);
        setContentSource(`OCR Upload (Original ${originalLanguage.toUpperCase()})`);
        return; // Exit early, no translation needed
      }

      // ✅ Need to translate to a different language
      console.log(`🔄 Translating from ${originalLanguage} to ${currentLanguage}...`);
      setIsTranslating(true);

      try {
        const result = await translateText(originalText, currentLanguage, originalLanguage);

        if (result.success && result.translatedText) {
          setCurrentReadingContent(result.translatedText);
          setContentSource(`OCR Upload (Translated to ${currentLanguage.toUpperCase()})`);
          console.log('✅ Translation successful!');
        } else {
          console.error('❌ Translation failed:', result.error);
          // Fallback to original
          setCurrentReadingContent(originalText);
          setContentSource(`OCR Upload (Original ${originalLanguage.toUpperCase()})`);
        }
      } catch (error) {
        console.error('❌ Translation error:', error);
        // Fallback to original
        setCurrentReadingContent(originalText);
        setContentSource(`OCR Upload (Original ${originalLanguage.toUpperCase()})`);
      } finally {
        setIsTranslating(false);
      }
    };

    handleLanguageChange();
  }, [currentLanguage, originalText, originalLanguage]); // ✅ FIXED: Include all dependencies

  const awardPoints = (points, reason) => {
    setGameStats(prev => {
      const newStats = {
        ...prev,
        score: prev.score + points,
        sessionPoints: prev.sessionPoints + points
      };

      if (reason === 'pronunciation') {
        newStats.pointsBreakdown = {
          ...prev.pointsBreakdown,
          pronunciation: prev.pointsBreakdown.pronunciation + points
        };
      } else if (reason === 'reading') {
        newStats.pointsBreakdown = {
          ...prev.pointsBreakdown,
          reading: prev.pointsBreakdown.reading + points
        };
      }

      return newStats;
    });

    setPointsPopup(`+${points}`);
    setTimeout(() => setPointsPopup(null), 1000);
  };

  const checkAchievements = () => {
    const { score, badges } = gameStats;
    const newBadges = [];

    if (score >= 1500 && !badges.includes('Rising Star')) {
      newBadges.push('Rising Star');
    }
    if (score >= 3000 && !badges.includes('Super Reader')) {
      newBadges.push('Super Reader');
    }

    if (newBadges.length > 0) {
      setGameStats(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges]
      }));
      alert(`🎉 New Badge Unlocked: ${newBadges.join(', ')}!`);
    }
  };

  const handleTextExtracted = (text, source, file, language) => {
    if (!text) return;
    setPreviewText(text);
    setPreviewSource(source);
    setPreviewFile(file);
    setPreviewLanguage(language || 'en');
    setIsViewingPreview(true);
    userLoadedTextRef.current = true;
  };

  const analyzeText = async (text, language) => {
    try {
      const response = await fetch("http://localhost:5000/api/ml/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: text,
          language: language || currentLanguage,
          saveToFile: true  
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const analysis = data.analysis || {};
        setDifficultWords(analysis.challenging_words || []);
        setDifficultyScore(analysis.difficulty_score || 0);
        setReadingLevel(analysis.reading_level || 'Unknown');
        
        console.log('✅ Text analysis:', analysis);
        console.log('📊 Language:', language);
        console.log('🎯 Difficult words:', analysis.challenging_words);
      }

      return data;
    } catch (error) {
      console.error('❌ Analysis Error:', error);
      return null;
    }
  };

  const loadExtractedText = async () => {
    if (!previewText) return;
    setIsAnalyzing(true);

    try {
      const ocrLanguage = previewLanguage || 'en';
      
      console.log('🌍 Loading OCR text with language:', ocrLanguage);
      
      // ✅ Store original text and language for translation
      setOriginalText(previewText);
      setOriginalLanguage(ocrLanguage);
      
      const analysisResult = await analyzeText(previewText, ocrLanguage);

      if (analysisResult && analysisResult.success) {
        setCurrentReadingContent(previewText);
        setContentSource(`OCR Upload (Original ${ocrLanguage.toUpperCase()})`);
        setPreviewText(null);
        setPreviewFile(null);
        setPreviewLanguage(null);
        setIsViewingPreview(false);
      } else {
        setCurrentReadingContent(previewText);
        setContentSource(`OCR Upload (Original ${ocrLanguage.toUpperCase()})`);
        setPreviewText(null);
        setPreviewFile(null);
        setPreviewLanguage(null);
        setIsViewingPreview(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setCurrentReadingContent(previewText);
      setContentSource(`OCR Upload (Original ${ocrLanguage.toUpperCase()})`);
      setPreviewText(null);
      setPreviewFile(null);
      setPreviewLanguage(null);
      setIsViewingPreview(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveSession = async () => {
    if (!userId) {
      console.warn('No userId provided, skipping session save');
      return;
    }

    try {
      const sessionData = {
        userId: userId,
        sessionType: 'reading',
        content: currentReadingContent,
        wpm: 0,
        accuracy: 0,
        readingTimeSec: 0,
        difficultWords: difficultWords,
        language: currentLanguage,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch('http://localhost:5000/api/reading/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Session saved successfully!');
      } else {
        console.error('❌ Failed to save session:', data.error);
      }
    } catch (error) {
      console.error('❌ Save Session Error:', error);
    }
  };

  const handleCancelPreview = () => {
    setPreviewText(null);
    setPreviewFile(null);
    setPreviewLanguage(null);
    setIsViewingPreview(false);
  };

  const speakWord = (word) => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      
      if (languageConfig && languageConfig.ttsCode) {
        utterance.lang = languageConfig.ttsCode;
      }
      
      utterance.rate = STT_CONFIG.SPEECH_RATE;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const listenForWord = (expectedWord) => {
    return new Promise((resolve) => {
      if (!SpeechRecognition) {
        setFeedback({
          type: "warning",
          message: t('reader.speechNotSupported') || "Speech Recognition not supported."
        });
        resolve({ success: false, skip: true });
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      
      if (languageConfig && languageConfig.ttsCode) {
        recognition.lang = languageConfig.ttsCode;
      } else {
        recognition.lang = "en-US";
      }
      
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;

      recognitionRef.current = recognition;

      setFeedback({
        type: "info",
        message: `🎤 ${t('reader.speak')}: "${expectedWord}"`
      });

      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          recognition.stop();
          setFeedback({
            type: "warning",
            message: t('reader.noSpeechDetected') || "⏱️ No speech detected. Try again..."
          });
          resolve({ success: false, skip: false });
        }
      }, STT_CONFIG.TIMEOUT_MS);

      recognition.onresult = (event) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);

        const results = event.results[0];
        const spokenWord = results[0].transcript.trim();
        
        let isCorrect = false;
        
        for (let i = 0; i < results.length; i++) {
          const alternative = results[i].transcript.trim();
          if (normalize(expectedWord) === normalize(alternative)) {
            isCorrect = true;
            break;
          }
        }

        if (isCorrect) {
          setFeedback({
            type: "success",
            message: `✅ ${t('reader.correct') || 'Correct'}! "${spokenWord}"`
          });
          resolve({ success: true, skip: false });
        } else {
          setFeedback({
            type: "danger",
            message: `❌ ${t('reader.wrong') || 'Wrong'}! ${t('reader.youSaid') || 'You said'} "${spokenWord}"`
          });
          resolve({ success: false, skip: false });
        }
      };

      recognition.onerror = (event) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);

        let errorMsg = t('reader.errorOccurred') || "Error occurred. Moving to next word...";
        if (event.error === 'no-speech') {
          errorMsg = t('reader.noSpeechMoving') || "No speech detected. Moving on...";
        } else if (event.error === 'not-allowed') {
          errorMsg = t('reader.micPermissionDenied') || "Microphone permission denied!";
          shouldContinueRef.current = false;
        }
        
        setFeedback({
          type: "danger",
          message: errorMsg
        });
        resolve({ success: false, skip: event.error === 'not-allowed' });
      };

      recognition.onend = () => {
        recognitionRef.current = null;
      };

      try {
        recognition.start();
      } catch (error) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({ success: false, skip: true });
        }
      }
    });
  };

  const processWord = async (word, index) => {
    if (!shouldContinueRef.current) return;

    setCurrentWord(word);
    setCurrentWordIndex(index);

    let attempts = 0;

    while (attempts < STT_CONFIG.MAX_ATTEMPTS && shouldContinueRef.current) {
      const result = await listenForWord(word);
      
      if (result.skip) {
        setIsSTTActive(false);
        return;
      }

      if (result.success) {
        awardPoints(POINT_SYSTEM.CORRECT_PRONUNCIATION, 'pronunciation');
        await new Promise(resolve => setTimeout(resolve, STT_CONFIG.SUCCESS_DELAY_MS));
        setFeedback(null);
        break;
      } else {
        attempts++;
        
        if (attempts >= 2 && !difficultWords.includes(word.toLowerCase())) {
          setDifficultWords(prev => [...prev, word.toLowerCase()]);
        }
        
        await new Promise(resolve => setTimeout(resolve, STT_CONFIG.RETRY_DELAY_MS));
        
        if (attempts < STT_CONFIG.MAX_ATTEMPTS && shouldContinueRef.current) {
          setFeedback({
            type: "warning",
            message: `📢 ${t('reader.listen')}: "${word}"`
          });
          await speakWord(word);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setFeedback({
            type: "info",
            message: `🔁 ${t('reader.tryAgain') || 'Try again'} (${attempts}/${STT_CONFIG.MAX_ATTEMPTS - 1})`
          });
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          if (shouldContinueRef.current) {
            setFeedback({
              type: "warning",
              message: t('reader.movingToNext') || `Moving to next word...`
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeedback(null);
          }
        }
      }
    }
  };

  const startSTTReading = async () => {
    if (wordsArray.length === 0) return;

    setIsSTTActive(true);
    shouldContinueRef.current = true;
    setCurrentWordIndex(0);
    setFeedback(null);

    for (let i = 0; i < wordsArray.length; i++) {
      if (!shouldContinueRef.current) break;
      await processWord(wordsArray[i], i);
    }

    if (shouldContinueRef.current) {
      awardPoints(POINT_SYSTEM.COMPLETE_READING, 'reading');
      checkAchievements();
      
      await saveSession();
      
      setFeedback({
        type: "success",
        message: `🎉 ${t('reader.completed') || 'Completed'}! ${t('reader.greatJob') || 'Great job'}! +${POINT_SYSTEM.COMPLETE_READING} ${t('reader.bonus') || 'bonus'}!`
      });
      setTimeout(() => {
        setFeedback(null);
        setIsSTTActive(false);
      }, 3000);
    }
  };

  const stopSTTReading = () => {
    shouldContinueRef.current = false;
    setIsSTTActive(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel();
    setFeedback(null);
    setCurrentWord("");
  };

  useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const readingStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
  };

  const splitGraphemes = (str) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const seg = new Intl.Segmenter('und', { granularity: 'grapheme' });
      return [...seg.segment(str)].map(s => s.segment);
    }
    return str.match(/[\u0900-\u097F\u0C80-\u0CFF][\u0900-\u097F\u0C80-\u0CFF\u0300-\u036F]*|./gs) || [];
  };

  const renderColoredWord = (word) => {
    if (!colorCodingEnabled || colorIntensity < 50) {
      return <span style={{ color: '#000000' }}>{word}</span>;
    }

    const langLetters = CONFUSING_LETTERS[currentLanguage] || {};
    let colorMap;
    
    if (Object.keys(langLetters).length > 0) {
      colorMap = {};
      Object.keys(langLetters).forEach(l => {
        colorMap[l] = langLetters[l].color;
        colorMap[l.toLowerCase()] = langLetters[l].color;
        colorMap[l.toUpperCase()] = langLetters[l].color;
      });
    } else {
      colorMap = getCompleteColorMap();
    }

    return splitGraphemes(word).map((grapheme, idx) => {
      const baseChar = grapheme[0];
      const hexColor = colorMap[baseChar];

      if (hexColor) {
        const strength = colorIntensity / 100;
        const r = Math.round(parseInt(hexColor.slice(1, 3), 16) * strength);
        const g = Math.round(parseInt(hexColor.slice(3, 5), 16) * strength);
        const b = Math.round(parseInt(hexColor.slice(5, 7), 16) * strength);

        return (
          <span key={idx} style={{
            color: `rgb(${r}, ${g}, ${b})`,
            fontWeight: colorIntensity > 70 ? 'bold' : colorIntensity > 50 ? '600' : 'normal',
            transition: 'color 0.3s ease'
          }}>
            {grapheme}
          </span>
        );
      }
      return <span key={idx}>{grapheme}</span>;
    });
  };

  const getHelperText = () => {
    if (colorIntensity < 50) {
      return t('reader.colorHelper.below50') || '⚪ Below 50% - All text in normal black (No color support)';
    } else if (colorIntensity < 60) {
      return t('reader.colorHelper.50to60') || '🌑 50-60% - Colors fading to dark (Almost independent)';
    } else if (colorIntensity < 70) {
      return t('reader.colorHelper.60to70') || '🌓 60-70% - Medium colors (Gradual fade)';
    } else if (colorIntensity < 80) {
      return t('reader.colorHelper.70to80') || '🌕 70-80% - Bright colors (Good support)';
    } else {
      return t('reader.colorHelper.80to100') || '⭐ 80-100% - Maximum color & bold (Beginner level)';
    }
  };

  const handleWordClick = (word) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSpeechSynthesisUtterance(word);
    
    if (languageConfig && languageConfig.ttsCode) {
      utterance.lang = languageConfig.ttsCode;
    }
    
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ✅ NEW: AR Mode Fullscreen Render
  if (showAR) {
    return (
      <ARReaderDemo
        text={currentReadingContent}
        colorCodingEnabled={colorCodingEnabled}
        colorIntensity={colorIntensity}
        onClose={() => setShowAR(false)}
      />
    );
  }

  if (isViewingPreview) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div style={{ maxWidth: "900px", width: "100%" }}>
          {isAnalyzing ? (
            <Card className="p-5 text-center shadow-lg border-info">
              <Card.Body>
                <Spinner animation="border" variant="info" className="mb-3" />
                <h4>{t('reader.analyzingText') || 'Analyzing Text...'}</h4>
                <small className="text-muted">
                  {t('reader.analyzingLanguage') || 'Analyzing in'}: <strong>{previewLanguage ? 
                    (previewLanguage === 'en' ? 'English' : previewLanguage === 'hi' ? 'Hindi' : 'Kannada') 
                    : languageConfig?.name || currentLanguage}</strong>
                </small>
              </Card.Body>
            </Card>
          ) : (
            <OCRSideBySidePreview
              uploadedFile={previewFile}
              extractedText={previewText}
              source={previewSource}
              onLoadText={loadExtractedText}
              onCancel={handleCancelPreview}
            />
          )}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={3}>
          <OCRUploader 
            onTextExtracted={handleTextExtracted}
            currentLanguage={currentLanguage}
          />
          
          <Card className="mb-3 shadow-sm border-primary">
            <Card.Body>
              <Form.Check
                type="switch"
                id="color-coding-switch"
                label={
                  <span>
                    <strong>{t('reader.enableColorCoding') || 'Enable Color Coding for Confused Letters'}</strong>
                    <small className="d-block text-muted mt-1">
                      {t('reader.colorCodingDesc') || 'Highlights b/d, p/q, m/w, n/u in different colors'}
                    </small>
                  </span>
                }
                checked={colorCodingEnabled}
                onChange={(e) => setColorCodingEnabled(e.target.checked)}
                style={{ fontSize: '1rem' }}
                className="mb-3"
              />

              {colorCodingEnabled && (
                <>
                  <hr />
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Label className="mb-0">
                        <strong>🎨 {t('reader.colorBrightness') || 'Color Brightness & Contrast'}</strong>
                      </Form.Label>
                      <span className={`badge ${colorIntensity < 50 ? 'bg-secondary' : 'bg-primary'}`}>
                        {colorIntensity}%
                      </span>
                    </div>
                    
                    <div className="position-relative mb-3" style={{ height: '40px' }}>
                      <div 
                        className="position-absolute w-100 rounded-pill"
                        style={{
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '8px',
                          background: 'linear-gradient(to right, #e0e0e0 0%, #4CAF50 50%, #2196F3 100%)',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                        }}
                      />
                      <input
                        type="range"
                        min="20"
                        max="100"
                        step="10"
                        value={colorIntensity}
                        onChange={(e) => setColorIntensity(parseInt(e.target.value))}
                        className="position-absolute w-100"
                        style={{
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          background: 'transparent',
                          WebkitAppearance: 'none',
                          appearance: 'none',
                          outline: 'none',
                          height: '40px',
                          zIndex: 2
                        }}
                      />
                    </div>
                    
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>🌙 {t('reader.less') || 'Less'}</span>
                      <span>⚡ {t('reader.more') || 'More'}</span>
                    </div>
                    
                    <Form.Text className="text-muted d-block">
                      {getHelperText()}
                    </Form.Text>
                  </Form.Group>

                  <hr />

                  <div>
                    <h6 className="mb-3">
                      <strong>🎨 {t('reader.colorGuide') || 'Color Guide'}</strong>
                    </h6>
                    <div className="small">
                      <div className="mb-2">
                        <span style={{ color: '#3498db', fontWeight: 'bold' }}>b</span>
                        <span className="ms-2 text-muted">{t('reader.blueRight') || 'Blue - right →'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>d</span>
                        <span className="ms-2 text-muted">{t('reader.redLeft') || 'Red - left ←'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>p</span>
                        <span className="ms-2 text-muted">{t('reader.greenDown') || 'Green - down right'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#f39c12', fontWeight: 'bold' }}>q</span>
                        <span className="ms-2 text-muted">{t('reader.orangeDown') || 'Orange - down left'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#34495e', fontWeight: 'bold' }}>n</span>
                        <span className="ms-2 text-muted">{t('reader.grayDown') || 'Gray - opens down'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#e67e22', fontWeight: 'bold' }}>u</span>
                        <span className="ms-2 text-muted">{t('reader.orangeUp') || 'Orange - opens up'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#16a085', fontWeight: 'bold' }}>m</span>
                        <span className="ms-2 text-muted">{t('reader.tealPeaks') || 'Teal - peaks up'}</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#c0392b', fontWeight: 'bold' }}>w</span>
                        <span className="ms-2 text-muted">{t('reader.redValleys') || 'Red - valleys down'}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {pointsPopup && (
            <div 
              className="position-fixed top-50 start-50 translate-middle"
              style={{
                animation: 'floatUp 1s ease-out',
                fontSize: '3rem',
                color: 'gold',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                zIndex: 9999,
                pointerEvents: 'none'
              }}>
              {pointsPopup} 🎉
            </div>
          )}

          {isSTTActive && (
            <Card className="mb-3 border-success">
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span><strong>{t('reader.overallProgress') || 'Overall Progress'}</strong></span>
                  <span className="text-success fw-bold">
                    {currentWordIndex + 1}/{wordsArray.length}
                  </span>
                </div>
                <ProgressBar 
                  now={((currentWordIndex + 1) / wordsArray.length) * 100}
                  variant="success"
                  animated
                  label={`${Math.round(((currentWordIndex + 1) / wordsArray.length) * 100)}%`}
                  style={{ height: '30px', fontSize: '1rem' }}
                />
                <small className="text-muted d-block mt-2">
                  {t('reader.pointsThisSession') || 'Points this session'}: <strong className="text-success">
                    {gameStats.sessionPoints}
                  </strong>
                </small>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-3 border-primary shadow-sm">
            <Card.Body>
              <h5 className="mb-3">{t('reader.readingMode') || 'Reading Mode'}</h5>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="modeToggle"
                  checked={pronunciationMode}
                  onChange={(e) => setPronunciationMode(e.target.checked)}
                  disabled={isSTTActive}
                />
                <label className="form-check-label" htmlFor="modeToggle">
                  <strong>
                    {pronunciationMode 
                      ? `🎤 ${t('reader.studentReads') || 'Student Reads (STT Mode)'}` 
                      : `🔊 ${t('Computer Reads') || 'Computer Reads (TTS Mode)'}`}
                  </strong>
                </label>
              </div>

              {pronunciationMode ? (
                <div>
                  <Alert variant="info" className="small mb-3">
                    💡 <strong>{t('reader.howItWorks') || 'How it works'}:</strong>
                    <ul className="mb-0 mt-2">
                      <li>{t('reader.speakClearly') || 'Speak each word clearly when prompted'}</li>
                      <li>✅ {t('reader.correctPoints', { points: POINT_SYSTEM.CORRECT_PRONUNCIATION }) || `Correct → +${POINT_SYSTEM.CORRECT_PRONUNCIATION} points`}</li>
                      <li>❌ {t('reader.wrongRetry') || 'Wrong → hear correct version, try again'}</li>
                      <li>🎉 {t('reader.completeBonus', { bonus: POINT_SYSTEM.COMPLETE_READING }) || `Complete all → +${POINT_SYSTEM.COMPLETE_READING} bonus!`}</li>
                    </ul>
                  </Alert>
                  {!isSTTActive ? (
                    <Button
                      variant="success"
                      size="lg"
                      className="w-100"
                      onClick={startSTTReading}
                    >
                      <Play size={20} className="me-2" />
                      {t('reader.startReadingPractice') || 'Start Reading Practice'}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="lg"
                      className="w-100"
                      onClick={stopSTTReading}
                    >
                      <Square size={20} className="me-2" />
                      {t('reader.stopPractice') || 'Stop Practice'}
                    </Button>
                  )}
                </div>
              ) : (
                <TextToSpeech 
                  text={currentReadingContent}
                  colorCodingEnabled={colorCodingEnabled}
                  colorIntensity={colorIntensity}
                  renderColoredWord={renderColoredWord}
                />
              )}
            </Card.Body>
          </Card>

          {feedback && (
            <Alert 
              variant={feedback.type} 
              className="mt-2"
              style={{ 
                fontSize: "1.2rem", 
                fontWeight: "bold",
                animation: "fadeIn 0.3s"
              }}
            >
              {feedback.message}
            </Alert>
          )}

          {isSTTActive && currentWord && (
            <Card className="mb-3 bg-light">
              <Card.Body className="text-center">
                <h6 className="text-muted">{t('reader.currentWord') || 'Current Word'}:</h6>
                <h2 style={{ fontSize: "2.5rem" }}>
                  {renderColoredWord(currentWord)}
                </h2>
                <small className="text-muted">
                  {t('reader.wordCount', { 
                    current: currentWordIndex + 1, 
                    total: wordsArray.length 
                  }) || `Word ${currentWordIndex + 1} of ${wordsArray.length}`}
                </small>
              </Card.Body>
            </Card>
          )}

          {/* ✅ NEW: AR Eye Button - Floats above Reading Text Card */}
          <div className="position-relative mb-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowAR(true)}
              className="position-absolute top-0 end-0"
              style={{
                zIndex: 10,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
              title={t('reader.tryAR', 'Try AR Reading')}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <Eye size={20} />
            </Button>
          </div>

          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📄 {t('reader.readingText') || 'Reading Text'}</h5>
            </Card.Header>
            <Card.Body style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '2rem',
              wordBreak: 'keep-all',
              overflowWrap: 'anywhere'
            }}>
              <ColorCoding 
                text={currentReadingContent} 
                enabled={colorCodingEnabled}
                colorIntensity={colorIntensity}
                onWordClick={handleWordClick}
                highlightDifficultWords={true}
                difficultWords={difficultWords}
                currentLanguage={currentLanguage}
              />
            </Card.Body>
          </Card>

          <Alert variant="info" className="mt-2 small">
            {t('reader.textLoaded') || 'Text Loaded'}: <strong>{contentSource}</strong>
            {languageConfig && (
              <span className="ms-2">
                | {t('reader.language') || 'Language'}: <strong>{languageConfig.name}</strong>
              </span>
            )}
          </Alert>

          {difficultWords.length > 0 && (
            <Alert variant="warning" className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>🎯 {t('reader.practiceWords') || 'Practice These Words'}:</strong>
                  <div className="mt-2">
                    {difficultWords.map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(word)}
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#fff',
                          padding: '4px 12px',
                          margin: '4px',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          border: '2px solid #ffc107',
                          fontWeight: 'bold',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.backgroundColor = '#fff9c4';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.backgroundColor = '#fff';
                        }}
                      >
                        🔊 {word}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => setDifficultWords([])}
                >
                  {t('common.buttons.clear') || 'Clear'}
                </Button>
              </div>
            </Alert>
          )}
        </Col>

        <Col lg={3}>
          <Gamification 
            score={gameStats.score}
            badges={gameStats.badges}
            streak={gameStats.streak}
            sessionPoints={gameStats.sessionPoints}
            pointsBreakdown={gameStats.pointsBreakdown}
          />
        </Col>
      </Row>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-100px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.8);
          border: 3px solid white;
          transition: all 0.2s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 5px rgba(255, 255, 255, 0.9);
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.05);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), 0 0 0 6px rgba(102, 126, 234, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 255, 255, 0.8);
          border: 3px solid white;
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
      `}</style>
    </Container>
  );
};

export default ReaderPage;