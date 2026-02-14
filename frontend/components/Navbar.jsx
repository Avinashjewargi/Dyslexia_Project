// frontend/components/Navbar.jsx - ENHANCED VERSION WITH INLINE STYLES

import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, NavDropdown, Badge, Offcanvas } from 'react-bootstrap';
import { BookOpen, Settings as SettingsIcon, LogOut, User, Sparkles, Menu } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

// Inline styles component
const NavbarStyles = () => {
  useEffect(() => {
    // Only add styles once
    if (!document.getElementById('navbar-custom-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'navbar-custom-styles';
      styleTag.innerHTML = `
/* ============================================
   MAIN NAVBAR STYLES
   ============================================ */

.navbar-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: 3px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 0;
  transition: all 0.3s ease;
}

.navbar-custom:hover {
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3) !important;
}

/* ============================================
   BRAND SECTION
   ============================================ */

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.brand-section:hover {
  transform: translateY(-2px);
}

.brand-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.brand-section:hover .brand-icon-wrapper {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(5deg);
}

.brand-icon {
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.brand-subtitle {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */

.mobile-menu-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  color: #ffffff;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover,
.mobile-menu-toggle:focus {
  background: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.5);
}

/* ============================================
   NAVIGATION LINKS
   ============================================ */

.navbar-links {
  gap: 0.25rem;
  margin: 0 1rem;
}

.nav-item-custom {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  white-space: nowrap;
}

.nav-item-custom::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: width 0.3s ease;
}

.nav-item-custom:hover,
.nav-item-custom.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff !important;
  transform: translateY(-1px);
}

.nav-item-custom:hover::before,
.nav-item-custom.active::before {
  width: 80%;
}

.nav-icon {
  font-size: 1.2rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.nav-text {
  font-weight: 500;
}

/* LexiAI Special Styling */
.lexiai-special {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.lexiai-special::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.sparkle-icon {
  color: #ffd700;
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

.pulse-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0);
  }
}

/* ============================================
   DROPDOWN STYLES
   ============================================ */

.dropdown-custom .dropdown-toggle {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
}

.dropdown-custom .dropdown-toggle::after {
  margin-left: 0.5rem;
  border-top-color: rgba(255, 255, 255, 0.9);
}

.dropdown-custom .dropdown-menu {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  margin-top: 0.5rem;
  background: #ffffff;
  min-width: 280px;
}

.dropdown-header-custom {
  font-weight: 700;
  color: #667eea;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.75rem 1rem 0.5rem;
}

.dropdown-item-custom {
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  border: none;
  margin-bottom: 0.25rem;
}

.dropdown-item-custom:hover {
  background: linear-gradient(135deg, #667eea15, #764ba215);
  transform: translateX(5px);
}

.dropdown-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.dropdown-text {
  flex: 1;
}

.dropdown-title {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.dropdown-desc {
  font-size: 0.8rem;
  color: #718096;
  line-height: 1.3;
}

.hub-link {
  background: linear-gradient(135deg, #667eea10, #764ba210);
  border: 1px dashed #667eea;
}

.hub-link:hover {
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-color: #764ba2;
}

/* ============================================
   NAVBAR ACTIONS (RIGHT SIDE)
   ============================================ */

.navbar-actions {
  flex-shrink: 0;
}

.action-item {
  display: flex;
  align-items: center;
}

/* ============================================
   USER DROPDOWN
   ============================================ */

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.user-dropdown .dropdown-menu {
  min-width: 280px;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.user-dropdown-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1.5rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-large {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.user-info {
  flex: 1;
}

.user-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-name-large {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.85rem;
  opacity: 0.85;
}

.logout-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e53e3e;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.logout-item:hover {
  background: #fff5f5;
  color: #c53030;
}

/* ============================================
   BUTTONS
   ============================================ */

.login-button {
  background: linear-gradient(135deg, #ffffff, #f7fafc);
  color: #667eea;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-button:hover {
  background: #ffffff;
  color: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.accessibility-button {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.accessibility-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: #ffffff;
  transform: translateY(-1px);
}

/* ============================================
   MOBILE OFFCANVAS MENU
   ============================================ */

.mobile-menu-offcanvas {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
}

.mobile-menu-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  color: #ffffff;
}

.mobile-menu-header .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.mobile-menu-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-nav {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
  color: #ffffff;
}

.mobile-nav-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.lexiai-mobile {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 215, 0, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.mobile-nav-section {
  margin: 1rem 0;
}

.mobile-nav-section-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}

.mobile-nav-item.sub-item {
  padding-left: 2rem;
  background: rgba(255, 255, 255, 0.05);
}

.mobile-menu-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
  margin-top: 1rem;
}

.mobile-user-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.mobile-user-name {
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
}

.mobile-user-email {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
}

/* ============================================
   RESPONSIVE ADJUSTMENTS
   ============================================ */

@media (max-width: 991.98px) {
  .brand-title {
    font-size: 1rem;
  }
  
  .brand-subtitle {
    font-size: 0.65rem;
  }
  
  .brand-icon-wrapper {
    padding: 0.4rem;
  }
  
  .brand-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 575.98px) {
  .brand-text {
    display: none;
  }
  
  .navbar-custom {
    padding: 0.5rem 0;
  }
}

/* ============================================
   SCROLLBAR STYLING (for dropdown menus)
   ============================================ */

.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

/* ============================================
   ACCESSIBILITY FOCUS STATES
   ============================================ */

.nav-item-custom:focus,
.dropdown-item-custom:focus,
.user-dropdown-trigger:focus,
.login-button:focus,
.accessibility-button:focus {
  outline: 3px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* ============================================
   ANIMATION UTILITIES
   ============================================ */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  animation: fadeInUp 0.3s ease;
}

/* ============================================
   PRINT STYLES
   ============================================ */

@media print {
  .navbar-custom {
    display: none;
  }
}
      `;
      document.head.appendChild(styleTag);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return null;
};

function AppNavbar({ onOpenSettings, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    navigate('/');
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Include inline styles */}
      <NavbarStyles />
      
      <Navbar 
        expand="lg" 
        className="navbar-custom shadow-lg"
        sticky="top"
      >
        <Container fluid className="px-3 px-lg-4">
          {/* Brand Section */}
          <Navbar.Brand 
            as={Link} 
            to="/" 
            className="brand-section d-flex align-items-center"
          >
            <div className="brand-icon-wrapper">
              <BookOpen size={32} className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">
                {t('navbar.appTitle', 'Adaptive Reading Assistant')}
              </span>
              <span className="brand-subtitle">Learn Smarter</span>
            </div>
          </Navbar.Brand>

          {/* Mobile Menu Toggle */}
          <Button
            variant="link"
            className="d-lg-none mobile-menu-toggle"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={24} />
          </Button>

          {/* Desktop Navigation */}
          <Navbar.Collapse id="navbar-nav" className="d-none d-lg-flex">
            {/* Left Navigation - Uses flex-grow to take available space */}
            <Nav className="navbar-links flex-grow-1 align-items-center">
              <Nav.Link 
                as={Link} 
                to="/reader"
                className={`nav-item-custom ${isActive('/reader') ? 'active' : ''}`}
              >
                <span className="nav-icon">📖</span>
                <span className="nav-text">{t('navbar.reader', 'Reader')}</span>
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/stories"
                className={`nav-item-custom ${isActive('/stories') ? 'active' : ''}`}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-text">{t('navbar.stories', 'Stories')}</span>
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/lexiai"
                className={`nav-item-custom lexiai-special ${isActive('/lexiai') ? 'active' : ''}`}
              >
                <Sparkles size={18} className="sparkle-icon" />
                <span className="nav-text">{t('navbar.lexiAI', 'LexiAI Learning')}</span>
                <Badge bg="primary" className="ms-2 pulse-badge">New</Badge>
              </Nav.Link>

              <NavDropdown
                title={
                  <span className="nav-item-custom">
                    <span className="nav-icon">📊</span>
                    <span className="nav-text">{t('navbar.dashboards', 'Dashboards')}</span>
                  </span>
                }
                id="dashboard-dropdown"
                className="dropdown-custom"
              >
                <NavDropdown.Item as={Link} to="/dashboard" className="dropdown-item-custom">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">👤</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title">{t('navbar.studentDashboard', 'Student Dashboard')}</div>
                      <div className="dropdown-desc">{t('navbar.studentDashboardDesc', 'Track your progress')}</div>
                    </div>
                  </div>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/teacher-dashboard" className="dropdown-item-custom">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">👩‍🏫</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title">{t('navbar.teacherDashboard', 'Teacher Dashboard')}</div>
                      <div className="dropdown-desc">{t('navbar.teacherDashboardDesc', 'Monitor class performance')}</div>
                    </div>
                  </div>
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown
                title={
                  <span className="nav-item-custom">
                    <span className="nav-icon">🎯</span>
                    <span className="nav-text">{t('navbar.phonologicalAwareness', 'Phonological Awareness')}</span>
                  </span>
                }
                id="phonology-dropdown"
                className="dropdown-custom"
              >
                <NavDropdown.Header className="dropdown-header-custom">
                  {t('navbar.practiceActivities', 'Practice Activities')}
                </NavDropdown.Header>

                <NavDropdown.Item as={Link} to="/phonology/spelling" className="dropdown-item-custom">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">📝</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title">{t('navbar.spellingPractice', 'Spelling Practice')}</div>
                      <div className="dropdown-desc">{t('navbar.spellingPracticeDesc', '3 Levels • Easy to Hard')}</div>
                    </div>
                  </div>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/phonology/replacement" className="dropdown-item-custom">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">🔄</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title">{t('navbar.letterReplacement', 'Letter Replacement')}</div>
                      <div className="dropdown-desc">{t('navbar.letterReplacementDesc', '15 Challenges')}</div>
                    </div>
                  </div>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/phonology/odd-one-out" className="dropdown-item-custom">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">⭐</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title">{t('navbar.oddOneOut', 'Odd One Out')}</div>
                      <div className="dropdown-desc">{t('navbar.oddOneOutDesc', '30 Tests • Categories, Sounds & Letters')}</div>
                    </div>
                  </div>
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/phonology" className="dropdown-item-custom hub-link">
                  <div className="dropdown-item-content">
                    <span className="dropdown-icon">🏠</span>
                    <div className="dropdown-text">
                      <div className="dropdown-title"><strong>{t('navbar.activityHub', 'Activity Hub')}</strong></div>
                    </div>
                  </div>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {/* Right Navigation - Action Items */}
            <div className="navbar-actions d-flex align-items-center gap-3">
              {/* Language Selector */}
              <div className="action-item">
                <LanguageSelector compact={true} showLabel={false} />
              </div>

              {/* User Section */}
              {user ? (
                <NavDropdown
                  title={
                    <div className="user-dropdown-trigger">
                      <div className="user-avatar">
                        <User size={18} />
                      </div>
                      <span className="user-name">{user.name}</span>
                      {user.role === 'teacher' && (
                        <Badge bg="success" className="user-badge">
                          {t('navbar.teacher', 'Teacher')}
                        </Badge>
                      )}
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                  className="user-dropdown"
                >
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      <User size={32} />
                    </div>
                    <div className="user-info">
                      <div className="user-label">{t('navbar.loggedInAs', 'Logged in as')}</div>
                      <div className="user-name-large">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout} className="logout-item">
                    <LogOut size={18} />
                    <span>{t('navbar.logout', 'Logout')}</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="primary" 
                  className="login-button"
                  as={Link}
                  to="/login"
                >
                  <User size={18} className="me-2" />
                  {t('navbar.login', 'Login')}
                </Button>
              )}

              {/* Accessibility Button */}
              <Button 
                variant="outline-light"
                onClick={handleSettingsClick}
                className="accessibility-button"
              >
                <SettingsIcon size={18} />
                <span className="d-none d-xl-inline ms-2">
                  {t('navbar.accessibility', 'Accessibility')}
                </span>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas 
        show={showMobileMenu} 
        onHide={closeMobileMenu}
        placement="end"
        className="mobile-menu-offcanvas"
      >
        <Offcanvas.Header closeButton className="mobile-menu-header">
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <BookOpen size={24} className="me-2" />
              <span>Menu</span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="mobile-menu-body">
          <Nav className="flex-column mobile-nav">
            <Nav.Link 
              as={Link} 
              to="/reader" 
              onClick={closeMobileMenu}
              className={`mobile-nav-item ${isActive('/reader') ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">📖</span>
              <span>{t('navbar.reader', 'Reader')}</span>
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/stories" 
              onClick={closeMobileMenu}
              className={`mobile-nav-item ${isActive('/stories') ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">📚</span>
              <span>{t('navbar.stories', 'Stories')}</span>
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/lexiai" 
              onClick={closeMobileMenu}
              className={`mobile-nav-item lexiai-mobile ${isActive('/lexiai') ? 'active' : ''}`}
            >
              <Sparkles size={18} className="mobile-nav-icon" />
              <span>{t('navbar.lexiAI', 'LexiAI Learning')}</span>
              <Badge bg="primary" className="ms-2">New</Badge>
            </Nav.Link>

            <div className="mobile-nav-section">
              <div className="mobile-nav-section-title">📊 {t('navbar.dashboards', 'Dashboards')}</div>
              <Nav.Link 
                as={Link} 
                to="/dashboard" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">👤</span>
                <span>{t('navbar.studentDashboard', 'Student Dashboard')}</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/teacher-dashboard" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">👩‍🏫</span>
                <span>{t('navbar.teacherDashboard', 'Teacher Dashboard')}</span>
              </Nav.Link>
            </div>

            <div className="mobile-nav-section">
              <div className="mobile-nav-section-title">🎯 {t('navbar.phonologicalAwareness', 'Phonological Awareness')}</div>
              <Nav.Link 
                as={Link} 
                to="/phonology/spelling" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">📝</span>
                <span>{t('navbar.spellingPractice', 'Spelling Practice')}</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/phonology/replacement" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">🔄</span>
                <span>{t('navbar.letterReplacement', 'Letter Replacement')}</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/phonology/odd-one-out" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">⭐</span>
                <span>{t('navbar.oddOneOut', 'Odd One Out')}</span>
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/phonology" 
                onClick={closeMobileMenu}
                className="mobile-nav-item sub-item"
              >
                <span className="mobile-nav-icon">🏠</span>
                <span>{t('navbar.activityHub', 'Activity Hub')}</span>
              </Nav.Link>
            </div>
          </Nav>

          <div className="mobile-menu-footer">
            <div className="mb-3">
              <LanguageSelector compact={false} showLabel={true} />
            </div>
            
            {user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="mobile-user-name">{user.name}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                  className="w-100 mt-3"
                >
                  <LogOut size={18} className="me-2" />
                  {t('navbar.logout', 'Logout')}
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary" 
                as={Link}
                to="/login"
                onClick={closeMobileMenu}
                className="w-100"
              >
                <User size={18} className="me-2" />
                {t('navbar.login', 'Login')}
              </Button>
            )}

            <Button 
              variant="outline-primary"
              onClick={handleSettingsClick}
              className="w-100 mt-3"
            >
              <SettingsIcon size={18} className="me-2" />
              {t('navbar.accessibility', 'Accessibility')}
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppNavbar;