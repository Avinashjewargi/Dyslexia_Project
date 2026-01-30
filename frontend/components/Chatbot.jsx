// frontend/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Chatbot window open/closed
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🔊 Text to Speech (Bot talks)
  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice Input (User speaks)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 📩 Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "User", text: input, timestamp: new Date() };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botReply = res.data.reply || "I received your message!";
      const botMsg = { sender: "Bot", text: botReply, timestamp: new Date() };
      setChat((prev) => [...prev, botMsg]);
      speak(botReply);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = "Sorry, I am not available right now. Please try again later.";
      const botMsg = { sender: "Bot", text: errorMsg, timestamp: new Date() };
      setChat((prev) => [...prev, botMsg]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChat([]);
    window.speechSynthesis.cancel();
  };

  return (
    <>
      {/* Global CSS to ensure chatbot stays fixed */}
      <style>
        {`
          .chatbot-container {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .chatbot-window {
            position: fixed !important;
            bottom: 110px !important;
            right: 20px !important;
            z-index: 999998 !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Ensure body doesn't have positioning that affects fixed elements */
          body {
            position: relative;
          }
        `}
      </style>

      {/* Floating Chat Button (Bottom-Right Corner - Always Visible) */}
      <div
        className="chatbot-container"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        {/* Robot Icon Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "4px solid white",
              boxShadow: "0 6px 24px rgba(102, 126, 234, 0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              animation: isOpen ? "none" : "float 3s ease-in-out infinite",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(102, 126, 234, 0.5)";
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

          {/* Notification Badge */}
          {chat.length > 0 && !isOpen && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ff4757",
                color: "white",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(255, 71, 87, 0.4)",
              }}
            >
              {chat.length > 9 ? "9+" : chat.length}
            </span>
          )}

          {/* Online Indicator */}
          <span
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              width: "18px",
              height: "18px",
              background: "#2ecc71",
              borderRadius: "50%",
              border: "3px solid white",
              animation: "pulse-online 2s infinite",
            }}
          />
        </button>
        </div>

        <style>
          {`
            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            @keyframes pulse-online {
              0%, 100% {
                box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
              }
              50% {
                box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
              }
            }

            @keyframes slideInRight {
              from {
                transform: translateX(100px);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }

            @keyframes slideDown {
              from {
                transform: translateY(0);
                opacity: 1;
              }
              to {
                transform: translateY(100%);
                opacity: 0;
              }
            }

            @keyframes bounce {
              0%, 60%, 100% {
                transform: translateY(0);
              }
              30% {
                transform: translateY(-10px);
              }
            }
          `}
        </style>
      </div>

      {/* Chat Window (Appears when opened) */}
      {isOpen && (
        <div
          className="chatbot-window"
          style={{
            position: "fixed",
            bottom: "110px",
            right: "20px",
            width: "400px",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 10px 50px rgba(0,0,0,0.25)",
            overflow: "hidden",
            zIndex: 999998,
            animation: "slideUp 0.4s ease",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Robot Avatar */}
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>
                  AI Assistant
                </h4>
                <p style={{ margin: 0, fontSize: "13px", opacity: 0.95, display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    background: "#2ecc71",
                    display: "inline-block"
                  }} />
                  Online • Ready to help
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={clearChat}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                  fontSize: "16px",
                }}
                title="Clear chat"
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.2)")
                }
              >
                🗑️
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "white",
                  transition: "all 0.3s",
                }}
                title="Close"
                onMouseEnter={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.2)")
                }
              >
                ✕
              </button>
            </div>
          </div>

          {/* CHAT AREA */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "#f8f9fa",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {chat.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  marginTop: "80px",
                }}
              >
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "20px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  👋
                </div>
                <p style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
                  Hi! I'm your AI Assistant
                </p>
                <p style={{ fontSize: "14px", color: "#666", marginTop: "8px", lineHeight: "1.6" }}>
                  Ask me anything about dyslexia support!<br />
                  I'm here to help you 24/7
                </p>
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius:
                      msg.sender === "User"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.sender === "User"
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : "#ffffff",
                    color: msg.sender === "User" ? "#ffffff" : "#333",
                    boxShadow:
                      msg.sender === "User"
                        ? "0 3px 10px rgba(102, 126, 234, 0.3)"
                        : "0 2px 8px rgba(0,0,0,0.1)",
                    wordWrap: "break-word",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6" }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "12px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "#ffffff",
                  color: "#666",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out 0.2s",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#667eea",
                    animation: "bounce 1.4s infinite ease-in-out 0.4s",
                  }}
                />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT AREA */}
          <div
            style={{
              padding: "16px",
              background: "#ffffff",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                background: "#f5f5f5",
                borderRadius: "12px",
                padding: "6px",
              }}
            >
              <input
                type="text"
                value={input}
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  background: "transparent",
                }}
              />

              <button
                onClick={startListening}
                disabled={isListening || isLoading}
                style={{
                  padding: "12px",
                  background: isListening ? "#ff6b6b" : "#667eea",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: isListening || isLoading ? "not-allowed" : "pointer",
                  fontSize: "20px",
                  transition: "all 0.3s",
                  minWidth: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title={isListening ? "Listening..." : "Voice input"}
              >
                {isListening ? "🎤" : "🎙️"}
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: "12px",
                  background:
                    input.trim() && !isLoading
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor:
                    input.trim() && !isLoading ? "pointer" : "not-allowed",
                  fontSize: "20px",
                  transition: "all 0.3s",
                  minWidth: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Send message"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
