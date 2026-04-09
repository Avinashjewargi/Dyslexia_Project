// backend/routes/ocr.js
// Hindi & Kannada OCR with proper UTF-8 encoding

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const OCRUpload = require("../models/OCRUpload");

// Language utilities
const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require("../config/languageConfig");

const { detectLanguage } = require("../utils/languageDetector");

// Map Tesseract codes back to UI codes
const TESSERACT_TO_UI = {
  eng: "en",
  hin: "hi",
  kan: "kn",
};

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
      __dirname, "..", "..", "ml", "venv", "Scripts", "python.exe"
    );
    // 3) Try current venv folder: ml/venv (Linux/Mac)
    const venvPythonUnix = path.join(
      __dirname, "..", "..", "ml", "venv", "bin", "python"
    );
    // 4) Backward-compat: older venv name ml/venv311 (Windows)
    const venv311PythonWin = path.join(
      __dirname, "..", "..", "ml", "venv311", "Scripts", "python.exe"
    );
    // 5) Backward-compat: older venv name ml/venv311 (Linux/Mac)
    const venv311PythonUnix = path.join(
      __dirname, "..", "..", "ml", "venv311", "bin", "python"
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
    return process.platform === "win32" ? "python" : "python3";
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

    // Accept both UI codes (en/hi/kn) and Tesseract codes (eng/hin/kan)
    const languageMap = {
      en: "eng",
      hi: "hin",
      kn: "kan",
      eng: "eng",
      hin: "hin",
      kan: "kan",
    };

    const langConfig = getLanguageConfig(language);
    const tesseractLang = languageMap[language] || langConfig.ocrLang || "eng";
    const uiLang = TESSERACT_TO_UI[tesseractLang] || language;

    console.log("📝 Language received:", language, `(${langConfig.name})`);
    console.log("🔤 Tesseract code:", tesseractLang);
    console.log("🌐 UI code:", uiLang);
    console.log("📁 File:", filePath);
    console.log("🐍 Python executable:", pythonExecutable);

    // ===============================
    // PRE-FLIGHT CHECKS
    // ===============================
    if (!fs.existsSync(pythonScriptPath)) {
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        success: false,
        error: "OCR script not found on server",
        path: pythonScriptPath,
        help: "Make sure ml/ocr/process_text.py exists",
      });
    }

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
    const pythonArgs = [pythonScriptPath, filePath, tesseractLang];

    console.log("🐍 Spawning:", pythonExecutable, pythonArgs);

    const pythonProcess = spawn(pythonExecutable, pythonArgs, {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        LANG: "en_US.UTF-8",
        LC_ALL: "en_US.UTF-8",
      },
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

    pythonProcess.stdout.setEncoding("utf8");
    pythonProcess.stderr.setEncoding("utf8");

    pythonProcess.stdout.on("data", (data) => {
      const chunk = data.toString("utf8");
      pythonOutput += chunk;
      console.log("Python stdout:", chunk);
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString("utf8");
      pythonError += msg;
      console.error("🐍 Python stderr:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Python spawn error:", error);

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
        pythonExecutable,
        help: {
          windows: "Install Python from python.org and add to PATH",
          linux: "Run: sudo apt-get install python3",
          mac: "Run: brew install python3",
        },
      });
    });

    pythonProcess.on("close", (code) => {
      console.log("🐍 Python exit code:", code);
      console.log("Python stdout length:", pythonOutput.length);
      console.log("Python stderr length:", pythonError.length);

      if (hasResponded) return;

      if (code !== 0) {
        let errorMessage = "OCR processing failed";
        let helpMessage = "";

        if (
          pythonError.includes("ModuleNotFoundError") ||
          pythonError.includes("No module named")
        ) {
          if (pythonError.includes("pytesseract")) {
            errorMessage = "Missing Python package: pytesseract";
            helpMessage = "Run: pip install pytesseract (in your venv)";
          } else if (
            pythonError.includes("PIL") ||
            pythonError.includes("Pillow")
          ) {
            errorMessage = "Missing Python package: Pillow";
            helpMessage = "Run: pip install Pillow (in your venv)";
          } else {
            errorMessage = "Missing required Python packages";
            helpMessage = "Run: pip install pytesseract Pillow (in your venv)";
          }
        } else if (
          pythonError.includes("TesseractNotFoundError") ||
          pythonError.includes("tesseract is not installed")
        ) {
          errorMessage = "Tesseract OCR not installed";
          helpMessage =
            "Install Tesseract: https://github.com/tesseract-ocr/tesseract";
        } else if (
          pythonError.includes(`failed loading language '${tesseractLang}'`)
        ) {
          errorMessage = `Tesseract language pack '${tesseractLang}' not installed`;
          helpMessage = `Install Tesseract language data for ${langConfig.name}`;
        }

        cleanupAndRespond(500, {
          success: false,
          error: errorMessage,
          details: pythonError || "Unknown Python error",
          exitCode: code,
          help: helpMessage,
          installGuide: {
            tesseract: {
              windows:
                "Download from: https://github.com/UB-Mannheim/tesseract/wiki",
              linux:
                "Run: sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin tesseract-ocr-kan",
              mac: "Run: brew install tesseract tesseract-lang",
            },
            python_packages:
              "Activate your venv then run: pip install pytesseract Pillow",
          },
        });
        return;
      }

      // Success — process output
      try {
        if (!pythonOutput.trim()) {
          cleanupAndRespond(500, {
            success: false,
            error: "No output from OCR script",
            stderr: pythonError,
            help: "Check if Python script is working correctly",
          });
          return;
        }

        const result = JSON.parse(pythonOutput.trim());

        if (!result.success) {
          cleanupAndRespond(500, {
            success: false,
            error: result.error || "OCR processing failed",
            details: result.traceback || result.details || pythonError,
            help: result.help || result.error,
          });
          return;
        }

        const extractedText = result.extractedText || result.text || "";

        console.log("✅ OCR Success:");
        console.log("📝 Text length:", extractedText.length);
        console.log("🔤 Script:", result.script);
        console.log("📄 Preview:", extractedText.substring(0, 100));

        // ===============================
        // AUTO LANGUAGE DETECTION
        // ===============================
        let detectedLanguage = uiLang;
        if (!req.body.language && extractedText) {
          try {
            detectedLanguage = detectLanguage(extractedText);
            console.log("Auto-detected language:", detectedLanguage);
          } catch (err) {
            console.warn("Language detection failed:", err.message);
          }
        }

        // ===============================
        // SAVE OCR UPLOAD TO DATABASE
        // ===============================
        (async () => {
          try {
            const ocrDoc = new OCRUpload({
              userId: req.body.userId || null,
              imageUrl: req.body.imageUrl || null,
              imagePath: filePath,
              extractedText,
              language: detectedLanguage || "en",
              script: result.script || getScriptName(detectedLanguage),
              confidence: typeof result.confidence === "number" ? result.confidence : 0,
              wordCount:
                result.word_count ||
                extractedText.split(/\s+/).filter(Boolean).length,
              processingTime: result.processingTime || 0,
              metadata: {
                originalFilename: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
              },
            });
            await ocrDoc.save();
            console.log("✅ OCR saved to database (OCRUpload)");
          } catch (saveErr) {
            console.warn("⚠️ Could not save OCR upload to DB:", saveErr.message);
          }
        })();

        cleanupAndRespond(200, {
          success: true,
          extractedText,
          language: detectedLanguage,
          script: result.script || getScriptName(detectedLanguage),
          confidence: result.confidence || 0.95,
          processingTime: result.processingTime || 0,
          wordCount:
            result.word_count ||
            extractedText.split(/\s+/).filter(Boolean).length,
        });
      } catch (err) {
        console.error("❌ JSON parse error:", err.message);
        console.error("Raw Python output:", pythonOutput);

        cleanupAndRespond(500, {
          success: false,
          error: "Failed to parse OCR output",
          details: err.message,
          raw_output: pythonOutput.substring(0, 500),
          help: "Python script may have printed non-JSON output. Check Python logs.",
        });
      }
    });

    // ===============================
    // TIMEOUT (45s)
    // ===============================
    timeoutHandle = setTimeout(() => {
      console.error("❌ OCR timeout after 45 seconds");
      cleanupAndRespond(504, {
        success: false,
        error: "OCR Timeout: Process took too long",
        help: "Try with a smaller image or simpler text",
      });
    }, 45000);
  });

  router.get('/stats', async (req, res) => {
    try {
      const total = await OCRUpload.countDocuments();
      const latest = await OCRUpload.find().sort({ createdAt: -1 }).limit(5);
      res.json({ success: true, total, latest });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};

function getScriptName(language) {
  const scripts = {
    en: "Latin",
    hi: "Devanagari",
    kn: "Kannada",
  };
  return scripts[language] || "Unknown";
}