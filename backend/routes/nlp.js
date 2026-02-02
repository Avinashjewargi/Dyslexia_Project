const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Language configuration
const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require('../config/languageConfig');

// Path to Python NLP script
const scriptPath = path.join(
  __dirname,
  '..',
  '..',
  'ml',
  'nlp',
  'reading_analysis.py'
);

// IMPORTANT: Use Python launcher on Windows
// Works cross-platform
const pythonExecutable = 'py';

// ========================================
// TEXT ANALYSIS (NLP)
// POST /api/nlp/analyze
// ========================================
router.post('/analyze', async (req, res) => {
  try {
    const { text, language } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------
    if (!text) {
      return res.status(400).json({
        success: false,
        error: "Missing 'text' field for analysis",
      });
    }

    // -----------------------------
    // Language handling
    // -----------------------------
    const lang = isValidLanguage(language) ? language : DEFAULT_LANGUAGE;
    const langConfig = getLanguageConfig(lang);

    console.log(`🧠 NLP requested | Language: ${lang} (${langConfig.name})`);

    // -----------------------------
    // Spawn Python process
    // -----------------------------
    const pythonProcess = spawn(
      pythonExecutable,
      [scriptPath, text, lang],
      {
        windowsHide: true, // prevents cmd popup on Windows
      }
    );

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
      console.error('🐍 Python NLP error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: 'Failed to run NLP analysis script',
          details: pythonError,
        });
      }

      try {
        if (!pythonOutput.trim()) {
          return res.status(500).json({
            success: false,
            error: 'No output from NLP script',
          });
        }

        // IMPORTANT: trim output before parsing
        const analysisResult = JSON.parse(pythonOutput.trim());

        res.json({
          success: true,
          analysis: analysisResult.analysis || analysisResult,
          language: lang,
        });

      } catch (err) {
        console.error('❌ NLP JSON parse error:', err.message);
        res.status(500).json({
          success: false,
          error: 'Failed to parse NLP results',
          rawOutput: pythonOutput,
        });
      }
    });

  } catch (error) {
    console.error('❌ NLP Analysis Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Text analysis failed',
      details: error.message,
    });
  }
});

module.exports = router;
