from gtts import gTTS
import speech_recognition as sr
import os
import sys
import json
import hashlib
import time
from pathlib import Path

# ---------------- PATH SETUP ----------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
AUDIO_DIR = PROJECT_ROOT / 'backend' / 'audio_temp'

sys.path.append(str(PROJECT_ROOT))
from config.languageConfig import (
    get_gtts_lang,
    is_valid_language,
    DEFAULT_LANGUAGE
)

# ---------------- TEXT TO SPEECH ----------------
def text_to_speech(
    text,
    language='en',
    speed=1.0
):
    """
    Convert text to speech and save MP3 file

    Returns:
        dict with audio filename and metadata
    """
    try:
        if not is_valid_language(language):
            language = DEFAULT_LANGUAGE

        gtts_lang = get_gtts_lang(language)
        AUDIO_DIR.mkdir(parents=True, exist_ok=True)

        # Unique filename
        text_hash = hashlib.md5(text.encode()).hexdigest()
        timestamp = int(time.time())
        filename = f"{language}_{text_hash}_{timestamp}.mp3"
        filepath = AUDIO_DIR / filename

        tts = gTTS(
            text=text,
            lang=gtts_lang,
            slow=(speed < 0.8)
        )
        tts.save(str(filepath))

        # Approx duration
        word_count = len(text.split())
        duration = (word_count / 2.5) / max(speed, 0.5)

        return {
            "success": True,
            "audio_filename": filename,
            "audio_path": str(filepath),
            "audio_url": f"/audio/{filename}",
            "language": language,
            "word_count": word_count,
            "duration": round(duration, 2)
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ---------------- SPEECH TO TEXT ----------------
def speech_to_text(audio_file_path, language='en'):
    """
    Convert speech (WAV) to text
    """
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)

        text = recognizer.recognize_google(
            audio,
            language=language
        )

        return {
            "success": True,
            "transcription": text
        }

    except sr.UnknownValueError:
        return {
            "success": False,
            "error": "Could not understand audio"
        }
    except sr.RequestError as e:
        return {
            "success": False,
            "error": f"Speech service unavailable: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ---------------- BACKWARD COMPATIBILITY ----------------
def generate_speech(text):
    """Default English TTS"""
    return text_to_speech(text, 'en')

# ---------------- CLI ENTRY (NODE.JS SUPPORT) ----------------
if __name__ == "__main__":
    """
    Usage:
    ------
    TTS:
      python recognition.py "Hello world"

    STT:
      python recognition.py stt_mode path/to/audio.wav en
    """

    if len(sys.argv) > 1 and sys.argv[1] == "stt_mode":
        if len(sys.argv) < 3:
            print(json.dumps({
                "success": False,
                "error": "Missing audio file path"
            }))
            sys.exit(1)

        audio_path = sys.argv[2]
        language = sys.argv[3] if len(sys.argv) > 3 else 'en'

        result = speech_to_text(audio_path, language)
        print(json.dumps(result))

    else:
        input_text = sys.argv[1] if len(sys.argv) > 1 else "Hello, adaptive reading assistant."
        result = text_to_speech(input_text)
        print(json.dumps(result))
