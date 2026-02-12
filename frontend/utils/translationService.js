// frontend/utils/translationService.js

const TRANSLATION_API_URL = 'http://localhost:5000/api/translate';

/**
 * Translate text from one language to another
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, hi, kn)
 * @param {string} sourceLanguage - Source language code (default: 'auto')
 * @returns {Promise<Object>} Translation result
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  try {
    const response = await fetch(TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        translatedText: data.translatedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage
      };
    }

    // If translation fails, return original text
    return {
      success: false,
      translatedText: text,
      error: data.error,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      translatedText: text, // Return original text as fallback
      error: error.message
    };
  }
};

/**
 * Translate multiple texts
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Object>} Batch translation result
 */
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'auto') => {
  try {
    const response = await fetch(`${TRANSLATION_API_URL}/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage,
        sourceLanguage
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        translations: data.translations
      };
    }

    return {
      success: false,
      error: data.error
    };

  } catch (error) {
    console.error('Batch translation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Detect language of text
 * @param {string} text - Text to detect language
 * @returns {Promise<Object>} Detection result
 */
export const detectLanguage = async (text) => {
  try {
    const response = await fetch(`${TRANSLATION_API_URL}/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        detectedLanguage: data.detectedLanguage,
        confidence: data.confidence
      };
    }

    return {
      success: false,
      error: data.error
    };

  } catch (error) {
    console.error('Language detection error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  translateText,
  translateBatch,
  detectLanguage
};