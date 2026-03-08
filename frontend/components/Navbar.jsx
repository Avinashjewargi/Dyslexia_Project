<<<<<<< HEAD
// frontend/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// Full redesign: flex layout • working i18n • animated LexiAI
// ─────────────────────────────────────────────────────────────
=======
<<<<<<< HEAD
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
=======
// frontend/components/Navbar.jsx - UPDATED (AR button removed, now in Reader)
>>>>>>> c47a464ca5f886da4147d734e8915dd7dc5b3c47

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Settings as SettingsIcon, LogOut,
  User, ChevronDown, Menu, X, BarChart2, Mic, Sparkles,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

<<<<<<< HEAD
/* ═══════════════════════════════════════
   KEYFRAMES  (injected once via <style>)
═══════════════════════════════════════ */
const GLOBAL_CSS = `
  /* LexiAI animations */
  @keyframes lexiPulse {
    0%,100%{box-shadow:0 0 8px rgba(167,139,250,.5),0 0 20px rgba(96,165,250,.25);}
    50%    {box-shadow:0 0 20px rgba(167,139,250,.95),0 0 40px rgba(96,165,250,.55),0 0 60px rgba(167,139,250,.18);}
  }
  @keyframes lexiShimmer {
    0%  {background-position:-200% center;}
    100%{background-position: 200% center;}
  }
  @keyframes lexiStar {
    0%  {transform:rotate(0deg)   scale(1);}
    50% {transform:rotate(180deg) scale(1.35);}
    100%{transform:rotate(360deg) scale(1);}
  }
  @keyframes lexiBadge {
    0%,100%{transform:translateY(0)   scale(1);}
    40%    {transform:translateY(-3px) scale(1.1);}
    70%    {transform:translateY(1px)  scale(.96);}
  }
  @keyframes lexiSparkle {
    0%  {opacity:0;transform:translate(0,0)                    scale(0);}
    45% {opacity:1;}
    100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.2);}
  }
  @keyframes lexiRing {
    0%  {transform:scale(1);  opacity:.55;}
    100%{transform:scale(2.3);opacity:0;}
  }
=======
function AppNavbar({ onOpenSettings, user, onLogout }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
>>>>>>> c47a464ca5f886da4147d734e8915dd7dc5b3c47

  /* LexiAI pill */
  .lexi-btn{
    position:relative;overflow:visible;
    background:linear-gradient(135deg,rgba(167,139,250,.18),rgba(96,165,250,.18))!important;
    border:1.5px solid rgba(167,139,250,.55)!important;
    border-radius:10px!important;padding:.45rem 1.1rem!important;
    animation:lexiPulse 2.5s ease-in-out infinite;
    text-decoration:none;
  }
  .lexi-btn:hover{
    background:linear-gradient(135deg,rgba(167,139,250,.32),rgba(96,165,250,.32))!important;
    border-color:rgba(167,139,250,.88)!important;
  }
  .lexi-text{
    background:linear-gradient(90deg,#c4b5fd,#93c5fd,#f9a8d4,#c4b5fd);
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:lexiShimmer 2.5s linear infinite;
    font-weight:800;letter-spacing:.02em;
  }
  .lexi-star{animation:lexiStar 3s linear infinite;flex-shrink:0;}
  .lexi-new{
    position:absolute;top:-9px;right:-9px;
    background:linear-gradient(135deg,#f97316,#ef4444);
    color:#fff;font-size:.52rem;font-weight:900;
    padding:2px 6px;border-radius:20px;letter-spacing:.08em;text-transform:uppercase;
    animation:lexiBadge 1.8s ease-in-out infinite;
    box-shadow:0 2px 8px rgba(239,68,68,.6);pointer-events:none;z-index:10;
  }
  .lexi-sparkle{
    position:absolute;width:4px;height:4px;border-radius:50%;
    pointer-events:none;
    animation:lexiSparkle 2s ease-in-out infinite;
  }
  .lexi-ring{
    position:absolute;inset:-4px;border:1.5px solid rgba(167,139,250,.5);
    border-radius:14px;pointer-events:none;
    animation:lexiRing 2.5s ease-out infinite;
  }

  /* responsive */
  @media(max-width:992px){
    .nb-center{display:none!important;}
    .nb-mob-tog{display:flex!important;}
  }

<<<<<<< HEAD
  /* button hovers */
  .nb-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(102,126,234,.6)!important;}
  .nb-btn-outline:hover{background:rgba(167,139,250,.15)!important;color:#fff!important;}
`;

/* sparkle config */
const SPARKLES = [
  { l:'-14px', t:'-12px', tx:'-18px', ty:'-20px', d:'0s',    c:'#c4b5fd' },
  { l:'100%',  t:'-10px', tx:'18px',  ty:'-20px', d:'0.7s',  c:'#93c5fd' },
  { l:'50%',   t:'100%',  tx:'0px',   ty:'20px',  d:'1.35s', c:'#f9a8d4' },
  { l:'-10px', t:'55%',   tx:'-20px', ty:'6px',   d:'2.0s',  c:'#fde68a' },
];

/* ═══════════════════════════════════════
   INLINE STYLE TOKENS
═══════════════════════════════════════ */
const S = {
  nav:{
    position:'sticky',top:0,zIndex:1000,
    background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    boxShadow:'0 4px 30px rgba(0,0,0,.45)',
    padding:'0 2rem',height:64,
    display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',
    fontFamily:"'Segoe UI',system-ui,sans-serif",
  },
  brand:{
    display:'flex',alignItems:'center',gap:'.5rem',
    textDecoration:'none',fontWeight:800,fontSize:'1.15rem',
    background:'linear-gradient(90deg,#a78bfa,#60a5fa)',
    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
    whiteSpace:'nowrap',flexShrink:0,
  },
  center:{
    display:'flex',alignItems:'center',gap:'.2rem',
    flex:1,justifyContent:'center',
  },
  right:{display:'flex',alignItems:'center',gap:'.5rem',flexShrink:0},

  link:{
    display:'flex',alignItems:'center',gap:'.35rem',
    padding:'.4rem .72rem',borderRadius:8,
    textDecoration:'none',color:'rgba(255,255,255,.72)',
    fontSize:'.875rem',fontWeight:500,
    transition:'all .2s ease',whiteSpace:'nowrap',
    cursor:'pointer',background:'transparent',border:'none',fontFamily:'inherit',
  },
  linkHov :{color:'#fff',background:'rgba(255,255,255,.1)'},
  linkAct :{color:'#fff',background:'rgba(167,139,250,.16)'},

  ddWrap:{position:'relative'},
  ddMenu:{
    position:'absolute',top:'calc(100% + 8px)',left:'50%',
    transform:'translateX(-50%)',
    background:'linear-gradient(135deg,#1a1a2e,#16213e)',
    border:'1px solid rgba(167,139,250,.22)',borderRadius:12,
    padding:'.45rem',minWidth:224,
    boxShadow:'0 20px 60px rgba(0,0,0,.55)',zIndex:2000,
  },
  ddHdr:{
    padding:'.35rem .8rem',fontSize:'.68rem',fontWeight:700,
    letterSpacing:'.08em',color:'rgba(167,139,250,.65)',textTransform:'uppercase',
  },
  ddDiv:{height:1,background:'rgba(255,255,255,.07)',margin:'.2rem 0'},
  ddItem:{
    display:'flex',flexDirection:'column',
    padding:'.55rem .8rem',borderRadius:8,
    textDecoration:'none',color:'rgba(255,255,255,.8)',
    fontSize:'.875rem',fontWeight:500,transition:'all .15s',cursor:'pointer',
  },
  ddItemHov:{background:'rgba(167,139,250,.13)',color:'#fff'},
  ddDesc:{fontSize:'.73rem',color:'rgba(255,255,255,.38)',marginTop:2},

  btnPrimary:{
    display:'flex',alignItems:'center',gap:'.4rem',
    padding:'.4rem 1rem',borderRadius:8,border:'none',
    background:'linear-gradient(135deg,#667eea,#764ba2)',
    color:'#fff',fontSize:'.875rem',fontWeight:600,
    cursor:'pointer',textDecoration:'none',transition:'all .2s',
    boxShadow:'0 2px 12px rgba(102,126,234,.4)',fontFamily:'inherit',
  },
  btnOutline:{
    display:'flex',alignItems:'center',gap:'.4rem',
    padding:'.4rem .75rem',borderRadius:8,
    border:'1px solid rgba(167,139,250,.4)',background:'transparent',
    color:'#c4b5fd',fontSize:'.875rem',fontWeight:500,
    cursor:'pointer',transition:'all .2s',fontFamily:'inherit',
  },
  badge:{
    padding:'.15rem .48rem',borderRadius:20,fontSize:'.62rem',fontWeight:700,
    background:'linear-gradient(90deg,#10b981,#059669)',color:'#fff',
  },
  mobTog:{
    background:'none',border:'none',color:'#fff',
    cursor:'pointer',padding:'.25rem',display:'none',fontFamily:'inherit',
  },
  mobMenu:{
    position:'fixed',top:64,left:0,right:0,
    background:'linear-gradient(135deg,#0f0c29,#302b63)',
    borderBottom:'1px solid rgba(167,139,250,.2)',
    padding:'1rem',display:'flex',flexDirection:'column',gap:'.2rem',
    zIndex:999,boxShadow:'0 20px 40px rgba(0,0,0,.5)',
  },
};

/* ═══════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════ */
function NLink({ to, children }) {
  const [h, setH] = useState(false);
  const loc = useLocation();
  return (
    <Link
      to={to}
      style={{ ...S.link, ...(loc.pathname === to ? S.linkAct : h ? S.linkHov : {}) }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >{children}</Link>
=======
<<<<<<< HEAD
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
=======
  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          <BookOpen size={28} className="me-2" style={{ marginBottom: '4px' }} />
          {t('navbar.appTitle', 'Adaptive Reading Assistant')}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Reader Link */}
            <Nav.Link as={Link} to="/reader">
              📖 {t('navbar.reader', 'Reader')}
            </Nav.Link>
            
            {/* Stories Link */}
            <Nav.Link as={Link} to="/stories">
              📚 {t('navbar.stories', 'Stories')}
            </Nav.Link>

            {/* LexiAI Learning Module */}
            <Nav.Link 
              as={Link} 
              to="/lexiai"
              className="fw-bold text-primary"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              <Sparkles size={18} className="me-1" style={{ marginBottom: '2px', color: '#667eea' }} />
              {t('navbar.lexiAI', 'LexiAI Learning')}
            </Nav.Link>
            
            {/* Dashboard Dropdown */}
            <NavDropdown 
              title={
                <span>
                  📊 {t('navbar.dashboards', 'Dashboards')}
                </span>
              } 
              id="dashboard-dropdown"
            >
              <NavDropdown.Item as={Link} to="/dashboard">
                👤 {t('navbar.studentDashboard', 'Student Dashboard')}
                <div className="small text-muted">
                  {t('navbar.studentDashboardDesc', 'Track your progress')}
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/teacher-dashboard">
                👩‍🏫 {t('navbar.teacherDashboard', 'Teacher Dashboard')}
                <div className="small text-muted">
                  {t('navbar.teacherDashboardDesc', 'Monitor class performance')}
                </div>
              </NavDropdown.Item>
            </NavDropdown>
            
            {/* Phonology Dropdown */}
            <NavDropdown 
              title={
                <span>
                  🎯 {t('navbar.phonologicalAwareness', 'Phonological Awareness')}
                </span>
              } 
              id="phonology-dropdown"
            >
              <NavDropdown.Header>
                {t('navbar.practiceActivities', 'Practice Activities')}
              </NavDropdown.Header>
              
              <NavDropdown.Item as={Link} to="/phonology/spelling">
                📝 {t('navbar.spellingPractice', 'Spelling Practice')}
                <div className="small text-muted">
                  {t('navbar.spellingPracticeDesc', '3 Levels • Easy to Hard')}
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/phonology/replacement">
                🔄 {t('navbar.letterReplacement', 'Letter Replacement')}
                <div className="small text-muted">
                  {t('navbar.letterReplacementDesc', '15 Challenges')}
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/phonology/odd-one-out">
                ⭐ {t('navbar.oddOneOut', 'Odd One Out')}
                <div className="small text-muted">
                  {t('navbar.oddOneOutDesc', '30 Tests • Categories, Sounds & Letters')}
                </div>
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item as={Link} to="/phonology">
                <strong>🏠 {t('navbar.activityHub', 'Activity Hub')}</strong>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          {/* RIGHT SIDE - Language Selector, Login, then Accessibility */}
          <div className="d-flex align-items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector compact={true} showLabel={false} />

            {/* Login/User Dropdown */}
            {user ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={18} className="me-2" />
                    {user.name}
                    {user.role === 'teacher' && (
                      <Badge bg="success" className="ms-2">
                        {t('navbar.teacher', 'Teacher')}
                      </Badge>
                    )}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Header>
                  <div className="small text-muted">
                    {t('navbar.loggedInAs', 'Logged in as')}
                  </div>
                  <strong>{user.name}</strong>
                  <div className="small text-muted">{user.email}</div>
                </NavDropdown.Header>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item onClick={handleLogout}>
                  <LogOut size={18} className="me-2" />
                  {t('navbar.logout', 'Logout')}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                variant="primary" 
                size="sm"
                as={Link}
                to="/login"
              >
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
                {t('navbar.login', 'Login')}
              </Button>
            )}

<<<<<<< HEAD
            <Button 
              variant="outline-primary"
              onClick={handleSettingsClick}
              className="w-100 mt-3"
=======
            {/* Accessibility Settings - TOP RIGHT CORNER */}
            <Button 
              variant="outline-primary" 
              onClick={handleSettingsClick}
              className="d-flex align-items-center"
              size="sm"
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
            >
              <SettingsIcon size={18} className="me-2" />
              {t('navbar.accessibility', 'Accessibility')}
            </Button>
          </div>
<<<<<<< HEAD
        </Offcanvas.Body>
      </Offcanvas>
    </>
=======
        </Navbar.Collapse>
      </Container>
    </Navbar>
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
>>>>>>> c47a464ca5f886da4147d734e8915dd7dc5b3c47
  );
}

function DDrop({ trigger, children }) {
  const [o, setO] = useState(false);
  return (
    <div style={S.ddWrap} onMouseEnter={() => setO(true)} onMouseLeave={() => setO(false)}>
      <button style={{ ...S.link, ...(o ? S.linkHov : {}) }}>
        {trigger}
        <ChevronDown size={13} style={{ transition:'transform .2s', transform: o ? 'rotate(180deg)' : 'none', marginLeft:1 }} />
      </button>
      {o && <div style={S.ddMenu}>{children}</div>}
    </div>
  );
}

function DItem({ to, children, onClick }) {
  const [h, setH] = useState(false);
  const p = {
    style:{ ...S.ddItem, ...(h ? S.ddItemHov : {}) },
    onMouseEnter:() => setH(true),
    onMouseLeave:() => setH(false),
  };
  return to ? <Link to={to} {...p}>{children}</Link> : <div {...p} onClick={onClick}>{children}</div>;
}

function LexiBtn({ label }) {
  return (
    <Link to="/lexiai" className="lexi-btn" style={{ ...S.link }}>
      <span className="lexi-ring" />
      {SPARKLES.map((sp, i) => (
        <span key={i} className="lexi-sparkle"
          style={{ left:sp.l, top:sp.t, '--tx':sp.tx, '--ty':sp.ty,
                   animationDelay:sp.d, background:sp.c }} />
      ))}
      <Sparkles size={15} className="lexi-star" color="#c4b5fd" />
      <span className="lexi-text">{label}</span>
      <span className="lexi-new">NEW</span>
    </Link>
  );
}

/* ═══════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════ */
export default function AppNavbar({ onOpenSettings, user, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mob, setMob] = useState(false);

  const logout = () => { onLogout?.(); navigate('/'); };

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 992) setMob(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const mobLinks = [
    ['/reader',                '📖', 'navbar.reader',              'Reader'],
    ['/stories',               '📚', 'navbar.stories',             'Stories'],
    ['/lexiai',                '✨', 'navbar.lexiAI',              'LexiAI Learning'],
    ['/dashboard',             '👤', 'navbar.studentDashboard',    'Student Dashboard'],
    ['/teacher-dashboard',     '👩‍🏫', 'navbar.teacherDashboard',   'Teacher Dashboard'],
    ['/phonology/spelling',    '📝', 'navbar.spellingPractice',    'Spelling Practice'],
    ['/phonology/replacement', '🔄', 'navbar.letterReplacement',   'Letter Replacement'],
    ['/phonology/odd-one-out', '⭐', 'navbar.oddOneOut',           'Odd One Out'],
    ['/phonology',             '🏠', 'navbar.activityHub',         'Activity Hub'],
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <nav style={S.nav}>

        {/* BRAND */}
        <Link to="/" style={S.brand}>
          <BookOpen size={23} color="#a78bfa" />
          {t('navbar.appTitle', 'Adaptive Reading')}
        </Link>

        {/* CENTER */}
        <div className="nb-center" style={S.center}>

          <NLink to="/reader">📖 {t('navbar.reader','Reader')}</NLink>
          <NLink to="/stories">📚 {t('navbar.stories','Stories')}</NLink>

          {/* ✦ LexiAI animated pill */}
          <LexiBtn label={t('navbar.lexiAI','LexiAI')} />

          {/* Dashboards */}
          <DDrop trigger={<><BarChart2 size={14}/> {t('navbar.dashboards','Dashboards')}</>}>
            <DItem to="/dashboard">
              <span>👤 {t('navbar.studentDashboard','Student Dashboard')}</span>
              <span style={S.ddDesc}>{t('navbar.studentDashboardDesc','Track your progress')}</span>
            </DItem>
            <div style={S.ddDiv}/>
            <DItem to="/teacher-dashboard">
              <span>👩‍🏫 {t('navbar.teacherDashboard','Teacher Dashboard')}</span>
              <span style={S.ddDesc}>{t('navbar.teacherDashboardDesc','Monitor class performance')}</span>
            </DItem>
          </DDrop>

          {/* Phonology */}
          <DDrop trigger={<><Mic size={14}/> {t('navbar.phonologicalAwareness','Phonology')}</>}>
            <div style={S.ddHdr}>{t('navbar.practiceActivities','Practice Activities')}</div>
            <DItem to="/phonology/spelling">
              <span>📝 {t('navbar.spellingPractice','Spelling Practice')}</span>
              <span style={S.ddDesc}>{t('navbar.spellingPracticeDesc','3 Levels • Easy to Hard')}</span>
            </DItem>
            <div style={S.ddDiv}/>
            <DItem to="/phonology/replacement">
              <span>🔄 {t('navbar.letterReplacement','Letter Replacement')}</span>
              <span style={S.ddDesc}>{t('navbar.letterReplacementDesc','15 Challenges')}</span>
            </DItem>
            <div style={S.ddDiv}/>
            <DItem to="/phonology/odd-one-out">
              <span>⭐ {t('navbar.oddOneOut','Odd One Out')}</span>
              <span style={S.ddDesc}>{t('navbar.oddOneOutDesc','30 Tests • Categories, Sounds & Letters')}</span>
            </DItem>
            <div style={S.ddDiv}/>
            <DItem to="/phonology">
              <span>🏠 <strong>{t('navbar.activityHub','Activity Hub')}</strong></span>
            </DItem>
          </DDrop>
        </div>

        {/* RIGHT */}
        <div style={S.right}>

          {/* ── Language Selector (your existing component, wired to i18n) ── */}
          <LanguageSelector compact={true} showLabel={false} />

          {/* User / Login */}
          {user ? (
            <DDrop trigger={
              <span style={{display:'flex',alignItems:'center',gap:'.35rem'}}>
                <User size={14}/>
                {user.name}
                {user.role==='teacher' && <span style={S.badge}>{t('navbar.teacher','Teacher')}</span>}
              </span>
            }>
              <div style={{padding:'.5rem .8rem',borderBottom:'1px solid rgba(255,255,255,.08)',marginBottom:'.25rem'}}>
                <div style={{fontSize:'.68rem',color:'rgba(255,255,255,.38)',textTransform:'uppercase',letterSpacing:'.07em'}}>
                  {t('navbar.loggedInAs','Logged in as')}
                </div>
                <div style={{fontWeight:700,color:'#fff',fontSize:'.875rem'}}>{user.name}</div>
                <div style={{fontSize:'.73rem',color:'rgba(255,255,255,.38)'}}>{user.email}</div>
              </div>
              <DItem onClick={logout}>
                <span style={{color:'#f87171',display:'flex',alignItems:'center',gap:'.4rem'}}>
                  <LogOut size={14}/> {t('navbar.logout','Logout')}
                </span>
              </DItem>
            </DDrop>
          ) : (
            <Link to="/login" style={S.btnPrimary} className="nb-btn-primary">
              {t('navbar.login','Login')}
            </Link>
          )}

          {/* Accessibility */}
          <button style={S.btnOutline} className="nb-btn-outline" onClick={onOpenSettings}>
            <SettingsIcon size={14}/>
            {t('navbar.accessibility','Accessibility')}
          </button>

          {/* Hamburger */}
          <button className="nb-mob-tog" style={S.mobTog} onClick={() => setMob(v=>!v)} aria-label="Menu">
            {mob ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mob && (
        <div style={S.mobMenu}>
          {mobLinks.map(([to,emoji,key,fb]) => (
            <Link key={to} to={to}
              style={{...S.link,justifyContent:'flex-start',padding:'.6rem .75rem'}}
              onClick={() => setMob(false)}
            >
              {emoji} {t(key,fb)}
            </Link>
          ))}

          <div style={{...S.ddDiv,margin:'.5rem 0'}}/>

          {/* Full language selector in mobile */}
          <div style={{padding:'0 .4rem'}}>
            <LanguageSelector compact={false} showLabel={true}/>
          </div>

          <div style={{...S.ddDiv,margin:'.5rem 0'}}/>

          {user ? (
            <button style={{...S.link,color:'#f87171',justifyContent:'flex-start'}} onClick={logout}>
              <LogOut size={14}/> {t('navbar.logout','Logout')}
            </button>
          ) : (
            <Link to="/login" style={{...S.btnPrimary,justifyContent:'center'}} onClick={() => setMob(false)}>
              {t('navbar.login','Login')}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
