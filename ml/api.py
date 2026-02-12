from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
import nltk

# --------------------------------------------------
# NLTK SETUP (RUN ONCE AT STARTUP)
# --------------------------------------------------
def setup_nltk():
    required_resources = ["punkt"]
    for resource in required_resources:
        try:
            nltk.data.find(f"tokenizers/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)

setup_nltk()

# --------------------------------------------------
# PATH SETUP
# --------------------------------------------------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.append(PROJECT_ROOT)

# --------------------------------------------------
# IMPORT PROJECT MODULES
# --------------------------------------------------
from ocr.process_text import extract_text_from_image
from speech.recognition import text_to_speech
from nlp.reading_analysis import analyze_text
from config.languageConfig import is_valid_language, DEFAULT_LANGUAGE

# --------------------------------------------------
# FLASK APP SETUP
# --------------------------------------------------
app = Flask(__name__)
CORS(app)
PORT = 5050

AUDIO_DIR = os.path.join(PROJECT_ROOT, "backend", "audio_temp")

# --------------------------------------------------
# HOME / HEALTH ROUTES
# --------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ML Service is running",
        "version": "1.0",
        "supported_languages": ["en", "hi", "kn"],
        "endpoints": {
            "health": "/health",
            "ocr": "/api/v1/ocr",
            "tts": "/api/v1/tts",
            "analysis": "/api/v1/analyze-content",
            "audio": "/audio/<filename>"
        }
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "ML API"
    }), 200

# --------------------------------------------------
# OCR ENDPOINT
# --------------------------------------------------
@app.route("/api/v1/ocr", methods=["POST"])
def ocr_endpoint():
    try:
        if "image" not in request.files:
            return jsonify({
                "success": False,
                "error": "No image file provided"
            }), 400

        image = request.files["image"]
        language = request.form.get("language", DEFAULT_LANGUAGE)

        if not is_valid_language(language):
            language = DEFAULT_LANGUAGE

        temp_path = f"temp_{image.filename}"
        image.save(temp_path)

        result = extract_text_from_image(temp_path, language)

        os.remove(temp_path)

        return jsonify(result), 200 if result.get("success") else 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# --------------------------------------------------
# TEXT TO SPEECH ENDPOINT
# --------------------------------------------------
@app.route("/api/v1/tts", methods=["POST"])
def tts_endpoint():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({
                "success": False,
                "error": "No text provided"
            }), 400

        text = data["text"]
        language = data.get("language", DEFAULT_LANGUAGE)
        speed = float(data.get("speed", 1.0))

        if not is_valid_language(language):
            language = DEFAULT_LANGUAGE

        result = text_to_speech(text, language, speed)

        return jsonify(result), 200 if result.get("success") else 500

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# --------------------------------------------------
# TEXT ANALYSIS ENDPOINT
# --------------------------------------------------
@app.route("/api/v1/analyze-content", methods=["POST"])
def analyze_endpoint():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({
                "success": False,
                "error": "No text provided"
            }), 400

        text = data["text"]
        language = data.get("language", DEFAULT_LANGUAGE)

        if not is_valid_language(language):
            language = DEFAULT_LANGUAGE

        result = analyze_text(text, language)

        if not result.get("success"):
            return jsonify(result), 500

        return jsonify({
            "success": True,
            "analysis": {
                "language": result.get("language", language),
                "script": result.get("script", "Unknown"),
                "reading_level": result.get("reading_level", "Unknown"),
                "difficulty_score": result.get("difficulty_score", 0.0),
                "challenging_words": result.get("challenging_words", []),
                "statistics": result.get("statistics", {})
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# --------------------------------------------------
# SERVE GENERATED AUDIO FILES
# --------------------------------------------------
@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_from_directory(AUDIO_DIR, filename)

# --------------------------------------------------
# MAIN
# --------------------------------------------------
if __name__ == "__main__":
    print("🚀 Starting ML API Server")
    print(f"🌐 http://localhost:{PORT}")
    print("🗣 Supported languages: en, hi, kn")
    app.run(host="0.0.0.0", port=PORT, debug=True)
