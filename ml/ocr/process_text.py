# ml/ocr/process_text.py
# WORKING VERSION: Proper UTF-8 support for Hindi & Kannada

import sys
import json
import os
import io
import time

# Force UTF-8 encoding
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


def extract_text_from_image(image_path, language):
    """
    Main function called by api.py.
    image_path: path to the image file
    language: Tesseract language code (eng/hin/kan)
    Returns a dict with success, extractedText, language (UI code), script, etc.
    """
    # Import pytesseract
    try:
        import pytesseract
    except ImportError:
        return {
            'success': False,
            'error': 'pytesseract not installed',
            'details': 'ModuleNotFoundError: No module named pytesseract',
            'help': 'Run: pip install pytesseract'
        }

    # Import PIL
    try:
        from PIL import Image
    except ImportError:
        return {
            'success': False,
            'error': 'Pillow not installed',
            'details': 'ModuleNotFoundError: No module named PIL',
            'help': 'Run: pip install Pillow'
        }

    # Verify image exists
    if not os.path.exists(image_path):
        return {
            'success': False,
            'error': 'Image file not found',
            'details': f'Path: {image_path}',
            'help': ''
        }

    start_time = time.time()

    # Open image
    try:
        img = Image.open(image_path)
    except Exception as e:
        return {
            'success': False,
            'error': 'Failed to open image',
            'details': str(e),
            'help': 'Image may be corrupted'
        }

    # Check Tesseract is installed
    try:
        tesseract_version = pytesseract.get_tesseract_version()
        print(f"Tesseract version: {tesseract_version}", file=sys.stderr)
    except Exception as e:
        return {
            'success': False,
            'error': 'Tesseract not found',
            'details': str(e),
            'help': 'Install Tesseract OCR from: https://github.com/tesseract-ocr/tesseract/wiki'
        }

    # Check language pack is available
    try:
        available_langs = pytesseract.get_languages()
        print(f"Available languages: {available_langs}", file=sys.stderr)

        if language not in available_langs:
            return {
                'success': False,
                'error': f'Language pack "{language}" not available',
                'details': f'Available: {", ".join(available_langs)}',
                'help': f'Install language pack: {language}.traineddata'
            }
    except Exception:
        pass  # If we can't check, proceed anyway

    # Run OCR
    try:
        print(f"Running OCR with language: {language}", file=sys.stderr)
        config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(img, lang=language, config=config)
        text = text.strip()
        print(f"OCR completed. Extracted {len(text)} characters", file=sys.stderr)

    except pytesseract.TesseractNotFoundError:
        return {
            'success': False,
            'error': 'Tesseract executable not found',
            'details': 'Tesseract is not installed or not in PATH',
            'help': 'Install Tesseract OCR'
        }
    except Exception as e:
        return {
            'success': False,
            'error': 'OCR processing failed',
            'details': str(e),
            'help': ''
        }

    # Map Tesseract code back to UI language code
    lang_map = {'eng': 'en', 'hin': 'hi', 'kan': 'kn'}
    ui_lang = lang_map.get(language, 'en')

    processing_time = time.time() - start_time
    word_count = len(text.split()) if text else 0
    script = detect_script(text)

    return {
        'success': True,
        'extractedText': text,
        'text': text,
        'language': ui_lang,        # 'en' / 'hi' / 'kn'
        'script': script,
        'confidence': 0.95,
        'processingTime': round(processing_time, 2),
        'word_count': word_count,
        'source': 'OCR Upload'
    }


# --------------------------------------------------
# CLI usage: python process_text.py <image_path> <language>
# --------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        send_error(
            'Invalid arguments',
            'Usage: python process_text.py <image_path> <language>',
            'Provide image path and language code (eng/hin/kan)'
        )

    image_path = sys.argv[1]
    language = sys.argv[2]

    result = extract_text_from_image(image_path, language)
    print(json.dumps(result, ensure_ascii=False), flush=True)
    sys.exit(0 if result.get('success') else 1)