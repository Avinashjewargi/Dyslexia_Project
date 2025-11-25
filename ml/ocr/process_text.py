# ml/ocr/process_text.py

import sys
import json
import os

try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None


def extract_text_from_image(image_path: str) -> dict:
    """
    Extract text from an image using Tesseract OCR.
    Returns a JSON-serializable dict.
    """

    # 1) Dependency check
    if Image is None or pytesseract is None:
        return {
            "success": False,
            "error": "Server Error: Missing libraries. Please install with `pip install pytesseract Pillow`.",
        }

    # 2) File existence check
    if not os.path.exists(image_path):
        return {
            "success": False,
            "error": f"File not found: {image_path}",
        }

    try:
        # 3) Open image
        img = Image.open(image_path)

        # 4) PERFORMANCE: resize very large images
        max_size = (1800, 1800)
        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size)

        # 5) If needed on Windows, set explicit tesseract path
        # pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

        # 6) Run OCR
        extracted_text = pytesseract.image_to_string(img)
        clean_text = extracted_text.strip()

        if not clean_text:
            return {
                "success": True,
                "extracted_text": "No text detected in image.",
                "source": "OCR (Empty)",
            }

        return {
            "success": True,
            "extracted_text": clean_text,
            "source": "OCR Upload",
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"OCR Failed: {str(e)}",
        }


if __name__ == "__main__":
    # Node passes image path as first argument
    if len(sys.argv) > 1:
        result = extract_text_from_image(sys.argv[1])
        print(json.dumps(result))
    else:
        print(json.dumps({
            "success": False,
            "error": "No image path provided.",
        }))
