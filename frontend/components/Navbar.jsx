// frontend/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────
// Full redesign: flex layout • working i18n • animated LexiAI
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Settings as SettingsIcon, LogOut,
  User, ChevronDown, Menu, X, BarChart2, Mic, Sparkles,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

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
