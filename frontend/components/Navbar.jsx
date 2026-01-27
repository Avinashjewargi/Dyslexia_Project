// frontend/components/Navbar.jsx (UPDATED WITH LOGOUT)

import React from 'react';
import { Navbar, Container, Nav, Button, NavDropdown, Badge } from 'react-bootstrap';
import { BookOpen, Settings as SettingsIcon, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function AppNavbar({ onOpenSettings, user, onLogout }) {
  const navigate = useNavigate();

  const handleSettingsClick = (e) => {
    e.preventDefault();
    if (onOpenSettings) {
      onOpenSettings();
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <BookOpen size={28} className="me-2" style={{ marginBottom: '4px' }} />
          Adaptive Reading Assistant
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                {/* Reader Link - Only for logged-in users */}
                <Nav.Link as={Link} to="/reader">
                  📖 Reader
                </Nav.Link>
                
                {/* Stories Link - Only for logged-in users */}
                <Nav.Link as={Link} to="/stories">
                  📚 Stories
                </Nav.Link>
                
                {/* Dashboard Dropdown */}
                <NavDropdown 
                  title={
                    <span>
                      📊 Dashboards
                    </span>
                  } 
                  id="dashboard-dropdown"
                >
                  {user.role === 'student' && (
                    <NavDropdown.Item as={Link} to="/dashboard">
                      👤 Student Dashboard
                      <div className="small text-muted">Track your progress</div>
                    </NavDropdown.Item>
                  )}
                  
                  {user.role === 'teacher' && (
                    <NavDropdown.Item as={Link} to="/teacher-dashboard">
                      👩‍🏫 Teacher Dashboard
                      <div className="small text-muted">Monitor class performance</div>
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
                
                {/* Phonology Dropdown - Only for students */}
                {user.role === 'student' && (
                  <NavDropdown 
                    title={
                      <span>
                        🎯 Phonological Awareness
                      </span>
                    } 
                    id="phonology-dropdown"
                  >
                    <NavDropdown.Header>Practice Activities</NavDropdown.Header>
                    
                    <NavDropdown.Item as={Link} to="/phonology/spelling">
                      📝 Spelling Practice
                      <div className="small text-muted">3 Levels • Easy to Hard</div>
                    </NavDropdown.Item>
                    
                    <NavDropdown.Divider />
                    
                    <NavDropdown.Item as={Link} to="/phonology/replacement">
                      🔄 Letter Replacement
                      <div className="small text-muted">15 Challenges</div>
                    </NavDropdown.Item>
                    
                    <NavDropdown.Divider />
                    
                    <NavDropdown.Item as={Link} to="/phonology/odd-one-out">
                      ⭐ Odd One Out
                      <div className="small text-muted">30 Tests • Categories, Sounds & Letters</div>
                    </NavDropdown.Item>
                    
                    <NavDropdown.Divider />
                    
                    <NavDropdown.Item as={Link} to="/phonology">
                      <strong>🏠 Activity Hub</strong>
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          {/* Right side buttons */}
          <div className="d-flex align-items-center gap-2">
            {/* Accessibility Settings Button */}
            <Button 
              variant="outline-primary" 
              onClick={handleSettingsClick}
              className="d-flex align-items-center"
              size="sm"
            >
              <SettingsIcon size={18} className="me-2" />
              Accessibility
            </Button>

            {/* User Info & Logout */}
            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={18} className="me-2" />
                    {user.name}
                    {user.role === 'teacher' && (
                      <Badge bg="success" className="ms-2">Teacher</Badge>
                    )}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Header>
                  <div className="small text-muted">Logged in as</div>
                  <strong>{user.name}</strong>
                  <div className="small text-muted">{user.email}</div>
                </NavDropdown.Header>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item onClick={handleLogout}>
                  <LogOut size={18} className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                as={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;