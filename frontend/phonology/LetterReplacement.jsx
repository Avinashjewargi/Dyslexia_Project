// frontend/phonology/LetterReplacement.jsx

import React, { useState } from 'react';
import { Container, Card, Button, Form, Alert, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { ArrowLeft, Volume2, Check, X, RefreshCw, Lightbulb } from 'lucide-react';

// 15 Letter replacement test cases with emojis
const REPLACEMENT_TESTS = [
  // Easy replacements (1-5)
  { id: 1, original: "cat", remove: "c", add: "b", answer: "bat", difficulty: "easy", hint: "Flying animal", originalEmoji: "🐱", answerEmoji: "🦇" },
  { id: 2, original: "dog", remove: "d", add: "l", answer: "log", difficulty: "easy", hint: "Piece of wood", originalEmoji: "🐕", answerEmoji: "🪵" },
  { id: 3, original: "run", remove: "r", add: "s", answer: "sun", difficulty: "easy", hint: "Bright in sky", originalEmoji: "🏃", answerEmoji: "☀️" },
  { id: 4, original: "pen", remove: "p", add: "t", answer: "ten", difficulty: "easy", hint: "Number after 9", originalEmoji: "🖊️", answerEmoji: "🔟" },
  { id: 5, original: "bad", remove: "b", add: "d", answer: "dad", difficulty: "easy", hint: "Father", originalEmoji: "👎", answerEmoji: "👨" },
  
  // Medium replacements (6-10)
  { id: 6, original: "play", remove: "l", add: "r", answer: "pray", difficulty: "medium", hint: "Talk to God", originalEmoji: "🎮", answerEmoji: "🙏" },
  { id: 7, original: "boat", remove: "b", add: "g", answer: "goat", difficulty: "medium", hint: "Farm animal", originalEmoji: "⛵", answerEmoji: "🐐" },
  { id: 8, original: "park", remove: "p", add: "d", answer: "dark", difficulty: "medium", hint: "No light", originalEmoji: "🏞️", answerEmoji: "🌑" },
  { id: 9, original: "pink", remove: "p", add: "l", answer: "link", difficulty: "medium", hint: "Connection", originalEmoji: "💗", answerEmoji: "🔗" },
  { id: 10, original: "bear", remove: "b", add: "p", answer: "pear", difficulty: "medium", hint: "Green fruit", originalEmoji: "🐻", answerEmoji: "🍐" },
  
  // Challenging replacements (11-15)
  { id: 11, original: "bread", remove: "b", add: "d", answer: "dread", difficulty: "hard", hint: "Fear something", originalEmoji: "🍞", answerEmoji: "😰" },
  { id: 12, original: "pride", remove: "pr", add: "br", answer: "bride", difficulty: "hard", hint: "Woman getting married", originalEmoji: "🦁", answerEmoji: "👰" },
  { id: 13, original: "grape", remove: "g", add: "d", answer: "drape", difficulty: "hard", hint: "Curtain", originalEmoji: "🍇", answerEmoji: "🪟" },
  { id: 14, original: "quest", remove: "qu", add: "b", answer: "best", difficulty: "hard", hint: "Number one", originalEmoji: "🗺️", answerEmoji: "🏆" },
  { id: 15, original: "clown", remove: "cl", add: "br", answer: "brown", difficulty: "hard", hint: "A color", originalEmoji: "🤡", answerEmoji: "🟤" }
];

const LetterReplacement = ({ onBack, updateProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const currentTest = REPLACEMENT_TESTS[currentIndex];
  const totalTests = REPLACEMENT_TESTS.length;

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentTest.answer.toLowerCase();
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: '🎉 Correct! Well done!' });
      setScore(score + 1);
      speakWord('Excellent!');
      
      setTimeout(() => {
        if (currentIndex + 1 < totalTests) {
          nextQuestion();
        } else {
          // Test complete
          updateProgress({
            completed: currentIndex + 1,
            total: totalTests
          });
        }
      }, 1500);
    } else {
      setAttempts(attempts + 1);
      setFeedback({ 
        type: 'error', 
        message: attempts >= 1 
          ? `Not quite. The answer is "${currentTest.answer}". Let's try the next one!`
          : `Try again! Hint: ${currentTest.hint}` 
      });
      
      if (attempts >= 1) {
        setTimeout(() => {
          if (currentIndex + 1 < totalTests) {
            nextQuestion();
          }
        }, 2000);
      }
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
  };

  const skipQuestion = () => {
    if (currentIndex + 1 < totalTests) {
      nextQuestion();
    }
  };

  if (currentIndex >= totalTests) {
    return (
      <Container className="py-5">
        <Card className="text-center shadow-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <RefreshCw size={80} className="text-success mb-3" />
            <h2 className="text-success mb-3">🎊 Test Complete! 🎊</h2>
            <p className="h4 mb-4">
              You got {score} out of {totalTests} correct!
            </p>
            
            <div className="mb-4">
              <div className="h1 text-primary">
                {Math.round((score / totalTests) * 100)}%
              </div>
              <ProgressBar 
                now={(score / totalTests) * 100} 
                variant="success" 
                style={{ height: '20px' }}
              />
            </div>

            <Button variant="primary" size="lg" onClick={() => window.location.reload()} className="me-2">
              Try Again
            </Button>
            
            <Button variant="outline-secondary" size="lg" onClick={onBack}>
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
            <Card.Header className="bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <RefreshCw size={24} className="me-2" />
                  Letter Replacement Challenge
                </h4>
                <Badge bg="light" text="dark" className="p-2">
                  {currentTest.difficulty.toUpperCase()}
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Progress */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Question {currentIndex + 1} of {totalTests}</small>
                  <small className="text-muted">Score: {score}/{totalTests}</small>
                </div>
                <ProgressBar 
                  now={((currentIndex + 1) / totalTests) * 100} 
                  variant="success"
                  style={{ height: '10px' }}
                />
              </div>

              {/* Instructions */}
              <Alert variant="info" className="mb-4">
                <strong>Instructions:</strong> Replace the letter(s) in the word to make a new word!
              </Alert>

              {/* Question Card */}
              <Card className="mb-4 border-success">
                <Card.Body className="text-center p-4">
                  <h3 className="mb-4">Original Word:</h3>
                  
                  {/* Display original word emoji */}
                  <div className="mb-3" style={{ fontSize: '4rem' }}>
                    {currentTest.originalEmoji}
                  </div>
                  
                  <div 
                    className="mb-4 p-3 bg-light rounded"
                    style={{ fontSize: '3rem', fontWeight: 'bold', letterSpacing: '0.2em' }}
                  >
                    {currentTest.original}
                  </div>

                  <Button 
                    variant="outline-info" 
                    onClick={() => speakWord(currentTest.original)}
                    className="mb-4"
                  >
                    <Volume2 size={20} className="me-2" />
                    Hear the word
                  </Button>

                  <Card className="bg-warning bg-opacity-10 border-warning">
                    <Card.Body>
                      <h5 className="text-warning mb-3">
                        <RefreshCw size={20} className="me-2" />
                        Make the Change:
                      </h5>
                      <div className="h4">
                        Remove: <Badge bg="danger" className="mx-2 p-2">{currentTest.remove}</Badge>
                        Add: <Badge bg="success" className="mx-2 p-2">{currentTest.add}</Badge>
                      </div>
                      <p className="mt-3 mb-0 text-muted">
                        What new word do you get?
                      </p>
                      
                      {/* Show answer emoji as visual hint after wrong attempts */}
                      {feedback && feedback.type === 'error' && attempts >= 1 && (
                        <div className="mt-3">
                          <p className="text-success mb-2"><strong>The answer is:</strong></p>
                          <div style={{ fontSize: '3rem' }}>
                            {currentTest.answerEmoji}
                          </div>
                          <p className="text-muted mt-2">{currentTest.answer}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>

                  {showHint && (
                    <Alert variant="warning" className="mt-3">
                      <Lightbulb size={20} className="me-2" />
                      <strong>Hint:</strong> {currentTest.hint}
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* Answer Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="h5">Your Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the new word here..."
                    autoFocus
                    style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.1em' }}
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
                  
                  {!showHint && (
                    <Button 
                      variant="outline-warning" 
                      onClick={() => setShowHint(true)}
                    >
                      <Lightbulb size={20} className="me-2" />
                      Show Hint
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={skipQuestion}
                  >
                    Skip
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

          {/* Tips Card */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="text-success">💡 Strategy Tips:</h6>
              <ul className="mb-0 small">
                <li>Look at the emoji to understand what the word means</li>
                <li>Say the original word out loud</li>
                <li>Remove the letter(s) mentioned</li>
                <li>Add the new letter(s) in the same place</li>
                <li>Say the new word - does it make sense?</li>
                <li>If you get stuck, the emoji hint will appear!</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LetterReplacement;