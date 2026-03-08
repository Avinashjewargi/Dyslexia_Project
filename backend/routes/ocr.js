//backend/routes/ocr.js

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// Language utilities
const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require("../config/languageConfig");

const { detectLanguage } = require("../utils/languageDetector");

/**
 * This router expects `upload` (multer instance)
 * to be injected from the parent file
 */
module.exports = (upload) => {
  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "ml",
    "ocr",
    "process_text.py"
  );

  // ===============================
  // PYTHON EXECUTABLE - USE VENV
  // ===============================
  const getPythonExecutable = () => {
    // 1) Allow explicit override via env var (recommended for debugging)
    const envPython = process.env.ML_PYTHON;
    if (envPython && fs.existsSync(envPython)) {
      console.log("✅ Using Python from ML_PYTHON env:", envPython);
      return envPython;
    }

    // 2) Try current venv folder: ml/venv (Windows)
    const venvPythonWin = path.join(
      __dirname,
      "..",
      "..",
      "ml",
      "venv",
      "Scripts",
      "python.exe"
    );

    // 3) Try current venv folder: ml/venv (Linux/Mac)
    const venvPythonUnix = path.join(
      __dirname,
      "..",
      "..",
      "ml",
      "venv",
      "bin",
      "python"
    );

    // 4) Backward‑compat: older venv name ml/venv311 (Windows)
    const venv311PythonWin = path.join(
      __dirname,
      "..",
      "..",
      "ml",
      "venv311",
      "Scripts",
      "python.exe"
    );

    // 5) Backward‑compat: older venv name ml/venv311 (Linux/Mac)
    const venv311PythonUnix = path.join(
      __dirname,
      "..",
      "..",
      "ml",
      "venv311",
      "bin",
      "python"
    );

    if (fs.existsSync(venvPythonWin)) {
      console.log("✅ Using virtual environment Python:", venvPythonWin);
      return venvPythonWin;
    }

    if (fs.existsSync(venvPythonUnix)) {
      console.log("✅ Using virtual environment Python:", venvPythonUnix);
      return venvPythonUnix;
    }

    if (fs.existsSync(venv311PythonWin)) {
      console.log("✅ Using virtual environment Python (venv311):", venv311PythonWin);
      return venv311PythonWin;
    }

    if (fs.existsSync(venv311PythonUnix)) {
      console.log("✅ Using virtual environment Python (venv311):", venv311PythonUnix);
      return venv311PythonUnix;
    }

    // 6) Fallback to system Python
    console.warn("⚠️ Virtual environment not found, using system Python");
    const platform = process.platform;
    return platform === "win32" ? "python" : "python3";
  };

  const pythonExecutable = getPythonExecutable();

  // ===============================
  // OCR IMAGE UPLOAD ENDPOINT
  // ===============================
  router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("\n=== OCR Upload Request ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file uploaded",
      });
    }

    const filePath = req.file.path;

    // ===============================
    // LANGUAGE HANDLING
    // ===============================
    let language = req.body.language || DEFAULT_LANGUAGE;

    if (!isValidLanguage(language)) {
      console.warn(`Invalid language "${language}", using default`);
      language = DEFAULT_LANGUAGE;
    }

    const langConfig = getLanguageConfig(language);

    console.log("File path:", filePath);
    console.log("Language:", language, `(${langConfig.name})`);
    console.log("Tesseract Lang:", langConfig.ocrLang);
    console.log("OCR Script:", pythonScriptPath);
    console.log("Python executable:", pythonExecutable);

    // ===============================
    // PRE-FLIGHT CHECKS
    // ===============================
    
    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        success: false,
        error: "OCR script not found on server",
        path: pythonScriptPath,
        help: "Make sure ml/ocr/process_text.py exists"
      });
    }

    // Check if uploaded file exists
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        error: "Uploaded file not found",
        path: filePath,
      });
    }

    // ===============================
    // PYTHON PROCESS WITH UTF-8 ENCODING
    // ===============================
    const pythonArgs = [
      pythonScriptPath,
      filePath,
      langConfig.ocrLang, // Tesseract language code
    ];

    console.log("Spawning Python:", pythonExecutable, pythonArgs);

    const pythonProcess = spawn(pythonExecutable, pythonArgs, {
      env: { 
        ...process.env,
        PYTHONIOENCODING: 'utf-8'  // Force UTF-8 encoding
      }
    });

    let pythonOutput = "";
    let pythonError = "";
    let hasResponded = false;
    let timeoutHandle = null;

    const cleanupAndRespond = (status, payload) => {
      if (hasResponded) return;
      hasResponded = true;

      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill("SIGTERM");
      }

      fs.unlink(filePath, (err) => {
        if (err) console.error("File cleanup failed:", err.message);
      });

      if (!res.headersSent) {
        res.status(status).json(payload);
      }
    };

    pythonProcess.stdout.setEncoding('utf8');  // Set UTF-8 encoding
    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stdout.on("data", (data) => {
      const chunk = data.toString('utf8');
      pythonOutput += chunk;
      console.log("Python stdout:", chunk);
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString('utf8');
      pythonError += msg;
      console.error("Python stderr:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("Python spawn error:", error);
      
      let helpMessage = "Failed to start Python process. ";
      
      if (error.code === "ENOENT") {
        helpMessage += `Python executable '${pythonExecutable}' not found. `;
        helpMessage += "Please install Python and ensure it's in your PATH. ";
        helpMessage += "Visit: https://www.python.org/downloads/";
      }

      cleanupAndRespond(500, {
        success: false,
        error: helpMessage,
        details: error.message,
        code: error.code,
        pythonExecutable: pythonExecutable,
        help: {
          windows: "Install Python from python.org and add to PATH",
          linux: "Run: sudo apt-get install python3",
          mac: "Run: brew install python3"
        }
      });
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process exited with code:", code);
      console.log("Python stdout length:", pythonOutput.length);
      console.log("Python stderr length:", pythonError.length);

      if (hasResponded) return;

      if (code !== 0) {
        // Enhanced error reporting
        let errorMessage = "OCR processing failed";
        let helpMessage = "";

        // Check for specific error patterns
        if (pythonError.includes("ModuleNotFoundError") || 
            pythonError.includes("No module named")) {
          if (pythonError.includes("pytesseract")) {
            errorMessage = "Missing Python package: pytesseract";
            helpMessage = "Run: pip install pytesseract (in venv311)";
          } else if (pythonError.includes("PIL") || pythonError.includes("Pillow")) {
            errorMessage = "Missing Python package: Pillow";
            helpMessage = "Run: pip install Pillow (in venv311)";
          } else {
            errorMessage = "Missing required Python packages";
            helpMessage = "Run: pip install pytesseract Pillow (in venv311)";
          }
        } else if (pythonError.includes("TesseractNotFoundError") || 
                   pythonError.includes("tesseract is not installed")) {
          errorMessage = "Tesseract OCR not installed";
          helpMessage = "Install Tesseract: https://github.com/tesseract-ocr/tesseract";
        } else if (pythonError.includes("failed loading language")) {
          errorMessage = `Tesseract language pack '${langConfig.ocrLang}' not installed`;
          helpMessage = `Install language data for ${langConfig.name}`;
        }

        cleanupAndRespond(500, {
          success: false,
          error: errorMessage,
          details: pythonError || "Unknown Python error",
          exitCode: code,
          help: helpMessage,
          installGuide: {
            tesseract: {
              windows: "Download from: https://github.com/UB-Mannheim/tesseract/wiki",
              linux: "Run: sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-kan",
              mac: "Run: brew install tesseract tesseract-lang"
            },
            python_packages: "Activate venv311 then run: pip install pytesseract Pillow"
          }
        });
        return;
      }

      // Success case - process output
      try {
        if (!pythonOutput.trim()) {
          cleanupAndRespond(500, {
            success: false,
            error: "No output from OCR script",
            stderr: pythonError,
            help: "Check if Python script is working correctly"
          });
          return;
        }

        const result = JSON.parse(pythonOutput);
        
        // Check if Python script reported an error
        if (!result.success) {
          cleanupAndRespond(500, {
            success: false,
            error: result.error || "OCR processing failed",
            details: result.traceback || pythonError,
            help: result.error
          });
          return;
        }

        const extractedText = result.extractedText || result.text || "";

        // ===============================
        // AUTO LANGUAGE DETECTION
        // ===============================
        let detectedLanguage = language;
        if (!req.body.language && extractedText) {
          try {
            detectedLanguage = detectLanguage(extractedText);
            console.log("Auto-detected language:", detectedLanguage);
          } catch (err) {
            console.warn("Language detection failed:", err.message);
          }
        }

        cleanupAndRespond(200, {
          success: true,
          extractedText,
          language: detectedLanguage,
          script: result.script || get_script_name(detectedLanguage),
          confidence: result.confidence || 0.95,
          processingTime: result.processingTime || 0,
          wordCount: result.word_count || 0
        });

      } catch (err) {
        console.error("JSON parse error:", err.message);
        console.error("Raw Python output:", pythonOutput);
        
        cleanupAndRespond(500, {
          success: false,
          error: "Failed to parse OCR output",
          details: err.message,
          raw_output: pythonOutput.substring(0, 500), // Limit size
          help: "Python script may have printed non-JSON output. Check Python logs."
        });
      }
    });

    // ===============================
    // TIMEOUT (45s - increased for large images)
    // ===============================
    timeoutHandle = setTimeout(() => {
      console.error("OCR timeout after 45 seconds");
      cleanupAndRespond(504, {
        success: false,
        error: "OCR Timeout: Process took too long",
        help: "Try with a smaller image or simpler text"
      });
    }, 45000);
  });

  return router;
};

function get_script_name(language) {
  const scripts = {
    'en': 'Latin',
    'hi': 'Devanagari',
    'kn': 'Kannada'
  };
  return scripts[language] || 'Unknown';
}