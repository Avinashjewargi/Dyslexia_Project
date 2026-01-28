// frontend/phonology/OddOneOut.jsx
// ENHANCED VERSION WITH ADVANCED FEATURES

import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Row, Col, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import { ArrowLeft, Sparkles, Check, X, Volume2, Play, Pause, SkipForward, ChevronLeft, ChevronRight, 
         Eye, EyeOff, Clock, Trophy, HelpCircle, RotateCcw, BookOpen } from 'lucide-react';

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
  'hat': '🎩', 'bat': '🦇', 'fun': '🎉', 'pen': '🖊️',
  'free': '🆓', 'see': '👀', 'ship': '🚢', 'shop': '🏪', 'chip': '🍟',
  'call': '📞', 'fall': '🍂', 'pig': '🐷', 'dig': '⛏️', 'bed': '🛏️',
  'make': '🔨', 'take': '🤝', 'bake': '🍰', 'night': '🌙', 'light': '💡', 
  'bright': '✨', 'dark': '🌑', 'toy': '🧸', 'boy': '👦', 'joy': '😄', 
  'girl': '👧', 'star': '⭐', 'far': '🛣️',
  // Letter-based words
  'ball': '⚽', 'pan': '🍳', 'pin': '📌', 'hen': '🐔',
  'just': '⚖️', 'join': '🤝', 'queen': '👸', 'quick': '⚡', 'quiet': '🤫', 
  'keep': '🔐', 'mad': '😡', 'bad': '👎', 'look': '👀', 'took': '🤲',
  'bring': '🎁', 'string': '🧵', 'thing': '📦', 'bean': '🫘',
  'puppy': '🐕', 'funny': '😂', 'party': '🎉', 'black': '⬛', 'block': '🧱', 
  'blank': '⬜', 'brown': '🟤', 'check': '✅', 'chop': '🪓'
};

// Helper function to get emoji for a word
const getWordEmoji = (word) => {
  const lowerWord = word.toLowerCase();
  return WORD_EMOJIS[lowerWord] || '📝';
};

// 30 Odd One Out test cases
const ODD_ONE_OUT_TESTS = [
  // CATEGORY-BASED (1-10)
  {
    id: 1,
    type: "category",
    words: ["cat", "dog", "bird", "table"],
    odd: "table",
    reason: "Table is furniture, others are animals",
    category: "Animals vs Furniture",
    hint: "Three of these are living things that move around",
    difficulty: "easy"
  },
  {
    id: 2,
    type: "category",
    words: ["apple", "banana", "carrot", "orange"],
    odd: "carrot",
    reason: "Carrot is a vegetable, others are fruits",
    category: "Fruits vs Vegetables",
    hint: "Think about which one grows underground",
    difficulty: "easy"
  },
  {
    id: 3,
    type: "category",
    words: ["car", "bus", "train", "house"],
    odd: "house",
    reason: "House is a building, others are vehicles",
    category: "Vehicles vs Buildings",
    hint: "Three of these can take you places",
    difficulty: "easy"
  },
  {
    id: 4,
    type: "category",
    words: ["red", "blue", "green", "big"],
    odd: "big",
    reason: "Big describes size, others are colors",
    category: "Colors vs Size words",
    hint: "Three of these describe what something looks like",
    difficulty: "medium"
  },
  {
    id: 5,
    type: "category",
    words: ["run", "jump", "sleep", "chair"],
    odd: "chair",
    reason: "Chair is a thing, others are actions",
    category: "Actions vs Objects",
    hint: "Three of these are things you DO",
    difficulty: "easy"
  },
  {
    id: 6,
    type: "category",
    words: ["book", "pen", "pencil", "shoe"],
    odd: "shoe",
    reason: "Shoe is clothing, others are school supplies",
    category: "School supplies vs Clothing",
    hint: "Three of these you use for learning",
    difficulty: "easy"
  },
  {
    id: 7,
    type: "category",
    words: ["hot", "cold", "warm", "fast"],
    odd: "fast",
    reason: "Fast describes speed, others describe temperature",
    category: "Temperature vs Speed",
    hint: "Three of these tell you if something is hot or cold",
    difficulty: "medium"
  },
  {
    id: 8,
    type: "category",
    words: ["sun", "moon", "star", "tree"],
    odd: "tree",
    reason: "Tree is on Earth, others are in the sky",
    category: "Sky objects vs Earth objects",
    hint: "Three of these are up in space",
    difficulty: "easy"
  },
  {
    id: 9,
    type: "category",
    words: ["happy", "sad", "angry", "loud"],
    odd: "loud",
    reason: "Loud describes sound, others describe feelings",
    category: "Feelings vs Sound",
    hint: "Three of these are emotions you feel inside",
    difficulty: "medium"
  },
  {
    id: 10,
    type: "category",
    words: ["milk", "juice", "water", "bread"],
    odd: "bread",
    reason: "Bread is solid food, others are drinks",
    category: "Drinks vs Food",
    hint: "Three of these you can pour into a glass",
    difficulty: "easy"
  },

  // SOUND-BASED (11-20)
  {
    id: 11,
    type: "sound",
    words: ["cat", "hat", "bat", "dog"],
    odd: "dog",
    reason: "Dog doesn't rhyme with -at sound",
    soundPattern: "-at rhyme",
    hint: "Say them out loud - three end with the same sound",
    difficulty: "easy"
  },
  {
    id: 12,
    type: "sound",
    words: ["run", "fun", "sun", "pen"],
    odd: "pen",
    reason: "Pen has -en sound, others have -un sound",
    soundPattern: "-un rhyme",
    hint: "Three of these rhyme with 'bun'",
    difficulty: "easy"
  },
  {
    id: 13,
    type: "sound",
    words: ["tree", "free", "see", "car"],
    odd: "car",
    reason: "Car doesn't have the long 'ee' sound",
    soundPattern: "long 'ee' sound",
    hint: "Three have the 'eee' sound at the end",
    difficulty: "medium"
  },
  {
    id: 14,
    type: "sound",
    words: ["ship", "shop", "sheep", "chip"],
    odd: "sheep",
    reason: "Sheep has 'ee' sound, others have short 'i' or 'o'",
    soundPattern: "short vowel sounds",
    hint: "One has a longer vowel sound than the others",
    difficulty: "hard"
  },
  {
    id: 15,
    type: "sound",
    words: ["ball", "call", "fall", "book"],
    odd: "book",
    reason: "Book doesn't rhyme with -all",
    soundPattern: "-all rhyme",
    hint: "Three rhyme with 'wall'",
    difficulty: "easy"
  },
  {
    id: 16,
    type: "sound",
    words: ["big", "pig", "dig", "bed"],
    odd: "bed",
    reason: "Bed has -ed sound, others have -ig sound",
    soundPattern: "-ig rhyme",
    hint: "Three rhyme with 'wig'",
    difficulty: "easy"
  },
  {
    id: 17,
    type: "sound",
    words: ["make", "take", "bake", "milk"],
    odd: "milk",
    reason: "Milk doesn't have the -ake sound",
    soundPattern: "-ake rhyme",
    hint: "Three rhyme with 'cake'",
    difficulty: "medium"
  },
  {
    id: 18,
    type: "sound",
    words: ["night", "light", "bright", "dark"],
    odd: "dark",
    reason: "Dark doesn't have the -ight sound",
    soundPattern: "-ight pattern",
    hint: "Three have 'ight' at the end",
    difficulty: "medium"
  },
  {
    id: 19,
    type: "sound",
    words: ["toy", "boy", "joy", "girl"],
    odd: "girl",
    reason: "Girl doesn't have the -oy sound",
    soundPattern: "-oy sound",
    hint: "Three rhyme with 'Roy'",
    difficulty: "medium"
  },
  {
    id: 20,
    type: "sound",
    words: ["car", "star", "far", "cat"],
    odd: "cat",
    reason: "Cat doesn't have the -ar sound",
    soundPattern: "-ar sound",
    hint: "Three have 'ar' sound",
    difficulty: "medium"
  },

  // LETTER-BASED (21-30)
  {
    id: 21,
    type: "letter",
    words: ["bat", "ball", "dog", "book"],
    odd: "dog",
    reason: "Dog starts with 'd', others start with 'b'",
    letterPattern: "starts with 'b'",
    hint: "Look at the first letter",
    difficulty: "easy"
  },
  {
    id: 22,
    type: "letter",
    words: ["pen", "pan", "pin", "hen"],
    odd: "hen",
    reason: "Hen starts with 'h', others start with 'p'",
    letterPattern: "starts with 'p'",
    hint: "Check which letter comes first",
    difficulty: "easy"
  },
  {
    id: 23,
    type: "letter",
    words: ["jump", "just", "fast", "join"],
    odd: "fast",
    reason: "Fast starts with 'f', others start with 'j'",
    letterPattern: "starts with 'j'",
    hint: "Three begin with the same letter",
    difficulty: "easy"
  },
  {
    id: 24,
    type: "letter",
    words: ["queen", "quick", "quiet", "keep"],
    odd: "keep",
    reason: "Keep starts with 'k', others start with 'q'",
    letterPattern: "starts with 'q'",
    hint: "Three start with an unusual letter",
    difficulty: "medium"
  },
  {
    id: 25,
    type: "letter",
    words: ["mad", "sad", "bad", "red"],
    odd: "red",
    reason: "Red ends with 'e-d', others end with 'a-d'",
    letterPattern: "ends with 'ad'",
    hint: "Look at the last two letters",
    difficulty: "medium"
  },
  {
    id: 26,
    type: "letter",
    words: ["book", "look", "took", "bike"],
    odd: "bike",
    reason: "Bike ends with 'ke', others end with 'ook'",
    letterPattern: "ends with 'ook'",
    hint: "Three end with the same letters",
    difficulty: "medium"
  },
  {
    id: 27,
    type: "letter",
    words: ["bring", "string", "thing", "bean"],
    odd: "bean",
    reason: "Bean doesn't have 'ing', others do",
    letterPattern: "contains 'ing'",
    hint: "Three contain 'ing' in them",
    difficulty: "hard"
  },
  {
    id: 28,
    type: "letter",
    words: ["happy", "puppy", "funny", "party"],
    odd: "party",
    reason: "Party ends with 'ty', others end with 'py'",
    letterPattern: "ends with 'py'",
    hint: "Look carefully at the last two letters",
    difficulty: "hard"
  },
  {
    id: 29,
    type: "letter",
    words: ["black", "block", "blank", "brown"],
    odd: "brown",
    reason: "Brown starts with 'br', others start with 'bl'",
    letterPattern: "starts with 'bl'",
    hint: "Check the first two letters",
    difficulty: "medium"
  },
  {
    id: 30,
    type: "letter",
    words: ["chair", "check", "chop", "ship"],
    odd: "ship",
    reason: "Ship has 'sh' sound, others have 'ch' sound",
    letterPattern: "starts with 'ch'",
    hint: "Three start with 'ch'",
    difficulty: "medium"
  }
];

const OddOneOut = ({ onBack, updateProgress }) => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, completed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [showReason, setShowReason] = useState(false);
  const [attempts, setAttempts] = useState(Array(ODD_ONE_OUT_TESTS.length).fill(0));
  const [correctAnswers, setCorrectAnswers] = useState(Array(ODD_ONE_OUT_TESTS.length).fill(false));
  const [timePerQuestion, setTimePerQuestion] = useState(Array(ODD_ONE_OUT_TESTS.length).fill(0));
  const [timer, setTimer] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [usedHints, setUsedHints] = useState(Array(ODD_ONE_OUT_TESTS.length).fill(false));
  const [showStats, setShowStats] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);

  const timerRef = useRef(null);

  const currentTest = ODD_ONE_OUT_TESTS[currentIndex];
  const totalTests = ODD_ONE_OUT_TESTS.length;

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState]);

  // Enhanced Text-to-Speech
  const speakWord = (text, options = {}) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.75;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Google') || voice.name.includes('Natural'))
      ) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Read all words aloud
  const readAllWords = () => {
    const allWords = currentTest.words.join(', ');
    speakWord(`The words are: ${allWords}. Find the odd one out.`, { rate: 0.7 });
  };

  // Start game
  const startGame = () => {
    setGameState('playing');
    setTimer(0);
    speakWord('Let\'s begin! Find the odd one out.', { rate: 0.8 });
  };

  // Pause/Resume game
  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      speakWord('Game paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
      speakWord('Game resumed');
    }
  };

  // Handle word selection
  const handleWordClick = (word) => {
    if (gameState !== 'playing' || feedback) return;

    setSelectedWord(word);
    
    const isCorrect = word === currentTest.odd;
    const newAttempts = [...attempts];
    newAttempts[currentIndex] += 1;
    setAttempts(newAttempts);
    
    if (isCorrect) {
      const newCorrectAnswers = [...correctAnswers];
      newCorrectAnswers[currentIndex] = true;
      setCorrectAnswers(newCorrectAnswers);

      const newTimePerQuestion = [...timePerQuestion];
      newTimePerQuestion[currentIndex] = timer;
      setTimePerQuestion(newTimePerQuestion);

      setFeedback({ type: 'success', message: '🎉 Perfect! That\'s the odd one out!' });
      setScore(score + 1);
      speakWord('Excellent! You found it!', { rate: 0.8 });
      
      // Add to history
      setAnswerHistory([...answerHistory, {
        questionId: currentTest.id,
        correct: true,
        attempts: newAttempts[currentIndex],
        timeSpent: timer,
        usedHint: usedHints[currentIndex]
      }]);

      setShowReason(true);

      setTimeout(() => {
        if (currentIndex + 1 < totalTests) {
          nextQuestion();
        } else {
          setGameState('completed');
          updateProgress({
            completed: currentIndex + 1,
            total: totalTests,
            score: score + 1
          });
        }
      }, 3000);
    } else {
      setFeedback({ type: 'error', message: '❌ Not quite. Try again!' });
      speakWord('Try again', { rate: 0.8 });

      // Add to history
      setAnswerHistory([...answerHistory, {
        questionId: currentTest.id,
        correct: false,
        attempts: newAttempts[currentIndex]
      }]);

      setTimeout(() => {
        setFeedback(null);
        setSelectedWord(null);
      }, 1500);
    }
  };

  // Navigation functions
  const nextQuestion = () => {
    if (currentIndex + 1 < totalTests) {
      setCurrentIndex(currentIndex + 1);
      setSelectedWord(null);
      setFeedback(null);
      setShowReason(false);
      setShowHint(false);
      setTimer(0);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedWord(null);
      setFeedback(null);
      setShowReason(false);
      setShowHint(false);
      setTimer(0);
    }
  };

  const skipQuestion = () => {
    setShowReason(true);
    speakWord(`The answer is ${currentTest.odd}. ${currentTest.reason}`, { rate: 0.7 });
    
    const newTimePerQuestion = [...timePerQuestion];
    newTimePerQuestion[currentIndex] = timer;
    setTimePerQuestion(newTimePerQuestion);

    setTimeout(() => {
      if (currentIndex + 1 < totalTests) {
        nextQuestion();
      }
    }, 3000);
  };

  const showAnswer = () => {
    setShowReason(true);
    speakWord(`The odd one out is ${currentTest.odd}. ${currentTest.reason}`, { rate: 0.7 });
  };

  const showHintHandler = () => {
    setShowHint(true);
    const newUsedHints = [...usedHints];
    newUsedHints[currentIndex] = true;
    setUsedHints(newUsedHints);
    speakWord(currentTest.hint, { rate: 0.7 });
  };

  const toggleBookmark = () => {
    if (bookmarkedQuestions.includes(currentIndex)) {
      setBookmarkedQuestions(bookmarkedQuestions.filter(i => i !== currentIndex));
    } else {
      setBookmarkedQuestions([...bookmarkedQuestions, currentIndex]);
    }
  };

  const restartGame = () => {
    setGameState('ready');
    setCurrentIndex(0);
    setSelectedWord(null);
    setFeedback(null);
    setScore(0);
    setShowReason(false);
    setAttempts(Array(ODD_ONE_OUT_TESTS.length).fill(0));
    setCorrectAnswers(Array(ODD_ONE_OUT_TESTS.length).fill(false));
    setTimePerQuestion(Array(ODD_ONE_OUT_TESTS.length).fill(0));
    setTimer(0);
    setShowHint(false);
    setUsedHints(Array(ODD_ONE_OUT_TESTS.length).fill(false));
    setAnswerHistory([]);
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    setSelectedWord(null);
    setFeedback(null);
    setShowReason(false);
    setShowHint(false);
    setTimer(0);
    setGameState('playing');
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

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalAttempts = attempts.reduce((a, b) => a + b, 0);
    const correctCount = correctAnswers.filter(Boolean).length;
    const totalTime = timePerQuestion.reduce((a, b) => a + b, 0);
    const avgTime = correctCount > 0 ? Math.round(totalTime / correctCount) : 0;
    const hintsUsed = usedHints.filter(Boolean).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    return {
      totalAttempts,
      correctCount,
      totalTime,
      avgTime,
      hintsUsed,
      accuracy,
      score,
      percentage: Math.round((score / totalTests) * 100)
    };
  };

  // Ready screen
  if (gameState === 'ready') {
    return (
      <Container className="py-5">
        <Card className="shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card.Header className="bg-primary text-white text-center py-4">
            <Sparkles size={60} className="mb-3" />
            <h1>Find the Odd One Out</h1>
            <p className="mb-0">Test your phonological awareness skills!</p>
          </Card.Header>

          <Card.Body className="p-5">
            <Row className="mb-4">
              <Col md={4} className="text-center mb-3">
                <div className="display-4 text-primary">30</div>
                <div className="text-muted">Questions</div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="display-4 text-warning">3</div>
                <div className="text-muted">Types</div>
              </Col>
              <Col md={4} className="text-center mb-3">
                <div className="display-4 text-success">∞</div>
                <div className="text-muted">No Time Limit</div>
              </Col>
            </Row>

            <Alert variant="info" className="mb-4">
              <h5><BookOpen size={20} className="me-2" />What You'll Practice:</h5>
              <Row>
                <Col md={4}>
                  <Badge bg="primary" className="w-100 p-2 mb-2">📁 Category</Badge>
                  <small className="d-block">Group items by type</small>
                </Col>
                <Col md={4}>
                  <Badge bg="warning" className="w-100 p-2 mb-2">🔊 Sound</Badge>
                  <small className="d-block">Listen for rhymes</small>
                </Col>
                <Col md={4}>
                  <Badge bg="success" className="w-100 p-2 mb-2">🔤 Letter</Badge>
                  <small className="d-block">Spot letter patterns</small>
                </Col>
              </Row>
            </Alert>

            <div className="d-grid gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={startGame}
                style={{ fontSize: '1.3rem', padding: '1rem' }}
              >
                <Play size={24} className="me-2" />
                Start Game
              </Button>

              <Button 
                variant="outline-secondary" 
                size="lg" 
                onClick={onBack}
              >
                <ArrowLeft size={20} className="me-2" />
                Back to Activities
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Completed screen
  if (gameState === 'completed') {
    const stats = calculateStats();

    return (
      <Container className="py-5">
        <Card className="text-center shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card.Body className="p-5">
            <Trophy size={100} className="text-warning mb-4" />
            <h1 className="text-success mb-4">🎉 Congratulations! 🎉</h1>
            
            <div className="mb-4">
              <div className="display-3 text-primary mb-2">
                {stats.percentage}%
              </div>
              <p className="h4 text-muted">
                {score} out of {totalTests} correct
              </p>
              <ProgressBar 
                now={stats.percentage} 
                variant={stats.percentage >= 80 ? "success" : stats.percentage >= 60 ? "warning" : "danger"}
                style={{ height: '25px' }}
                className="mb-3"
              />
            </div>

            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="bg-light h-100">
                  <Card.Body>
                    <Clock size={30} className="text-primary mb-2" />
                    <div className="h5">{formatTime(stats.totalTime)}</div>
                    <small className="text-muted">Total Time</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-light h-100">
                  <Card.Body>
                    <Clock size={30} className="text-success mb-2" />
                    <div className="h5">{stats.avgTime}s</div>
                    <small className="text-muted">Avg Time</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-light h-100">
                  <Card.Body>
                    <HelpCircle size={30} className="text-warning mb-2" />
                    <div className="h5">{stats.hintsUsed}</div>
                    <small className="text-muted">Hints Used</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="bg-light h-100">
                  <Card.Body>
                    <Check size={30} className="text-info mb-2" />
                    <div className="h5">{stats.accuracy}%</div>
                    <small className="text-muted">Accuracy</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Alert variant={stats.percentage >= 80 ? "success" : stats.percentage >= 60 ? "info" : "warning"}>
              <strong>Performance:</strong>{' '}
              {stats.percentage >= 90 && "Outstanding! You're a phonology expert! 🌟"}
              {stats.percentage >= 80 && stats.percentage < 90 && "Excellent work! Keep it up! 🎯"}
              {stats.percentage >= 60 && stats.percentage < 80 && "Good job! Practice makes perfect! 💪"}
              {stats.percentage < 60 && "Keep practicing! You're learning! 📚"}
            </Alert>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={restartGame}
              >
                <RotateCcw size={20} className="me-2" />
                Try Again
              </Button>

              <Button 
                variant="info" 
                size="lg" 
                onClick={() => {
                  setReviewMode(true);
                  setGameState('playing');
                  setCurrentIndex(0);
                }}
              >
                <BookOpen size={20} className="me-2" />
                Review Answers
              </Button>

              <Button 
                variant="outline-secondary" 
                size="lg" 
                onClick={onBack}
              >
                <ArrowLeft size={20} className="me-2" />
                Back to Activities
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Main game screen
  return (
    <Container className="py-4">
      {/* Top Navigation */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" onClick={onBack}>
          <ArrowLeft size={20} className="me-2" />
          Back
        </Button>

        <div className="d-flex gap-2">
          <Button 
            variant={gameState === 'paused' ? 'success' : 'warning'} 
            onClick={togglePause}
          >
            {gameState === 'paused' ? <Play size={20} /> : <Pause size={20} />}
          </Button>

          <Button 
            variant="outline-info" 
            onClick={() => setShowStats(true)}
          >
            <Trophy size={20} />
          </Button>

          <Button 
            variant="outline-danger" 
            onClick={restartGame}
          >
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className={`bg-${getTypeColor(currentTest.type)} text-white`}>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h4 className="mb-1">
                    <Sparkles size={24} className="me-2" />
                    Find the Odd One Out
                  </h4>
                  <Badge bg="light" text="dark" className="me-2">
                    {getTypeIcon(currentTest.type)} {currentTest.type.toUpperCase()}
                  </Badge>
                  <Badge bg={getDifficultyColor(currentTest.difficulty)}>
                    {currentTest.difficulty}
                  </Badge>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <Clock size={20} />
                  <span className="h5 mb-0">{formatTime(timer)}</span>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Progress */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">Question {currentIndex + 1} of {totalTests}</small>
                  <small className="text-muted">Score: {score}/{totalTests}</small>
                </div>
                <ProgressBar style={{ height: '12px' }}>
                  <ProgressBar 
                    variant="success" 
                    now={(score / totalTests) * 100} 
                    key={1}
                  />
                  <ProgressBar 
                    variant="info" 
                    now={((currentIndex + 1 - score) / totalTests) * 100} 
                    key={2}
                  />
                </ProgressBar>
              </div>

              {/* Pause overlay */}
              {gameState === 'paused' && (
                <Alert variant="warning" className="text-center mb-4">
                  <Pause size={40} className="mb-2" />
                  <h5>Game Paused</h5>
                  <Button variant="success" onClick={togglePause}>
                    <Play size={20} className="me-2" />
                    Resume
                  </Button>
                </Alert>
              )}

              {gameState === 'playing' && (
                <>
                  {/* Instructions */}
                  <Alert variant={getTypeColor(currentTest.type)} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <strong>Instructions:</strong> Click on the word that doesn't belong!
                        <div className="mt-2">
                          <small>
                            {currentTest.type === 'category' && '📁 Think about what group each word belongs to'}
                            {currentTest.type === 'sound' && '🔊 Listen to how the words sound'}
                            {currentTest.type === 'letter' && '🔤 Look at the letters in each word'}
                          </small>
                        </div>
                      </div>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={readAllWords}
                      >
                        <Volume2 size={16} className="me-1" />
                        Read All
                      </Button>
                    </div>
                  </Alert>

                  {/* Hint */}
                  {showHint && (
                    <Alert variant="info" className="mb-3">
                      <HelpCircle size={20} className="me-2" />
                      <strong>Hint:</strong> {currentTest.hint}
                    </Alert>
                  )}

                  {/* Words Grid */}
                  <Row className="g-3 mb-4">
                    {currentTest.words.map((word, index) => {
                      const isSelected = selectedWord === word;
                      const isCorrect = word === currentTest.odd;
                      const showCorrectAnswer = showReason && isCorrect;
                      
                      let cardStyle = { 
                        cursor: feedback ? 'default' : 'pointer',
                        transition: 'all 0.3s',
                        border: '3px solid transparent',
                        height: '100%'
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
                            style={cardStyle}
                            onClick={() => handleWordClick(word)}
                            onMouseEnter={(e) => {
                              if (!feedback) e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <Card.Body className="text-center p-4">
                              <div className="mb-3" style={{ fontSize: '4rem' }}>
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
                      variant={feedback.type === 'success' ? 'success' : 'danger'} 
                      className="text-center mb-3"
                    >
                      <div className="h5">
                        {feedback.type === 'success' ? <Check size={30} /> : <X size={30} />}
                        <div className="mt-2">{feedback.message}</div>
                      </div>
                    </Alert>
                  )}

                  {/* Reason/Explanation */}
                  {showReason && (
                    <Alert variant="info" className="mb-3">
                      <strong>💡 Explanation:</strong> {currentTest.reason}
                      {currentTest.category && <div className="mt-2"><small>Category: {currentTest.category}</small></div>}
                      {currentTest.soundPattern && <div className="mt-2"><small>Sound Pattern: {currentTest.soundPattern}</small></div>}
                      {currentTest.letterPattern && <div className="mt-2"><small>Letter Pattern: {currentTest.letterPattern}</small></div>}
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Row className="g-2 mb-3">
                    <Col xs={6} md={3}>
                      <Button 
                        variant="outline-info" 
                        className="w-100"
                        onClick={showHintHandler}
                        disabled={showHint || usedHints[currentIndex]}
                      >
                        <HelpCircle size={18} className="me-1" />
                        Hint
                      </Button>
                    </Col>
                    <Col xs={6} md={3}>
                      <Button 
                        variant="outline-warning" 
                        className="w-100"
                        onClick={showAnswer}
                        disabled={feedback?.type === 'success'}
                      >
                        <Eye size={18} className="me-1" />
                        Show Answer
                      </Button>
                    </Col>
                    <Col xs={6} md={3}>
                      <Button 
                        variant="outline-secondary" 
                        className="w-100"
                        onClick={skipQuestion}
                        disabled={feedback?.type === 'success'}
                      >
                        <SkipForward size={18} className="me-1" />
                        Skip
                      </Button>
                    </Col>
                    <Col xs={6} md={3}>
                      <Button 
                        variant="outline-primary" 
                        className="w-100"
                        onClick={toggleBookmark}
                      >
                        {bookmarkedQuestions.includes(currentIndex) ? '★' : '☆'}
                      </Button>
                    </Col>
                  </Row>

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={previousQuestion}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft size={20} className="me-1" />
                      Previous
                    </Button>

                    <div className="text-center">
                      <small className="text-muted">
                        Attempts: {attempts[currentIndex]}
                      </small>
                    </div>

                    <Button 
                      variant="secondary" 
                      onClick={nextQuestion}
                      disabled={currentIndex === totalTests - 1}
                    >
                      Next
                      <ChevronRight size={20} className="ms-1" />
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Tips Card */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className={`text-${getTypeColor(currentTest.type)}`}>
                💡 Strategy for {currentTest.type} questions:
              </h6>
              <ul className="mb-0 small">
                {currentTest.type === 'category' && (
                  <>
                    <li>Think: What do these words have in common?</li>
                    <li>Ask: Which word belongs to a different group?</li>
                    <li>Look for patterns in meaning</li>
                  </>
                )}
                {currentTest.type === 'sound' && (
                  <>
                    <li>Say each word out loud slowly</li>
                    <li>Listen for words that rhyme or sound similar</li>
                    <li>Find the word that sounds different</li>
                    <li>Pay attention to ending sounds</li>
                  </>
                )}
                {currentTest.type === 'letter' && (
                  <>
                    <li>Look at the first letters of each word</li>
                    <li>Check the last letters too</li>
                    <li>Look for letter patterns in the middle</li>
                    <li>Count the letters if needed</li>
                  </>
                )}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Modal */}
      <Modal show={showStats} onHide={() => setShowStats(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Trophy size={24} className="me-2" />
            Game Statistics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
            const stats = calculateStats();
            return (
              <>
                <Row className="mb-4">
                  <Col md={6} className="mb-3">
                    <Card className="bg-primary text-white">
                      <Card.Body className="text-center">
                        <h2>{stats.score}/{totalTests}</h2>
                        <small>Questions Correct</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Card className="bg-success text-white">
                      <Card.Body className="text-center">
                        <h2>{stats.percentage}%</h2>
                        <small>Accuracy Rate</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <small className="text-muted">Total Time:</small>
                    <div className="h5">{formatTime(stats.totalTime)}</div>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted">Avg Time per Q:</small>
                    <div className="h5">{stats.avgTime}s</div>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted">Hints Used:</small>
                    <div className="h5">{stats.hintsUsed}</div>
                  </Col>
                </Row>

                <h6 className="mb-3">Progress by Type:</h6>
                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <small>📁 Category</small>
                    <small>{correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'category' && c).length}/10</small>
                  </div>
                  <ProgressBar 
                    now={(correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'category' && c).length / 10) * 100} 
                    variant="primary"
                  />
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <small>🔊 Sound</small>
                    <small>{correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'sound' && c).length}/10</small>
                  </div>
                  <ProgressBar 
                    now={(correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'sound' && c).length / 10) * 100} 
                    variant="warning"
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <small>🔤 Letter</small>
                    <small>{correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'letter' && c).length}/10</small>
                  </div>
                  <ProgressBar 
                    now={(correctAnswers.filter((c, i) => ODD_ONE_OUT_TESTS[i].type === 'letter' && c).length / 10) * 100} 
                    variant="success"
                  />
                </div>

                {bookmarkedQuestions.length > 0 && (
                  <Alert variant="info">
                    <strong>Bookmarked Questions:</strong> {bookmarkedQuestions.length}
                    <div className="mt-2">
                      {bookmarkedQuestions.map(i => (
                        <Badge 
                          key={i} 
                          bg="secondary" 
                          className="me-1 cursor-pointer"
                          onClick={() => {
                            goToQuestion(i);
                            setShowStats(false);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          Q{i + 1}
                        </Badge>
                      ))}
                    </div>
                  </Alert>
                )}
              </>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStats(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OddOneOut;
