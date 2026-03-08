<<<<<<< HEAD
import sys
import os
import json
import traceback

# Force UTF-8 encoding for stdout
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

# -------------------------------
# Safe imports
# -------------------------------
try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None

# -------------------------------
# Add parent directory for config imports
# -------------------------------
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from config.languageConfig import (
        get_tesseract_lang,
        is_valid_language,
        DEFAULT_LANGUAGE
    )
except ImportError:
    # Fallback (should not normally happen)
    def get_tesseract_lang(lang): return "eng"
    def is_valid_language(lang): return lang == "en"
    DEFAULT_LANGUAGE = "en"


# -------------------------------
# Helper: Script name
# -------------------------------
def get_script_name(language: str) -> str:
    scripts = {
        "en": "Latin",
        "hi": "Devanagari",
        "kn": "Kannada"
    }
    return scripts.get(language, "Unknown")


# -------------------------------
# Core OCR Function
# -------------------------------
def extract_text_from_image(image_path: str, language: str = "en") -> dict:
    """
    Extract text from an image using Tesseract OCR with language support.
    """

    # 1️⃣ Dependency check
    if Image is None or pytesseract is None:
        return {
            "success": False,
            "error": "Missing libraries. Install: pip install pytesseract Pillow"
        }

    # 2️⃣ File existence check
    if not os.path.exists(image_path):
        return {
            "success": False,
            "error": f"File not found: {image_path}"
        }

    # 3️⃣ Validate language
    if not is_valid_language(language):
        language = DEFAULT_LANGUAGE

    tesseract_lang = get_tesseract_lang(language)

    try:
        # 4️⃣ Check Tesseract installation
        try:
            pytesseract.get_tesseract_version()
        except Exception:
            return {
                "success": False,
                "error": "Tesseract OCR not installed or not in PATH"
            }

        # 5️⃣ Open image
        img = Image.open(image_path)

        # Convert image mode if needed
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        # Resize very large images
        max_size = (1800, 1800)
        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # 6️⃣ OCR configuration
        custom_config = f"--oem 3 --psm 6 -l {tesseract_lang}"

        # 7️⃣ Extract text
        extracted_text = pytesseract.image_to_string(
            img,
            config=custom_config,
            timeout=30
        ).strip()

        # 8️⃣ Confidence calculation (FIXED)
        try:
            data = pytesseract.image_to_data(
                img,
                lang=tesseract_lang,
                output_type=pytesseract.Output.DICT
            )

            # Handle both string and int confidence values
            confidences = []
            for conf in data.get("conf", []):
                try:
                    # Convert to int if it's a string
                    conf_int = int(conf) if isinstance(conf, str) else conf
                    # Only include valid confidence values (> 0)
                    if conf_int > 0:
                        confidences.append(conf_int)
                except (ValueError, TypeError):
                    # Skip invalid confidence values
                    continue

            avg_confidence = (
                sum(confidences) / len(confidences) / 100
                if confidences else 0
            )
        except Exception as conf_error:
            # If confidence calculation fails, use default
            print(f"Warning: Confidence calculation failed: {conf_error}", file=sys.stderr)
            avg_confidence = 0.85

        # 9️⃣ Empty text handling
        if not extracted_text:
            return {
                "success": True,
                "extractedText": "No text detected in image.",
                "confidence": 0,
                "language": language,
                "script": get_script_name(language),
                "word_count": 0
            }

        return {
            "success": True,
            "extractedText": extracted_text,
            "confidence": round(avg_confidence, 2),
            "language": language,
            "script": get_script_name(language),
            "word_count": len(extracted_text.split())
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"OCR Failed: {str(e)}",
            "traceback": traceback.format_exc()
        }


# -------------------------------
# Backward compatibility
# -------------------------------
def process_image(image_path: str) -> dict:
    return extract_text_from_image(image_path, "en")


# -------------------------------
# CLI ENTRY (Node.js compatibility)
# -------------------------------
if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            print(json.dumps({
                "success": False,
                "error": "No image path provided"
            }, ensure_ascii=False), flush=True)
            sys.exit(1)

        image_path = sys.argv[1]
        language = sys.argv[2] if len(sys.argv) > 2 else "en"

        result = extract_text_from_image(image_path, language)
        
        # Ensure proper UTF-8 JSON output
        print(json.dumps(result, ensure_ascii=False, indent=None), flush=True)

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "traceback": traceback.format_exc()
        }, ensure_ascii=False), flush=True)

    sys.exit(0)
=======
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
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
