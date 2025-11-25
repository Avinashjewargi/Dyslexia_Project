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


def extract_text_from_image(image_path):
    """
    Extracts text from an image file using Tesseract.
    Returns a dict that Node.js will JSON.stringify and send to frontend.
    """
    # 1) Dependency check
    if Image is None or pytesseract is None:
        return {
            "success": False,
            "error": "Missing libraries. Install: pip install pytesseract Pillow",
        }

    # 2) File existence check
    if not os.path.exists(image_path):
        return {
            "success": False,
            "error": f"File not found: {image_path}",
        }

    try:
        # 3) Open and process image
        img = Image.open(image_path)

        # Convert to RGB if needed
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        # Resize large images
        max_size = (1800, 1800)
        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size)

        # If Tesseract is not in PATH on Windows, uncomment and set this:
        # pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

        # 4) Run OCR
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
    # Called from Node: python process_text.py <image_path>
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        result = extract_text_from_image(image_path)
    else:
        result = {
            "success": False,
            "error": "No image path provided.",
        }

    # Print JSON so Node can read it on stdout
    print(json.dumps(result))
