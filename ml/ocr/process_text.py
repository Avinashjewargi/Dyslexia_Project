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
