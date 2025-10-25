# ml/speech/recognition.py (FINAL CORRECTED VERSION with pathlib)

from gtts import gTTS
import sys
import os
import json
from pathlib import Path # NEW IMPORT for robust path handling

# Define the absolute path to the project root and then to the audio_temp folder.
# This guarantees the path is correct regardless of where the script is run from.
# Path(__file__).resolve() gets the absolute location of this script.
# .parent.parent.parent navigates up to the root 'Adaptive-Reading-Assistant-for-Dyslexia-main'.
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent 
AUDIO_DIR = PROJECT_ROOT / 'backend' / 'audio_temp' # Navigate to the final folder

def text_to_speech(text):
    """
    Generates an MP3 file from the given text using gTTS.
    """
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)
        
    # Create a safe, unique filename using text hash
    safe_filename = f"{hash(text) & 0xFFFFFFFF}.mp3" 
    output_path = AUDIO_DIR / safe_filename # Use Path object for joining
    
    try:
        tts = gTTS(text=text, lang='en')
        tts.save(str(output_path)) # Convert back to string for gTTS.save()
        
        # Return only the filename so the backend can construct the URL
        return safe_filename 
    except Exception as e:
        print(f"Error generating TTS: {e}", file=sys.stderr)
        return None


if __name__ == '__main__':
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
    else:
        input_text = "Hello, adaptive reading assistant."

    filename = text_to_speech(input_text)

    # Print result as JSON for the Node.js backend to read
    if filename:
        print(json.dumps({"success": True, "audio_filename": filename}))
    else:
        # Note: Added the 'error' key here for clearer handling in Node.js
        print(json.dumps({"success": False, "error": "TTS failed during generation."}))