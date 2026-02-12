//backend/routes/ocr.js
// COMPLETE FIX: Hindi & Kannada OCR with proper UTF-8 encoding

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require("../config/languageConfig");

const { detectLanguage } = require("../utils/languageDetector");

module.exports = (upload) => {
  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "ml",
    "ocr",
    "process_text.py"
  );

  const getPythonExecutable = () => {
    const venvPythonWin = path.join(__dirname, "..", "..", "ml", "venv311", "Scripts", "python.exe");
    const venvPythonUnix = path.join(__dirname, "..", "..", "ml", "venv311", "bin", "python");
    
    if (fs.existsSync(venvPythonWin)) return venvPythonWin;
    if (fs.existsSync(venvPythonUnix)) return venvPythonUnix;
    
    const platform = process.platform;
    return platform === "win32" ? "python" : "python3";
  };

  const pythonExecutable = getPythonExecutable();

  // Map Tesseract codes back to UI codes
  const TESSERACT_TO_UI = {
    'eng': 'en',
    'hin': 'hi',
    'kan': 'kn'
  };

  router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("\n=== OCR Upload Request ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file uploaded",
      });
    }

    const filePath = req.file.path;
    let language = req.body.language || DEFAULT_LANGUAGE;

    // Accept both UI codes (en/hi/kn) and Tesseract codes (eng/hin/kan)
    const languageMap = {
      'en': 'eng',
      'hi': 'hin', 
      'kn': 'kan',
      'eng': 'eng',
      'hin': 'hin',
      'kan': 'kan'
    };

    const tesseractLang = languageMap[language] || 'eng';
    const uiLang = TESSERACT_TO_UI[tesseractLang] || language;

    console.log("📝 Language received:", language);
    console.log("🔤 Tesseract code:", tesseractLang);
    console.log("🌐 UI code:", uiLang);
    console.log("📁 File:", filePath);

    if (!fs.existsSync(pythonScriptPath)) {
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        success: false,
        error: "OCR script not found",
        help: "Make sure ml/ocr/process_text.py exists"
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        error: "Uploaded file not found",
      });
    }

    const pythonArgs = [pythonScriptPath, filePath, tesseractLang];

    console.log("🐍 Spawning:", pythonExecutable, pythonArgs);

    const pythonProcess = spawn(pythonExecutable, pythonArgs, {
      env: { 
        ...process.env,
        PYTHONIOENCODING: 'utf-8',
        LANG: 'en_US.UTF-8',
        LC_ALL: 'en_US.UTF-8'
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

    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString('utf8');
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString('utf8');
      pythonError += msg;
      console.error("🐍 Python stderr:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Python spawn error:", error);
      
      let helpMessage = "Failed to start Python. ";
      if (error.code === "ENOENT") {
        helpMessage += "Python not found in PATH. Install Python from python.org";
      }

      cleanupAndRespond(500, {
        success: false,
        error: helpMessage,
        details: error.message,
      });
    });

    pythonProcess.on("close", (code) => {
      console.log("🐍 Python exit code:", code);

      if (hasResponded) return;

      if (code !== 0) {
        console.error("❌ Python error output:", pythonError);
        
        let errorMessage = "OCR processing failed";
        let helpMessage = "";

        if (pythonError.includes("pytesseract")) {
          errorMessage = "pytesseract not installed";
          helpMessage = "Run: pip install pytesseract --break-system-packages";
        } else if (pythonError.includes("PIL") || pythonError.includes("Pillow")) {
          errorMessage = "Pillow not installed";
          helpMessage = "Run: pip install Pillow --break-system-packages";
        } else if (pythonError.includes("TesseractNotFound")) {
          errorMessage = "Tesseract OCR not installed";
          helpMessage = "Install Tesseract: https://github.com/tesseract-ocr/tesseract/wiki";
        } else if (pythonError.includes(`failed loading language '${tesseractLang}'`)) {
          errorMessage = `Language '${tesseractLang}' not installed`;
          helpMessage = `Install Tesseract language pack for ${tesseractLang}`;
        }

        cleanupAndRespond(500, {
          success: false,
          error: errorMessage,
          details: pythonError,
          help: helpMessage,
        });
        return;
      }

      try {
        if (!pythonOutput.trim()) {
          cleanupAndRespond(500, {
            success: false,
            error: "No output from OCR",
            details: pythonError,
          });
          return;
        }

        const result = JSON.parse(pythonOutput.trim());
        
        if (!result.success) {
          cleanupAndRespond(500, {
            success: false,
            error: result.error || "OCR failed",
            details: result.details || pythonError,
            help: result.help || ""
          });
          return;
        }

        const extractedText = result.extractedText || result.text || "";

        console.log("✅ OCR Success:");
        console.log("📝 Text length:", extractedText.length);
        console.log("🔤 Script:", result.script);
        console.log("📄 Preview:", extractedText.substring(0, 100));

        cleanupAndRespond(200, {
          success: true,
          extractedText,
          language: uiLang, // Return UI language code (en/hi/kn)
          script: result.script,
          confidence: result.confidence || 0.95,
          processingTime: result.processingTime || 0,
          wordCount: extractedText.split(/\s+/).filter(Boolean).length
        });

      } catch (err) {
        console.error("❌ JSON parse error:", err.message);
        console.error("Raw output:", pythonOutput);
        
        cleanupAndRespond(500, {
          success: false,
          error: "Failed to parse OCR output",
          details: err.message,
        });
      }
    });

    timeoutHandle = setTimeout(() => {
      console.error("❌ OCR timeout");
      cleanupAndRespond(504, {
        success: false,
        error: "OCR timeout - process took too long",
      });
    }, 60000);
  });

  return router;
};