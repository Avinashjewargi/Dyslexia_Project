// frontend/components/Navbar.jsx

import React from 'react';
// Import Navbar and Container components from react-bootstrap
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function AppNavbar() {
  // Dummy functions for demonstration
  const toggleAccessibility = () => {
    alert("Accessibility Toggle clicked! (Feature to be implemented in Settings)");
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Adaptive Reading Assistant
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/reader">Reader</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          </Nav>
          {/* This button will link to the accessibility settings */}
          <Button variant="outline-primary" onClick={toggleAccessibility}>
            A A A (Accessibility Settings)
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;