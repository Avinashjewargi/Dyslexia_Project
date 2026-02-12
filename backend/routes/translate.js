// backend/routes/translate.js

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
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // Parse Google Translate response
    if (response.data && response.data[0]) {
      const translatedText = response.data[0]
        .map(item => item[0])
        .filter(Boolean)
        .join('');

      const detectedSourceLang = response.data[2] || sourceLanguage;

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
 * Body: { texts: string[], targetLanguage: string }
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
          }
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
      }
    });

    if (response.data && response.data[2]) {
      const detectedLanguage = response.data[2];
      
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