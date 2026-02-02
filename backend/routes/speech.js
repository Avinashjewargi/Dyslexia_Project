const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Language configuration
const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require('../config/languageConfig');

/**
 * This router expects `upload` (multer instance)
 * to be injected from server.js
 */
module.exports = (upload) => {
  // Path to Python script
  const recognitionScriptPath = path.join(
    __dirname,
    '..',
    '..',
    'ml',
    'speech',
    'recognition.py'
  );

  // IMPORTANT: Use Python launcher on Windows
  const pythonExecutable = 'py';

  // =====================================================
  // TEXT TO SPEECH (TTS)
  // POST /api/speech/tts
  // =====================================================
  router.post('/tts', async (req, res) => {
    try {
      const { text, speed = 1.0, language } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: "Missing 'text' field for TTS",
        });
      }

      // Language validation
      const lang = isValidLanguage(language) ? language : DEFAULT_LANGUAGE;
      const langConfig = getLanguageConfig(lang);

      console.log(`🔊 TTS requested | Language: ${lang} (${langConfig.name})`);

      // Spawn Python process
      const pythonProcess = spawn(
        pythonExecutable,
        [
          recognitionScriptPath,
          'tts_mode',
          text,
          langConfig.ttsLang,
          String(speed),
        ],
        {
          windowsHide: true,
        }
      );

      let pythonOutput = '';
      let pythonError = '';

      // Safety timeout (30s)
      const timeout = setTimeout(() => {
        pythonProcess.kill('SIGKILL');
      }, 30000);

      pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
        console.error('🐍 Python TTS error:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);

        if (code !== 0) {
          return res.status(500).json({
            success: false,
            error: 'Failed to run TTS script',
            details: pythonError,
          });
        }

        try {
          const result = JSON.parse(pythonOutput.trim());

          if (!result.success) {
            return res.status(500).json({
              success: false,
              error: result.error || 'TTS failed',
            });
          }

          res.json({
            success: true,
            audioUrl: result.audioUrl || `/audio/${result.audio_filename}`,
            duration: result.duration || 0,
            language: lang,
          });

        } catch (err) {
          console.error('❌ TTS JSON parse error:', err.message);
          res.status(500).json({
            success: false,
            error: 'Failed to parse TTS output',
            rawOutput: pythonOutput,
          });
        }
      });

    } catch (error) {
      console.error('❌ TTS Error:', error.message);
      res.status(500).json({
        success: false,
        error: 'Text-to-speech processing failed',
        details: error.message,
      });
    }
  });

  // =====================================================
  // SPEECH TO TEXT (STT)
  // POST /api/speech/stt
  // =====================================================
  router.post('/stt', upload.single('audio'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file uploaded',
      });
    }

    const filePath = req.file.path;
    const targetWord = req.body.word || '';
    const language = req.body.language;

    // Language validation
    const lang = isValidLanguage(language) ? language : DEFAULT_LANGUAGE;
    const langConfig = getLanguageConfig(lang);

    console.log(`🎙️ STT requested | Language: ${lang} (${langConfig.name})`);

    const pythonProcess = spawn(
      pythonExecutable,
      [
        recognitionScriptPath,
        'stt_mode',
        filePath,
        targetWord,
        langConfig.ttsLang,
      ],
      {
        windowsHide: true,
      }
    );

    let pythonOutput = '';
    let pythonError = '';

    // Safety timeout
    const timeout = setTimeout(() => {
      pythonProcess.kill('SIGKILL');
    }, 30000);

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
      console.error('🐍 Python STT error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);

      // Cleanup uploaded audio file
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temp audio:', err.message);
      });

      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: 'Failed to run STT script',
          details: pythonError,
        });
      }

      try {
        const result = JSON.parse(pythonOutput.trim());

        res.json({
          success: true,
          text: result.text || '',
          confidence: result.confidence || 0,
          pronunciationScore: result.pronunciationScore,
          language: lang,
        });

      } catch (err) {
        console.error('❌ STT JSON parse error:', err.message);
        res.status(500).json({
          success: false,
          error: 'Failed to parse STT output',
          rawOutput: pythonOutput,
        });
      }
    });
  });

  return router;
};
