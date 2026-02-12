// frontend/lexiai/LearningCard.jsx
// REUSABLE COMPONENT FOR ALL 25 CARDS

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { ArrowLeft, Volume2, Mic, Camera, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../components/AccessibilityContext';

function LearningCard({ 
  title, 
  subtitle, 
  category,
  categoryColor,
  items, // Array of learning items with { word, image, audioText, colorCode }
  onBack 
}) {
  const navigate = useNavigate();
  const { settings } = useAccessibility();
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [speechFeedback, setSpeechFeedback] = useState(null);

  // Text-to-Speech Function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slower for dyslexia
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-to-Text (Voice Recognition)
  const startListening = (targetWord) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechFeedback(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const target = targetWord.toLowerCase().trim();
      
      if (transcript === target) {
        setSpeechFeedback({ type: 'success', message: `Perfect! You said "${targetWord}" correctly! 🎉` });
        speakText(`Excellent! ${targetWord}`);
      } else {
        setSpeechFeedback({ 
          type: 'warning', 
          message: `You said "${transcript}". Try saying "${targetWord}" again.` 
        });
        speakText(`Try again. Say ${targetWord}`);
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpeechFeedback({ type: 'danger', message: 'Could not hear you. Please try again.' });
    };

    recognition.start();
  };

  // Color coding for confusing letters (b/d/p/q, 6/9, etc.)
  const applyColorCoding = (text) => {
    if (!text) return text;
    
    const colorMap = {
      'b': '#FF6B6B', // Red
      'd': '#4ECDC4', // Teal
      'p': '#95E1D3', // Light green
      'q': '#F38181', // Pink
      '6': '#FFD93D', // Yellow
      '9': '#6BCB77'  // Green
    };

    return text.split('').map((char, idx) => {
      const lowerChar = char.toLowerCase();
      if (colorMap[lowerChar]) {
        return (
          <span 
            key={idx} 
            style={{ 
              color: colorMap[lowerChar], 
              fontWeight: 'bold',
              fontSize: '1.1em'
            }}
          >
            {char}
          </span>
        );
      }
      return <span key={idx}>{char}</span>;
    });
  };

  const containerStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    backgroundColor: settings.highContrast ? '#121212' : '#f8f9fa',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    color: settings.highContrast ? '#ffffff' : '#212529'
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
    color: 'white',
    padding: '2rem',
    borderRadius: '15px',
    marginBottom: '2rem',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
  };

  return (
    <div style={containerStyle}>
      <Container>
        {/* Header */}
        <div style={headerStyle}>
          <Button 
            variant="light" 
            size="sm" 
            onClick={() => navigate('/lexiai')}
            style={{ marginBottom: '1rem' }}
          >
            <ArrowLeft size={18} className="me-2" />
            Back to Hub
          </Button>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {title}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            {subtitle} • {category}
          </p>
          <Badge bg="light" text="dark" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            {items.length} Examples
          </Badge>
        </div>

        {/* Speech Feedback */}
        {speechFeedback && (
          <Alert 
            variant={speechFeedback.type} 
            dismissible 
            onClose={() => setSpeechFeedback(null)}
            className="mb-4"
          >
            {speechFeedback.message}
          </Alert>
        )}

        {/* Learning Items Grid */}
        <Row>
          {items.map((item, idx) => (
            <Col key={idx} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card 
                style={{
                  border: 'none',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                className="learning-item-card"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image */}
                <div 
                  style={{
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.word}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '4rem' }}>
                      {item.emoji || '📷'}
                    </div>
                  )}
                  
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <Camera size={14} className="me-1" />
                    #{idx + 1}
                  </div>
                </div>

                {/* Content */}
                <Card.Body className="text-center">
                  <h5 style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.3rem' }}>
                    {applyColorCoding(item.word)}
                  </h5>
                  
                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(item.audioText || item.word);
                      }}
                      style={{ borderRadius: '20px' }}
                    >
                      <Volume2 size={16} className="me-1" />
                      Listen
                    </Button>
                    
                    <Button
                      variant={isListening ? "danger" : "success"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        startListening(item.word);
                      }}
                      disabled={isListening}
                      style={{ borderRadius: '20px' }}
                    >
                      <Mic size={16} className="me-1" />
                      {isListening ? 'Listening...' : 'Speak'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Detail Modal */}
        {selectedItem && (
          <Modal
            show={selectedItem !== null}
            onHide={() => setSelectedItem(null)}
            size="lg"
            centered
          >
            <Modal.Header closeButton style={{ backgroundColor: categoryColor, color: 'white' }}>
              <Modal.Title>{selectedItem.word}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center p-4">
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                {selectedItem.emoji || '📷'}
              </div>
              
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                {applyColorCoding(selectedItem.word)}
              </h2>
              
              {selectedItem.description && (
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                  {selectedItem.description}
                </p>
              )}

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => speakText(selectedItem.audioText || selectedItem.word)}
                >
                  <Volume2 size={20} className="me-2" />
                  Listen
                </Button>
                
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => startListening(selectedItem.word)}
                  disabled={isListening}
                >
                  <Mic size={20} className="me-2" />
                  {isListening ? 'Listening...' : 'Practice Speaking'}
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </Container>

      <style jsx>{`
        .learning-item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default LearningCard;
