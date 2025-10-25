// frontend/src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layout Components
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';
// Import the Provider
import { AccessibilityProvider } from '../components/AccessibilityProvider';


// Import Page Components
import StudentDashboard from '../dashboard/StudentDashboard';
import TeacherDashboard from '../dashboard/TeacherDashboard';
import ReaderPage from '../reader/ReaderPage'; // We will create this wrapper component below!


// A simple wrapper component to hold the Reader's main page elements
// We are putting this here temporarily to keep the structure clean.
const ReaderPageWrapper = () => (
  <div className="d-flex flex-column min-vh-100">
    <AppNavbar />
    {/* Placeholder for the actual Reader UI */}
    <div className="flex-grow-1 container my-5">
      <ReaderPage />
    </div>
    <AppFooter />
  </div>
);

function App() {
  return (
    <AccessibilityProvider>
      <Routes>
        {/* Define routes for the main pages. 
        The Navbar and Footer are included in the component logic (or wrapper) 
        to maintain consistent layout. 
      */}
        <Route path="/" element={<Navigate to="/student-dashboard" />} />

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* Reader route - this is the core utility */}
        <Route path="/reader" element={<ReaderPageWrapper />} />

        {/* Fallback for any unknown route */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />

      </Routes>
    </AccessibilityProvider>
  );
}

export default App;