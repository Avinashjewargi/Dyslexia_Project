// frontend/src/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh;
    background: #0b0e1a;
    font-family: 'Nunito', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow-x: hidden;
  }

  .auth-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 700px 500px at 0% 0%, rgba(99,102,241,.18) 0%, transparent 60%),
      radial-gradient(ellipse 500px 400px at 100% 100%, rgba(16,185,129,.12) 0%, transparent 60%),
      radial-gradient(ellipse 400px 300px at 80% 10%, rgba(139,92,246,.1) 0%, transparent 60%);
  }
  .auth-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(99,102,241,.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(99,102,241,.06) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .auth-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 560px;
    background: rgba(17,20,35,.97);
    border: 1px solid rgba(99,102,241,.25);
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.03) inset;
    animation: slideUp .45s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes slideUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .auth-header {
    padding: 2rem 2rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
    text-align: center;
  }
  .auth-logo-wrap {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 1rem;
    box-shadow: 0 8px 24px rgba(99,102,241,.4);
  }
  .auth-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.4rem; font-weight: 700; color: #f1f5f9; margin-bottom: .25rem;
  }
  .auth-subtitle { font-size: .85rem; color: #64748b; }

  .tab-bar {
    display: flex; gap: 4px;
    margin: 1.25rem 2rem .75rem;
    background: rgba(255,255,255,.04);
    border-radius: 14px; padding: 4px;
    border: 1px solid rgba(255,255,255,.07);
  }
  .tab-btn {
    flex: 1; padding: .6rem .5rem;
    border: none; border-radius: 11px;
    background: transparent;
    font-family: 'Nunito', sans-serif;
    font-size: .88rem; font-weight: 700;
    color: #64748b; cursor: pointer; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: .4rem;
  }
  .tab-btn.active {
    background: linear-gradient(135deg, rgba(99,102,241,.3), rgba(139,92,246,.2));
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,.4);
    box-shadow: 0 2px 12px rgba(99,102,241,.2);
  }
  .tab-btn:hover:not(.active) { color: #94a3b8; }

  .mode-bar {
    display: flex;
    border-bottom: 1px solid rgba(255,255,255,.07);
    margin: 0 2rem;
  }
  .mode-btn {
    flex: 1; padding: .75rem .5rem;
    border: none; background: transparent;
    font-family: 'Nunito', sans-serif;
    font-size: .95rem; font-weight: 700;
    color: #64748b; cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .2s; margin-bottom: -1px;
  }
  .mode-btn.active { color: #6366f1; border-bottom-color: #6366f1; }
  .mode-btn:hover:not(.active) { color: #94a3b8; }

  .form-body { padding: 1.5rem 2rem 2rem; }

  .alert {
    display: flex; align-items: flex-start; gap: .6rem;
    padding: .75rem 1rem; border-radius: 12px;
    font-size: .83rem; line-height: 1.5; margin-bottom: 1.25rem;
  }
  .alert-error   { background: rgba(239,68,68,.1);  border: 1px solid rgba(239,68,68,.3);  color: #fca5a5; }
  .alert-success { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.3); color: #6ee7b7; }
  .alert-info    { background: rgba(99,102,241,.1); border: 1px solid rgba(99,102,241,.3); color: #c7d2fe; }

  .demo-chip {
    display: inline-flex; align-items: center; gap: .4rem;
    background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.25);
    border-radius: 20px; padding: .35rem .85rem;
    font-size: .78rem; font-weight: 700; color: #34d399;
    cursor: pointer; transition: background .2s; margin-bottom: 1.25rem;
  }
  .demo-chip:hover { background: rgba(16,185,129,.18); }

  .section-label {
    font-size: .7rem; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase;
    color: #475569; margin: 1.25rem 0 .75rem;
    display: flex; align-items: center; gap: .5rem;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.07);
  }

  .field { margin-bottom: .85rem; }
  .field-label {
    display: block; font-size: .78rem; font-weight: 700;
    color: #94a3b8; margin-bottom: .4rem; letter-spacing: .02em;
  }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }

  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: .85rem; top: 50%;
    transform: translateY(-50%); font-size: .95rem;
    pointer-events: none; opacity: .5; z-index: 1;
  }

  input[type=text],
  input[type=email],
  input[type=password],
  select {
    width: 100%;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 11px;
    padding: .72rem .85rem .72rem 2.3rem;
    color: #f1f5f9;
    font-family: 'Nunito', sans-serif;
    font-size: .9rem; font-weight: 500;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    -webkit-appearance: none;
  }
  select { background-color: #111423; cursor: pointer; }
  input[type=text]::placeholder,
  input[type=email]::placeholder,
  input[type=password]::placeholder { color: #475569; }
  input[type=text]:focus,
  input[type=email]:focus,
  input[type=password]:focus,
  select:focus {
    border-color: #6366f1;
    background: rgba(99,102,241,.07);
    box-shadow: 0 0 0 3px rgba(99,102,241,.15);
  }
  input.err, select.err { border-color: rgba(239,68,68,.6); }
  .field-err { font-size: .75rem; color: #f87171; margin-top: .3rem; }

  .opt-badge {
    display: inline-block; background: rgba(255,255,255,.06);
    border-radius: 4px; padding: .1rem .4rem;
    font-size: .65rem; font-weight: 700; color: #475569;
    margin-left: .4rem; letter-spacing: .05em; text-transform: uppercase;
  }

  .check-row {
    display: flex; align-items: center; gap: .55rem; margin-bottom: 1rem;
  }
  .check-row input[type=checkbox] {
    width: 17px; height: 17px; padding: 0;
    accent-color: #6366f1; cursor: pointer; flex-shrink: 0;
  }
  .check-row label {
    font-size: .82rem; color: #94a3b8; cursor: pointer; font-weight: 600; line-height: 1.4;
  }

  .btn-primary {
    width: 100%; padding: .85rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none; border-radius: 12px;
    color: #fff; font-family: 'Nunito', sans-serif;
    font-size: .95rem; font-weight: 800;
    cursor: pointer; transition: all .2s;
    box-shadow: 0 4px 20px rgba(99,102,241,.4);
    letter-spacing: .02em; margin-top: .5rem;
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,.55);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; }

  .btn-ghost {
    width: 100%; padding: .75rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px;
    color: #64748b; font-family: 'Nunito', sans-serif;
    font-size: .88rem; font-weight: 700;
    cursor: pointer; transition: all .2s; margin-top: .65rem;
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,.2); color: #94a3b8; }

  .divider {
    display: flex; align-items: center; gap: .75rem;
    margin: 1rem 0; color: #334155;
    font-size: .75rem; letter-spacing: .08em; text-transform: uppercase;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.07);
  }

  .spin {
    display: inline-block; width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin .6s linear infinite;
    vertical-align: middle; margin-right: .45rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pw-strength { margin-top: .4rem; display: flex; gap: 3px; height: 3px; }
  .pw-bar { flex: 1; border-radius: 2px; background: rgba(255,255,255,.08); transition: background .3s; }
  .pw-bar.weak   { background: #ef4444; }
  .pw-bar.medium { background: #f59e0b; }
  .pw-bar.strong { background: #10b981; }

  .auth-footer {
    text-align: center; font-size: .78rem;
    color: #475569; margin-top: 1.25rem; line-height: 1.8;
  }
  .auth-footer a-link {
    color: #6366f1; cursor: pointer; font-weight: 700;
  }

  @media (max-width: 580px) {
    .auth-card { border-radius: 18px; }
    .form-body { padding-left: 1.25rem; padding-right: 1.25rem; }
    .tab-bar { margin-left: 1.25rem; margin-right: 1.25rem; }
    .mode-bar { margin-left: 1.25rem; margin-right: 1.25rem; }
    .field-row { grid-template-columns: 1fr; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, name, type = 'text', placeholder, value, onChange, error, icon, optional }) {
  return (
    <div className="field">
      <label className="field-label">
        {label}{optional && <span className="opt-badge">optional</span>}
      </label>
      <div className="input-wrap">
        {icon && <span className="input-icon">{icon}</span>}
        <input type={type} name={name} placeholder={placeholder}
          value={value} onChange={onChange}
          className={error ? 'err' : ''}
          autoComplete={type === 'password' ? 'new-password' : 'off'} />
      </div>
      {error && <div className="field-err">{error}</div>}
    </div>
  );
}

function pwStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  return s;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [tab,  setTab]  = useState('student');
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState(null);

  const [login, setLogin] = useState({ email: '', password: '', remember: false });
  const [loginErr, setLoginErr] = useState({});

  const [reg, setReg] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    grade: '', studentId: '', teacherCode: '', language: 'en', agreeTerms: false,
  });
  const [regErr, setRegErr] = useState({});

  const strength = pwStrength(reg.password);

  const DEMO = {
    student: { email: 'student@dyslexia.edu', password: 'student123' },
    teacher: { email: 'teacher@dyslexia.edu', password: 'teacher123' },
  };

  const switchMode = (m) => { setMode(m); setAlert(null); setLoginErr({}); setRegErr({}); };
  const switchTab  = (t) => { setTab(t);  setAlert(null); setLoginErr({}); setRegErr({}); };

  const onLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLogin(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setLoginErr(p => ({ ...p, [name]: '' }));
    setAlert(null);
  };

  const onRegChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReg(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setRegErr(p => ({ ...p, [name]: '' }));
    setAlert(null);
  };

  const fillDemo = () => {
    setLogin({ email: DEMO[tab].email, password: DEMO[tab].password, remember: false });
    setAlert({ type: 'info', msg: `Demo ${tab} credentials filled — click Sign In!` });
  };

  const validateLogin = () => {
    const e = {};
    if (!login.email)  e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(login.email)) e.email = 'Enter a valid email';
    if (!login.password) e.password = 'Password is required';
    setLoginErr(e);
    return !Object.keys(e).length;
  };

  const validateReg = () => {
    const e = {};
    if (!reg.name.trim())   e.name = 'Full name is required';
    if (!reg.email)         e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(reg.email)) e.email = 'Enter a valid email';
    if (!reg.password)      e.password = 'Password is required';
    else if (reg.password.length < 6) e.password = 'Minimum 6 characters';
    if (reg.password !== reg.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (tab === 'student' && !reg.grade) e.grade = 'Please select a grade';
    if (!reg.agreeTerms)    e.agreeTerms = 'You must agree to the terms';
    setRegErr(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true); setAlert(null);

    if (login.email === DEMO[tab].email && login.password === DEMO[tab].password) {
      await new Promise(r => setTimeout(r, 700));
      const user = { email: login.email, role: tab, name: tab === 'student' ? 'Emma Thompson' : 'Dr. Sarah Johnson', id: `demo-${tab}` };
      (login.remember ? localStorage : sessionStorage).setItem('dyslexia_user', JSON.stringify(user));
      setAlert({ type: 'success', msg: '✓ Login successful! Redirecting…' });
      setTimeout(() => { onLogin && onLogin(user); navigate('/'); }, 900);
      setLoading(false); return;
    }

    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login.email, password: login.password })
      });
      const data = await res.json();
      if (data.success) {
        // Respect \"Remember me\" for storage location
        const storage = login.remember ? localStorage : sessionStorage;
        storage.setItem('dyslexia_token', data.token);
        storage.setItem('dyslexia_user', JSON.stringify(data.user));
        setAlert({ type: 'success', msg: `✓ Welcome back, ${data.user.name}!` });
        setTimeout(() => { onLogin && onLogin(data.user); navigate('/'); }, 900);
      } else {
        setAlert({ type: 'error', msg: data.error || 'Invalid credentials.' });
      }
    } catch {
      setAlert({ type: 'error', msg: 'Cannot reach server. Try demo credentials.' });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateReg()) return;
    setLoading(true); setAlert(null);

    const payload = {
      email: reg.email, password: reg.password,
      name: reg.name, role: tab, language: reg.language,
      ...(tab === 'student' && { grade: reg.grade, studentId: reg.studentId }),
      ...(tab === 'teacher' && { teacherCode: reg.teacherCode }),
    };

    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        // New accounts default to persistent login
        localStorage.setItem('dyslexia_token', data.token);
        localStorage.setItem('dyslexia_user', JSON.stringify(data.user));
        setAlert({ type: 'success', msg: `✓ Account created! Welcome, ${data.user.name}!` });
        setTimeout(() => { onLogin && onLogin(data.user); navigate('/'); }, 1000);
      } else {
        setAlert({ type: 'error', msg: data.error || 'Registration failed.' });
      }
    } catch {
      setAlert({ type: 'error', msg: 'Cannot reach server. Please try again.' });
    }
    setLoading(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="auth-root">
        <div className="auth-bg" />
        <div className="auth-grid-bg" />

        <div className="auth-card">

          {/* ── Header ─────────────────────────────────────── */}
          <div className="auth-header">
            <div className="auth-logo-wrap">📚</div>
            <div className="auth-title">Adaptive Reading Assistant</div>
            <div className="auth-subtitle">Supporting students with dyslexia</div>
          </div>

          {/* ── Role Tabs ──────────────────────────────────── */}
          <div className="tab-bar">
            <button className={`tab-btn${tab === 'student' ? ' active' : ''}`} onClick={() => switchTab('student')}>
              🎒 Student
            </button>
            <button className={`tab-btn${tab === 'teacher' ? ' active' : ''}`} onClick={() => switchTab('teacher')}>
              🏫 Teacher
            </button>
          </div>

          {/* ── Mode Bar ───────────────────────────────────── */}
          <div className="mode-bar">
            <button className={`mode-btn${mode === 'login' ? ' active' : ''}`} onClick={() => switchMode('login')}>
              Sign In
            </button>
            <button className={`mode-btn${mode === 'register' ? ' active' : ''}`} onClick={() => switchMode('register')}>
              Create Account
            </button>
          </div>

          <div className="form-body">

            {/* Alert banner */}
            {alert && (
              <div className={`alert alert-${alert.type}`}>
                <span>{alert.type === 'error' ? '⚠️' : alert.type === 'success' ? '✅' : 'ℹ️'}</span>
                <span>{alert.msg}</span>
              </div>
            )}

            {/* ══════════════ LOGIN ══════════════════════════ */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} noValidate>

                <span className="demo-chip" onClick={fillDemo}>
                  ⚡ Fill demo {tab} credentials
                </span>

                <Field label="Email Address" name="email" type="email"
                  placeholder={`${tab}@dyslexia.edu`}
                  value={login.email} onChange={onLoginChange}
                  error={loginErr.email} icon="✉️" />

                <Field label="Password" name="password" type="password"
                  placeholder="Enter your password"
                  value={login.password} onChange={onLoginChange}
                  error={loginErr.password} icon="🔒" />

                {/* Remember me + Forgot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div className="check-row" style={{ marginBottom: 0 }}>
                    <input type="checkbox" name="remember" id="remember"
                      checked={login.remember} onChange={onLoginChange}
                      style={{ width: 'auto', padding: 0 }} />
                    <label htmlFor="remember" style={{ fontSize: '.82rem', color: '#94a3b8', fontWeight: 600 }}>
                      Remember me
                    </label>
                  </div>
                  <a href="#" style={{ fontSize: '.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? <><span className="spin" />Signing in…</> : `Sign In as ${tab === 'student' ? 'Student' : 'Teacher'}`}
                </button>

                <div className="divider">or</div>

                <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
                  Continue Without Login
                </button>

                <div className="auth-footer">
                  Don't have an account?{' '}
                  <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}
                    onClick={() => switchMode('register')}>
                    Create one free →
                  </span>
                </div>
              </form>
            )}

            {/* ══════════════ REGISTER ═══════════════════════ */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} noValidate>

                {/* Personal Info */}
                <div className="section-label">👤 Personal Information</div>

                <Field label="Full Name" name="name"
                  placeholder="Enter your full name"
                  value={reg.name} onChange={onRegChange}
                  error={regErr.name} icon="👤" />

                <Field label="Email Address" name="email" type="email"
                  placeholder="you@school.edu"
                  value={reg.email} onChange={onRegChange}
                  error={regErr.email} icon="✉️" />

                {/* Password */}
                <div className="section-label">🔐 Set Password</div>

                <div className="field-row">
                  {/* Password with strength bar */}
                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="input-wrap">
                      <span className="input-icon">🔒</span>
                      <input type="password" name="password"
                        placeholder="Min 6 characters"
                        value={reg.password} onChange={onRegChange}
                        className={regErr.password ? 'err' : ''}
                        autoComplete="new-password" />
                    </div>
                    {reg.password && (
                      <div className="pw-strength">
                        <div className={`pw-bar ${strength >= 1 ? (strength === 1 ? 'weak' : strength === 2 ? 'medium' : 'strong') : ''}`} />
                        <div className={`pw-bar ${strength >= 2 ? (strength === 2 ? 'medium' : 'strong') : ''}`} />
                        <div className={`pw-bar ${strength >= 3 ? 'strong' : ''}`} />
                      </div>
                    )}
                    {regErr.password && <div className="field-err">{regErr.password}</div>}
                  </div>

                  <Field label="Confirm Password" name="confirmPassword" type="password"
                    placeholder="Repeat password"
                    value={reg.confirmPassword} onChange={onRegChange}
                    error={regErr.confirmPassword} icon="🔒" />
                </div>

                {/* ── Student fields ───────────────────────── */}
                {tab === 'student' && (
                  <>
                    <div className="section-label">🎓 Student Details</div>
                    <div className="field-row">
                      {/* Grade select */}
                      <div className="field">
                        <label className="field-label">Grade / Class</label>
                        <div className="input-wrap">
                          <span className="input-icon">📋</span>
                          <select name="grade" value={reg.grade} onChange={onRegChange}
                            className={regErr.grade ? 'err' : ''}>
                            <option value="">Select your grade…</option>
                            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(g => (
                              <option key={g} value={g}>Grade {g}</option>
                            ))}
                          </select>
                        </div>
                        {regErr.grade && <div className="field-err">{regErr.grade}</div>}
                      </div>

                      <Field label="Student ID" name="studentId" optional
                        placeholder="e.g. STU2024001"
                        value={reg.studentId} onChange={onRegChange} icon="🪪" />
                    </div>
                  </>
                )}

                {/* ── Teacher fields ───────────────────────── */}
                {tab === 'teacher' && (
                  <>
                    <div className="section-label">🏫 Teacher Details</div>
                    <Field label="Teacher / School Code" name="teacherCode" optional
                      placeholder="Provided by your school admin"
                      value={reg.teacherCode} onChange={onRegChange} icon="🔑" />
                  </>
                )}

                {/* Preferences */}
                <div className="section-label">⚙️ Preferences</div>

                <div className="field">
                  <label className="field-label">Preferred Language</label>
                  <div className="input-wrap">
                    <span className="input-icon">🌐</span>
                    <select name="language" value={reg.language} onChange={onRegChange}>
                      <option value="en">🇬🇧 English</option>
                      <option value="hi">🇮🇳 Hindi</option>
                      <option value="kn">🇮🇳 Kannada</option>
                    </select>
                  </div>
                </div>

                {/* Terms */}
                <div className="check-row" style={{ marginTop: '.5rem' }}>
                  <input type="checkbox" name="agreeTerms" id="agreeTerms"
                    checked={reg.agreeTerms} onChange={onRegChange}
                    style={{ width: 'auto', padding: 0 }} />
                  <label htmlFor="agreeTerms">
                    I agree to the{' '}
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: '#6366f1', textDecoration: 'none' }}>Privacy Policy</a>
                  </label>
                </div>
                {regErr.agreeTerms && (
                  <div className="field-err" style={{ marginTop: '-.5rem', marginBottom: '.6rem' }}>
                    {regErr.agreeTerms}
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading
                    ? <><span className="spin" />Creating account…</>
                    : `Create ${tab === 'student' ? 'Student' : 'Teacher'} Account`}
                </button>

                <div className="divider">or</div>

                <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
                  Continue Without Account
                </button>

                <div className="auth-footer">
                  Already have an account?{' '}
                  <span style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 700 }}
                    onClick={() => switchMode('login')}>
                    Sign In →
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
