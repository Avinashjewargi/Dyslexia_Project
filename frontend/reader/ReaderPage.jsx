// frontend/reader/ReaderPage.jsx - COMPLETE FIXED VERSION

import React, { useState, useRef } from "react";
import { Container, Card, Alert, Row, Col, Button, Spinner, ProgressBar, Form } from "react-bootstrap";
import { Play, Square } from "lucide-react";
import TextToSpeech from "./TextToSpeech";
import Gamification from "./Gamification";
import OCRUploader from "./OCRUploader";
import OCRSideBySidePreview from "./OCRSideBySidePreview";
import ColorCoding from "./ColorCoding";
import { useAccessibility } from "../components/AccessibilityContext";
import { getCompleteColorMap } from '../config/colorCodingConfig';

const DEFAULT_CONTENT =
  "The boy and dog played with the ball in the park. They had fun together.";

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

  const [currentReadingContent, setCurrentReadingContent] = useState(DEFAULT_CONTENT);
  const [colorCodingEnabled, setColorCodingEnabled] = useState(true);
  const [colorIntensity, setColorIntensity] = useState(70);
  const [pronunciationMode, setPronunciationMode] = useState(false);
  const [contentSource, setContentSource] = useState("Default Sample");
  
  // OCR Preview states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isViewingPreview, setIsViewingPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  
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

  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(true);

  React.useEffect(() => {
    setWordsArray(currentReadingContent.split(" ").filter(w => w.trim()));
  }, [currentReadingContent]);

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

  const handleTextExtracted = (text, source, file) => {
    if (!text) return;
    setPreviewText(text);
    setPreviewSource(source);
    setPreviewFile(file);
    setIsViewingPreview(true);
  };

  const loadExtractedText = async () => {
    if (!previewText) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch("http://localhost:5000/api/ml/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: previewText,
          source: previewSource,
          saveToFile: true  
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setPreviewText(null);
        setPreviewFile(null);
        setIsViewingPreview(false);
      } else {
        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setIsViewingPreview(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setCurrentReadingContent(previewText);
      setContentSource(previewSource || "Uploaded / Manual");
      setIsViewingPreview(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewText(null);
    setPreviewFile(null);
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
          message: "Speech Recognition not supported."
        });
        resolve({ success: false, skip: true });
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;

      recognitionRef.current = recognition;

      setFeedback({
        type: "info",
        message: `🎤 Speak: "${expectedWord}"`
      });

      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          recognition.stop();
          setFeedback({
            type: "warning",
            message: "⏱️ No speech detected. Try again..."
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
            message: `✅ Correct! "${spokenWord}"`
          });
          resolve({ success: true, skip: false });
        } else {
          setFeedback({
            type: "danger",
            message: `❌ Wrong! You said "${spokenWord}"`
          });
          resolve({ success: false, skip: false });
        }
      };

      recognition.onerror = (event) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);

        let errorMsg = "Error occurred. Moving to next word...";
        if (event.error === 'no-speech') {
          errorMsg = "No speech detected. Moving on...";
        } else if (event.error === 'not-allowed') {
          errorMsg = "Microphone permission denied!";
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
        
        // Track difficult words after 2 failed attempts
        if (attempts >= 2 && !difficultWords.includes(word.toLowerCase())) {
          setDifficultWords(prev => [...prev, word.toLowerCase()]);
        }
        
        await new Promise(resolve => setTimeout(resolve, STT_CONFIG.RETRY_DELAY_MS));
        
        if (attempts < STT_CONFIG.MAX_ATTEMPTS && shouldContinueRef.current) {
          setFeedback({
            type: "warning",
            message: `📢 Listen: "${word}"`
          });
          await speakWord(word);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setFeedback({
            type: "info",
            message: `🔁 Try again (${attempts}/${STT_CONFIG.MAX_ATTEMPTS - 1})`
          });
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          if (shouldContinueRef.current) {
            setFeedback({
              type: "warning",
              message: `Moving to next word...`
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
      
      setFeedback({
        type: "success",
        message: `🎉 Completed! Great job! +${POINT_SYSTEM.COMPLETE_READING} bonus!`
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

  React.useEffect(() => {
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

  // Helper function to render colored single word - SMOOTH FADE TO BLACK
  const renderColoredWord = (word) => {
    // If not enabled OR below 50%, return PLAIN BLACK TEXT
    if (!colorCodingEnabled || colorIntensity < 50) {
      return <span style={{ color: '#000000' }}>{word}</span>;
    }

    const colorMap = getCompleteColorMap();
    
    return word.split('').map((char, index) => {
      const lowerChar = char.toLowerCase();
      if (colorMap[lowerChar]) {
        const color = colorMap[lowerChar];
        
        // Calculate color strength - smoothly fades to black
        const colorStrength = colorIntensity / 100; // 0.5 to 1.0
        
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // Interpolate between full color and black
        const finalR = Math.round(r * colorStrength);
        const finalG = Math.round(g * colorStrength);
        const finalB = Math.round(b * colorStrength);

        const style = {
          color: `rgb(${finalR}, ${finalG}, ${finalB})`,
          fontWeight: colorIntensity > 70 ? 'bold' : (colorIntensity > 50 ? '600' : 'normal'),
          transition: 'color 0.3s ease, font-weight 0.3s ease'
        };

        return <span key={index} style={style}>{char}</span>;
      }
      return <span key={index}>{char}</span>;
    });
  };

  const getHelperText = () => {
    if (colorIntensity < 50) {
      return '⚪ Below 50% - All text in normal black (No color support)';
    } else if (colorIntensity < 60) {
      return '🌑 50-60% - Colors fading to dark (Almost independent)';
    } else if (colorIntensity < 70) {
      return '🌓 60-70% - Medium colors (Gradual fade)';
    } else if (colorIntensity < 80) {
      return '🌕 70-80% - Bright colors (Good support)';
    } else {
      return '⭐ 80-100% - Maximum color & bold (Beginner level)';
    }
  };

  // Speak word when clicked
  const handleWordClick = (word) => {
    if (!("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

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
                <h4>Analyzing Text...</h4>
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
          <OCRUploader onTextExtracted={handleTextExtracted} />
          
          {/* Combined Color Coding Card with Toggle, Slider, and Guide */}
          <Card className="mb-3 shadow-sm border-primary">
            <Card.Body>
              {/* Toggle Switch */}
              <Form.Check
                type="switch"
                id="color-coding-switch"
                label={
                  <span>
                    <strong>Enable Color Coding for Confused Letters</strong>
                    <small className="d-block text-muted mt-1">
                      Highlights b/d, p/q, m/w, n/u in different colors
                    </small>
                  </span>
                }
                checked={colorCodingEnabled}
                onChange={(e) => setColorCodingEnabled(e.target.checked)}
                style={{ fontSize: '1rem' }}
                className="mb-3"
              />

              {/* Brightness Slider - shown when enabled */}
              {colorCodingEnabled && (
                <>
                  <hr />
                  <Form.Group className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Form.Label className="mb-0">
                        <strong>🎨 Color Brightness & Contrast</strong>
                      </Form.Label>
                      <span className={`badge ${colorIntensity < 50 ? 'bg-secondary' : 'bg-primary'}`}>
                        {colorIntensity}%
                      </span>
                    </div>
                    
                    {/* Custom Realistic Slider */}
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
                      <span>🌙 Less</span>
                      <span>⚡ More</span>
                    </div>
                    
                    <Form.Text className="text-muted d-block">
                      {getHelperText()}
                    </Form.Text>
                  </Form.Group>

                  <hr />

                  {/* Color Guide */}
                  <div>
                    <h6 className="mb-3">
                      <strong>🎨 Color Guide</strong>
                    </h6>
                    <div className="small">
                      <div className="mb-2">
                        <span style={{ color: '#3498db', fontWeight: 'bold' }}>b</span>
                        <span className="ms-2 text-muted">Blue - right →</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>d</span>
                        <span className="ms-2 text-muted">Red - left ←</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>p</span>
                        <span className="ms-2 text-muted">Green - down right</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#f39c12', fontWeight: 'bold' }}>q</span>
                        <span className="ms-2 text-muted">Orange - down left</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#34495e', fontWeight: 'bold' }}>n</span>
                        <span className="ms-2 text-muted">Gray - opens down</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#e67e22', fontWeight: 'bold' }}>u</span>
                        <span className="ms-2 text-muted">Orange - opens up</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#16a085', fontWeight: 'bold' }}>m</span>
                        <span className="ms-2 text-muted">Teal - peaks up</span>
                      </div>
                      <div className="mb-2">
                        <span style={{ color: '#c0392b', fontWeight: 'bold' }}>w</span>
                        <span className="ms-2 text-muted">Red - valleys down</span>
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
                  <span><strong>Overall Progress</strong></span>
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
                  Points this session: <strong className="text-success">
                    {gameStats.sessionPoints}
                  </strong>
                </small>
              </Card.Body>
            </Card>
          )}

          <Card className="mb-3 border-primary shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Reading Mode</h5>
              
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
                      ? "🎤 Student Reads (STT Mode)" 
                      : "🔊 Computer Reads (TTS Mode)"}
                  </strong>
                </label>
              </div>

              {pronunciationMode ? (
                <div>
                  <Alert variant="info" className="small mb-3">
                    💡 <strong>How it works:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Speak each word clearly when prompted</li>
                      <li>✅ Correct → +{POINT_SYSTEM.CORRECT_PRONUNCIATION} points</li>
                      <li>❌ Wrong → hear correct version, try again</li>
                      <li>🎉 Complete all → +{POINT_SYSTEM.COMPLETE_READING} bonus!</li>
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
                      Start Reading Practice
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="lg"
                      className="w-100"
                      onClick={stopSTTReading}
                    >
                      <Square size={20} className="me-2" />
                      Stop Practice
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
                <h6 className="text-muted">Current Word:</h6>
                <h2 style={{ fontSize: "2.5rem" }}>
                  {renderColoredWord(currentWord)}
                </h2>
                <small className="text-muted">
                  Word {currentWordIndex + 1} of {wordsArray.length}
                </small>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📄 Reading Text</h5>
            </Card.Header>
            <Card.Body style={{ backgroundColor: '#f8f9fa', padding: '2rem' }}>
              <ColorCoding 
                text={currentReadingContent} 
                enabled={colorCodingEnabled}
                colorIntensity={colorIntensity}
                onWordClick={handleWordClick}
                highlightDifficultWords={true}
                difficultWords={difficultWords}
              />
            </Card.Body>
          </Card>

          <Alert variant="info" className="mt-2 small">
            Text Loaded: <strong>{contentSource}</strong>
          </Alert>

          {/* Difficult Words Alert */}
          {difficultWords.length > 0 && (
            <Alert variant="warning" className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>🎯 Practice These Words:</strong>
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
                  Clear
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
        
        /* Custom Slider Styles */
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