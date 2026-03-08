// frontend/components/Chatbot.jsx - Modern AI Assistant with Enhanced Offline Mode
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

          .chatbot-container {
            position: fixed !important;
            bottom: 24px !important;
            right: 24px !important;
            z-index: 999999 !important;
          }
          
          .chatbot-window {
            position: fixed !important;
            bottom: 100px !important;
            right: 24px !important;
            z-index: 999998 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .chat-image {
            width: 100%;
            height: auto;
            max-height: 280px;
            object-fit: cover;
            border-radius: 12px;
            margin: 12px 0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
          }
          
          .chat-image:hover {
            transform: scale(1.02);
          }

          .facts-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 3px solid #0ea5e9;
            padding: 16px;
            margin: 12px 0;
            border-radius: 12px;
          }

          .fact-item {
            padding: 8px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #1e293b;
            border-bottom: 1px dashed #bae6fd;
          }

          .fact-item:last-child {
            border-bottom: none;
          }

          .fact-item::before {
            content: "•";
            color: #0ea5e9;
            font-weight: bold;
            margin-right: 8px;
            font-size: 18px;
          }

          .title-box {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            margin: 8px 0;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          }

          .calculator-box {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            margin: 12px 0;
          }

          .calc-button {
            width: 56px;
            height: 56px;
            margin: 4px;
            font-size: 20px;
            font-weight: 600;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            background: white;
            color: #1e293b;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .calc-button:hover {
            background: #6366f1;
            color: white;
            border-color: #6366f1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }

          .calc-button:active {
            transform: scale(0.95);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }

          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .message-enter {
            animation: fadeIn 0.3s ease;
          }

          .robot-icon {
            position: relative;
            font-size: 28px;
          }

          .loading-spinner {
            width: 28px;
            height: 28px;
            border: 3px solid #e2e8f0;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          .calculator-popup {
            position: fixed;
            bottom: 100px;
            right: 24px;
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            animation: slideUp 0.3s ease;
            z-index: 999999;
          }

          .modern-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .modern-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .gradient-text {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>

      {/* Calculator Popup (Circular) */}
      {showCalculator && (
        <div className="calculator-popup">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              🔢 Calculator
            </h4>
            <button 
              onClick={() => setShowCalculator(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>
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

      {/* Floating Button */}
      <div className="chatbot-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            border: "none",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(99, 102, 241, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.4)";
          }}
        >
          {/* Robot Icon */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              position: 'relative',
              zIndex: 2
            }}
          >
            <path
              d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z"
              fill="white"
            />
            <path
              d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z"
              fill="white"
            />
          </svg>

          {/* Status Dot */}
          <span style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            width: "12px",
            height: "12px",
            background: isOnline ? "#10b981" : "#ef4444",
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: isOnline 
              ? "0 2px 8px rgba(16, 185, 129, 0.4)" 
              : "0 2px 8px rgba(239, 68, 68, 0.4)",
            zIndex: 3,
          }}/>

          {chat.length > 0 && !isOpen && (
            <span style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              fontSize: "11px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
              zIndex: 4,
            }}>
              {chat.length > 9 ? "9+" : chat.length}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
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

          {/* Chat Area */}
          <div className="modern-scrollbar" style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            background: "linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {chat.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "80px" }}>
                <div style={{ 
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)"
                  }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
<<<<<<< HEAD
}
=======
}
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
