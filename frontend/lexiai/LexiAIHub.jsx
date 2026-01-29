// frontend/lexiai/LexiAIHub.jsx

import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../components/AccessibilityContext';
import { 
  BookA, Volume2, Hash, Eye, Music, 
  Rabbit, Bird, Bug, Apple, Carrot,
  Palette, Car, User, Shirt, Home,
  Globe, Cloud, Clock,
  Shapes, Grid, Maximize, Navigation, Heart, AlertTriangle, ShieldCheck,
  Camera
} from 'lucide-react';

function LexiAIHub() {
  const navigate = useNavigate();
  const { settings } = useAccessibility();

  // Card categories with metadata
  const cardCategories = [
    {
      category: '🅰️ Language & Literacy',
      color: '#FF6B6B',
      cards: [
        { id: 'alphabet', title: 'Alphabet Master', subtitle: 'A-Z, a-z', icon: BookA, count: 52 },
        { id: 'phonics', title: 'Phonics & Sounds', subtitle: 'Letter sounds', icon: Volume2, count: 44 },
        { id: 'numbers', title: 'Numbers & Digits', subtitle: '0-100', icon: Hash, count: 40 },
        { id: 'sight-words', title: 'Sight Words', subtitle: 'Common words', icon: Eye, count: 50 },
        { id: 'rhymes', title: 'Rhymes & Patterns', subtitle: 'Word families', icon: Music, count: 30 }
      ]
    },
    {
      category: '🐾 Living Things',
      color: '#4ECDC4',
      cards: [
        { id: 'animals', title: 'Animals Explorer', subtitle: 'Wild & domestic', icon: Rabbit, count: 40 },
        { id: 'birds', title: 'Birds World', subtitle: 'Flying friends', icon: Bird, count: 35 },
        { id: 'insects', title: 'Insects Hub', subtitle: 'Tiny creatures', icon: Bug, count: 30 },
        { id: 'fruits', title: 'Fruits Basket', subtitle: 'Healthy treats', icon: Apple, count: 40 },
        { id: 'vegetables', title: 'Vegetable Garden', subtitle: 'Veggie varieties', icon: Carrot, count: 35 }
      ]
    },
    {
      category: '🌈 Daily Life & Surroundings',
      color: '#95E1D3',
      cards: [
        { id: 'colors', title: 'Colors & Shades', subtitle: 'Rainbow world', icon: Palette, count: 30 },
        { id: 'vehicles', title: 'Vehicles Zone', subtitle: 'On the move', icon: Car, count: 40 },
        { id: 'body', title: 'Human Body', subtitle: 'Know yourself', icon: User, count: 35 },
        { id: 'clothes', title: 'Clothes & Wearables', subtitle: 'What we wear', icon: Shirt, count: 40 },
        { id: 'home', title: 'Home Objects', subtitle: 'Around the house', icon: Home, count: 50 }
      ]
    },
    {
      category: '🌍 Nature & Time Awareness',
      color: '#F38181',
      cards: [
        { id: 'nature', title: 'Nature & Space', subtitle: 'Earth & beyond', icon: Globe, count: 40 },
        { id: 'weather', title: 'Weather Watch', subtitle: 'Sky conditions', icon: Cloud, count: 30 },
        { id: 'time', title: 'Time & Calendar', subtitle: 'Days, months, seasons', icon: Clock, count: 45 }
      ]
    },
    {
      category: '🔷 Thinking, Math & Life Skills',
      color: '#AA96DA',
      cards: [
        { id: 'shapes', title: 'Shapes & Geometry', subtitle: 'Circles, squares', icon: Shapes, count: 30 },
        { id: 'patterns', title: 'Pattern Builder', subtitle: 'Sequences', icon: Grid, count: 30 },
        { id: 'size', title: 'Size & Comparison', subtitle: 'Big, small, tall', icon: Maximize, count: 30 },
        { id: 'direction', title: 'Direction Sense', subtitle: 'Left, right, up, down', icon: Navigation, count: 30 },
        { id: 'emotions', title: 'Emotion Sense', subtitle: 'Feelings & faces', icon: Heart, count: 35 },
        { id: 'symbols', title: 'Signs & Symbols', subtitle: 'Common signs', icon: AlertTriangle, count: 40 },
        { id: 'safety', title: 'Safety & Social Skills', subtitle: 'Stay safe', icon: ShieldCheck, count: 35 }
      ]
    }
  ];

  const handleCardClick = (cardId) => {
    navigate(`/lexiai/${cardId}`);
  };

  const containerStyle = {
    fontFamily: settings.fontFamily,
    backgroundColor: settings.highContrast ? '#121212' : '#f0f4f8',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '3rem'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 0',
    borderRadius: '15px',
    marginBottom: '3rem',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  };

  return (
    <div style={containerStyle}>
      <Container>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ✨ LexiAI Learning Center
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.95 }}>
            AI-Powered Multi-Sensory Learning for Dyslexia Support
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.85, marginTop: '0.5rem' }}>
            <Camera size={20} style={{ marginRight: '8px', marginBottom: '3px' }} />
            25 Interactive Cards • 30+ Visual Examples Each • TTS, STT & Color Coding
          </p>
        </div>

        {/* Learning Cards by Category */}
        {cardCategories.map((category, idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            {/* Category Header */}
            <div 
              style={{ 
                backgroundColor: category.color,
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              {category.category}
            </div>

            {/* Cards Grid */}
            <Row>
              {category.cards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Col key={card.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-4">
                    <Card
                      onClick={() => handleCardClick(card.id)}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        height: '100%'
                      }}
                      className="learning-card"
                    >
                      <Card.Body 
                        className="text-center p-3"
                        style={{
                          background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}30 100%)`
                        }}
                      >
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            margin: '0 auto 1rem',
                            backgroundColor: category.color,
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                          }}
                        >
                          <IconComponent size={32} color="white" />
                        </div>
                        
                        <h6 style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1rem' }}>
                          {card.title}
                        </h6>
                        
                        <p className="text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                          {card.subtitle}
                        </p>
                        
                        <Badge 
                          bg="secondary" 
                          style={{ 
                            fontSize: '0.75rem',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px'
                          }}
                        >
                          {card.count}+ Examples
                        </Badge>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        ))}

        {/* Info Footer */}
        <div 
          style={{
            backgroundColor: settings.highContrast ? '#1e1e1e' : 'white',
            padding: '2rem',
            borderRadius: '15px',
            marginTop: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <h5 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            🎯 Multi-Sensory Learning Features
          </h5>
          <Row>
            <Col md={3} sm={6} className="mb-3">
              <div style={{ fontSize: '2rem' }}>🔊</div>
              <strong>Text-to-Speech</strong>
              <p className="small text-muted">Listen to every word</p>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div style={{ fontSize: '2rem' }}>🎤</div>
              <strong>Speech-to-Text</strong>
              <p className="small text-muted">Practice pronunciation</p>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div style={{ fontSize: '2rem' }}>🎨</div>
              <strong>Color Coding</strong>
              <p className="small text-muted">Visual differentiation</p>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <div style={{ fontSize: '2rem' }}>📸</div>
              <strong>Image Learning</strong>
              <p className="small text-muted">30+ visual examples</p>
            </Col>
          </Row>
        </div>
      </Container>

      <style jsx>{`
        .learning-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default LexiAIHub;
