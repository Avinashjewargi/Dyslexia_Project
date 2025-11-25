# ml/speech/recognition.py

from gtts import gTTS
import sys
import os
import json
from pathlib import Path 
import speech_recognition as sr # NEW IMPORT for Speech-to-Text

# Define the absolute path to the project root for robust file saving
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent 
AUDIO_DIR = PROJECT_ROOT / 'backend' / 'audio_temp'

# --- TEXT-TO-SPEECH (TTS) FUNCTION ---
def text_to_speech(text):
    """
    Generates an MP3 file from the given text using gTTS.
    """
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)
        
    # Create a safe, unique filename using text hash
    safe_filename = f"{hash(text) & 0xFFFFFFFF}.mp3" 
    output_path = AUDIO_DIR / safe_filename
    
    try:
        tts = gTTS(text=text, lang='en')
        tts.save(str(output_path))
        
        # Return only the filename for the backend to construct the URL
        return safe_filename 
    except Exception as e:
        print(f"Error generating TTS: {e}", file=sys.stderr)
        return None

# --- SPEECH-TO-TEXT (STT) FUNCTION ---
def speech_to_text(audio_file_path):
    """
    Recognizes speech from an audio file (WAV format expected).
    Returns the transcribed text.
    """
    r = sr.Recognizer()
    
    try:
        # We process the temporary file uploaded by the user
        with sr.AudioFile(audio_file_path) as source:
            audio = r.record(source) 
        
        # Use Google Speech Recognition API 
        transcribed_text = r.recognize_google(audio)
        
        return transcribed_text
        
    except sr.UnknownValueError:
        return "Could not understand audio"
    except sr.RequestError as e:
        return f"Speech service unavailable: {e}"
    except Exception:
        # Fallback for file or other errors
        return "Error processing audio file"


if __name__ == '__main__':
    # Node.js will call this script in two modes: TTS or STT
    
    if len(sys.argv) > 1 and sys.argv[1] == 'stt_mode':
        # --- STT MODE ---
        # Arguments expected: [recognition.py, 'stt_mode', audio_file_path, target_word]
        if len(sys.argv) > 2:
            audio_path = sys.argv[2]
            # target_word = sys.argv[3] # We don't need the target word here, but we pass it
            
            transcription = speech_to_text(audio_path)
            
            # Print STT result as JSON
            print(json.dumps({
                "success": True, 
                "transcription": transcription
            }))
        else:
            print(json.dumps({"success": False, "error": "Missing audio file path for STT."}))

    else:
        # --- TTS MODE (Default) ---
        # Arguments expected: [recognition.py, text_to_pronounce]
        input_text = sys.argv[1] if len(sys.argv) > 1 else "Hello, adaptive reading assistant."

        filename = text_to_speech(input_text)
        
        # Print TTS result as JSON
        if filename:
            print(json.dumps({"success": True, "audio_filename": filename}))
        else:
            print(json.dumps({"success": False, "error": "TTS failed during generation."}))