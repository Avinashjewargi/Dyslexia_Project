import React, { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);

  // 🔊 Text to Speech (Bot talks)
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice Input (User speaks)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
    };

    recognition.start();
  };

  // 📩 Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "User", text: input };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botReply = res.data.reply;

      const botMsg = { sender: "Bot", text: botReply };
      setChat((prev) => [...prev, botMsg]);

      speak(botReply); // 🔊 Bot speaks

    } catch (error) {
      const errorMsg = "Sorry, I am not available right now.";
      setChat((prev) => [...prev, { sender: "Bot", text: errorMsg }]);
      speak(errorMsg);
    }

    setInput("");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "350px",
        padding: "12px",
        background: "#ffffff",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ textAlign: "center" }}>🧠 Dyslexia Assistant</h4>

      {/* CHAT AREA */}
      <div
        style={{
          height: "260px",
          overflowY: "auto",
          border: "1px solid #eee",
          padding: "8px",
          marginBottom: "8px",
        }}
      >
        {chat.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>

      {/* INPUT */}
      <input
        type="text"
        value={input}
        placeholder="Type or speak..."
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
      />

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={sendMessage} style={{ flex: 1 }}>
          Send
        </button>

        <button onClick={startListening} style={{ flex: 1 }}>
          🎤 Speak
        </button>
      </div>
    </div>
  );
}
