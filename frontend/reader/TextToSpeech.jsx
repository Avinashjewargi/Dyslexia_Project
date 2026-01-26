// frontend/reader/TextToSpeech.jsx

import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

const TextToSpeech = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [progress, setProgress] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = () => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry! Your browser doesn't support text-to-speech.");
      return;
    }

    window.speechSynthesis.cancel();

    const words = text.split(" ");
    let wordIndex = 0;

    const speakNextWord = () => {
      if (wordIndex >= words.length) {
        setIsPlaying(false);
        setProgress(100);
        return;
      }

      const word = words[wordIndex];
      setCurrentWord(word);
      setProgress(Math.floor((wordIndex / words.length) * 100));

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = readingSpeed;
      utterance.pitch = 1.1;
      utterance.volume = isMuted ? 0 : 1;

      utterance.onend = () => {
        wordIndex++;
        speakNextWord();
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    setIsPaused(false);
    speakNextWord();
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentWord("");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Card 
      className="border-0 shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: "50px",
                height: "50px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Volume2 size={28} className="text-white" />
            </div>
            <div>
              <h5 className="mb-0 text-white fw-bold">Computer Reads Aloud</h5>
              <small className="text-white" style={{ opacity: 0.9 }}>
                Listen and follow along
              </small>
            </div>
          </div>
          <button
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
            onClick={toggleMute}
            style={{
              width: "45px",
              height: "45px",
              border: "none",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>

        {/* Progress Bar */}
        {(isPlaying || isPaused) && (
          <div className="mb-4">
            <div 
              className="position-relative rounded-pill overflow-hidden"
              style={{
                height: "12px",
                background: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <div
                className="position-absolute top-0 start-0 h-100 rounded-pill"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #00f260 0%, #0575e6 100%)",
                  transition: "width 0.3s ease",
                  boxShadow: "0 0 20px rgba(0, 242, 96, 0.6)",
                }}
              />
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-white fw-bold">{progress}%</small>
              <small className="text-white">Reading...</small>
            </div>
          </div>
        )}

        {/* Current Word Display */}
        {currentWord && (
          <div 
            className="mb-4 p-4 rounded-3 text-center position-relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)",
                animation: "shimmer 2s infinite",
              }}
            />
            <Sparkles 
              size={20} 
              className="text-warning mb-2" 
              style={{ animation: "pulse 1.5s infinite" }}
            />
            <h2 
              className="mb-0 fw-bold position-relative"
              style={{
                fontSize: "2.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 10px rgba(102, 126, 234, 0.3)",
              }}
            >
              {currentWord}
            </h2>
          </div>
        )}

        {/* Reading Speed Control */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="text-white fw-bold mb-0">
              Reading Speed
            </label>
            <Badge 
              bg="light" 
              text="dark"
              className="px-3 py-2"
              style={{ fontSize: "1rem", fontWeight: "600" }}
            >
              {readingSpeed.toFixed(1)}x
            </Badge>
          </div>
          <input
            type="range"
            className="form-range"
            min="0.4"
            max="1.2"
            step="0.1"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
            disabled={isPlaying}
            style={{
              cursor: isPlaying ? "not-allowed" : "pointer",
            }}
          />
          <div className="d-flex justify-content-between mt-2">
            <small className="text-white">🐢 Slow</small>
            <small className="text-white">🐇 Fast</small>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="d-flex gap-2">
          {!isPlaying && !isPaused && (
            <button
              className="btn btn-light flex-fill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={speakText}
              style={{
                fontSize: "1.1rem",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
              }}
            >
              <Play size={24} />
              Start Reading
            </button>
          )}

          {isPlaying && (
            <button
              className="btn flex-fill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={pauseSpeech}
              style={{
                fontSize: "1.1rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                boxShadow: "0 4px 15px rgba(245, 87, 108, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(245, 87, 108, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(245, 87, 108, 0.4)";
              }}
            >
              <Pause size={24} />
              Pause
            </button>
          )}

          {isPaused && (
            <button
              className="btn flex-fill py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
              onClick={resumeSpeech}
              style={{
                fontSize: "1.1rem",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)",
                color: "white",
                boxShadow: "0 4px 15px rgba(0, 242, 96, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(0, 242, 96, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 242, 96, 0.4)";
              }}
            >
              <Play size={24} />
              Resume
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              className="btn py-3 px-4 d-flex align-items-center justify-content-center"
              onClick={stopSpeech}
              style={{
                borderRadius: "12px",
                border: "none",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <RotateCcw size={24} />
            </button>
          )}
        </div>

        {/* Idle State Message */}
        {!isPlaying && !isPaused && !currentWord && (
          <div className="text-center mt-3">
            <small className="text-white" style={{ opacity: 0.8 }}>
              Click start to begin reading the text aloud
            </small>
          </div>
        )}
      </Card.Body>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        .form-range::-webkit-slider-thumb {
          background: white;
          border: 3px solid rgba(255, 255, 255, 0.5);
          width: 24px;
          height: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .form-range::-moz-range-thumb {
          background: white;
          border: 3px solid rgba(255, 255, 255, 0.5);
          width: 24px;
          height: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .form-range::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.3);
          height: 8px;
          border-radius: 10px;
        }

        .form-range::-moz-range-track {
          background: rgba(255, 255, 255, 0.3);
          height: 8px;
          border-radius: 10px;
        }
      `}} />
    </Card>
  );
};

export default TextToSpeech;