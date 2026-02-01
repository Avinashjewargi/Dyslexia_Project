// frontend/phonology/PhonologyHub.jsx (WITH TRANSLATIONS)

import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { BookOpen, Sparkles, RefreshCw, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SpellingTest from './SpellingTest';
import LetterReplacement from './LetterReplacement';
import OddOneOut from './OddOneOut';

/**
 * PhonologyHub - Main component for phonological awareness activities
 * Includes: Spelling, Letter Replacement, and Odd One Out tests
 */
const PhonologyHub = () => {
  const { t } = useTranslation();
  
  const [activeTest, setActiveTest] = useState(null);
  const [userProgress, setUserProgress] = useState({
    spelling: { level: 1, completed: 0, total: 5 },
    replacement: { completed: 0, total: 15 },
    oddOneOut: { completed: 0, total: 30 }
  });

  const activities = [
    {
      id: 'spelling',
      title: t('games.spelling.title', 'Spelling Practice'),
      icon: <BookOpen size={40} />,
      description: t('games.spelling.description', 'Practice spelling words from easy to challenging'),
      color: 'primary',
      levels: 3,
      testComponent: SpellingTest
    },
    {
      id: 'replacement',
      title: t('games.replacement.title', 'Letter Replacement'),
      icon: <RefreshCw size={40} />,
      description: t('games.replacement.description', 'Replace letters to make new words'),
      color: 'success',
      levels: 1,
      testComponent: LetterReplacement
    },
    {
      id: 'oddOneOut',
      title: t('games.oddOneOut.title', 'Odd One Out'),
      icon: <Sparkles size={40} />,
      description: t('games.oddOneOut.description', 'Find the word that doesn\'t belong'),
      color: 'warning',
      levels: 1,
      testComponent: OddOneOut
    }
  ];

  const handleActivitySelect = (activityId) => {
    setActiveTest(activityId);
  };

  const handleBack = () => {
    setActiveTest(null);
  };

  const updateProgress = (activityId, progress) => {
    setUserProgress(prev => ({
      ...prev,
      [activityId]: progress
    }));
  };

  if (activeTest) {
    const activity = activities.find(a => a.id === activeTest);
    const TestComponent = activity.testComponent;
    
    return (
      <TestComponent 
        onBack={handleBack}
        progress={userProgress[activeTest]}
        updateProgress={(progress) => updateProgress(activeTest, progress)}
      />
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="text-center mb-4">
        <h1 className="text-primary mb-2">
          <Award size={48} className="me-2" />
          {t('games.hub.title', 'Phonological Awareness Center')}
        </h1>
        <p className="text-muted">
          {t('games.hub.subtitle', 'Practice your reading skills with fun activities!')}
        </p>
      </div>

      <Row className="g-4">
        {activities.map((activity) => (
          <Col key={activity.id} md={4}>
            <Card 
              className="h-100 shadow-sm hover-card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => handleActivitySelect(activity.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card.Body className="text-center">
                <div className={`text-${activity.color} mb-3`}>
                  {activity.icon}
                </div>
                <Card.Title className="h4">{activity.title}</Card.Title>
                <Card.Text className="text-muted mb-3">
                  {activity.description}
                </Card.Text>
                
                {activity.levels > 1 && (
                  <Badge bg="info" className="mb-2">
                    {t('games.level', 'Level')} {userProgress[activity.id]?.level || 1} / {activity.levels}
                  </Badge>
                )}
                
                <div className="mt-3">
                  <small className="text-muted">
                    {t('games.progress', 'Progress')}: {userProgress[activity.id]?.completed || 0} / {userProgress[activity.id]?.total || 0}
                  </small>
                  <div className="progress mt-2" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar bg-${activity.color}`}
                      style={{ 
                        width: `${((userProgress[activity.id]?.completed || 0) / (userProgress[activity.id]?.total || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-4 bg-light">
        <Card.Body>
          <h5 className="text-info">💡 {t('games.tips.title', 'Tips for Parents & Teachers')}</h5>
          <ul className="mb-0">
            <li>{t('games.tips.tip1', 'Start with easier activities and gradually increase difficulty')}</li>
            <li>{t('games.tips.tip2', 'Celebrate small victories to build confidence')}</li>
            <li>{t('games.tips.tip3', 'Practice for 10-15 minutes daily for best results')}</li>
            <li>{t('games.tips.tip4', 'Use the color coding feature alongside these activities')}</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PhonologyHub;
