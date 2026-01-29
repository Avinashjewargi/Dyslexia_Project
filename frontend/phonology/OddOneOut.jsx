// frontend/phonology/OddOneOut.jsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { ArrowLeft, Sparkles, Check, X, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';

// Emoji mapping for all words
const WORD_EMOJIS = {
  // Animals
  'cat': '🐱', 'dog': '🐕', 'bird': '🐦', 'sheep': '🐑', 'ant': '🐜',
  // Food
  'apple': '🍎', 'banana': '🍌', 'carrot': '🥕', 'orange': '🍊', 'bread': '🍞',
  'milk': '🥛', 'juice': '🧃', 'water': '💧',
  // Objects/Furniture
  'table': '🪑', 'chair': '🪑', 'shoe': '👟', 'book': '📚', 'pen': '🖊️', 
  'pencil': '✏️', 'bike': '🚲', 'house': '🏠',
  // Vehicles
  'car': '🚗', 'bus': '🚌', 'train': '🚆',
  // Colors/Descriptors
  'red': '🔴', 'blue': '🔵', 'green': '🟢', 'big': '📏', 'fast': '⚡',
  'hot': '🔥', 'cold': '❄️', 'warm': '☀️', 'loud': '🔊',
  // Actions
  'run': '🏃', 'jump': '🦘', 'sleep': '😴',
  // Emotions
  'happy': '😊', 'sad': '😢', 'angry': '😠',
  // Sky/Nature
  'sun': '☀️', 'moon': '🌙', 'star': '⭐', 'tree': '🌳',
  // Rhyming words
  'hat': '🎩', 'bat': '🦇', 'fun': '🎉', 'free': '🆓', 'see': '👀',
  'ship': '🚢', 'shop': '🏪', 'chip': '🍟',
  'ball': '⚽', 'call': '📞', 'fall': '🍂',
  'pig': '🐷', 'dig': '⛏️', 'bed': '🛏️',
  'make': '🔨', 'take': '🤝', 'bake': '🍰',
  'night': '🌙', 'light': '💡', 'bright': '✨', 'dark': '🌑',
  'toy': '🧸', 'boy': '👦', 'joy': '😄', 'girl': '👧',
  'far': '🛣️',
  // Letter-based words
  'pan': '🍳', 'pin': '📌', 'hen': '🐔',
  'just': '⚖️', 'join': '🤝',
  'queen': '👸', 'quick': '⚡', 'quiet': '🤫', 'keep': '🔐',
  'mad': '😡', 'bad': '👎',
  'look': '👀', 'took': '🤲',
  'bring': '🎁', 'string': '🧵', 'thing': '📦', 'bean': '🫘',
  'puppy': '🐕', 'funny': '😂', 'party': '🎉',
  'black': '⬛', 'block': '🧱', 'blank': '⬜', 'brown': '🟤',
  'check': '✅', 'chop': '🪓'
};

// Helper function to get emoji for a word
const getWordEmoji = (word) => {
  const lowerWord = word.toLowerCase();
  return WORD_EMOJIS[lowerWord] || '📝';
};

// 30 Odd One Out test cases - NOW WITH RANDOMIZED POSITIONS
const ODD_ONE_OUT_TESTS = [
  // CATEGORY-BASED (1-10)
  {
    id: 1,
    type: "category",
    words: ["cat", "dog", "bird", "table"],
    odd: "table",
    reason: "Table is furniture, others are animals",
    category: "Animals vs Furniture"
  },
  {
    id: 2,
    type: "category",
    words: ["apple", "banana", "carrot", "orange"],
    odd: "carrot",
    reason: "Carrot is a vegetable, others are fruits",
    category: "Fruits vs Vegetables"
  },
  {
    id: 3,
    type: "category",
    words: ["car", "bus", "train", "house"],
    odd: "house",
    reason: "House is a building, others are vehicles",
    category: "Vehicles vs Buildings"
  },
  {
    id: 4,
    type: "category",
    words: ["red", "blue", "green", "big"],
    odd: "big",
    reason: "Big describes size, others are colors",
    category: "Colors vs Size words"
  },
  {
    id: 5,
    type: "category",
    words: ["run", "jump", "sleep", "chair"],
    odd: "chair",
    reason: "Chair is a thing, others are actions",
    category: "Actions vs Objects"
  },
  {
    id: 6,
    type: "category",
    words: ["book", "pen", "pencil", "shoe"],
    odd: "shoe",
    reason: "Shoe is clothing, others are school supplies",
    category: "School supplies vs Clothing"
  },
  {
    id: 7,
    type: "category",
    words: ["hot", "cold", "warm", "fast"],
    odd: "fast",
    reason: "Fast describes speed, others describe temperature",
    category: "Temperature vs Speed"
  },
  {
    id: 8,
    type: "category",
    words: ["sun", "moon", "star", "tree"],
    odd: "tree",
    reason: "Tree is on Earth, others are in the sky",
    category: "Sky objects vs Earth objects"
  },
  {
    id: 9,
    type: "category",
    words: ["happy", "sad", "angry", "loud"],
    odd: "loud",
    reason: "Loud describes sound, others describe feelings",
    category: "Feelings vs Sound"
  },
  {
    id: 10,
    type: "category",
    words: ["milk", "juice", "water", "bread"],
    odd: "bread",
    reason: "Bread is solid food, others are drinks",
    category: "Drinks vs Food"
  },

  // SOUND-BASED (11-20)
  {
    id: 11,
    type: "sound",
    words: ["cat", "hat", "bat", "dog"],
    odd: "dog",
    reason: "Dog doesn't rhyme with -at sound",
    soundPattern: "-at rhyme"
  },
  {
    id: 12,
    type: "sound",
    words: ["run", "fun", "sun", "pen"],
    odd: "pen",
    reason: "Pen has -en sound, others have -un sound",
    soundPattern: "-un rhyme"
  },
  {
    id: 13,
    type: "sound",
    words: ["tree", "free", "see", "car"],
    odd: "car",
    reason: "Car doesn't have the long 'ee' sound",
    soundPattern: "long 'ee' sound"
  },
  {
    id: 14,
    type: "sound",
    words: ["ship", "shop", "sheep", "chip"],
    odd: "sheep",
    reason: "Sheep has 'ee' sound, others have short 'i' or 'o'",
    soundPattern: "short vowel sounds"
  },
  {
    id: 15,
    type: "sound",
    words: ["ball", "call", "fall", "book"],
    odd: "book",
    reason: "Book doesn't rhyme with -all",
    soundPattern: "-all rhyme"
  },
  {
    id: 16,
    type: "sound",
    words: ["big", "pig", "dig", "bed"],
    odd: "bed",
    reason: "Bed has -ed sound, others have -ig sound",
    soundPattern: "-ig rhyme"
  },
  {
    id: 17,
    type: "sound",
    words: ["make", "take", "bake", "milk"],
    odd: "milk",
    reason: "Milk doesn't have the -ake sound",
    soundPattern: "-ake rhyme"
  },
  {
    id: 18,
    type: "sound",
    words: ["night", "light", "bright", "dark"],
    odd: "dark",
    reason: "Dark doesn't have the -ight sound",
    soundPattern: "-ight pattern"
  },
  {
    id: 19,
    type: "sound",
    words: ["toy", "boy", "joy", "girl"],
    odd: "girl",
    reason: "Girl doesn't have the -oy sound",
    soundPattern: "-oy sound"
  },
  {
    id: 20,
    type: "sound",
    words: ["car", "star", "far", "cat"],
    odd: "cat",
    reason: "Cat doesn't have the -ar sound",
    soundPattern: "-ar sound"
  },

  // LETTER-BASED (21-30)
  {
    id: 21,
    type: "letter",
    words: ["bat", "ball", "dog", "book"],
    odd: "dog",
    reason: "Dog starts with 'd', others start with 'b'",
    letterPattern: "starts with 'b'"
  },
  {
    id: 22,
    type: "letter",
    words: ["pen", "pan", "pin", "hen"],
    odd: "hen",
    reason: "Hen starts with 'h', others start with 'p'",
    letterPattern: "starts with 'p'"
  },
  {
    id: 23,
    type: "letter",
    words: ["jump", "just", "fast", "join"],
    odd: "fast",
    reason: "Fast starts with 'f', others start with 'j'",
    letterPattern: "starts with 'j'"
  },
  {
    id: 24,
    type: "letter",
    words: ["queen", "quick", "quiet", "keep"],
    odd: "keep",
    reason: "Keep starts with 'k', others start with 'q'",
    letterPattern: "starts with 'q'"
  },
  {
    id: 25,
    type: "letter",
    words: ["mad", "sad", "bad", "red"],
    odd: "red",
    reason: "Red ends with 'e-d', others end with 'a-d'",
    letterPattern: "ends with 'ad'"
  },
  {
    id: 26,
    type: "letter",
    words: ["book", "look", "took", "bike"],
    odd: "bike",
    reason: "Bike ends with 'ke', others end with 'ook'",
    letterPattern: "ends with 'ook'"
  },
  {
    id: 27,
    type: "letter",
    words: ["bring", "string", "thing", "bean"],
    odd: "bean",
    reason: "Bean doesn't have 'ing', others do",
    letterPattern: "contains 'ing'"
  },
  {
    id: 28,
    type: "letter",
    words: ["happy", "puppy", "funny", "party"],
    odd: "party",
    reason: "Party ends with 'ty', others end with 'py'",
    letterPattern: "ends with 'py'"
  },
  {
    id: 29,
    type: "letter",
    words: ["black", "block", "blank", "brown"],
    odd: "brown",
    reason: "Brown starts with 'br', others start with 'bl'",
    letterPattern: "starts with 'bl'"
  },
  {
    id: 30,
    type: "letter",
    words: ["chair", "check", "chop", "ship"],
    odd: "ship",
    reason: "Ship has 'sh' sound, others have 'ch' sound",
    letterPattern: "starts with 'ch'"
  }
];

const OddOneOut = ({ onBack, updateProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showReason, setShowReason] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const currentTest = ODD_ONE_OUT_TESTS[currentIndex];
  const totalTests = ODD_ONE_OUT_TESTS.length;

  // Shuffle words when question changes
  useEffect(() => {
    const words = [...currentTest.words];
    // Fisher-Yates shuffle algorithm
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    setShuffledWords(words);
  }, [currentIndex]);

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = (word) => {
    if (showReason) return; // Don't allow clicks after answer is shown
    
    setSelectedWord(word);
    
    const isCorrect = word === currentTest.odd;
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: '✅ Perfect! That\'s the odd one out!' });
      setScore(score + 1);
      setShowReason(true);
      speakWord('Excellent! You found it!');
      
      setTimeout(() => {
        if (currentIndex + 1 < totalTests) {
          nextQuestion();
        } else {
          updateProgress({
            completed: currentIndex + 1,
            total: totalTests
          });
        }
      }, 2500);
    } else {
      setAttempts(attempts + 1);
      setFeedback({ type: 'error', message: '❌ Not quite. Try again!' });
      speakWord('Try again');
      
      // Don't auto-advance on wrong answer - let them try again
      setTimeout(() => {
        setFeedback(null);
        setSelectedWord(null);
      }, 1500);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    setSelectedWord(null);
    setFeedback(null);
    setShowReason(false);
    setAttempts(0);
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedWord(null);
      setFeedback(null);
      setShowReason(false);
      setAttempts(0);
    }
  };

  const skipQuestion = () => {
    setShowReason(true);
    setFeedback({ 
      type: 'warning', 
      message: `The answer is "${currentTest.odd}". Moving to next question...` 
    });
    
    setTimeout(() => {
      if (currentIndex + 1 < totalTests) {
        nextQuestion();
      }
    }, 2500);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'category': return 'primary';
      case 'sound': return 'warning';
      case 'letter': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'category': return '📁';
      case 'sound': return '🔊';
      case 'letter': return '🔤';
      default: return '❓';
    }
  };

  if (currentIndex >= totalTests) {
    return (
      <Container className="py-5">
        <Card className="text-center shadow-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <Sparkles size={80} className="text-warning mb-3" />
            <h2 className="text-success mb-3">🎉 Amazing Work! 🎉</h2>
            <p className="h4 mb-4">
              You found {score} out of {totalTests} odd ones out!
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

            <div className="mb-4">
              <Badge bg="primary" className="me-2 p-2">Category: {Math.round((score / 30) * 10)}/10</Badge>
              <Badge bg="warning" className="me-2 p-2">Sound: {Math.round((score / 30) * 10)}/10</Badge>
              <Badge bg="success" className="p-2">Letter: {Math.round((score / 30) * 10)}/10</Badge>
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
            <Card.Header className={`bg-${getTypeColor(currentTest.type)} text-white`}>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <Sparkles size={24} className="me-2" />
                  Find the Odd One Out
                </h4>
                <Badge bg="light" text="dark" className="p-2">
                  {getTypeIcon(currentTest.type)} {currentTest.type.toUpperCase()}
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
                  variant={getTypeColor(currentTest.type)}
                  style={{ height: '10px' }}
                />
              </div>

              {/* Instructions */}
              <Alert variant={getTypeColor(currentTest.type)} className="mb-4">
                <strong>Instructions:</strong> Click on the word that doesn't belong with the others!
                <div className="mt-2">
                  <small>
                    {currentTest.type === 'category' && '📁 Think about what group each word belongs to'}
                    {currentTest.type === 'sound' && '🔊 Listen to how the words sound'}
                    {currentTest.type === 'letter' && '🔤 Look at the letters in each word'}
                  </small>
                </div>
              </Alert>

              {/* Words Grid - NOW SHOWING SHUFFLED WORDS */}
              <Row className="g-3 mb-4">
                {shuffledWords.map((word, index) => {
                  const isSelected = selectedWord === word;
                  const isCorrect = word === currentTest.odd;
                  const showCorrectAnswer = showReason && isCorrect;
                  
                  let cardClass = 'h-100 word-card';
                  let cardStyle = { 
                    cursor: feedback || showReason ? 'default' : 'pointer',
                    transition: 'all 0.3s',
                    border: '3px solid transparent'
                  };
                  
                  if (isSelected && feedback) {
                    if (feedback.type === 'success') {
                      cardStyle.border = '3px solid #28a745';
                      cardStyle.backgroundColor = '#d4edda';
                    } else {
                      cardStyle.border = '3px solid #dc3545';
                      cardStyle.backgroundColor = '#f8d7da';
                    }
                  } else if (showCorrectAnswer) {
                    cardStyle.border = '3px solid #28a745';
                    cardStyle.backgroundColor = '#d4edda';
                  }
                  
                  return (
                    <Col key={index} xs={6}>
                      <Card 
                        className={cardClass}
                        style={cardStyle}
                        onClick={() => !feedback && !showReason && handleWordClick(word)}
                        onMouseEnter={(e) => {
                          if (!feedback && !showReason) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Card.Body className="text-center p-4">
                          <div className="h2 mb-3" style={{ fontSize: '3rem' }}>
                            {getWordEmoji(word)}
                          </div>
                          <h4 className="mb-3" style={{ fontWeight: 'bold', letterSpacing: '0.05em' }}>
                            {word}
                          </h4>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(word);
                            }}
                          >
                            <Volume2 size={16} />
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* Feedback */}
              {feedback && (
                <Alert 
                  variant={feedback.type === 'success' ? 'success' : feedback.type === 'warning' ? 'warning' : 'danger'} 
                  className="text-center mb-3"
                >
                  {feedback.type === 'success' ? <Check size={24} /> : <X size={24} />}
                  <span className="ms-2">{feedback.message}</span>
                </Alert>
              )}

              {/* Reason/Explanation */}
              {showReason && (
                <Alert variant="info" className="mb-3">
                  <strong>💡 Why?</strong> {currentTest.reason}
                  {currentTest.category && <div className="mt-2"><small>Category: {currentTest.category}</small></div>}
                  {currentTest.soundPattern && <div className="mt-2"><small>Sound Pattern: {currentTest.soundPattern}</small></div>}
                  {currentTest.letterPattern && <div className="mt-2"><small>Letter Pattern: {currentTest.letterPattern}</small></div>}
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button 
                  variant="outline-secondary"
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={20} className="me-1" />
                  Previous
                </Button>

                {!feedback && !showReason && (
                  <Button 
                    variant="outline-warning" 
                    onClick={skipQuestion}
                  >
                    Skip & Show Answer
                  </Button>
                )}

                <Button 
                  variant="outline-primary"
                  onClick={nextQuestion}
                  disabled={currentIndex === totalTests - 1 || !showReason}
                >
                  Next
                  <ChevronRight size={20} className="ms-1" />
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Tips Card */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className={`text-${getTypeColor(currentTest.type)}`}>💡 Strategy for this type:</h6>
              <ul className="mb-0 small">
                {currentTest.type === 'category' && (
                  <>
                    <li>Think: What do these words have in common?</li>
                    <li>Ask: Which word belongs to a different group?</li>
                  </>
                )}
                {currentTest.type === 'sound' && (
                  <>
                    <li>Say each word out loud</li>
                    <li>Listen for words that rhyme or sound similar</li>
                    <li>Find the word that sounds different</li>
                  </>
                )}
                {currentTest.type === 'letter' && (
                  <>
                    <li>Look at the first letters of each word</li>
                    <li>Check the last letters too</li>
                    <li>Look for letter patterns in the middle</li>
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

export default OddOneOut;