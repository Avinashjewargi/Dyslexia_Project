// frontend/src/App.jsx - CORRECTED (Using new AuthPage)

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

const API = 'http://localhost:5000/api';

// Providers
import { AccessibilityProvider, useAccessibility } from '../components/AccessibilityContext';
import { LanguageProvider } from '../contexts/LanguageContext';

// Common Components
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';
import Settings from '../components/Settings';
import Chatbot from '../components/Chatbot';

// Pages
import AuthPage from './AuthPage';  // ✅ NEW AUTH PAGE
import LandingPage from './LandingPage';
import ReaderPage from '../reader/ReaderPage';

// Dashboards
import StudentDashboard from '../dashboard/StudentDashboard';
import TeacherDashboard from '../dashboard/TeacherDashboard';

// Phonology Modules
import PhonologyHub from '../phonology/PhonologyHub';
import SpellingTest from '../phonology/SpellingTest';
import LetterReplacement from '../phonology/LetterReplacement';
import OddOneOut from '../phonology/OddOneOut';

// Stories
import StoriesReader from '../stories/StoriesReader';

// LexiAI Hub
import LexiAIHub from '../lexiai/LexiAIHub';

// ===== CATEGORY 1: Language & Literacy (5) =====
import AlphabetMaster from '../lexiai/cards/AlphabetMaster';
import PhonicsAndSounds from '../lexiai/cards/PhonicsAndSounds';
import NumbersAndDigits from '../lexiai/cards/NumbersAndDigits';
import SightWords from '../lexiai/cards/SightWords';
import RhymesAndPatterns from '../lexiai/cards/RhymesAndPatterns';

// ===== CATEGORY 2: Living Things (5) =====
import AnimalsExplorer from '../lexiai/cards/AnimalsExplorer';
import BirdsWorld from '../lexiai/cards/BirdsWorld';
import InsectsHub from '../lexiai/cards/InsectsHub';
import FruitsBasket from '../lexiai/cards/FruitsBasket';
import VegetableGarden from '../lexiai/cards/VegetableGarden';

// ===== CATEGORY 3: Daily Life & Surroundings (5) =====
import ColorsShades from '../lexiai/cards/ColorsShades';
import VehiclesZone from '../lexiai/cards/VehiclesZone';
import HumanBody from '../lexiai/cards/HumanBody';
import ClothesWearables from '../lexiai/cards/ClothesWearables';
import HomeObjects from '../lexiai/cards/HomeObjects';

// ===== CATEGORY 4: Nature & Time Awareness (3) =====
import NatureSpace from '../lexiai/cards/NatureSpace';
import WeatherWatch from '../lexiai/cards/WeatherWatch';
import TimeCalendar from '../lexiai/cards/TimeCalendar';

// ===== CATEGORY 5: Thinking, Math & Life Skills (7) =====
import ShapesGeometry from '../lexiai/cards/ShapesGeometry';
import PatternBuilder from '../lexiai/cards/PatternBuilder';
import SizeComparison from '../lexiai/cards/SizeComparison';
import DirectionSense from '../lexiai/cards/DirectionSense';
import EmotionSense from '../lexiai/cards/EmotionSense';
import SignsSymbols from '../lexiai/cards/SignsSymbols';
import SafetySocial from '../lexiai/cards/SafetySocial';

/* =========================
   INNER LAYOUT COMPONENT
========================= */
const MainLayout = ({ children, isLandingPage, user, onLogout }) => {
  const { settings } = useAccessibility();
  const [showSettings, setShowSettings] = useState(false);

  const appStyle = {
    fontFamily: settings.fontFamily,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: settings.highContrast ? '#121212' : '#f8f9fa',
    color: settings.highContrast ? '#ffffff' : '#212529',
    transition: 'background-color 0.3s, color 0.3s',
  };

  // Landing page layout (NO chatbot)
  if (isLandingPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppNavbar user={user} onLogout={onLogout} onOpenSettings={() => setShowSettings(true)} />
        <div className="flex-grow-1">{children}</div>
        <AppFooter />
        <Settings show={showSettings} handleClose={() => setShowSettings(false)} />
      </div>
    );
  }

  // All other pages (layout only – chatbot is rendered globally in App)
  return (
    <div style={appStyle}>
      <AppNavbar user={user} onLogout={onLogout} onOpenSettings={() => setShowSettings(true)} />

      <div className="flex-grow-1 container-fluid my-5">
        {children}
      </div>

      <AppFooter />
      <Settings show={showSettings} handleClose={() => setShowSettings(false)} />
    </div>
  );
};

/* =========================
   MAIN APP COMPONENT
========================= */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser =
          localStorage.getItem('dyslexia_user') ||
          sessionStorage.getItem('dyslexia_user');

        const token =
          localStorage.getItem('dyslexia_token') ||
          sessionStorage.getItem('dyslexia_token');

        // If we have a token, validate it with the backend and refresh user data
        if (token) {
          try {
            const res = await fetch(`${API}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();

            if (data.success && data.user) {
              const normalizedUser = {
                id: data.user._id || data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                studentId: data.user.studentId,
                teacherCode: data.user.teacherCode,
                grade: data.user.grade,
                language: data.user.language,
                settings: data.user.settings,
              };

              setUser(normalizedUser);

              // Persist refreshed user back to the same storage that holds the token
              const usingLocal = localStorage.getItem('dyslexia_token') === token;
              const storage = usingLocal ? localStorage : sessionStorage;
              storage.setItem('dyslexia_user', JSON.stringify(normalizedUser));

              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Auto-login validation failed', err);
          }

          // Token invalid or request failed – clear all auth data
          localStorage.removeItem('dyslexia_user');
          localStorage.removeItem('dyslexia_token');
          sessionStorage.removeItem('dyslexia_user');
          sessionStorage.removeItem('dyslexia_token');
        }

        // Fallback: use whatever user object is in storage (guest/demo mode)
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            console.error('Invalid session data');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dyslexia_user');
    localStorage.removeItem('dyslexia_token');
    sessionStorage.removeItem('dyslexia_user');
    sessionStorage.removeItem('dyslexia_token');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const userId = user?.id || 'guest-user';

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <>
          <Routes>
            {/* ✅ NEW: Auth Page (Login + Register) */}
            <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />

            {/* Landing Page */}
            <Route
              path="/"
              element={
                <MainLayout isLandingPage user={user} onLogout={handleLogout}>
                  <LandingPage />
                </MainLayout>
              }
            />

            {/* Reader */}
            <Route
              path="/reader"
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <ReaderPage userId={userId} />
                </MainLayout>
              }
            />

            {/* Stories */}
            <Route 
              path="/stories" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <StoriesReader />
                </MainLayout>
              } 
            />
            
            {/* Dashboards */}
            <Route 
              path="/dashboard" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <StudentDashboard userId={userId} />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/teacher-dashboard" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <TeacherDashboard teacherId={userId} />
                </MainLayout>
              } 
            />

            {/* Phonology Routes */}
            <Route 
              path="/phonology" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <PhonologyHub />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/phonology/spelling" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <SpellingTest />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/phonology/replacement" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <LetterReplacement />
                </MainLayout>
              } 
            />
            
            <Route 
              path="/phonology/odd-one-out" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <OddOneOut />
                </MainLayout>
              } 
            />

            {/* LexiAI Hub */}
            <Route 
              path="/lexiai" 
              element={
                <MainLayout user={user} onLogout={handleLogout}>
                  <LexiAIHub />
                </MainLayout>
              } 
            />

            {/* ===== ALL 25 LEXIAI ROUTES ===== */}
            <Route path="/lexiai/alphabet" element={<MainLayout user={user} onLogout={handleLogout}><AlphabetMaster /></MainLayout>} />
            <Route path="/lexiai/phonics" element={<MainLayout user={user} onLogout={handleLogout}><PhonicsAndSounds /></MainLayout>} />
            <Route path="/lexiai/numbers" element={<MainLayout user={user} onLogout={handleLogout}><NumbersAndDigits /></MainLayout>} />
            <Route path="/lexiai/sight-words" element={<MainLayout user={user} onLogout={handleLogout}><SightWords /></MainLayout>} />
            <Route path="/lexiai/rhymes" element={<MainLayout user={user} onLogout={handleLogout}><RhymesAndPatterns /></MainLayout>} />

            <Route path="/lexiai/animals" element={<MainLayout user={user} onLogout={handleLogout}><AnimalsExplorer /></MainLayout>} />
            <Route path="/lexiai/birds" element={<MainLayout user={user} onLogout={handleLogout}><BirdsWorld /></MainLayout>} />
            <Route path="/lexiai/insects" element={<MainLayout user={user} onLogout={handleLogout}><InsectsHub /></MainLayout>} />
            <Route path="/lexiai/fruits" element={<MainLayout user={user} onLogout={handleLogout}><FruitsBasket /></MainLayout>} />
            <Route path="/lexiai/vegetables" element={<MainLayout user={user} onLogout={handleLogout}><VegetableGarden /></MainLayout>} />

            <Route path="/lexiai/colors" element={<MainLayout user={user} onLogout={handleLogout}><ColorsShades /></MainLayout>} />
            <Route path="/lexiai/vehicles" element={<MainLayout user={user} onLogout={handleLogout}><VehiclesZone /></MainLayout>} />
            <Route path="/lexiai/body" element={<MainLayout user={user} onLogout={handleLogout}><HumanBody /></MainLayout>} />
            <Route path="/lexiai/clothes" element={<MainLayout user={user} onLogout={handleLogout}><ClothesWearables /></MainLayout>} />
            <Route path="/lexiai/home" element={<MainLayout user={user} onLogout={handleLogout}><HomeObjects /></MainLayout>} />

            <Route path="/lexiai/nature" element={<MainLayout user={user} onLogout={handleLogout}><NatureSpace /></MainLayout>} />
            <Route path="/lexiai/weather" element={<MainLayout user={user} onLogout={handleLogout}><WeatherWatch /></MainLayout>} />
            <Route path="/lexiai/time" element={<MainLayout user={user} onLogout={handleLogout}><TimeCalendar /></MainLayout>} />

            <Route path="/lexiai/shapes" element={<MainLayout user={user} onLogout={handleLogout}><ShapesGeometry /></MainLayout>} />
            <Route path="/lexiai/patterns" element={<MainLayout user={user} onLogout={handleLogout}><PatternBuilder /></MainLayout>} />
            <Route path="/lexiai/size" element={<MainLayout user={user} onLogout={handleLogout}><SizeComparison /></MainLayout>} />
            <Route path="/lexiai/direction" element={<MainLayout user={user} onLogout={handleLogout}><DirectionSense /></MainLayout>} />
            <Route path="/lexiai/emotions" element={<MainLayout user={user} onLogout={handleLogout}><EmotionSense /></MainLayout>} />
            <Route path="/lexiai/symbols" element={<MainLayout user={user} onLogout={handleLogout}><SignsSymbols /></MainLayout>} />
            <Route path="/lexiai/safety" element={<MainLayout user={user} onLogout={handleLogout}><SafetySocial /></MainLayout>} />

            {/* 404 */}
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>

          {/* Global floating chatbot – always mounted */}
          <Chatbot />
        </>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
