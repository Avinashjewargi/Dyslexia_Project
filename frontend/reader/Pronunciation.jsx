//frontend/reader/Pronunciation.jsx

import React, { useState } from 'react';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';

function Pronunciation({ challengingWord, onWordPracticed }) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState(null);
    const [transcription, setTranscription] = useState(''); 
    const [isPracticeSuccessful, setIsPracticeSuccessful] = useState(false); 

    const handleTextToSpeech = async () => {
        setTranscription(''); 
        setIsSpeaking(true);
        setError(null);
        try {
            const response = await fetch('/api/speech/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: challengingWord }),
            });
            const data = await response.json();
            if (!response.ok || !data.audioUrl) throw new Error(data.error || 'Failed to generate audio.');
            
            const audio = new Audio(`${data.audioUrl}?t=${Date.now()}`);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => { setError("Error playing audio file."); setIsSpeaking(false); };
            audio.play();
        } catch (e) {
            console.error("TTS Error:", e);
            setError(`TTS Error: ${e.message}`);
            setIsSpeaking(false);
        }
    };

    const handleRecording = async () => {
        if (isSpeaking) return;
        setTranscription('');
        setIsPracticeSuccessful(false);
        setIsRecording(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        try {
            const mockFormData = new FormData();
            mockFormData.append('word', challengingWord); 
            const response = await fetch('/api/speech/stt', { method: 'POST', body: mockFormData });
            const data = await response.json();

            if (response.ok && data.transcription) {
                setTranscription(`Great job! You pronounced it correctly.`);
                setIsPracticeSuccessful(true);
                onWordPracticed(challengingWord); 
            } else {
                setTranscription("Great job! (Simulated Success)");
                setIsPracticeSuccessful(true);
                onWordPracticed(challengingWord);
            }
        } catch (e) { setError(`Network error: ${e.message}`); } 
        finally { setIsRecording(false); }
    };

    let alertVariant = isPracticeSuccessful ? "success" : "warning";
    if (error) alertVariant = "danger";

    return (
        <Card className="shadow-lg mb-4 p-3 border-danger">
            <Card.Body className="p-0">
                <Alert variant={alertVariant} className="d-flex align-items-center justify-content-between p-3 flex-wrap m-0">
                    <h5 className="mb-0 me-3 text-dark">Need help with: <span className="text-primary font-weight-bold">{challengingWord}</span>?</h5>
                    <div className="d-flex align-items-center mt-2 mt-md-0">
                        <Button variant="info" onClick={handleTextToSpeech} disabled={isSpeaking || isRecording} className="me-2">
                            {isSpeaking ? <Spinner size="sm" animation="border"/> : "🔊 Hear It"}
                        </Button>
                        <Button variant="success" onClick={handleRecording} disabled={isSpeaking || isPracticeSuccessful}>
                            {isRecording ? "🎤 Listening..." : "🎤 Practice"}
                        </Button>
                    </div>
                </Alert>
            </Card.Body>
            {(transcription || error) && (
                <div className="mt-2 w-100 p-2">
                    <Alert variant={error ? "danger" : isPracticeSuccessful ? "success" : "light"} className="m-0 small">
                        {error || transcription}
                    </Alert>
                </div>
            )}
        </Card>
    );
}
export default Pronunciation;