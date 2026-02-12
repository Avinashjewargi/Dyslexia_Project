# ml/ocr/process_text.py
# WORKING VERSION: Proper UTF-8 support for Hindi & Kannada

import sys
import json
import os

# Force UTF-8 encoding
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

def send_error(error, details="", help_msg=""):
    result = {
        'success': False,
        'error': error,
        'details': details,
        'help': help_msg
    }
    print(json.dumps(result, ensure_ascii=False), flush=True)
    sys.exit(1)

# Check arguments
if len(sys.argv) < 3:
    send_error(
        'Invalid arguments',
        'Usage: python process_text.py <image_path> <language>',
        'Provide image path and language code (eng/hin/kan)'
    )

image_path = sys.argv[1]
language = sys.argv[2]

# Verify image exists
if not os.path.exists(image_path):
    send_error('Image file not found', f'Path: {image_path}', '')

# Import pytesseract
try:
    import pytesseract
except ImportError:
    send_error(
        'pytesseract not installed',
        'ModuleNotFoundError: No module named pytesseract',
        'Run: pip install pytesseract --break-system-packages'
    )

# Import PIL
try:
    from PIL import Image
except ImportError:
    send_error(
        'Pillow not installed',
        'ModuleNotFoundError: No module named PIL',
        'Run: pip install Pillow --break-system-packages'
    )

import time

def detect_script(text):
    if not text:
        return 'Unknown'
    
    sample = text[:100]
    devanagari = sum(1 for c in sample if '\u0900' <= c <= '\u097F')
    kannada = sum(1 for c in sample if '\u0C80' <= c <= '\u0CFF')
    latin = sum(1 for c in sample if c.isalpha() and ord(c) < 128)
    
    if devanagari > kannada and devanagari > latin:
        return 'Devanagari'
    elif kannada > devanagari and kannada > latin:
        return 'Kannada'
    elif latin > 0:
        return 'Latin'
    return 'Mixed'

# Main processing
try:
    start_time = time.time()
    
    # Open image
    try:
        img = Image.open(image_path)
    except Exception as e:
        send_error('Failed to open image', str(e), 'Image may be corrupted')
    
    # Check Tesseract
    try:
        tesseract_version = pytesseract.get_tesseract_version()
        print(f"Tesseract version: {tesseract_version}", file=sys.stderr)
    except Exception as e:
        send_error(
            'Tesseract not found',
            str(e),
            'Install Tesseract OCR from: https://github.com/tesseract-ocr/tesseract/wiki'
        )
    
    # Check language availability
    try:
        available_langs = pytesseract.get_languages()
        print(f"Available languages: {available_langs}", file=sys.stderr)
        
        if language not in available_langs:
            send_error(
                f'Language {language} not available',
                f'Available: {", ".join(available_langs)}',
                f'Install language pack: {language}.traineddata'
            )
    except:
        pass
    
    # Perform OCR
    try:
        print(f"Running OCR with language: {language}", file=sys.stderr)
        
        config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(img, lang=language, config=config)
        text = text.strip()
        
        print(f"OCR completed. Extracted {len(text)} characters", file=sys.stderr)
        
    except pytesseract.TesseractNotFoundError:
        send_error(
            'Tesseract executable not found',
            'Tesseract is not installed or not in PATH',
            'Install Tesseract OCR'
        )
    except Exception as e:
        send_error('OCR processing failed', str(e), '')
    
    # Calculate metrics
    processing_time = time.time() - start_time
    word_count = len(text.split()) if text else 0
    script = detect_script(text)
    
    # Map Tesseract code to UI code
    lang_map = {'eng': 'en', 'hin': 'hi', 'kan': 'kn'}
    ui_lang = lang_map.get(language, 'en')
    
    # Success response
    result = {
        'success': True,
        'extractedText': text,
        'text': text,
        'language': ui_lang,
        'script': script,
        'confidence': 0.95,
        'processingTime': round(processing_time, 2),
        'word_count': word_count
    }
    
    print(json.dumps(result, ensure_ascii=False), flush=True)
    sys.exit(0)
    
except Exception as e:
    import traceback
    send_error('Unexpected error', str(e), traceback.format_exc())