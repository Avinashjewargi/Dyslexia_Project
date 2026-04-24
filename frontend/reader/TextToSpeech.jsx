// frontend/reader/TextToSpeech.jsx - WITH LANGUAGE SUPPORT

import React, { useState, useEffect } from "react";
import { Card, Badge } from "react-bootstrap";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const TextToSpeech = ({ text, colorCodingEnabled, colorIntensity, renderColoredWord }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Add language context and translation
  const { currentLanguage, languageConfig } = useLanguage();
  const { t } = useTranslation();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log('Available voices:', voices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Get the best voice for current language
  // Get the best voice for current language
const getLanguageVoice = () => {
  if (!languageConfig || !languageConfig.ttsCode) {
    console.warn('⚠️ No language config found');
    return null;
  }

  const voices = availableVoices;
  const targetLang = languageConfig.ttsCode; // e.g., 'hi-IN', 'kn-IN'
  const langPrefix = targetLang.split('-')[0]; // e.g., 'hi', 'kn'
  
  console.log(`🔍 Searching voice for: ${targetLang} (${languageConfig.name})`);
  console.log(`📋 Available voices:`, voices.map(v => `${v.name} (${v.lang})`));

  // Priority 1: Exact match (hi-IN, kn-IN)
  let voice = voices.find(v => v.lang === targetLang);
  if (voice) {
    console.log(`✅ Found exact match: ${voice.name}`);
    return voice;
  }

  // Priority 2: Same language, different region (hi-*, kn-*)
  voice = voices.find(v => v.lang.startsWith(langPrefix + '-'));
  if (voice) {
    console.log(`✅ Found regional match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // Priority 3: Just language code (hi, kn)
  voice = voices.find(v => v.lang === langPrefix);
  if (voice) {
    console.log(`✅ Found language match: ${voice.name}`);
    return voice;
  }

  // Priority 4: Voice name contains language
  const langName = languageConfig.name.toLowerCase();
  voice = voices.find(v => v.name.toLowerCase().includes(langName));
  if (voice) {
    console.log(`✅ Found by name match: ${voice.name}`);
    return voice;
  }

  // Priority 5: For Hindi, try Devanagari-related voices
  if (langPrefix === 'hi') {
    voice = voices.find(v => 
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('devanagari') ||
      v.lang.toLowerCase().includes('hi')
    );
    if (voice) {
      console.log(`✅ Found Hindi-related: ${voice.name}`);
      return voice;
    }
  }

  // Priority 6: For Kannada
  if (langPrefix === 'kn') {
    voice = voices.find(v => 
      v.name.toLowerCase().includes('kannada') ||
      v.lang.toLowerCase().includes('kn')
    );
    if (voice) {
      console.log(`✅ Found Kannada-related: ${voice.name}`);
      return voice;
    }
  }

  console.warn(`❌ No voice found for ${targetLang}, will use browser default`);
  return null;
};

const speakText = () => {
  if (!("speechSynthesis" in window)) {
    alert(t('reader.browserNotSupported') || "Sorry! Your browser doesn't support text-to-speech.");
    return;
  }

  window.speechSynthesis.cancel();

  const words = text.split(" ").filter(w => w.trim());
  let wordIndex = 0;

  const speakNextWord = () => {
    if (wordIndex >= words.length) {
      setIsPlaying(false);
      setProgress(100);
      setCurrentWord("");
      setCurrentWordIndex(-1);
      return;
    }

    const word = words[wordIndex];
    setCurrentWord(word);
    setCurrentWordIndex(wordIndex);
    setProgress(Math.floor((wordIndex / words.length) * 100));

    const utterance = new SpeechSynthesisUtterance(word);
    
    // ✅ FIX: Set language code FIRST before voice
    if (languageConfig && languageConfig.ttsCode) {
      utterance.lang = languageConfig.ttsCode;
      console.log(`🔊 Speaking in: ${languageConfig.ttsCode}`);
    } else {
      utterance.lang = 'en-US'; // Fallback
    }
    
    // ✅ FIX: Get voice AFTER setting language
    const languageVoice = getLanguageVoice();
    if (languageVoice) {
      utterance.voice = languageVoice;
      console.log(`🎤 Using voice: ${languageVoice.name} (${languageVoice.lang})`);
    } else {
      console.warn(`⚠️ No matching voice found for ${utterance.lang}, using default`);
    }
    
    utterance.rate = readingSpeed;
    utterance.pitch = 1.1;
    utterance.volume = isMuted ? 0 : 1;

    utterance.onend = () => {
      wordIndex++;
      speakNextWord();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      console.error('Failed word:', word);
      console.error('Language:', utterance.lang);
      console.error('Voice:', utterance.voice?.name);
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
    setCurrentWordIndex(-1);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Display current word with or without color coding
  const displayCurrentWord = () => {
    // If color coding is enabled AND intensity >= 50%, use colored letters
    if (colorCodingEnabled && colorIntensity >= 50 && renderColoredWord) {
      return (
        <span style={{ 
          display: 'inline-block',
          color: 'inherit' // Let the colored spans show through
        }}>
          {renderColoredWord(currentWord)}
        </span>
      );
    }
    
    // Otherwise, show with gradient (normal display when < 50% or disabled)
    return (
      <span style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: 'inline-block'
      }}>
        {currentWord}
      </span>
    );
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
              <h5 className="mb-0 text-white fw-bold">
                {t('reader.computerReadsAloud') || 'Computer Reads Aloud'}
              </h5>
              <small className="text-white" style={{ opacity: 0.9 }}>
                {t('reader.listenFollowAlong') || 'Listen and follow along'}
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
            title={isMuted ? t('reader.unmute') : t('reader.mute')}
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
              <small className="text-white">
                {t('reader.reading') || 'Reading...'}
              </small>
            </div>
          </div>
        )}

        {/* Current Word Display with Color Coding */}
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
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {displayCurrentWord()}
            </h2>
            <small className="text-muted d-block mt-2">
              {t('reader.wordCount', { 
                current: currentWordIndex + 1, 
                total: text.split(" ").filter(w => w.trim()).length 
              }) || `Word ${currentWordIndex + 1} of ${text.split(" ").filter(w => w.trim()).length}`}
            </small>
          </div>
        )}

        {/* Reading Speed Control */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="text-white fw-bold mb-0">
              {t('reader.readingSpeed') || 'Reading Speed'}
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
            min="0.5"
            max="2.0"
            step="0.1"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
            disabled={isPlaying}
            style={{
              cursor: isPlaying ? "not-allowed" : "pointer",
            }}
          />
          <div className="d-flex justify-content-between mt-2">
            <small className="text-white">🐢 {t('reader.slow') || 'Slow'}</small>
            <small className="text-white">🐇 {t('reader.fast') || 'Fast'}</small>
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
              {t('reader.startReading') || 'Start Reading'}
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
              {t('common.buttons.pause') || 'Pause'}
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
              {t('common.buttons.resume') || 'Resume'}
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              className="btn py-3 px-4 d-flex align-items-center justify-content-center"
              onClick={stopSpeech}
              title={t('common.buttons.stop') || 'Stop'}
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
              {t('reader.clickStartToRead') || 'Click start to begin reading the text aloud'}
            </small>
          </div>
        )}

        {/* Language Voice Info (Debug - can be removed in production) */}
        {availableVoices.length > 0 && (
          <div className="text-center mt-2">
            <small className="text-white" style={{ opacity: 0.6, fontSize: '0.75rem' }}>
              {languageConfig && languageConfig.name 
                ? `${t('reader.using') || 'Using'} ${languageConfig.name} ${t('reader.voice') || 'voice'}`
                : ''}
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