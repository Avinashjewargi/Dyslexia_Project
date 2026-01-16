// frontend/phonology/SpellingTest.jsx

import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { ArrowLeft, Volume2, Check, X, Trophy, Star } from 'lucide-react';

// Spelling test data with 3 levels
const SPELLING_DATA = {
  level1: {
    name: "Easy Level",
    description: "Simple 3-4 letter words",
    words: [
      { word: "cat", hint: "A pet that says meow", image: "🐱" },
      { word: "dog", hint: "A pet that barks", image: "🐕" },
      { word: "sun", hint: "Bright in the sky", image: "☀️" },
      { word: "run", hint: "Move fast with your legs", image: "🏃" },
      { word: "fun", hint: "When you enjoy something", image: "🎉" }
    ]
  },
  level2: {
    name: "Medium Level",
    description: "4-5 letter words with some tricky sounds",
    words: [
      { word: "play", hint: "What you do with toys", image: "🎮" },
      { word: "tree", hint: "Big plant with leaves", image: "🌳" },
      { word: "book", hint: "You read this", image: "📚" },
      { word: "jump", hint: "Hop up in the air", image: "🦘" },
      { word: "bird", hint: "Animal that flies", image: "🐦" }
    ]
  },
  level3: {
    name: "Challenge Level",
    description: "Longer words with confusing letters",
    words: [
      { word: "badge", hint: "Award you wear", image: "🏅", confusing: "b, d, g" },
      { word: "puddle", hint: "Water on the ground", image: "💧", confusing: "p, d, double l" },
      { word: "bridge", hint: "Cross over water", image: "🌉", confusing: "b, d, g" },
      { word: "quick", hint: "Very fast", image: "⚡", confusing: "q, u" },
      { word: "purple", hint: "A color", image: "🟣", confusing: "p, u, r" }
    ]
  }
};

const SpellingTest = ({ onBack, progress, updateProgress }) => {
  const [currentLevel, setCurrentLevel] = useState(progress?.level || 1);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completedWords, setCompletedWords] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const levelKey = `level${currentLevel}`;
  const currentLevelData = SPELLING_DATA[levelKey];
  const currentWord = currentLevelData.words[currentWordIndex];
  const totalWords = currentLevelData.words.length;

  // Text-to-speech function
  const speakWord = (text, rate = 0.8) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: '🎉 Perfect! Great job!' });
      setScore(score + 1);
      setCompletedWords([...completedWords, currentWord.word]);
      speakWord('Excellent! You got it right!');
      
      // Check if level is complete
      if (currentWordIndex + 1 >= totalWords) {
        setTimeout(() => {
          handleLevelComplete();
        }, 1500);
      } else {
        setTimeout(() => {
          nextWord();
        }, 1500);
      }
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Not quite. The correct spelling is "${currentWord.word}". Try again!` 
      });
      speakWord(`Not quite. The correct spelling is ${currentWord.word}`);
    }
  };

  const nextWord = () => {
    setCurrentWordIndex(currentWordIndex + 1);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleLevelComplete = () => {
    setShowCelebration(true);
    speakWord('Congratulations! You completed this level!');
    
    // Update progress
    updateProgress({
      level: currentLevel,
      completed: completedWords.length + 1,
      total: totalWords
    });
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setCurrentWordIndex(0);
      setUserAnswer('');
      setFeedback(null);
      setCompletedWords([]);
      setShowCelebration(false);
      
      updateProgress({
        level: currentLevel + 1,
        completed: 0,
        total: SPELLING_DATA[`level${currentLevel + 1}`].words.length
      });
    }
  };

  const skipWord = () => {
    if (currentWordIndex + 1 < totalWords) {
      nextWord();
    }
  };

  if (showCelebration) {
    return (
      <Container className="py-5">
        <Card className="text-center shadow-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <Trophy size={80} className="text-warning mb-3" />
            <h2 className="text-success mb-3">🎉 Level Complete! 🎉</h2>
            <p className="h4 mb-4">You spelled {score} out of {totalWords} words correctly!</p>
            
            <div className="mb-4">
              <h5>Words you mastered:</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {completedWords.map((word, idx) => (
                  <Badge key={idx} bg="success" className="p-2" style={{ fontSize: '1rem' }}>
                    {word}
                  </Badge>
                ))}
              </div>
            </div>

            {currentLevel < 3 ? (
              <Button variant="primary" size="lg" onClick={nextLevel} className="me-2">
                <Star className="me-2" />
                Next Level
              </Button>
            ) : (
              <Alert variant="success" className="mt-3">
                🏆 Congratulations! You've completed all levels!
              </Alert>
            )}
            
            <Button variant="outline-secondary" size="lg" onClick={onBack} className="ms-2">
              Back to Activities
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-3">
        <ArrowLeft size={20} className="me-2" />
        Back
      </Button>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{currentLevelData.name}</h4>
                  <small>{currentLevelData.description}</small>
                </div>
                <Badge bg="light" text="dark" className="p-2">
                  Level {currentLevel} / 3
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Word {currentWordIndex + 1} of {totalWords}</small>
                  <small className="text-muted">Score: {score}/{totalWords}</small>
                </div>
                <ProgressBar 
                  now={((currentWordIndex + 1) / totalWords) * 100} 
                  variant="success"
                  style={{ height: '10px' }}
                />
              </div>

              {/* Word Card */}
              <Card className="mb-4 bg-light border-0">
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: '5rem' }} className="mb-3">
                    {currentWord.image}
                  </div>
                  
                  <Button 
                    variant="info" 
                    size="lg" 
                    onClick={() => speakWord(currentWord.word)}
                    className="mb-3"
                  >
                    <Volume2 size={24} className="me-2" />
                    Listen to the Word
                  </Button>

                  <Alert variant="info" className="mb-0">
                    <strong>Hint:</strong> {currentWord.hint}
                    {currentWord.confusing && (
                      <div className="mt-2">
                        <small>⚠️ Watch out for: {currentWord.confusing}</small>
                      </div>
                    )}
                  </Alert>
                </Card.Body>
              </Card>

              {/* Answer Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="h5">Type the spelling:</Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    autoFocus
                    style={{ fontSize: '1.5rem', textAlign: 'center' }}
                  />
                </Form.Group>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button 
                    variant="success" 
                    type="submit" 
                    size="lg"
                    disabled={!userAnswer.trim()}
                  >
                    <Check size={20} className="me-2" />
                    Check Answer
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={skipWord}
                    disabled={currentWordIndex + 1 >= totalWords}
                  >
                    Skip Word
                  </Button>
                </div>
              </Form>

              {/* Feedback */}
              {feedback && (
                <Alert 
                  variant={feedback.type === 'success' ? 'success' : 'danger'} 
                  className="mt-4 text-center"
                >
                  {feedback.type === 'success' ? <Check size={24} /> : <X size={24} />}
                  <span className="ms-2">{feedback.message}</span>
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Level Info */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="text-info">💡 Tips for this level:</h6>
              <ul className="mb-0 small">
                {currentLevel === 1 && (
                  <>
                    <li>Listen carefully to each sound in the word</li>
                    <li>These are short, simple words - you can do it!</li>
                  </>
                )}
                {currentLevel === 2 && (
                  <>
                    <li>Some words have silent letters - listen carefully!</li>
                    <li>Remember: 'ee' makes a long 'e' sound</li>
                  </>
                )}
                {currentLevel === 3 && (
                  <>
                    <li>Watch out for b/d confusion - use color coding!</li>
                    <li>Double letters (like 'dd') make one sound</li>
                    <li>Take your time with these trickier words</li>
                  </>
                )}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SpellingTest;