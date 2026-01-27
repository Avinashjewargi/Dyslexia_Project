// frontend/src/LandingPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Tab, Tabs, Form, Alert } from 'react-bootstrap';
import { 
  BookOpen, Users, Award, Zap, TrendingUp, Heart, 
  Play, Settings, Upload, Mic, Volume2, PieChart,
  CheckCircle, ArrowRight, Star, Target, Sparkles,
  GraduationCap, UserCheck, BarChart3, BookMarked,
  Brain, Rocket, Shield, Clock, Smile, Trophy, MessageCircle, Send, ThumbsUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Feedback Section Component
const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: '🐛 Bug Report', color: '#FF8042' },
    { value: 'feature', label: '💡 Feature Request', color: '#00C49F' },
    { value: 'improvement', label: '⚡ Improvement', color: '#FFBB28' },
    { value: 'general', label: '💬 General Feedback', color: '#8884D8' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log({
      rating,
      feedbackType,
      feedbackText,
      name,
      email,
      timestamp: new Date().toISOString()
    });

    setSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedbackType('');
      setFeedbackText('');
      setName('');
      setEmail('');
    }, 3000);
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold text-white mb-3">
          <MessageCircle size={48} className="me-3" />
          Share Your Feedback
        </h2>
        <p className="lead text-white" style={{ opacity: 0.8 }}>
          Help us make reading better for everyone
        </p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          {submitted ? (
            <div
              className="p-5 rounded-4 text-center"
              style={{
                background: "rgba(67, 233, 123, 0.1)",
                backdropFilter: "blur(20px)",
                border: "2px solid rgba(67, 233, 123, 0.3)",
                animation: "scaleIn 0.5s ease"
              }}
            >
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  animation: "bounce 1s ease"
                }}
              >
                <CheckCircle size={50} color="white" />
              </div>
              <h3 className="text-white mb-2">Thank You!</h3>
              <p className="text-white mb-0" style={{ opacity: 0.9 }}>
                Your feedback helps us improve the experience for all students.
              </p>
            </div>
          ) : (
            <div
              className="p-5 rounded-4"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <Form onSubmit={handleSubmit}>
                {/* Rating Stars */}
                <div className="text-center mb-4">
                  <p className="text-white mb-3" style={{ fontSize: "1.1rem" }}>
                    How would you rate your experience?
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={40}
                        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                        fill={(hoverRating || rating) >= star ? "#FFD700" : "transparent"}
                        color={(hoverRating || rating) >= star ? "#FFD700" : "rgba(255, 255, 255, 0.5)"}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-white mt-2 mb-0" style={{ opacity: 0.8 }}>
                      {rating === 5 && "🎉 Excellent!"}
                      {rating === 4 && "😊 Great!"}
                      {rating === 3 && "👍 Good"}
                      {rating === 2 && "😐 Okay"}
                      {rating === 1 && "😔 Needs Improvement"}
                    </p>
                  )}
                </div>

                {/* Feedback Type */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white mb-3">What type of feedback?</Form.Label>
                  <Row className="g-2">
                    {feedbackTypes.map((type) => (
                      <Col xs={6} key={type.value}>
                        <div
                          className="p-3 rounded-3 text-center"
                          style={{
                            background: feedbackType === type.value 
                              ? `${type.color}30` 
                              : "rgba(255, 255, 255, 0.05)",
                            border: feedbackType === type.value 
                              ? `2px solid ${type.color}` 
                              : "1px solid rgba(255, 255, 255, 0.1)",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                          onClick={() => setFeedbackType(type.value)}
                        >
                          <span className="text-white">{type.label}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Form.Group>

                {/* Feedback Text */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Your Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tell us what you think..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
                      resize: "none"
                    }}
                  />
                </Form.Group>

                {/* Name and Email */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white">Name (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "white"
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white">Email (Optional)</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          color: "white"
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-100 py-3"
                  disabled={!rating || !feedbackType || !feedbackText || isSubmitting}
                  style={{
                    background: rating && feedbackType && feedbackText 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="me-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </Form>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-top" style={{ borderColor: "rgba(255, 255, 255, 0.1) !important" }}>
                <Row className="text-center text-white g-3">
                  <Col xs={4}>
                    <div>
                      <h4 className="mb-1">2,547</h4>
                      <small style={{ opacity: 0.7 }}>Feedbacks</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h4 className="mb-1">4.8/5</h4>
                      <small style={{ opacity: 0.7 }}>Avg Rating</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h4 className="mb-1">98%</h4>
                      <small style={{ opacity: 0.7 }}>Satisfied</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const LandingPage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [statsCount, setStatsCount] = useState({ students: 0, sessions: 0, improvement: 0 });

  // Animate stats on load
  useEffect(() => {
    const interval = setInterval(() => {
      setStatsCount(prev => ({
        students: prev.students < 10000 ? prev.students + 100 : 10000,
        sessions: prev.sessions < 50000 ? prev.sessions + 500 : 50000,
        improvement: prev.improvement < 95 ? prev.improvement + 1 : 95
      }));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Upload size={48} />,
      title: "Smart OCR",
      description: "Upload any image and watch AI extract text instantly",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      demo: "📸 → 📝 → ✨"
    },
    {
      icon: <Volume2 size={48} />,
      title: "Natural Voice",
      description: "Crystal-clear text-to-speech with adjustable speeds",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      demo: "🔊 → 🎵 → 👂"
    },
    {
      icon: <Mic size={48} />,
      title: "Voice Recognition",
      description: "Real-time pronunciation feedback and correction",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      demo: "🗣️ → ✅ → 🎯"
    },
    {
      icon: <Sparkles size={48} />,
      title: "Color Magic",
      description: "Smart color coding for confusing letter pairs",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      demo: "🎨 → 📖 → 💡"
    },
    {
      icon: <Trophy size={48} />,
      title: "Gamification",
      description: "Points, badges, and leaderboards keep you motivated",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      demo: "🎮 → 🏆 → 🎉"
    },
    {
      icon: <BarChart3 size={48} />,
      title: "Smart Analytics",
      description: "Beautiful charts track every bit of progress",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      demo: "📊 → 📈 → 🎓"
    }
  ];

  const testimonials = [
    {
      name: "Emma",
      role: "Student, Age 12",
      text: "This app made reading fun! I love earning badges and seeing my progress.",
      avatar: "👧",
      rating: 5
    },
    {
      name: "Ms. Johnson",
      role: "Special Ed Teacher",
      text: "Game-changer for my classroom. Students are more engaged than ever!",
      avatar: "👩‍🏫",
      rating: 5
    },
    {
      name: "David",
      role: "Parent",
      text: "My son's reading confidence has improved dramatically in just 2 months.",
      avatar: "👨",
      rating: 5
    }
  ];

  return (
    <div style={{ background: "#0a0e27", minHeight: "100vh", overflow: "hidden" }}>
      {/* Animated Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        opacity: 0.1,
        zIndex: 0
      }} />

      {/* Floating Shapes */}
      <div style={{ position: "fixed", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", opacity: 0.1, filter: "blur(60px)", animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", opacity: 0.1, filter: "blur(80px)", animation: "float 8s ease-in-out infinite reverse" }} />

      <Container fluid className="position-relative" style={{ zIndex: 1 }}>
        {/* Hero Section */}
        <Container className="py-5">
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="text-white">
              <Badge 
                bg="light" 
                text="dark" 
                className="mb-3 px-3 py-2"
                style={{ fontSize: "0.9rem", fontWeight: "600" }}
              >
                <Sparkles size={16} className="me-2" />
                AI-Powered Reading Assistant
              </Badge>
              
              <h1 
                className="display-2 fw-bold mb-4"
                style={{ 
                  textShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  lineHeight: "1.2"
                }}
              >
                Transform
                <span style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block"
                }}>
                  Reading
                </span>
                Into Success
              </h1>
              
              <p className="lead mb-4" style={{ fontSize: "1.4rem", opacity: 0.9 }}>
                Empowering students with dyslexia through cutting-edge AI, 
                gamification, and personalized learning experiences.
              </p>

              {/* Stats */}
              <Row className="mb-4 g-3">
                <Col xs={4}>
                  <div 
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <h3 className="mb-0 fw-bold">{statsCount.students.toLocaleString()}+</h3>
                    <small style={{ opacity: 0.8 }}>Students</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div 
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <h3 className="mb-0 fw-bold">{statsCount.sessions.toLocaleString()}+</h3>
                    <small style={{ opacity: 0.8 }}>Sessions</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div 
                    className="p-3 rounded-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <h3 className="mb-0 fw-bold">{statsCount.improvement}%</h3>
                    <small style={{ opacity: 0.8 }}>Improvement</small>
                  </div>
                </Col>
              </Row>

              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  as={Link} 
                  to="/reader" 
                  size="lg" 
                  className="px-5 py-3"
                  style={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow = "0 15px 40px rgba(102, 126, 234, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  <Rocket size={20} className="me-2" />
                  Start  Now
                </Button>
                <Button 
                  size="lg" 
                  className="px-5 py-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.1rem"
                  }}
                  onClick={() => setShowVideoModal(true)}
                >
                  <Play size={20} className="me-2" />
                  Watch Demo
                </Button>
              </div>
            </Col>

            <Col lg={6} className="mt-5 mt-lg-0">
              <div 
                className="position-relative p-4"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "30px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop" 
                  alt="Student reading" 
                  className="img-fluid rounded-4"
                  style={{ width: "100%", height: "auto" }}
                />
                
                {/* Floating Badge */}
                <div 
                  className="position-absolute"
                  style={{
                    top: "20px",
                    right: "20px",
                    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    padding: "15px 25px",
                    borderRadius: "50px",
                    boxShadow: "0 10px 30px rgba(67, 233, 123, 0.4)",
                    animation: "bounce 2s infinite"
                  }}
                >
                  <strong className="text-white">🎯 95% Success Rate</strong>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Features Showcase */}
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-white mb-3">
              Powerful Features
            </h2>
            <p className="lead text-white" style={{ opacity: 0.8 }}>
              Everything you need to succeed
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index}>
                <div
                  className="h-100 p-4 rounded-4 text-white"
                  style={{
                    background: activeFeature === index 
                      ? "rgba(255, 255, 255, 0.15)" 
                      : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: activeFeature === index 
                      ? "2px solid rgba(255, 255, 255, 0.3)" 
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.4s ease",
                    transform: activeFeature === index ? "scale(1.05)" : "scale(1)"
                  }}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={(e) => {
                    if (activeFeature !== index) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFeature !== index) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }
                  }}
                >
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      background: feature.gradient,
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p style={{ opacity: 0.9 }}>{feature.description}</p>
                  <div className="mt-3" style={{ fontSize: "1.5rem" }}>
                    {feature.demo}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        {/* How It Works */}
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-white mb-3">
              How It Works
            </h2>
            <p className="lead text-white" style={{ opacity: 0.8 }}>
              Simple steps to success
            </p>
          </div>

          <Tabs
            defaultActiveKey="student"
            className="mb-4 justify-content-center"
            style={{
              borderBottom: "2px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <Tab 
              eventKey="student" 
              title={
                <span className="px-3 py-2">
                  <GraduationCap size={20} className="me-2" />
                  For Students
                </span>
              }
            >
              <Row className="g-4 mt-3">
                {[
                  { icon: <BookOpen />, title: "Choose Your Text", desc: "Upload image or type directly" },
                  { icon: <Settings />, title: "Customize", desc: "Adjust font, size, and colors" },
                  { icon: <Volume2 />, title: "Listen & Read", desc: "Use text-to-speech feature" },
                  { icon: <Mic />, title: "Practice", desc: "Speak words for feedback" },
                  { icon: <Trophy />, title: "Earn Rewards", desc: "Get points and badges" },
                  { icon: <TrendingUp />, title: "Track Progress", desc: "See your improvement" }
                ].map((step, index) => (
                  <Col md={6} lg={4} key={index}>
                    <div
                      className="p-4 rounded-4 text-white h-100"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "1.5rem",
                          fontWeight: "bold"
                        }}
                      >
                        {index + 1}
                      </div>
                      <h5 className="mb-2">{step.title}</h5>
                      <p style={{ opacity: 0.8 }}>{step.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab 
              eventKey="teacher" 
              title={
                <span className="px-3 py-2">
                  <Users size={20} className="me-2" />
                  For Teachers
                </span>
              }
            >
              <Row className="g-4 mt-3">
                {[
                  { icon: <BarChart3 />, title: "Monitor Class", desc: "View overall performance" },
                  { icon: <UserCheck />, title: "Track Students", desc: "Individual progress reports" },
                  { icon: <Target />, title: "Identify Issues", desc: "Find struggling students" },
                  { icon: <BookMarked />, title: "Assign Content", desc: "Share stories and exercises" },
                  { icon: <Award />, title: "Set Goals", desc: "Create class objectives" },
                  { icon: <PieChart />, title: "Export Reports", desc: "Share with parents" }
                ].map((step, index) => (
                  <Col md={6} lg={4} key={index}>
                    <div
                      className="p-4 rounded-4 text-white h-100"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          fontSize: "1.5rem",
                          fontWeight: "bold"
                        }}
                      >
                        {index + 1}
                      </div>
                      <h5 className="mb-2">{step.title}</h5>
                      <p style={{ opacity: 0.8 }}>{step.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Container>

        {/* Testimonials */}
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-white mb-3">
              What People Say
            </h2>
            <p className="lead text-white" style={{ opacity: 0.8 }}>
              Real stories from real users
            </p>
          </div>

          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <div
                  className="p-4 rounded-4 text-white h-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  <div className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="mb-3" style={{ fontSize: "1.1rem" }}>"{testimonial.text}"</p>
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontSize: "1.5rem"
                      }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <strong className="d-block">{testimonial.name}</strong>
                      <small style={{ opacity: 0.7 }}>{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Feedback Section */}
        <FeedbackSection />

        {/* Final CTA */}
        <Container className="py-5 text-center">
          <div
            className="p-5 rounded-4"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <h2 className="display-4 fw-bold text-white mb-4">
              Ready to Transform Reading?
            </h2>
            <p className="lead text-white mb-4" style={{ opacity: 0.9 }}>
              Join thousands of students succeeding every day
            </p>
            <Button 
              as={Link}
              to="/reader"
              size="lg"
              className="px-5 py-3"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)"
              }}
            >
              <Rocket size={24} className="me-2" />
              Get Started Free
            </Button>
          </div>
        </Container>
      </Container>

      {/* Demo Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: "#0a0e27", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Modal.Title className="text-white">Watch How It Works</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" style={{ background: "#0a0e27" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
              }}
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .nav-tabs .nav-link {
          color: rgba(255, 255, 255, 0.7);
          border: none;
          background: transparent;
        }
        .nav-tabs .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .form-control:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(102, 126, 234, 0.5) !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          color: white !important;
        }
        .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;