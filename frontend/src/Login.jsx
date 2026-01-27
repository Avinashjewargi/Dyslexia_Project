// frontend/src/Login.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { User, Mail, Lock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo credentials
  const DEMO_CREDENTIALS = {
    student: {
      email: 'student@dyslexia.edu',
      password: 'student123',
      name: 'Emma Thompson',
      id: 'student-emma-2024'
    },
    teacher: {
      email: 'teacher@dyslexia.edu',
      password: 'teacher123',
      name: 'Dr. Sarah Johnson',
      id: 'teacher-sarah-2024'
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 800));

    const credentials = DEMO_CREDENTIALS[activeTab];

    if (formData.email === credentials.email && formData.password === credentials.password) {
      const userData = {
        ...credentials,
        role: activeTab,
        timestamp: new Date().toISOString()
      };

      if (formData.rememberMe) {
        localStorage.setItem('dyslexia_user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('dyslexia_user', JSON.stringify(userData));
      }

      onLogin(userData);
      navigate('/');
    } else {
      setError('Invalid email or password. Try demo credentials.');
    }

    setLoading(false);
  };

  const handleDemoLogin = () => {
    const credentials = DEMO_CREDENTIALS[activeTab];
    setFormData({
      email: credentials.email,
      password: credentials.password,
      rememberMe: false
    });
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={6}>
            <div className="text-center mb-4">
              <BookOpen size={60} color="white" className="mb-3" />
              <h1 className="text-white mb-2">Adaptive Reading Assistant</h1>
              <p className="text-white-50">Supporting students with dyslexia</p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => {
                    setActiveTab(k);
                    setFormData({ email: '', password: '', rememberMe: false });
                    setError('');
                  }}
                  className="mb-4"
                  fill
                >
                  <Tab 
                    eventKey="student" 
                    title={
                      <span>
                        <User size={18} className="me-2" />
                        Student Login
                      </span>
                    }
                  >
                    <LoginForm
                      formData={formData}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleDemoLogin={handleDemoLogin}
                      error={error}
                      loading={loading}
                      userType="student"
                    />
                  </Tab>

                  <Tab 
                    eventKey="teacher" 
                    title={
                      <span>
                        <User size={18} className="me-2" />
                        Teacher Login
                      </span>
                    }
                  >
                    <LoginForm
                      formData={formData}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleDemoLogin={handleDemoLogin}
                      error={error}
                      loading={loading}
                      userType="teacher"
                    />
                  </Tab>
                </Tabs>

                {/* Skip Login Button */}
                <div className="text-center mt-3 pt-3 border-top">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleSkip}
                    className="w-100"
                  >
                    Continue Without Login
                  </Button>
                  <small className="text-muted d-block mt-2">
                    You can explore all features without logging in
                  </small>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-white small">
                Demo Mode • Login is optional • All features accessible
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const LoginForm = ({ formData, handleChange, handleSubmit, handleDemoLogin, error, loading, userType }) => {
  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Alert variant="info" className="mb-3">
        <strong>Demo Credentials:</strong>
        <div className="mt-2 small">
          <strong>Email:</strong> {userType}@dyslexia.edu<br />
          <strong>Password:</strong> {userType}123
        </div>
        <Button 
          variant="link" 
          size="sm" 
          className="p-0 mt-2"
          onClick={handleDemoLogin}
        >
          Click to fill demo credentials
        </Button>
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label>
          <Mail size={18} className="me-2" />
          Email Address
        </Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder={`Enter ${userType} email`}
          value={formData.email}
          onChange={handleChange}
          required
          size="lg"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          <Lock size={18} className="me-2" />
          Password
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          size="lg"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="rememberMe"
          label="Remember me"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
      </Form.Group>

      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-100"
        disabled={loading}
      >
        {loading ? 'Logging in...' : `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
      </Button>

      <div className="text-center mt-3">
        <a href="#" className="text-muted small">Forgot password?</a>
      </div>
    </Form>
  );
};

export default Login;