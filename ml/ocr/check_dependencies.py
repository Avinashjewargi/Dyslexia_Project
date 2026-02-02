#!/usr/bin/env python3
"""
OCR Setup Verification Script
Checks if all required dependencies are installed and configured correctly
"""

import sys
import json

def check_dependencies():
    results = {
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "checks": {}
    }
    
    # Check 1: PIL/Pillow
    try:
        from PIL import Image
        import PIL
        results["checks"]["pillow"] = {
            "installed": True,
            "version": PIL.__version__
        }
    except ImportError as e:
        results["checks"]["pillow"] = {
            "installed": False,
            "error": str(e),
            "fix": "pip install Pillow"
        }
    
    # Check 2: pytesseract
    try:
        import pytesseract
        results["checks"]["pytesseract"] = {
            "installed": True,
            "version": pytesseract.__version__ if hasattr(pytesseract, '__version__') else "unknown"
        }
        
        # Check 3: Tesseract executable
        try:
            version = pytesseract.get_tesseract_version()
            results["checks"]["tesseract"] = {
                "installed": True,
                "version": str(version)
            }
            
            # Check 4: Available languages
            try:
                langs = pytesseract.get_languages()
                results["checks"]["tesseract_languages"] = {
                    "available": langs,
                    "count": len(langs),
                    "has_english": "eng" in langs,
                    "has_hindi": "hin" in langs,
                    "has_kannada": "kan" in langs
                }
            except Exception as e:
                results["checks"]["tesseract_languages"] = {
                    "error": str(e)
                }
                
        except Exception as e:
            results["checks"]["tesseract"] = {
                "installed": False,
                "error": str(e),
                "fix": {
                    "windows": "Download from: https://github.com/UB-Mannheim/tesseract/wiki",
                    "linux": "sudo apt-get install tesseract-ocr",
                    "mac": "brew install tesseract"
                }
            }
            
    except ImportError as e:
        results["checks"]["pytesseract"] = {
            "installed": False,
            "error": str(e),
            "fix": "pip install pytesseract"
        }
    
    # Check 5: NLTK
    try:
        import nltk
        results["checks"]["nltk"] = {
            "installed": True,
            "version": nltk.__version__
        }
    except ImportError as e:
        results["checks"]["nltk"] = {
            "installed": False,
            "error": str(e),
            "fix": "pip install nltk"
        }
    
    return results


def print_results(results):
    print("\n" + "="*60)
    print("OCR DEPENDENCY CHECK")
    print("="*60)
    print(f"\nPython Version: {results['python_version']}")
    print("\nDependency Status:")
    print("-"*60)
    
    all_ok = True
    
    for name, check in results["checks"].items():
        if isinstance(check, dict):
            if check.get("installed"):
                version = check.get("version", "unknown")
                print(f"✅ {name}: OK (version: {version})")
            else:
                all_ok = False
                print(f"❌ {name}: NOT INSTALLED")
                if "error" in check:
                    print(f"   Error: {check['error']}")
                if "fix" in check:
                    print(f"   Fix: {check['fix']}")
    
    # Special handling for language packs
    if "tesseract_languages" in results["checks"]:
        lang_check = results["checks"]["tesseract_languages"]
        if "available" in lang_check:
            print(f"\n📚 Tesseract Languages: {lang_check['count']} installed")
            print(f"   English (eng): {'✅' if lang_check['has_english'] else '❌'}")
            print(f"   Hindi (hin): {'✅' if lang_check['has_hindi'] else '❌'}")
            print(f"   Kannada (kan): {'✅' if lang_check['has_kannada'] else '❌'}")
            
            if not all([lang_check['has_english'], lang_check['has_hindi'], lang_check['has_kannada']]):
                print("\n   Install missing languages:")
                print("   Linux: sudo apt-get install tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-kan")
                print("   Mac: brew install tesseract-lang")
                print("   Windows: Download language packs from Tesseract wiki")
    
    print("\n" + "="*60)
    if all_ok:
        print("✅ ALL DEPENDENCIES OK - OCR should work!")
    else:
        print("❌ MISSING DEPENDENCIES - Install them to use OCR")
    print("="*60 + "\n")
    
    return all_ok


if __name__ == "__main__":
    try:
        results = check_dependencies()
        
        # Print human-readable output to stderr so it doesn't interfere with JSON
        import sys
        sys.stderr.write("\n")
        print_results(results)
        
        # Output JSON to stdout for programmatic use
        print(json.dumps(results, indent=2))
        
        # Exit with appropriate code
        all_ok = all(
            check.get("installed", False) 
            for check in results["checks"].values() 
            if isinstance(check, dict) and "installed" in check
        )
        sys.exit(0 if all_ok else 1)
        
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)