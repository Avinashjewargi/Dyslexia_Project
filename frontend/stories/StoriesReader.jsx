// frontend/reader/StoriesReader.jsx (WITH TRANSLATIONS AND LANGUAGE FILTERING)

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge, Alert, Dropdown } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, BookOpen, Volume2, AlertCircle, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

// 10 Default Stories (expandable to include language property)
const DEFAULT_STORIES = [
  {
    id: 1,
    title: "The Thirsty Crow",
    moral: "Think smart to solve problems",
    text: "A crow was thirsty. It put stones in a pot. The water came up.",
    difficulty: "easy",
    image: "🦅",
    language: "en" // English
  },
  {
    id: 2,
    title: "The Kind Dog",
    moral: "Sharing makes friends",
    text: "A dog saw a hungry cat. He shared his food. They became friends.",
    difficulty: "easy",
    image: "🐕",
    language: "en"
  },
  {
    id: 3,
    title: "The Honest Boy",
    moral: "Honesty is the best policy",
    text: "A boy found a purse. He gave it back. Everyone praised him.",
    difficulty: "easy",
    image: "👦",
    language: "en"
  },
  {
    id: 4,
    title: "The Lazy Cat",
    moral: "Hard work brings rewards",
    text: "A cat slept all day. It did not get food. It felt sad.",
    difficulty: "easy",
    image: "🐱",
    language: "en"
  },
  {
    id: 5,
    title: "The Happy Bird",
    moral: "Happiness is contagious",
    text: "A bird sang every day. It felt happy. Others smiled.",
    difficulty: "easy",
    image: "🦜",
    language: "en"
  },
  {
    id: 6,
    title: "The Brave Ant",
    moral: "Help others in need",
    text: "An ant fell in water. A bird helped it. The ant was safe.",
    difficulty: "easy",
    image: "🐜",
    language: "en"
  },
  {
    id: 7,
    title: "The Greedy Dog",
    moral: "Don't be greedy",
    text: "A dog had a bone. He wanted more. He lost it.",
    difficulty: "easy",
    image: "🐕",
    language: "en"
  },
  {
    id: 8,
    title: "The Small Seed",
    moral: "Patience and care help growth",
    text: "A seed fell in soil. Rain and sun helped it. It grew into a plant.",
    difficulty: "easy",
    image: "🌱",
    language: "en"
  },
  {
    id: 9,
    title: "The Helping Friend",
    moral: "Friends help each other",
    text: "A boy fell down. His friend helped him. They walked home.",
    difficulty: "easy",
    image: "👦",
    language: "en"
  },
  {
    id: 10,
    title: "The Clean Child",
    moral: "Cleanliness brings happiness",
    text: "A girl cleaned her room. Her room looked nice. She felt proud.",
    difficulty: "easy",
    image: "👧",
    language: "en"
  }
];

const StoriesReader = ({ userId = 'test-user', onClose }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const [languageFilter, setLanguageFilter] = useState('all'); // 'all' or specific language
  const [allStories, setAllStories] = useState(DEFAULT_STORIES);
  const [filteredStories, setFilteredStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [difficultWords, setDifficultWords] = useState([]);
  const [readingStartTime, setReadingStartTime] = useState(Date.now());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Filter stories by language
  useEffect(() => {
    if (languageFilter === 'all') {
      setFilteredStories(allStories);
    } else {
      const filtered = allStories.filter(story => story.language === languageFilter);
      setFilteredStories(filtered);
    }
    setCurrentStoryIndex(0); // Reset to first story when filter changes
  }, [languageFilter, allStories]);

  // Auto-set language filter to current language on mount
  useEffect(() => {
    setLanguageFilter(currentLanguage);
  }, [currentLanguage]);

  const currentStory = filteredStories[currentStoryIndex];
  const totalStories = filteredStories.length;

  // Get available languages from stories
  const getAvailableLanguages = () => {
    const languages = new Set(allStories.map(s => s.language).filter(Boolean));
    return Array.from(languages);
  };

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.lang = currentStory?.language === 'es' ? 'es-ES' : 'en-US'; // Set language for TTS
      window.speechSynthesis.speak(utterance);
    }
  };

  // Navigate to previous story
  const previousStory = () => {
    if (currentStoryIndex > 0) {
      saveStoryProgress(); // Save before moving
      setCurrentStoryIndex(currentStoryIndex - 1);
      setDifficultWords([]);
      setReadingStartTime(Date.now());
    }
  };

  // Navigate to next story
  const nextStory = () => {
    if (currentStoryIndex < totalStories - 1) {
      saveStoryProgress(); // Save before moving
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
    }
  };

  // Save story progress
  const saveStoryProgress = async () => {
    if (!currentStory) return;
    
    const readingDuration = Math.floor((Date.now() - readingStartTime) / 1000);

    try {
      const response = await fetch('http://localhost:5000/api/reading/story-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          storyId: currentStory.id,
          storyTitle: currentStory.title,
          language: currentStory.language,
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
      console.error('Error saving story progress:', error);
    }
  };

  // Save progress when closing
  const handleClose = () => {
    saveStoryProgress();
    if (onClose) onClose();
  };

  // Split text into clickable words
  const renderInteractiveText = () => {
    if (!currentStory) return null;
    
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
            title={t('stories.clickIfDifficult', 'Click if you find this word difficult')}
          >
            {word}
          </span>
          {' '}
        </span>
      );
    });
  };

  // Show message if no stories available for selected language
  if (filteredStories.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="info" className="text-center">
          <AlertCircle size={24} className="mb-2" />
          <p className="mb-3">
            {t('stories.noStoriesAvailable', 'No stories available for the selected language.')}
          </p>
          <Button variant="primary" onClick={() => setLanguageFilter('all')}>
            {t('stories.showAllStories', 'Show All Stories')}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Close Button and Language Filter */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {onClose && (
          <Button 
            variant="outline-secondary"
            onClick={handleClose}
          >
            <X size={20} className="me-2" />
            {t('stories.backToReader', 'Back to Reader')}
          </Button>
        )}

        {/* Language Filter Dropdown */}
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary" id="story-language-filter">
            <Globe size={18} className="me-2" />
            {languageFilter === 'all' 
              ? t('stories.allLanguages', 'All Languages')
              : languageFilter.toUpperCase()
            }
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
              active={languageFilter === 'all'} 
              onClick={() => setLanguageFilter('all')}
            >
              {t('stories.allLanguages', 'All Languages')}
            </Dropdown.Item>
            <Dropdown.Divider />
            {getAvailableLanguages().map(lang => (
              <Dropdown.Item 
                key={lang}
                active={languageFilter === lang}
                onClick={() => setLanguageFilter(lang)}
              >
                {lang.toUpperCase()}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-primary mb-2">
          <BookOpen size={40} className="me-2" />
          {t('stories.title', 'Story Time')}
        </h2>
        <Badge bg="info" className="p-2">
          {t('stories.storyCount', 'Story {{current}} of {{total}}', { 
            current: currentStoryIndex + 1, 
            total: totalStories 
          })}
        </Badge>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Alert variant="success" className="text-center">
          ✅ {t('stories.progressSaved', 'Progress saved successfully!')}
        </Alert>
      )}

      <Row>
        <Col lg={8} className="mx-auto">
          {/* Main Story Card */}
          <Card className="shadow-lg mb-4">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{currentStory.title}</h3>
                  {currentStory.language && (
                    <Badge bg="light" text="dark" className="mt-2">
                      {currentStory.language.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <div style={{ fontSize: '3rem' }}>
                  {currentStory.image}
                </div>
              </div>
              <small className="d-block mt-2">
                💡 {t('stories.moral', 'Moral')}: {currentStory.moral}
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
                  {t('stories.readAloud', 'Read Story Aloud')}
                </Button>
              </div>

              {/* Difficult Words Section */}
              {difficultWords.length > 0 && (
                <Card className="bg-warning bg-opacity-10 border-warning mb-4">
                  <Card.Body>
                    <h5 className="text-warning mb-3">
                      <AlertCircle size={20} className="me-2" />
                      {t('stories.difficultWords', 'Words You Found Difficult')}:
                    </h5>
                    <div className="d-flex flex-wrap gap-2">
                      {difficultWords.map((word, idx) => (
                        <Badge 
                          key={idx} 
                          bg="warning" 
                          text="dark"
                          className="p-2"
                          style={{ fontSize: '1rem', cursor: 'pointer' }}
                          onClick={() => speakText(word)}
                        >
                          {word}
                          <Volume2 size={14} className="ms-2" />
                        </Badge>
                      ))}
                    </div>
                    <p className="small text-muted mt-3 mb-0">
                      ✅ {t('stories.wordsSaved', 'These words are saved for practice later!')}
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Instructions */}
              <Alert variant="info">
                <strong>{t('stories.howToUse', 'How to use')}:</strong>
                <ul className="mb-0 mt-2">
                  <li>{t('stories.instruction1', 'Click on any word you find difficult to pronounce or understand')}</li>
                  <li>{t('stories.instruction2', 'It will be highlighted and saved automatically')}</li>
                  <li>{t('stories.instruction3', 'Use the arrows to move between stories')}</li>
                  <li>{t('stories.instruction4', 'Your progress is saved automatically!')}</li>
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
                    {t('stories.previous', 'Previous')}
                  </Button>
                </Col>
                
                <Col xs={4} className="text-center">
                  <div className="small text-muted">
                    {t('stories.storyProgress', 'Story {{current}}/{{total}}', {
                      current: currentStoryIndex + 1,
                      total: totalStories
                    })}
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
                    {t('stories.next', 'Next')}
                    <ChevronRight size={20} className="ms-1" />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tips Card */}
          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="text-primary">📚 {t('stories.readingTips', 'Reading Tips')}:</h6>
              <ul className="small mb-0">
                <li>{t('stories.tip1', 'Take your time - there\'s no rush!')}</li>
                <li>{t('stories.tip2', 'Click the speaker button to hear the story')}</li>
                <li>{t('stories.tip3', 'Mark any word that\'s hard to say or understand')}</li>
                <li>{t('stories.tip4', 'Try to read the story 2-3 times')}</li>
                <li>{t('stories.tip5', 'Think about the moral of the story')}</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoriesReader;
