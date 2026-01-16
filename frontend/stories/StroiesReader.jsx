// frontend/stories/StoriesReader.jsx

import React, { useState } from 'react';
import { Container, Card, Button, Row, Col, Badge, Alert } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, BookOpen, Volume2, Star, AlertCircle } from 'lucide-react';

// 10 Default Stories
const DEFAULT_STORIES = [
  {
    id: 1,
    title: "The Thirsty Crow",
    moral: "Think smart to solve problems",
    text: "A crow was thirsty. It put stones in a pot. The water came up.",
    difficulty: "easy",
    image: "🐦"
  },
  {
    id: 2,
    title: "The Kind Dog",
    moral: "Sharing makes friends",
    text: "A dog saw a hungry cat. He shared his food. They became friends.",
    difficulty: "easy",
    image: "🐕"
  },
  {
    id: 3,
    title: "The Honest Boy",
    moral: "Honesty is the best policy",
    text: "A boy found a purse. He gave it back. Everyone praised him.",
    difficulty: "easy",
    image: "👦"
  },
  {
    id: 4,
    title: "The Lazy Cat",
    moral: "Hard work brings rewards",
    text: "A cat slept all day. It did not get food. It felt sad.",
    difficulty: "easy",
    image: "🐱"
  },
  {
    id: 5,
    title: "The Happy Bird",
    moral: "Happiness is contagious",
    text: "A bird sang every day. It felt happy. Others smiled.",
    difficulty: "easy",
    image: "🐦"
  },
  {
    id: 6,
    title: "The Brave Ant",
    moral: "Help others in need",
    text: "An ant fell in water. A bird helped it. The ant was safe.",
    difficulty: "easy",
    image: "🐜"
  },
  {
    id: 7,
    title: "The Greedy Dog",
    moral: "Don't be greedy",
    text: "A dog had a bone. He wanted more. He lost it.",
    difficulty: "easy",
    image: "🐕"
  },
  {
    id: 8,
    title: "The Small Seed",
    moral: "Patience and care help growth",
    text: "A seed fell in soil. Rain and sun helped it. It grew into a plant.",
    difficulty: "easy",
    image: "🌱"
  },
  {
    id: 9,
    title: "The Helping Friend",
    moral: "Friends help each other",
    text: "A boy fell down. His friend helped him. They walked home.",
    difficulty: "easy",
    image: "👦"
  },
  {
    id: 10,
    title: "The Clean Child",
    moral: "Cleanliness brings happiness",
    text: "A girl cleaned her room. Her room looked nice. She felt proud.",
    difficulty: "easy",
    image: "👧"
  }
];

const StoriesReader = ({ userId = 'test-user' }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [difficultWords, setDifficultWords] = useState([]);
  const [readingStartTime, setReadingStartTime] = useState(Date.now());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const currentStory = DEFAULT_STORIES[currentStoryIndex];
  const totalStories = DEFAULT_STORIES.length;

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Navigate to previous story
  const previousStory = () => {
    if (currentStoryIndex > 0) {
      saveDifficultWords(); // Save before moving
      setCurrentStoryIndex(currentStoryIndex - 1);
      setDifficultWords([]);
      setReadingStartTime(Date.now());
    }
  };

  // Navigate to next story
  const nextStory = () => {
    if (currentStoryIndex < totalStories - 1) {
      saveDifficultWords(); // Save before moving
      setCurrentStoryIndex(currentStoryIndex + 1);
      setDifficultWords([]);
      setReadingStartTime(Date.now());
    }
  };

  // Mark word as difficult
  const markWordAsDifficult = (word) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    
    if (!difficultWords.includes(cleanWord)) {
      setDifficultWords([...difficultWords, cleanWord]);
      
      // Immediately save to backend
      saveSingleDifficultWord(cleanWord);
    }
  };

  // Save single difficult word immediately
  const saveSingleDifficultWord = async (word) => {
    try {
      const response = await fetch('http://localhost:5000/api/reading/difficult-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          storyId: currentStory.id,
          storyTitle: currentStory.title,
          word: word,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log(`✅ Saved difficult word: ${word}`);
      }
    } catch (error) {
      console.error('Error saving difficult word:', error);
    }
  };

  // Save all difficult words when leaving story
  const saveDifficultWords = async () => {
    if (difficultWords.length === 0) return;

    const readingDuration = Math.floor((Date.now() - readingStartTime) / 1000);

    try {
      const response = await fetch('http://localhost:5000/api/reading/save-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          storyId: currentStory.id,
          storyTitle: currentStory.title,
          difficultWords: difficultWords,
          readingDuration: readingDuration,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error saving reading session:', error);
    }
  };

  // Split text into clickable words
  const renderInteractiveText = () => {
    const words = currentStory.text.split(' ');
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
      const isDifficult = difficultWords.includes(cleanWord);
      
      return (
        <span key={index}>
          <span
            onClick={() => markWordAsDifficult(word)}
            style={{
              cursor: 'pointer',
              padding: '2px 4px',
              borderRadius: '4px',
              backgroundColor: isDifficult ? '#fff3cd' : 'transparent',
              color: isDifficult ? '#856404' : 'inherit',
              fontWeight: isDifficult ? 'bold' : 'normal',
              border: isDifficult ? '2px solid #ffc107' : 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isDifficult) e.target.style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              if (!isDifficult) e.target.style.backgroundColor = 'transparent';
            }}
            title="Click if you find this word difficult"
          >
            {word}
          </span>
          {' '}
        </span>
      );
    });
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-primary mb-2">
          <BookOpen size={40} className="me-2" />
          Story Time
        </h2>
        <Badge bg="info" className="p-2">
          Story {currentStoryIndex + 1} of {totalStories}
        </Badge>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Alert variant="success" className="text-center">
          ✅ Progress saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={8} className="mx-auto">
          {/* Main Story Card */}
          <Card className="shadow-lg mb-4">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">{currentStory.title}</h3>
                <div style={{ fontSize: '3rem' }}>
                  {currentStory.image}
                </div>
              </div>
              <small className="d-block mt-2">
                💡 Moral: {currentStory.moral}
              </small>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Story Text */}
              <div 
                className="story-text mb-4 p-4 bg-light rounded"
                style={{
                  fontSize: '1.8rem',
                  lineHeight: '2.5',
                  fontFamily: 'OpenDyslexic, Arial, sans-serif',
                  letterSpacing: '0.05em'
                }}
              >
                {renderInteractiveText()}
              </div>

              {/* Audio Button */}
              <div className="text-center mb-4">
                <Button 
                  variant="info" 
                  size="lg"
                  onClick={() => speakText(currentStory.text)}
                >
                  <Volume2 size={24} className="me-2" />
                  Read Story Aloud
                </Button>
              </div>

              {/* Difficult Words Section */}
              {difficultWords.length > 0 && (
                <Card className="bg-warning bg-opacity-10 border-warning mb-4">
                  <Card.Body>
                    <h5 className="text-warning mb-3">
                      <AlertCircle size={20} className="me-2" />
                      Words You Found Difficult:
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      {difficultWords.map((word, idx) => (
                        <Badge 
                          key={idx} 
                          bg="warning" 
                          text="dark"
                          className="p-2 cursor-pointer"
                          style={{ fontSize: '1rem', cursor: 'pointer' }}
                          onClick={() => speakText(word)}
                        >
                          {word}
                          <Volume2 size={14} className="ms-2" />
                        </Badge>
                      ))}
                    </div>
                    <p className="small text-muted mt-3 mb-0">
                      ✅ These words are saved for practice later!
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Instructions */}
              <Alert variant="info">
                <strong>How to use:</strong>
                <ul className="mb-0 mt-2">
                  <li>Click on any word you find difficult to pronounce or understand</li>
                  <li>It will be highlighted and saved automatically</li>
                  <li>Use the arrows to move between stories</li>
                  <li>Your progress is saved automatically!</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>

          {/* Navigation */}
          <Card className="shadow-sm">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col xs={4}>
                  <Button
                    variant="outline-primary"
                    onClick={previousStory}
                    disabled={currentStoryIndex === 0}
                    className="w-100"
                  >
                    <ChevronLeft size={20} className="me-1" />
                    Previous
                  </Button>
                </Col>
                
                <Col xs={4} className="text-center">
                  <div className="small text-muted">
                    Story {currentStoryIndex + 1}/{totalStories}
                  </div>
                  <div className="progress mt-2" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success"
                      style={{ width: `${((currentStoryIndex + 1) / totalStories) * 100}%` }}
                    />
                  </div>
                </Col>
                
                <Col xs={4}>
                  <Button
                    variant="outline-primary"
                    onClick={nextStory}
                    disabled={currentStoryIndex === totalStories - 1}
                    className="w-100"
                  >
                    Next
                    <ChevronRight size={20} className="ms-1" />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tips Card */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="text-primary">📚 Reading Tips:</h6>
              <ul className="small mb-0">
                <li>Take your time - there's no rush!</li>
                <li>Click the speaker button to hear the story</li>
                <li>Mark any word that's hard to say or understand</li>
                <li>Try to read the story 2-3 times</li>
                <li>Think about the moral of the story</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoriesReader;