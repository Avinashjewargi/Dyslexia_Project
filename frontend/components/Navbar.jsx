// frontend/components/Navbar.jsx

import React from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { BookOpen, Settings as SettingsIcon } from 'lucide-react';

function AppNavbar() {
  const toggleAccessibility = () => {
    window.location.href = '/settings';
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <BookOpen size={28} className="me-2" style={{ marginBottom: '4px' }} />
          Adaptive Reading Assistant
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Reader Link */}
            <Nav.Link href="/reader">
              📖 Reader
            </Nav.Link>
            
            {/* Dashboard Link */}
            <Nav.Link href="/dashboard">
              📊 Dashboard
            </Nav.Link>
            
            {/* Phonology Dropdown - NEW */}
            <NavDropdown 
              title={
                <span>
                  🎯 Phonological Awareness
                </span>
              } 
              id="phonology-dropdown"
            >
              <NavDropdown.Header>Practice Activities</NavDropdown.Header>
              
              <NavDropdown.Item href="/phonology/spelling">
                📝 Spelling Practice
                <div className="small text-muted">3 Levels • Easy to Hard</div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item href="/phonology/replacement">
                🔄 Letter Replacement
                <div className="small text-muted">15 Challenges</div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item href="/phonology/odd-one-out">
                ⭐ Odd One Out
                <div className="small text-muted">30 Tests • Categories, Sounds & Letters</div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item href="/phonology">
                <strong>🏠 Activity Hub</strong>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          {/* Accessibility Settings Button */}
          <Button 
            variant="outline-primary" 
            onClick={toggleAccessibility}
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