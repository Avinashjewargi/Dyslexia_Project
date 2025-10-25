# ml/speech/recognition.py

from gtts import gTTS
import sys
import os
import json

# Define a temporary folder relative to the project root for audio files
# The '..' is necessary to navigate out of the ml directory and into the backend directory
AUDIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend', 'audio_temp')

def text_to_speech(text):
    """
    Generates an MP3 file from the given text using gTTS.
    Returns the path to the generated file relative to the backend static folder.
    """
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)

    # Create a safe, unique filename using text hash
    safe_filename = f"{hash(text) & 0xFFFFFFFF}.mp3" 
    output_path = os.path.join(AUDIO_DIR, safe_filename)

    try:
        tts = gTTS(text=text, lang='en')
        tts.save(output_path)

        # Return the filename so the backend knows which URL to serve
        return safe_filename 
    except Exception as e:
        # Print error to stderr so the Node.js process can capture it
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
        print(json.dumps({"success": False, "error": "TTS failed."}))