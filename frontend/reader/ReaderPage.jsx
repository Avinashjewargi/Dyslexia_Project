// frontend/reader/ReaderPage.jsx (Modified for NLP Integration)

import React, { useState, useEffect } from 'react'; // IMPORT useEffect
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

// Import all Reader components
import OCRUploader from './OCRUploader'; 
import OverlayText from './OverlayText';
import Gamification from './Gamification';
import Pronunciation from './Pronunciation'; 

// Initial dummy text
const initialSampleText = "The Adaptive Reading Assistant project is designed to help students with dyslexia by using tailored fonts, colors, and interactive features like text-to-speech. Our goal is to make reading a less challenging and more rewarding experience.";

// Dummy settings (should eventually come from global context)
const currentSettings = { font: 'OpenDyslexic, sans-serif', fontSize: 20, lineSpacing: 2.0 };

function ReaderPage() {
  const [currentText, setCurrentText] = useState(initialSampleText);
  const [challengingWords, setChallengingWords] = useState([]);
  const [difficultyScore, setDifficultyScore] = useState(0);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // 1. Function to call the NLP Analysis API
  const analyzeText = async (textToAnalyze) => {
    setLoadingAnalysis(true);
    setChallengingWords([]); // Clear previous highlights

    try {
      // POST request to the new NLP analysis endpoint
      const response = await fetch('/api/nlp/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const results = await response.json();

      // Update state with the results from the Python script
      setChallengingWords(results.challenging_words);
      setDifficultyScore(results.difficulty_score);

    } catch (error) {
      console.error("Error during NLP analysis:", error);
      // Fallback if analysis fails
      setChallengingWords(["Error"]); 
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // 2. Function to receive extracted text from the OCR component (Updated)
  const handleTextExtracted = (extractedText) => {
    setCurrentText(extractedText);
    analyzeText(extractedText); // Trigger analysis for the new text
  };

  // 3. Run analysis when the component first mounts (for sample text)
  useEffect(() => {
    analyzeText(initialSampleText);
  }, []); // Empty array means run once on mount

  // --- Determine the word for Pronunciation component ---
  // Use the first challenging word found, or a default
  const wordToPractice = challengingWords.length > 0 
                         ? challengingWords[0] 
                         : "reading";

  // --- Render Logic ---
  return (
    <Row className="g-4">
      <Col md={9}>
        <h2 className="mb-4">Adaptive Reading Interface</h2>

        {/* PRONUNCIATION TOOL INTEGRATION */}
        <Pronunciation word={wordToPractice} /> 

        {/* Loading indicator for analysis */}
        {loadingAnalysis ? (
            <div className="text-center p-5">
                <Spinner animation="border" variant="info" className="me-2" />
                <p className="mt-2">Analyzing text for difficulty...</p>
            </div>
        ) : (
            <Card className="shadow-lg">
                <Card.Body>
                    <OverlayText 
                        text={currentText}
                        challengingWords={challengingWords} // Passes the analyzed words
                        readerSettings={currentSettings}
                    />
                </Card.Body>
            </Card>
        )}

        <Alert variant="info" className="mt-3 d-flex justify-content-between">
            <div>
                Text Loaded: {currentText.length > 50 ? 'OCR Upload' : 'Sample Text'} | 
                Challenging Words Identified: **{challengingWords.length}**
            </div>
            <div>
                Difficulty Score: **{difficultyScore}**
            </div>
        </Alert>
      </Col>

      <Col md={3}>
        {/* OCR UPLOADER integration */}
        <OCRUploader onTextExtracted={handleTextExtracted} /> 

        {/* Gamification Sidebar */}
        <div className="mt-4">
            <Gamification />
        </div>

      </Col>
    </Row>
  );
}

export default ReaderPage;