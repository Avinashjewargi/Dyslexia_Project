# ml/config/languageConfig.py

"""
Language configuration for ML backend
Provides language mappings for OCR, TTS, and text analysis
"""

# Language configurations
LANGUAGES = {
    'en': {
        'code': 'en',
        'name': 'English',
        'tesseract': 'eng',
        'gtts': 'en',
        'script': 'Latin'
    },
    'hi': {
        'code': 'hi',
        'name': 'Hindi',
        'tesseract': 'hin',
        'gtts': 'hi',
        'script': 'Devanagari'
    },
    'kn': {
        'code': 'kn',
        'name': 'Kannada',
        'tesseract': 'kan',
        'gtts': 'kn',
        'script': 'Kannada'
    }
}

DEFAULT_LANGUAGE = 'en'


def get_language_config(language_code):
    """
    Get language configuration
    
    Args:
        language_code: Language code (en, hi, kn)
    
    Returns:
        dict: Language configuration
    """
    return LANGUAGES.get(language_code, LANGUAGES[DEFAULT_LANGUAGE])


def is_valid_language(language_code):
    """
    Check if language is supported
    
    Args:
        language_code: Language code to check
    
    Returns:
        bool: True if supported
    """
    return language_code in LANGUAGES


def get_tesseract_lang(language_code):
    """
    Get Tesseract language code
    
    Args:
        language_code: Language code
    
    Returns:
        str: Tesseract language code
    """
    config = get_language_config(language_code)
    return config['tesseract']


def get_gtts_lang(language_code):
    """
    Get gTTS language code
    
    Args:
        language_code: Language code
    
    Returns:
        str: gTTS language code
    """
    config = get_language_config(language_code)
    return config['gtts']


def get_script_name(language_code):
    """
    Get script name for language
    
    Args:
        language_code: Language code
    
    Returns:
        str: Script name
    """
    config = get_language_config(language_code)
    return config['script']


# Export all functions
__all__ = [
    'LANGUAGES',
    'DEFAULT_LANGUAGE',
    'get_language_config',
    'is_valid_language',
    'get_tesseract_lang',
    'get_gtts_lang',
    'get_script_name'
]