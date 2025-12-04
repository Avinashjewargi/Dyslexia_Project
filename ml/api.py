# ml/api.py

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS # CRITICAL: Import the CORS extension
import sys
import os
import json
import nltk

# --- SETUP NLTK DATA (Must be done before importing NLP modules) ---
def setup_nltk():
    """Download and setup required NLTK resources"""
    required_resources = ['punkt_tab', 'averaged_perceptron_tagger', 'wordnet']
    
    for resource in required_resources:
        try:
            nltk.data.find(f'tokenizers/{resource}')
        except LookupError:
            try:
                nltk.download(resource, quiet=True)
                print(f"✓ Downloaded NLTK resource: {resource}")
            except Exception as e:
                print(f"⚠ Warning: Could not download {resource}: {e}")

# Call setup before importing NLP modules
setup_nltk()

# Add the current directory to Python path to find subfolders (nlp, speech, etc.)
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Import the NLP analysis function (from nlp/reading_analysis.py)
from nlp.reading_analysis import analyze_reading_content 

app = Flask(__name__)
CORS(app) # CRITICAL: Initialize CORS to allow cross-origin requests
PORT = 5050

# --- Core NLP Analysis Endpoint ---
@app.route('/api/v1/analyze-content', methods=['POST'])
def analyze_content_route():
    """
    Analyzes content received from the frontend (OCR result or manual text).
    """
    data = request.json
    text_content = data.get('text')
    
    if not text_content:
        return jsonify({"message": "Missing 'text' parameter for analysis."}), 400

    try:
        # Call the function we imported from nlp/reading_analysis.py
        analysis_results = analyze_reading_content(text_content)
        
        return jsonify({
            "success": True,
            "analysis": analysis_results
        })
    except Exception as e:
        print(f"Error during NLP analysis: {e}", file=sys.stderr)
        return jsonify({
            "success": False,
            "message": "Internal error during NLP processing."
        }), 500

# --- Serve Static Audio Files (Required for TTS playback) ---
@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_from_directory('audio_temp', filename) 

if __name__ == '__main__':
    print(f"🚀 ML Service running on http://localhost:{PORT}")
    app.run(port=PORT, debug=True)