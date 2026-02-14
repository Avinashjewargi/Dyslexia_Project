// frontend/utils/translationService.js
<<<<<<< HEAD

const TRANSLATION_API_URL = 'http://localhost:5000/api/translate';
=======
// FIXED: Proper translation with better state management

const API_BASE_URL = 'http://127.0.0.1:5000/api';
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

/**
 * Translate text from one language to another
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (en, hi, kn)
<<<<<<< HEAD
 * @param {string} sourceLanguage - Source language code (default: 'auto')
=======
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
 * @returns {Promise<Object>} Translation result
 */
export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  try {
<<<<<<< HEAD
    const response = await fetch(TRANSLATION_API_URL, {
=======
    // Don't translate if source and target are the same
    if (sourceLanguage === targetLanguage) {
      console.log(`⏭️ Skipping translation: ${sourceLanguage} → ${targetLanguage} (same language)`);
      return {
        success: true,
        translatedText: text,
        originalText: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
        skipped: true
      };
    }

    console.log(`🌍 Translating: ${sourceLanguage} → ${targetLanguage}`);
    console.log(`📝 Text preview: ${text.substring(0, 100)}...`);

    const response = await fetch(`${API_BASE_URL}/translate`, {
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
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

<<<<<<< HEAD
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
=======
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Translation failed');
    }

    console.log(`✅ Translation successful`);
    console.log(`📝 Result preview: ${result.translatedText.substring(0, 100)}...`);

    return {
      success: true,
      translatedText: result.translatedText,
      originalText: result.originalText,
      sourceLanguage: result.sourceLanguage,
      targetLanguage: result.targetLanguage
    };

  } catch (error) {
    console.error('❌ Translation error:', error);
    return {
      success: false,
      error: error.message,
      translatedText: text // Return original text as fallback
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    };
  }
};

/**
<<<<<<< HEAD
 * Translate multiple texts
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code
 * @returns {Promise<Object>} Batch translation result
 */
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'auto') => {
  try {
    const response = await fetch(`${TRANSLATION_API_URL}/batch`, {
=======
 * Batch translate multiple texts
 */
export const batchTranslate = async (texts, targetLanguage, sourceLanguage = 'auto') => {
  try {
    console.log(`🌍 Batch translating ${texts.length} items: ${sourceLanguage} → ${targetLanguage}`);

    const response = await fetch(`${API_BASE_URL}/translate/batch`, {
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
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

<<<<<<< HEAD
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
=======
    if (!response.ok) {
      throw new Error(`Batch translation failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Batch translation failed');
    }

    console.log(`✅ Batch translation successful`);

    return {
      success: true,
      translations: result.translations,
      targetLanguage: result.targetLanguage,
      sourceLanguage: result.sourceLanguage
    };

  } catch (error) {
    console.error('❌ Batch translation error:', error);
    return {
      success: false,
      error: error.message,
      translations: texts.map(text => ({
        original: text,
        translated: text,
        success: false
      }))
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    };
  }
};

/**
<<<<<<< HEAD
 * Detect language of text
 * @param {string} text - Text to detect language
 * @returns {Promise<Object>} Detection result
 */
export const detectLanguage = async (text) => {
  try {
    const response = await fetch(`${TRANSLATION_API_URL}/detect`, {
=======
 * Detect the language of text
 */
export const detectTextLanguage = async (text) => {
  try {
    console.log(`🔍 Detecting language for: ${text.substring(0, 50)}...`);

    const response = await fetch(`${API_BASE_URL}/translate/detect`, {
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

<<<<<<< HEAD
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
=======
    if (!response.ok) {
      throw new Error(`Language detection failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Language detection failed');
    }

    console.log(`✅ Detected language: ${result.detectedLanguage}`);

    return {
      success: true,
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence
    };

  } catch (error) {
    console.error('❌ Language detection error:', error);
    return {
      success: false,
      error: error.message,
      detectedLanguage: 'en' // Default fallback
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    };
  }
};

export default {
  translateText,
<<<<<<< HEAD
  translateBatch,
  detectLanguage
=======
  batchTranslate,
  detectTextLanguage
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
};