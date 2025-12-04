
import sys
import json
import os
import traceback

try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None


def extract_text_from_image(image_path: str) -> dict:
    """Extract text from an image using Tesseract OCR."""
    
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
        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')

        # Resize large images
        max_size = (1800, 1800)
        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # 4) Check Tesseract
        try:
            pytesseract.get_tesseract_version()
        except Exception:
            return {
                "success": False,
                "error": "Tesseract not installed. Install from: https://github.com/tesseract-ocr/tesseract",
            }

        # 5) Run OCR with timeout
        extracted_text = pytesseract.image_to_string(
            img,
            timeout=30,
            config='--psm 3'
        )
        
        clean_text = extracted_text.strip()

        if not clean_text:
            return {
                "success": True,
                "extractedText": "No text detected in image.",
                "source": "OCR (Empty)",
            }

        return {
            "success": True,
            "extractedText": clean_text,
            "source": "OCR Upload",
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"OCR Failed: {str(e)}",
            "traceback": traceback.format_exc(),
        }


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(line_buffering=True)
        
        if len(sys.argv) > 1:
            result = extract_text_from_image(sys.argv[1])
            print(json.dumps(result), flush=True)
        else:
            print(json.dumps({
                "success": False,
                "error": "No image path provided.",
            }), flush=True)
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "traceback": traceback.format_exc(),
        }), flush=True)
    
    sys.exit(0)