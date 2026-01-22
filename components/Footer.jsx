// frontend/components/Footer.jsx

import React from 'react';
import { Container } from 'react-bootstrap';

function AppFooter() {
  return (
    <footer className="bg-light p-3 mt-auto border-top">
      <Container className="text-center text-muted">
        &copy; {new Date().getFullYear()} Adaptive Reading Assistant | Developed for Dyslexia Students
      </Container>
    </footer>
  );
}

export default AppFooter;