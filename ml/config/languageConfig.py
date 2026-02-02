# ml/config/languageConfig.py

LANGUAGES = {
    "en": {
        "code": "en",
        "name": "English",
        "tesseract_lang": "eng",
        "native_name": "English"
    },
    "hi": {
        "code": "hi",
        "name": "Hindi",
        "tesseract_lang": "hin",  # Tesseract uses 'hin' for Hindi
        "native_name": "हिंदी"
    },
    "kn": {
        "code": "kn",
        "name": "Kannada",
        "tesseract_lang": "kan",  # Tesseract uses 'kan' for Kannada
        "native_name": "ಕನ್ನಡ"
    }
}

DEFAULT_LANGUAGE = "en"


def get_tesseract_lang(language_code):
    """
    Convert language code to Tesseract language code
    en -> eng
    hi -> hin
    kn -> kan
    """
    if language_code in LANGUAGES:
        return LANGUAGES[language_code]["tesseract_lang"]
    return LANGUAGES[DEFAULT_LANGUAGE]["tesseract_lang"]


def is_valid_language(language_code):
    """Check if language code is supported"""
    return language_code in LANGUAGES


def get_language_name(language_code):
    """Get language name"""
    if language_code in LANGUAGES:
        return LANGUAGES[language_code]["name"]
    return LANGUAGES[DEFAULT_LANGUAGE]["name"]