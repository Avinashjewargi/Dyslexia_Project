// frontend/components/Navbar.jsx

import React from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function AppNavbar({ onOpenSettings }) {
  const handleSettingsClick = (e) => {
    e.preventDefault();
    if (onOpenSettings) {
      onOpenSettings();
    }
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
            {/* Reader Link */}
            <Nav.Link as={Link} to="/reader">
              📖 Reader
            </Nav.Link>
            
            {/* Stories Link */}
            <Nav.Link as={Link} to="/stories">
              📚 Stories
            </Nav.Link>
            
            {/* Dashboard Link */}
            <Nav.Link as={Link} to="/dashboard">
              📊 Dashboard
            </Nav.Link>
            
            {/* Phonology Dropdown */}
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
          </Nav>
          
          {/* Accessibility Settings Button */}
          <Button 
            variant="outline-primary" 
            onClick={handleSettingsClick}
            className="d-flex align-items-center"
          >
            <SettingsIcon size={18} className="me-2" />
            Accessibility
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;