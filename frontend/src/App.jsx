//frontend/src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import StudentDashboard from '../dashboard/StudentDashboard';
import TeacherDashboard from '../dashboard/TeacherDashboard';
import ReaderPage from '../reader/ReaderPage';
import Settings from '../components/Settings';
import { AccessibilityProvider, useAccessibility } from '../components/AccessibilityContext'; 
import AppFooter from '../components/Footer';

// Inner Layout component to consume Context
const MainLayout = ({ children }) => {
    const { settings } = useAccessibility();
    const [showSettings, setShowSettings] = useState(false);

    // Apply global high-contrast style dynamically
    const appStyle = {
        fontFamily: settings.fontFamily,
        // We don't set fontSize on the root to avoid breaking layout, 
        // but we could set a base variable if using CSS variables.
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: settings.highContrast ? '#121212' : '#f8f9fa',
        color: settings.highContrast ? '#ffffff' : '#212529',
        transition: 'background-color 0.3s, color 0.3s'
    };

    return (
        <div style={appStyle}>
            <AppNavbar onOpenSettings={() => setShowSettings(true)} />
            <div className="flex-grow-1 container-fluid my-5">
                {children}
            </div>
            <AppFooter />
            <Settings show={showSettings} handleClose={() => setShowSettings(false)} />
        </div>
    );
};

function App() {
    const mockUserId = "Dyslexia-User-7890"; 

    return (
        <AccessibilityProvider>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/reader" />} /> 
                    <Route path="/reader" element={<ReaderPage userId={mockUserId} />} />
                    <Route path="/dashboard" element={<StudentDashboard userId={mockUserId} />} />
                    <Route path="/teacher-dashboard" element={<TeacherDashboard />} /> 
                    <Route path="*" element={<h1>404: Page Not Found</h1>} />
                </Routes>
            </MainLayout>
        </AccessibilityProvider>
    );
}

export default App;