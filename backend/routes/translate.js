// backend/routes/translate.js
<<<<<<< HEAD
=======
// FIXED: Proper Hindi and Kannada translation with Google Translate API
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * Translation endpoint using Google Translate API (free)
 * POST /api/translate
 * Body: { text: string, targetLanguage: string, sourceLanguage?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: text and targetLanguage'
      });
    }

    console.log(`🌍 Translation request: ${sourceLanguage} → ${targetLanguage}`);
<<<<<<< HEAD
=======
    console.log(`📝 Text preview: ${text.substring(0, 100)}...`);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

    // Use Google Translate API (free tier)
    const url = 'https://translate.googleapis.com/translate_a/single';
    const params = {
      client: 'gtx',
      sl: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
      tl: targetLanguage,
      dt: 't',
      q: text
    };

    const response = await axios.get(url, { 
      params,
<<<<<<< HEAD
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
=======
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      // Ensure proper encoding for Hindi/Kannada
      responseType: 'json',
      responseEncoding: 'utf8'
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    });

    // Parse Google Translate response
    if (response.data && response.data[0]) {
      const translatedText = response.data[0]
        .map(item => item[0])
        .filter(Boolean)
        .join('');

      const detectedSourceLang = response.data[2] || sourceLanguage;

<<<<<<< HEAD
=======
      console.log(`✅ Translation successful`);
      console.log(`📝 Result preview: ${translatedText.substring(0, 100)}...`);
      console.log(`🔍 Detected source: ${detectedSourceLang}`);

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      return res.json({
        success: true,
        originalText: text,
        translatedText,
        sourceLanguage: detectedSourceLang,
        targetLanguage,
        translationService: 'Google Translate'
      });
    }

    throw new Error('Invalid response from translation service');

  } catch (error) {
    console.error('❌ Translation Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Translation failed',
      details: error.message,
      fallback: req.body.text // Return original text as fallback
    });
  }
});

/**
 * Batch translation endpoint
 * POST /api/translate/batch
<<<<<<< HEAD
 * Body: { texts: string[], targetLanguage: string }
=======
 * Body: { texts: string[], targetLanguage: string, sourceLanguage?: string }
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'auto' } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: texts (array) and targetLanguage'
      });
    }

    console.log(`🌍 Batch translation: ${texts.length} items to ${targetLanguage}`);

    // Translate each text
    const translationPromises = texts.map(async (text) => {
      try {
        const url = 'https://translate.googleapis.com/translate_a/single';
        const params = {
          client: 'gtx',
          sl: sourceLanguage,
          tl: targetLanguage,
          dt: 't',
          q: text
        };

        const response = await axios.get(url, { 
          params,
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0'
<<<<<<< HEAD
          }
=======
          },
          responseEncoding: 'utf8'
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        });

        if (response.data && response.data[0]) {
          const translatedText = response.data[0]
            .map(item => item[0])
            .filter(Boolean)
            .join('');

          return {
            original: text,
            translated: translatedText,
            success: true
          };
        }

        return {
          original: text,
          translated: text,
          success: false,
          error: 'Translation failed'
        };

      } catch (error) {
        return {
          original: text,
          translated: text,
          success: false,
          error: error.message
        };
      }
    });

    const results = await Promise.all(translationPromises);

<<<<<<< HEAD
=======
    console.log(`✅ Batch translation complete: ${results.filter(r => r.success).length}/${results.length} successful`);

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    return res.json({
      success: true,
      translations: results,
      targetLanguage,
      sourceLanguage
    });

  } catch (error) {
    console.error('❌ Batch Translation Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Batch translation failed',
      details: error.message
    });
  }
});

/**
 * Detect language endpoint
 * POST /api/translate/detect
 * Body: { text: string }
 */
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: text'
      });
    }

<<<<<<< HEAD
=======
    console.log(`🔍 Detecting language for: ${text.substring(0, 100)}...`);

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    const url = 'https://translate.googleapis.com/translate_a/single';
    const params = {
      client: 'gtx',
      sl: 'auto',
      tl: 'en',
      dt: 't',
      q: text.substring(0, 500) // Only send first 500 chars for detection
    };

    const response = await axios.get(url, { 
      params,
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
<<<<<<< HEAD
      }
=======
      },
      responseEncoding: 'utf8'
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    });

    if (response.data && response.data[2]) {
      const detectedLanguage = response.data[2];
      
<<<<<<< HEAD
=======
      console.log(`✅ Detected language: ${detectedLanguage}`);

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      return res.json({
        success: true,
        detectedLanguage,
        confidence: 0.95,
        text: text.substring(0, 100) + '...'
      });
    }

    throw new Error('Could not detect language');

  } catch (error) {
    console.error('❌ Language Detection Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Language detection failed',
      details: error.message
    });
  }
});

module.exports = router;