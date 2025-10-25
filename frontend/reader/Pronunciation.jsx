// frontend/reader/Pronunciation.jsx

import React, { useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { VolumeUpFill, MicFill } from 'react-bootstrap-icons'; 
import { useAccessibility } from '../components/AccessibilityContext'; // To get high contrast style

/**
 * Component for text-to-speech pronunciation and speech recording practice.
 * @param {string} word - The word or phrase to be pronounced.
 */
function Pronunciation({ word }) {
  const { settings } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  const handleTextToSpeech = async () => {
    setIsSpeaking(true);
    setError(null);

    try {
      // 1. Request audio generation from the backend
      const response = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word }), // Send the word to be pronounced
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate audio on server.');
      }

      // 2. Play the audio using the URL returned by the backend
      const audio = new Audio(data.audioUrl);

      audio.onended = () => setIsSpeaking(false); // Stop spinning when audio finishes
      audio.onerror = () => {
          setError("Error playing audio. File might be corrupted.");
          setIsSpeaking(false);
      };

      audio.play();

    } catch (e) {
      console.error("TTS Fetch error:", e);
      setError(`Could not play audio. Check backend (Port 5000). Details: ${e.message}`);
      setIsSpeaking(false);
    }
  };

  // Placeholder for Speech-to-Text/Recording (functionality remains the same)
  const handleRecording = () => {
    setIsRecording(true);
    console.log("Recording user's pronunciation...");
    setTimeout(() => setIsRecording(false), 2000); 
  };

  // Adjust Alert background for high contrast mode
  const alertVariant = settings.highContrast ? "dark" : "secondary";

  return (
    <Alert variant={alertVariant} className="d-flex align-items-center justify-content-between p-3">
      <h5 className="mb-0 me-3">Need help with: <span className="text-primary text-capitalize">{word}</span>?</h5>

      <div className="d-flex">
        {/* Text-to-Speech Button */}
        <Button 
          variant="info" 
          onClick={handleTextToSpeech} 
          disabled={isSpeaking || isRecording} 
          className="me-2"
        >
          {isSpeaking ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Speaking...
            </>
          ) : (
            <><VolumeUpFill className="me-1" /> Hear It</>
          )}
        </Button>

        {/* Speech Recording Button */}
        <Button 
          variant={isRecording ? "danger" : "outline-secondary"} 
          onClick={handleRecording} 
          disabled={isSpeaking}
        >
          {isRecording ? (
            <><MicFill className="me-1" /> Practicing...</>
          ) : (
            <><MicFill className="me-1" /> Practice</>
          )}
        </Button>
      </div>
      {error && (
          <Alert variant="danger" className="mt-2 w-100 position-absolute bottom-100 end-0">
              {error}
          </Alert>
      )}
    </Alert>
  );
}

export default Pronunciation;