// frontend/utils/translationService.js

const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Translate text from one language to another
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, hi, kn)
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<Object>} Translation result
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  try {
    if (sourceLanguage === targetLanguage) {
      return {
        success: true,
        translatedText: text,
        originalText: text,
        sourceLanguage,
        targetLanguage,
        skipped: true
      };
    }

    const response = await fetch(`${API_BASE_URL}/translate`, {
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

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Translation failed');
    }

    return {
      success: true,
      translatedText: result.translatedText,
      originalText: result.originalText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: error.message,
      translatedText: text
    };
  }
};

/**
 * Batch translate multiple texts
 */
export const batchTranslate = async (texts, targetLanguage, sourceLanguage = 'auto') => {
  try {
    const response = await fetch(`${API_BASE_URL}/translate/batch`, {
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

    if (!response.ok) {
      throw new Error(`Batch translation failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Batch translation failed');
    }

    return {
      success: true,
      translations: result.translations,
      targetLanguage: result.targetLanguage,
      sourceLanguage: result.sourceLanguage
    };

  } catch (error) {
    console.error('Batch translation error:', error);
    return {
      success: false,
      error: error.message,
      translations: texts.map(text => ({
        original: text,
        translated: text,
        success: false
      }))
    };
  }
};

/** @deprecated Use batchTranslate */
export const translateBatch = batchTranslate;

/**
 * Detect the language of text
 */
export const detectTextLanguage = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/translate/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Language detection failed');
    }

    return {
      success: true,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence
    };

  } catch (error) {
    console.error('Language detection error:', error);
    return {
      success: false,
      error: error.message,
      detectedLanguage: 'en'
    };
  }
};

/** @deprecated Use detectTextLanguage */
export const detectLanguage = detectTextLanguage;

export default {
  translateText,
  batchTranslate,
  translateBatch,
  detectTextLanguage,
  detectLanguage
};
