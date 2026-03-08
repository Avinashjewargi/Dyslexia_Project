// frontend/components/Chatbot.jsx
// Uses ReactDOM.createPortal to render directly into document.body
// This GUARANTEES fixed positioning works regardless of parent CSS
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

// ─── Portal wrapper: renders children directly into <body> ───────────────────
function Portal({ children }) {
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    const node = el.current;
    document.body.appendChild(node);
    return () => document.body.removeChild(node);
  }, []);

  return ReactDOM.createPortal(children, el.current);
}

// ─── Inject global styles once ───────────────────────────────────────────────
const STYLE_ID = "dyslexia-chatbot-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .dcb-fab-wrap {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 2147483647 !important;
    }

    .dcb-panel-wrap {
      position: fixed !important;
      bottom: 100px !important;
      right: 24px !important;
      z-index: 2147483646 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .dcb-calc-wrap {
      position: fixed !important;
      bottom: 100px !important;
      right: 500px !important;
      z-index: 2147483647 !important;
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.18);
      animation: dcb-slideUp 0.3s ease;
      min-width: 270px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .dcb-fab {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      box-shadow: 0 8px 24px rgba(99,102,241,0.45);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      position: relative;
      animation: dcb-pulse 2.5s infinite;
    }
    .dcb-fab:hover {
      transform: scale(1.13) !important;
      box-shadow: 0 14px 36px rgba(99,102,241,0.65) !important;
      animation: none !important;
    }

    .dcb-panel {
      display: flex; flex-direction: column;
      background: #fff; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.22);
      overflow: hidden;
      animation: dcb-slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
      transition: width 0.3s ease, height 0.3s ease;
    }

    .dcb-header {
      padding: 18px 20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff;
      display: flex; justify-content: space-between; align-items: center;
      flex-shrink: 0;
    }

    .dcb-messages {
      flex: 1; overflow-y: auto; padding: 20px;
      background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
      display: flex; flex-direction: column; gap: 14px;
    }
    .dcb-messages::-webkit-scrollbar { width: 6px; }
    .dcb-messages::-webkit-scrollbar-track { background: transparent; }
    .dcb-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .dcb-messages::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    .dcb-input-area {
      padding: 14px 18px; background: #fff;
      border-top: 1px solid #e2e8f0; flex-shrink: 0;
    }
    .dcb-input-row {
      display: flex; gap: 10px; background: #f8fafc;
      border-radius: 16px; padding: 6px;
      border: 2px solid #e2e8f0;
      transition: border-color 0.2s ease;
    }
    .dcb-input-row:focus-within { border-color: #6366f1; }
    .dcb-input {
      flex: 1; padding: 11px 14px; border: none; border-radius: 12px;
      font-size: 15px; outline: none; background: #fff;
      color: #1e293b; font-weight: 500;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .dcb-icon-btn {
      background: rgba(255,255,255,0.2); border: none; border-radius: 8px;
      width: 36px; height: 36px; cursor: pointer; color: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s ease;
    }
    .dcb-icon-btn:hover { background: rgba(255,255,255,0.35); }

    .dcb-send-btn {
      padding: 11px; border: none; border-radius: 12px;
      min-width: 46px; height: 46px; font-size: 19px; font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s ease;
    }
    .dcb-send-btn:hover:not(:disabled) { transform: translateY(-2px); }

    .dcb-mode-btn {
      display: flex; align-items: center; gap: 4px;
      border-radius: 12px; padding: 3px 9px;
      font-size: 11px; cursor: pointer; color: #fff;
      font-weight: 600; transition: background 0.2s ease; border: 1.5px solid;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .dcb-msg-enter { animation: dcb-fadeIn 0.28s ease; }

    .dcb-title-box {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #fff; padding: 11px 15px; border-radius: 10px; margin: 8px 0;
      font-weight: 600; font-size: 14px; text-align: center;
      box-shadow: 0 4px 12px rgba(99,102,241,0.25);
    }
    .dcb-facts-box {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-left: 3px solid #0ea5e9;
      padding: 14px; margin: 10px 0; border-radius: 12px;
    }
    .dcb-fact-item {
      padding: 7px 0; font-size: 13px; line-height: 1.6; color: #1e293b;
      border-bottom: 1px dashed #bae6fd;
    }
    .dcb-fact-item:last-child { border-bottom: none; }
    .dcb-fact-item::before { content: "•"; color: #0ea5e9; font-weight: bold; margin-right: 7px; }

    .dcb-calc-box {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 2px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 10px 0;
    }
    .dcb-calc-btn {
      width: 54px; height: 54px; margin: 4px; font-size: 19px; font-weight: 600;
      border: 2px solid #e2e8f0; border-radius: 50%; background: #fff; color: #1e293b;
      cursor: pointer; transition: all 0.2s;
    }
    .dcb-calc-btn:hover {
      background: #6366f1; color: #fff; border-color: #6366f1;
      transform: translateY(-2px);
    }

    .dcb-spinner {
      width: 26px; height: 26px; border: 3px solid #e2e8f0;
      border-top-color: #6366f1; border-radius: 50%;
      animation: dcb-spin 0.8s linear infinite;
    }

    .dcb-status-dot {
      position: absolute; bottom: 7px; right: 7px;
      width: 13px; height: 13px; border-radius: 50%;
      border: 2px solid #fff;
    }
    .dcb-badge {
      position: absolute; top: -4px; right: -4px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff; border-radius: 50%;
      width: 22px; height: 22px; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
    }

    @keyframes dcb-slideUp {
      from { transform: translateY(28px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes dcb-fadeIn {
      from { transform: translateY(10px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes dcb-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dcb-pulse {
      0%,100% { box-shadow: 0 8px 24px rgba(99,102,241,0.45); }
      50%      { box-shadow: 0 8px 36px rgba(99,102,241,0.75); }
    }
  `;
  document.head.appendChild(style);
}

// ─── Offline responses ────────────────────────────────────────────────────────
function getOfflineResponse(message) {
  const msg = message.toLowerCase();
  if (msg.match(/\b(hi|hello|hey)\b/))
    return { reply: "Hello! 👋 I'm your Dyslexia Reading Assistant.\n\nI can help with:\n• Reading practice\n• Text-to-speech\n• OCR uploads\n• Progress tracking\n• Accessibility settings", emoji: "👋" };
  if (msg.includes("how are you"))
    return { reply: "I'm great! 😊 Ready to help with your reading practice!", emoji: "😊" };
  if (msg.includes("dyslexia") || msg.includes("reading tip"))
    return { reply: "Our platform offers:\n✅ Color-coded letters (b/d/p/q)\n✅ OpenDyslexic font\n✅ Text-to-speech\n✅ OCR text extraction\n✅ Games & rewards", title: "Dyslexia Support Features", emoji: "📚", facts: ["Color coding helps b/d/p/q", "OpenDyslexic font for easier reading", "TTS helps pronunciation", "OCR reads images instantly", "Games make learning fun"] };
  if (msg.includes("ocr") || msg.includes("upload") || msg.includes("image"))
    return { reply: "OCR turns pictures into text!\n\n1. Go to Reader page\n2. Click Upload Image\n3. Select your photo\n4. Text appears in seconds!", title: "OCR Guide", emoji: "📸", facts: ["Reads text from any photo", "Works with books & papers", "Takes ~3-5 seconds", "Listen to extracted text", "Clear images work best"] };
  if (msg.includes("tts") || msg.includes("text to speech") || msg.includes("listen"))
    return { reply: "Text-to-Speech reads text aloud!\n\n1. Load text in Reader\n2. Click the 🔊 speaker icon\n3. Listen and follow along!", title: "Text-to-Speech Guide", emoji: "🔊", facts: ["Reads words out loud", "Highlights each word", "Pause and replay anytime", "Adjustable speed", "Great for pronunciation"] };
  if (msg.includes("color") || msg.includes("colour"))
    return { reply: "Color Coding for letters:\n\nb = Blue 🔵\nd = Red 🔴\np = Green 🟢\nq = Orange 🟠\n\nTurn it on in the Reader!", title: "Color Coding", emoji: "🎨", facts: ["Each confusing letter gets a color", "Brain remembers colors easily", "Less confusion while reading", "Toggle on/off anytime", "Works with all text"] };
  if (msg.includes("game") || msg.includes("phonology"))
    return { reply: "Fun Learning Games!\n\n🎯 Spelling Tests\n🔄 Letter Replacement\n🎲 Odd One Out\n\nFind them in the Phonology Hub!", title: "Learning Games", emoji: "🎮", facts: ["3 different games", "Practice spelling & sounds", "Instant feedback", "Earn badges", "Play unlimited times"] };
  if (msg.includes("progress") || msg.includes("dashboard"))
    return { reply: "Track Your Progress!\n\n📊 Reading speed (WPM)\n🎯 Accuracy %\n🏆 Points & badges\n⏱️ Time spent reading", title: "Progress Dashboard", emoji: "📊", facts: ["See reading speed over time", "View completed stories", "Monitor hard words", "Check achievements", "Teachers can view too"] };
  if (msg.includes("help") || msg.includes("guide"))
    return { reply: "I can help with:\n\n🔊 Text-to-Speech\n📸 OCR\n🎨 Color Coding\n📖 Stories\n🎮 Games\n📊 Progress\n⚙️ Settings\n\nJust ask!", title: "App Guide", emoji: "📚", facts: ["All features for dyslexia", "Upload images for OCR", "Colors for similar letters", "Listen to any text", "Track progress"] };
  if (msg.includes("thank"))
    return { reply: "You're welcome! 😊 Keep practicing!", emoji: "😊" };
  if (msg.match(/\b(bye|goodbye)\b/))
    return { reply: "Goodbye! 👋 Happy reading!", emoji: "👋" };
  return { reply: "I'm offline right now 📴\n\nTry asking:\n• 'How does OCR work?'\n• 'Tell me about color coding'\n• 'How to use text-to-speech?'\n• 'What games are available?'", emoji: "💡" };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => { injectStyles(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const speak = (text) => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    const clean = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/\*\*/g, "").replace(/\n/g, " ").trim();
    const s = new SpeechSynthesisUtterance(clean);
    s.lang = "en-US"; s.rate = 0.85; s.pitch = 1.1;
    window.speechSynthesis.speak(s);
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Edge!"); return; }
    if (recognitionRef.current) recognitionRef.current.stop();
    const r = new SR();
    r.lang = "en-US"; r.continuous = false;
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = r.onend = () => setIsListening(false);
    recognitionRef.current = r;
    r.start();
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsGenerating(false); setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input;
    setChat(p => [...p, { sender: "User", text, timestamp: new Date() }]);
    setInput(""); setIsLoading(true); setIsGenerating(true); setShowCalculator(false);

    if (!isOnline) {
      await new Promise(r => setTimeout(r, 500));
      const res = getOfflineResponse(text);
      setChat(p => [...p, { sender: "Bot", ...res, facts: res.facts || [], timestamp: new Date() }]);
      speak(res.reply.split("\n")[0]);
      setIsLoading(false); setIsGenerating(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    try {
      const { data } = await axios.post("http://localhost:5000/api/chat", { message: text }, { signal: abortControllerRef.current.signal });
      setChat(p => [...p, { sender: "Bot", text: data.reply || "Here's what I found!", ...data, facts: data.facts || [], timestamp: new Date() }]);
      speak(data.simplifiedText || data.reply?.split("\n")[0] || "");
    } catch (err) {
      const msg = err.name === "CanceledError" ? "Generation stopped." : "Oops! Something went wrong. Try again!";
      setChat(p => [...p, { sender: "Bot", text: msg, timestamp: new Date() }]);
    } finally {
      setIsLoading(false); setIsGenerating(false); abortControllerRef.current = null;
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const clearChat = () => { setChat([]); window.speechSynthesis.cancel(); };

  const W = isExpanded ? "680px" : "440px";
  const H = isExpanded ? "85vh" : "700px";
  const calcRows = [["7","8","9","+"],["4","5","6","-"],["1","2","3","*"],["0",".","=","/"]];

  return (
    <Portal>
      {/* ── CALCULATOR ── */}
      {showCalculator && isOpen && (
        <div className="dcb-calc-wrap">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>🔢 Calculator</span>
            <button onClick={() => setShowCalculator(false)}
              style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#64748b" }}>✕</button>
          </div>
          {calcRows.map((row, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"center" }}>
              {row.map(btn => (
                <button key={btn} className="dcb-calc-btn"
                  onClick={() => btn === "=" ? sendMessage() : setInput(p => p + btn)}
                  style={btn === "=" ? { background:"#6366f1", color:"#fff", borderColor:"#6366f1" } : {}}>
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── FAB ── */}
      <div className="dcb-fab-wrap">
        <button className="dcb-fab" onClick={() => setIsOpen(o => !o)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ position:"relative", zIndex:2 }}>
            <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z" fill="white"/>
            <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z" fill="white"/>
          </svg>
          <span className="dcb-status-dot"
            style={{ background: isOnline?"#10b981":"#ef4444", boxShadow:`0 0 8px ${isOnline?"#10b981":"#ef4444"}` }}/>
          {chat.length > 0 && !isOpen && (
            <span className="dcb-badge">{chat.length > 9 ? "9+" : chat.length}</span>
          )}
        </button>
      </div>

      {/* ── CHAT PANEL ── */}
      {isOpen && (
        <div className="dcb-panel-wrap">
          <div className="dcb-panel" style={{ width:W, height:H }}>

            {/* Header */}
            <div className="dcb-header">
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z" fill="white"/>
                    <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z" fill="white"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16 }}>Dyslexia Assistant</div>
                  <div style={{ display:"flex", gap:6, marginTop:5 }}>
                    {[
                      { label:"Online",  active:isOnline,  color:"#10b981", action:()=>setIsOnline(true)  },
                      { label:"Offline", active:!isOnline, color:"#ef4444", action:()=>setIsOnline(false) }
                    ].map(({label,active,color,action}) => (
                      <button key={label} className="dcb-mode-btn" onClick={action}
                        style={{ background:active?`${color}33`:"rgba(255,255,255,0.1)", borderColor:active?color:"rgba(255,255,255,0.3)" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:active?`0 0 6px ${color}`:"none" }}/>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", gap:6 }}>
                <button className="dcb-icon-btn" onClick={clearChat} title="New Chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <button className="dcb-icon-btn" onClick={() => setShowCalculator(c=>!c)} title="Calculator"
                  style={{ background: showCalculator?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.2)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2"/>
                    <line x1="8" y1="6" x2="16" y2="6"/>
                    <line x1="8" y1="10" x2="16" y2="10"/>
                    <line x1="8" y1="14" x2="16" y2="14"/>
                    <line x1="8" y1="18" x2="16" y2="18"/>
                  </svg>
                </button>
                <button className="dcb-icon-btn" onClick={() => setIsExpanded(e=>!e)} title={isExpanded?"Minimize":"Expand"}>
                  {isExpanded
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  }
                </button>
                <button className="dcb-icon-btn" onClick={() => setIsOpen(false)} title="Close" style={{ fontSize:17 }}>✕</button>
              </div>
            </div>

            {/* Messages */}
            <div className="dcb-messages">
              {chat.length === 0 && (
                <div style={{ textAlign:"center", marginTop:60, padding:"0 16px" }}>
                  <div style={{ width:78, height:78, borderRadius:"50%", margin:"0 auto 18px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(99,102,241,0.3)" }}>
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z" fill="white"/>
                      <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z" fill="white"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize:21, fontWeight:700, margin:"0 0 10px", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    {isOnline ? "Hello! I'm Your Dyslexia Assistant" : "Hello! Offline Mode"}
                  </h3>
                  <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, margin:"0 0 20px", maxWidth:290, marginLeft:"auto", marginRight:"auto" }}>
                    {isOnline ? "Ask me about reading, OCR, TTS, and more!" : "Ask me how to use this app!"}
                  </p>
                  {!isOnline && (
                    <div style={{ background:"linear-gradient(135deg,#dbeafe,#bfdbfe)", border:"1px solid #60a5fa", borderRadius:12, padding:"10px 14px", maxWidth:310, margin:"0 auto", fontSize:13, color:"#1e40af", fontWeight:500 }}>
                      💡 Try: "How does OCR work?" or "What are the games?"
                    </div>
                  )}
                </div>
              )}

              {chat.map((msg, i) => (
                <div key={i} className="dcb-msg-enter"
                  style={{ alignSelf: msg.sender==="User"?"flex-end":"flex-start", maxWidth:"85%" }}>
                  <div style={{
                    padding:"12px 15px",
                    borderRadius: msg.sender==="User" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.sender==="User" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#fff",
                    color: msg.sender==="User" ? "#fff" : "#1e293b",
                    boxShadow: msg.sender==="User" ? "0 4px 12px rgba(99,102,241,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                    wordWrap:"break-word", fontSize:15, lineHeight:1.65,
                    fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                  }}>
                    {msg.sender === "User" ? (
                      <p style={{ margin:0, fontWeight:500 }}>{msg.text}</p>
                    ) : (
                      <>
                        {msg.title && <div className="dcb-title-box">{msg.emoji} {msg.title}</div>}
                        {msg.imageUrl && <img src={msg.imageUrl} alt={msg.title||"img"} style={{ width:"100%", maxHeight:260, objectFit:"cover", borderRadius:10, margin:"10px 0" }} onError={(e)=>{e.target.style.display="none"}}/>}
                        {msg.simplifiedText && <p style={{ margin:"10px 0", lineHeight:1.8, color:"#334155" }}>{msg.simplifiedText}</p>}
                        {msg.calculation && (
                          <div className="dcb-calc-box">
                            <div style={{ fontSize:22, fontWeight:600, color:"#475569", textAlign:"center" }}>{msg.calculation.expression}</div>
                            <div style={{ textAlign:"center", margin:"8px 0", color:"#94a3b8" }}>=</div>
                            <div style={{ fontSize:32, fontWeight:700, color:"#6366f1", textAlign:"center" }}>{msg.calculation.formatted}</div>
                          </div>
                        )}
                        {msg.facts?.length > 0 && (
                          <div className="dcb-facts-box">
                            <div style={{ fontWeight:600, marginBottom:8, color:"#0ea5e9", fontSize:13 }}>💡 Key Facts</div>
                            {msg.facts.map((f,j) => <div key={j} className="dcb-fact-item">{f}</div>)}
                          </div>
                        )}
                        {!msg.simplifiedText && !msg.facts?.length && !msg.calculation && (
                          <p style={{ margin:0, whiteSpace:"pre-line" }}>{msg.text}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:"#94a3b8", marginTop:4, textAlign:msg.sender==="User"?"right":"left", fontWeight:500 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ alignSelf:"flex-start", maxWidth:"85%" }}>
                  <div style={{ padding:"13px 16px", borderRadius:"18px 18px 18px 4px", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.08)", display:"flex", gap:10, alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div className="dcb-spinner"/>
                      <span style={{ fontSize:14, color:"#64748b", fontWeight:500 }}>{isOnline?"Searching...":"Processing..."}</span>
                    </div>
                    {isGenerating && isOnline && (
                      <button onClick={stopGeneration} style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:6, padding:"4px 10px", fontSize:12, fontWeight:600, cursor:"pointer" }}>■ Stop</button>
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <div className="dcb-input-area">
              <div className="dcb-input-row">
                <input className="dcb-input" type="text" value={input}
                  placeholder={isGenerating?(isOnline?"Searching...":"Processing..."):!isOnline?"Ask about dyslexia features... (Offline)":"Ask me anything..."}
                  onChange={e=>setInput(e.target.value)}
                  onKeyPress={handleKey}
                  disabled={isLoading}
                />
                <button className="dcb-send-btn" onClick={startListening} disabled={isListening||isLoading}
                  style={{ background:isListening?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", cursor:isListening||isLoading?"not-allowed":"pointer", boxShadow:"0 4px 12px rgba(99,102,241,0.25)" }}>
                  {isListening?"🎤":"🎙️"}
                </button>
                <button className="dcb-send-btn" onClick={sendMessage} disabled={!input.trim()||isLoading}
                  style={{ background:input.trim()&&!isLoading?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#e2e8f0", color:input.trim()&&!isLoading?"#fff":"#94a3b8", cursor:input.trim()&&!isLoading?"pointer":"not-allowed", boxShadow:input.trim()&&!isLoading?"0 4px 12px rgba(99,102,241,0.25)":"none" }}>
                  ➤
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </Portal>
  );
}
