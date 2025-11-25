// frontend/reader/ReaderPage.jsx

import React, { useState } from "react";
import { Container, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import Pronunciation from "./Pronunciation";
import Gamification from "./Gamification";
import OCRUploader from "./OCRUploader";
import OCRSideBySidePreview from "./OCRSideBySidePreview";
import { useAccessibility } from "../components/AccessibilityContext";
import { saveReadingSession } from "../utils/firebase";

const DEFAULT_CONTENT =
  "The Adaptive Reading Assistant project is designed to help students with dyslexia by using tailored fonts, colors, and interactive features like text-to-speech. Our goal is to make reading a less challenging and more rewarding experience.";

const MOCK_DIFFICULT_WORDS = ["Adaptive", "dyslexia", "challenging", "rewarding"];

const ReaderPage = ({ userId }) => {
  const { settings } = useAccessibility();

  const [currentReadingContent, setCurrentReadingContent] =
    useState(DEFAULT_CONTENT);
  const [difficultWords, setDifficultWords] =
    useState(MOCK_DIFFICULT_WORDS);
  const [difficultyScore, setDifficultyScore] = useState(0.46);
  const [contentSource, setContentSource] = useState("Default Sample");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isViewingPreview, setIsViewingPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewText, setPreviewText] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const [currentChallengeWord, setCurrentChallengeWord] = useState(null);
  const [gamification, setGamification] = useState({
    score: 1250,
    badges: ["Focus Star"],
    streak: 7,
  });

  // Highlight difficult words and make them clickable
  const highlightContent = (text, wordsToHighlight) => {
    if (!text) return null;
    if (!wordsToHighlight || wordsToHighlight.length === 0) {
      return <span>{text}</span>;
    }

    const lowerSet = new Set(
      wordsToHighlight.map((w) => (w || "").toLowerCase())
    );
    const regex = new RegExp(`\\b(${Array.from(lowerSet).join("|")})\\b`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (lowerSet.has(part.toLowerCase())) {
        const cleaned = part.replace(/[^a-zA-Z]/g, "");
        return (
          <span
            key={index}
            className="text-danger text-decoration-underline fw-bold"
            style={{ cursor: "pointer" }}
            title={`Click to practice "${cleaned}"`}
            onClick={() => setCurrentChallengeWord(cleaned)}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // When OCR / manual text is returned from child
  const handleTextExtracted = (text, source, file) => {
    if (!text) return;
    setPreviewText(text);
    setPreviewSource(source);
    setPreviewFile(file);
    setIsViewingPreview(true);
    setCurrentChallengeWord(null);
  };

  // Load preview text into the main reader (with ML analysis)
  const loadExtractedText = async () => {
    if (!previewText) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/analyze-content",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: previewText }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const analysis = data.analysis || {};
        const challenging = analysis.challenging_words || [];
        const score = analysis.difficulty_score || 0;

        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setDifficultWords(challenging);
        setDifficultyScore(score);

        // Save reading session in Firebase
        const sessionData = {
          wpm: 0,
          readingTimeSec: 0,
          settingsUsed: settings,
          analysis: {
            difficult_words: challenging,
            difficulty_score: score,
            source: previewSource,
          },
        };

        const uid = userId || "local-dev-user";
        try {
          await saveReadingSession(uid, sessionData);
        } catch (err) {
          console.warn("Failed to save session in Firebase:", err);
        }

        setPreviewText(null);
        setPreviewFile(null);
        setIsViewingPreview(false);
      } else {
        alert("Analysis failed. Loading text without difficulty highlights.");
        setCurrentReadingContent(previewText);
        setContentSource(previewSource || "Uploaded / Manual");
        setDifficultWords([]);
        setDifficultyScore(0);
        setIsViewingPreview(false);
      }
    } catch (error) {
      console.error("Error calling analyze-content:", error);
      alert("Network error connecting to ML service.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWordPracticed = (word) => {
    const updated = difficultWords.filter(
      (w) => w.toLowerCase() !== word.toLowerCase()
    );
    setDifficultWords(updated);
    setCurrentChallengeWord(null);
    setGamification((prev) => ({
      ...prev,
      score: prev.score + 50,
    }));
  };

  const handleCancelPreview = () => {
    setPreviewText(null);
    setPreviewFile(null);
    setIsViewingPreview(false);
  };

  const readingStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    letterSpacing: `${settings.letterSpacing}em`,
    lineHeight: settings.lineHeight,
    backgroundColor: settings.highContrast ? "#333" : "#fff",
    color: settings.highContrast ? "#fff" : "#000",
    transition: "all 0.3s ease",
  };

  // If user is in preview mode (after OCR/manual), show preview page
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

  // Normal reading interface
  return (
    <Container fluid>
      <h2 className="mb-4 text-primary">Adaptive Reading Interface</h2>
      <Row>
        <Col lg={3} className="mb-4">
          <OCRUploader onTextExtracted={handleTextExtracted} />
        </Col>

        <Col lg={6} className="mb-4">
          {currentChallengeWord && (
            <Pronunciation
              challengingWord={currentChallengeWord}
              onWordPracticed={handleWordPracticed}
            />
          )}

          <Card className="p-4 shadow-lg mb-3" style={readingStyle}>
            {highlightContent(currentReadingContent, difficultWords)}
          </Card>

          <Alert
            variant="info"
            className="d-flex justify-content-between small"
          >
            <span>Text Loaded: <strong>{contentSource}</strong></span>
            <span>
              Difficulty: <strong>{difficultyScore.toFixed(2)}</strong>
            </span>
          </Alert>
        </Col>

        <Col lg={3} className="mb-4">
          <Gamification
            score={gamification.score}
            badges={gamification.badges}
            streak={gamification.streak}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ReaderPage;
