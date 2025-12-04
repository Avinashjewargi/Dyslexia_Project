
import React, { useState, useEffect } from "react";
import { Button, Card, ProgressBar, Badge } from "react-bootstrap";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

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
    <Card className="mb-3 border-primary shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            <Volume2 size={24} className="me-2 text-primary" />
            Read Aloud
          </h5>
          <Button
            variant={isMuted ? "outline-secondary" : "outline-primary"}
            size="sm"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
        </div>

        {/* Progress Bar */}
        {isPlaying || isPaused ? (
          <div className="mb-3">
            <ProgressBar now={progress} label={`${progress}%`} animated />
            {currentWord && (
              <div className="text-center mt-2">
                <Badge bg="info" style={{ fontSize: "1.2rem", padding: "10px 20px" }}>
                  {currentWord}
                </Badge>
              </div>
            )}
          </div>
        ) : null}

        {/* Speed Control */}
        <div className="mb-3">
          <label className="form-label">Reading Speed:</label>
          <input
            type="range"
            className="form-range"
            min="0.4"
            max="1.2"
            step="0.1"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
            disabled={isPlaying}
          />
          <div className="d-flex justify-content-between">
            <small>🐢 Slow</small>
            <small className="fw-bold">{readingSpeed.toFixed(1)}x</small>
            <small>🐇 Fast</small>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="d-flex gap-2">
          {!isPlaying && !isPaused && (
            <Button
              variant="primary"
              size="lg"
              className="flex-fill"
              onClick={speakText}
              style={{ fontSize: "1.1rem" }}
            >
              <Play size={20} className="me-2" />
              Start Reading
            </Button>
          )}

          {isPlaying && (
            <Button
              variant="warning"
              size="lg"
              className="flex-fill"
              onClick={pauseSpeech}
              style={{ fontSize: "1.1rem" }}
            >
              <Pause size={20} className="me-2" />
              Pause
            </Button>
          )}

          {isPaused && (
            <Button
              variant="success"
              size="lg"
              className="flex-fill"
              onClick={resumeSpeech}
              style={{ fontSize: "1.1rem" }}
            >
              <Play size={20} className="me-2" />
              Resume
            </Button>
          )}

          {(isPlaying || isPaused) && (
            <Button
              variant="danger"
              size="lg"
              onClick={stopSpeech}
              style={{ fontSize: "1.1rem" }}
            >
              <RotateCcw size={20} className="me-2" />
              Reset
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TextToSpeech;