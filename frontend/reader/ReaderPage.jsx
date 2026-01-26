// frontend/reader/ReaderPage.jsx (COMPLETE NEW VERSION)

import React, { useState, useRef } from "react";
import { Container, Card, Alert, Row, Col, Button, Spinner, ProgressBar } from "react-bootstrap";
import { Play, Square } from "lucide-react";
import TextToSpeech from "./TextToSpeech";
import Gamification from "./Gamification";
import OCRUploader from "./OCRUploader";
import OCRSideBySidePreview from "./OCRSideBySidePreview";
import ColorCoding, { ColorCodingSettings } from "./ColorCoding";
import { useAccessibility } from "../components/AccessibilityContext";

const DEFAULT_CONTENT =
  "The Adaptive Reading Assistant project is designed to help students with dyslexia by using tailored fonts, colors, and interactive features like text-to-speech.";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-z]/g, "");

// NEW: Constants for configuration
const STT_CONFIG = {
  MAX_ATTEMPTS: 3,
  TIMEOUT_MS: 6000,
  RETRY_DELAY_MS: 1200,
  SUCCESS_DELAY_MS: 800,
  SPEECH_RATE: 0.8
};

// NEW: Point system for different activities
const POINT_SYSTEM = {
  CORRECT_PRONUNCIATION: 10,
  COMPLETE_READING: 50,
  PRACTICE_WORD: 5,
  COMPLETE_STORY: 100,
  DAILY_STREAK: 20
};

const ReaderPage = () => {
  const { settings } = useAccessibility();

  const [currentReadingContent, setCurrentReadingContent] = useState(DEFAULT_CONTENT);
  const [colorCodingEnabled, setColorCodingEnabled] = useState(true);
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

  // NEW: Game stats state
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

  // NEW: Points popup state for animation
  const [pointsPopup, setPointsPopup] = useState(null);

  const recognitionRef = useRef(null);
  const shouldContinueRef = useRef(true);

  // Initialize words array when content changes
  React.useEffect(() => {
    setWordsArray(currentReadingContent.split(" ").filter(w => w.trim()));
  }, [currentReadingContent]);

  // NEW: Award points function
  const awardPoints = (points, reason) => {
    setGameStats(prev => {
      const newStats = {
        ...prev,
        score: prev.score + points,
        sessionPoints: prev.sessionPoints + points
      };

      // Update breakdown based on reason
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
      } else if (reason === 'story') {
        newStats.pointsBreakdown = {
          ...prev.pointsBreakdown,
          stories: prev.pointsBreakdown.stories + points
        };
      } else if (reason === 'game') {
        newStats.pointsBreakdown = {
          ...prev.pointsBreakdown,
          games: prev.pointsBreakdown.games + points
        };
      }

      return newStats;
    });

    // Show floating points animation
    setPointsPopup(`+${points}`);
    setTimeout(() => setPointsPopup(null), 1000);

    // TODO: Save to Firebase here
    // saveToFirebase(userId, gameStats);
  };

  // NEW: Check and award badges
  const checkAchievements = () => {
    const { score, badges } = gameStats;
    const newBadges = [];

    if (score >= 1500 && !badges.includes('Rising Star')) {
      newBadges.push('Rising Star');
    }
    if (score >= 3000 && !badges.includes('Super Reader')) {
      newBadges.push('Super Reader');
    }
    if (score >= 5000 && !badges.includes('Reading Champion')) {
      newBadges.push('Reading Champion');
    }

    if (newBadges.length > 0) {
      setGameStats(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges]
      }));
      alert(`🎉 New Badge Unlocked: ${newBadges.join(', ')}!`);
    }
  };

  // Handle OCR text extraction
  const handleTextExtracted = (text, source, file) => {
    if (!text) return;
    setPreviewText(text);
    setPreviewSource(source);
    setPreviewFile(file);
    setIsViewingPreview(true);
  };

  // Load extracted text from OCR preview
  const loadExtractedText = async () => {
    if (!previewText) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ml/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text: previewText,
            source: previewSource,
            saveToFile: true  
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setPreviewText(null);
        setPreviewFile(null);
        setIsViewingPreview(false);
      } else {
        alert("Analysis failed. Loading text without analysis.");
        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setIsViewingPreview(false);
      }
    } catch (error) {
      console.error("Error calling analyze-content:", error);
      alert("Network error connecting to ML service. Loading text anyway.");
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

  // Speak a word using TTS
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

  // Listen for student pronunciation
  const listenForWord = (expectedWord) => {
    return new Promise((resolve) => {
      if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported");
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

        console.log("Student said:", spokenWord, "| Expected:", expectedWord, "| Correct:", isCorrect);

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

        console.error("STT error:", event.error);
        
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
          console.error("Failed to start:", error);
          resolve({ success: false, skip: true });
        }
      }
    });
  };

  // MODIFIED: Process one word with points award
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
        // AWARD POINTS HERE (NEW)
        awardPoints(POINT_SYSTEM.CORRECT_PRONUNCIATION, 'pronunciation');
        
        await new Promise(resolve => setTimeout(resolve, STT_CONFIG.SUCCESS_DELAY_MS));
        setFeedback(null);
        break;
      } else {
        attempts++;
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

  // MODIFIED: Start STT reading with completion bonus
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
      // Award completion bonus (NEW)
      awardPoints(POINT_SYSTEM.COMPLETE_READING, 'reading');
      checkAchievements(); // Check for new badges
      
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

  // Stop STT reading
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

  // Cleanup with proper abort
  React.useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort(); // Force stop
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const readingStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
  };

  // OCR Preview Screen
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

  // Main Reading Screen
  return (
    <Container fluid>
      <Row>
        <Col lg={3}>
          <OCRUploader onTextExtracted={handleTextExtracted} />
          <ColorCodingSettings
            enabled={colorCodingEnabled}
            onToggle={setColorCodingEnabled}
          />
        </Col>

        <Col lg={6}>
          {/* Points Popup Animation (NEW) */}
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

          {/* Overall Progress Bar (NEW) */}
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

          {/* Mode Toggle */}
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
                // STT Mode Controls
                <div>
                  <Alert variant="info" className="small mb-3">
                    💡 <strong>How it works:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Speak each word clearly when prompted</li>
                      <li>✅ Correct pronunciation → +{POINT_SYSTEM.CORRECT_PRONUNCIATION} points, moves to next word</li>
                      <li>❌ Wrong pronunciation → hear correct version, then try again</li>
                      <li>You get {STT_CONFIG.MAX_ATTEMPTS - 1} retry attempts per word</li>
                      <li>🎉 Complete all words → +{POINT_SYSTEM.COMPLETE_READING} bonus points!</li>
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
                // TTS Mode
                <TextToSpeech text={currentReadingContent} />
              )}
            </Card.Body>
          </Card>

          {/* Feedback Display */}
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

          {/* Current Word Display */}
          {isSTTActive && currentWord && (
            <Card className="mb-3 bg-light">
              <Card.Body className="text-center">
                <h6 className="text-muted">Current Word:</h6>
                <h2 className="text-primary" style={{ fontSize: "2.5rem" }}>
                  {currentWord}
                </h2>
                <small className="text-muted">
                  Word {currentWordIndex + 1} of {wordsArray.length}
                </small>
              </Card.Body>
            </Card>
          )}

          {/* Reading Content */}
          <Card className="p-4 shadow-lg" style={readingStyle}>
            <ColorCoding
              text={currentReadingContent}
              enabled={colorCodingEnabled}
              readerSettings={settings}
            />
          </Card>

          <Alert variant="info" className="mt-2 small">
            Text Loaded: <strong>{contentSource}</strong>
          </Alert>
        </Col>

        <Col lg={3}>
          {/* Updated Gamification component with new props (NEW) */}
          <Gamification 
            score={gameStats.score}
            badges={gameStats.badges}
            streak={gameStats.streak}
            sessionPoints={gameStats.sessionPoints}
            pointsBreakdown={gameStats.pointsBreakdown}
          />
        </Col>
      </Row>

      {/* CSS for animations (NEW) */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-100px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default ReaderPage;