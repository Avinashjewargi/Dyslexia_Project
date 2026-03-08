//backend/routes/ocr.js
<<<<<<< HEAD
=======
// COMPLETE FIX: Hindi & Kannada OCR with proper UTF-8 encoding
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

<<<<<<< HEAD
// Language utilities
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require("../config/languageConfig");

const { detectLanguage } = require("../utils/languageDetector");

<<<<<<< HEAD
/**
 * This router expects `upload` (multer instance)
 * to be injected from the parent file
 */
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
module.exports = (upload) => {
  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "ml",
    "ocr",
    "process_text.py"
  );

<<<<<<< HEAD
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
=======
  const getPythonExecutable = () => {
    const venvPythonWin = path.join(__dirname, "..", "..", "ml", "venv311", "Scripts", "python.exe");
    const venvPythonUnix = path.join(__dirname, "..", "..", "ml", "venv311", "bin", "python");
    
    if (fs.existsSync(venvPythonWin)) return venvPythonWin;
    if (fs.existsSync(venvPythonUnix)) return venvPythonUnix;
    
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    const platform = process.platform;
    return platform === "win32" ? "python" : "python3";
  };

  const pythonExecutable = getPythonExecutable();

<<<<<<< HEAD
  // ===============================
  // OCR IMAGE UPLOAD ENDPOINT
  // ===============================
=======
  // Map Tesseract codes back to UI codes
  const TESSERACT_TO_UI = {
    'eng': 'en',
    'hin': 'hi',
    'kan': 'kn'
  };

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
  router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("\n=== OCR Upload Request ===");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No image file uploaded",
      });
    }

    const filePath = req.file.path;
<<<<<<< HEAD

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
=======
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

>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    if (!fs.existsSync(pythonScriptPath)) {
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        success: false,
<<<<<<< HEAD
        error: "OCR script not found on server",
        path: pythonScriptPath,
=======
        error: "OCR script not found",
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        help: "Make sure ml/ocr/process_text.py exists"
      });
    }

<<<<<<< HEAD
    // Check if uploaded file exists
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({
        success: false,
        error: "Uploaded file not found",
<<<<<<< HEAD
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
=======
      });
    }

    const pythonArgs = [pythonScriptPath, filePath, tesseractLang];

    console.log("🐍 Spawning:", pythonExecutable, pythonArgs);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

    const pythonProcess = spawn(pythonExecutable, pythonArgs, {
      env: { 
        ...process.env,
<<<<<<< HEAD
        PYTHONIOENCODING: 'utf-8'  // Force UTF-8 encoding
=======
        PYTHONIOENCODING: 'utf-8',
        LANG: 'en_US.UTF-8',
        LC_ALL: 'en_US.UTF-8'
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
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

<<<<<<< HEAD
    pythonProcess.stdout.setEncoding('utf8');  // Set UTF-8 encoding
    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stdout.on("data", (data) => {
      const chunk = data.toString('utf8');
      pythonOutput += chunk;
      console.log("Python stdout:", chunk);
=======
    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stderr.setEncoding('utf8');

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString('utf8');
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString('utf8');
      pythonError += msg;
<<<<<<< HEAD
      console.error("Python stderr:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("Python spawn error:", error);
      
      let helpMessage = "Failed to start Python process. ";
      
      if (error.code === "ENOENT") {
        helpMessage += `Python executable '${pythonExecutable}' not found. `;
        helpMessage += "Please install Python and ensure it's in your PATH. ";
        helpMessage += "Visit: https://www.python.org/downloads/";
=======
      console.error("🐍 Python stderr:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Python spawn error:", error);
      
      let helpMessage = "Failed to start Python. ";
      if (error.code === "ENOENT") {
        helpMessage += "Python not found in PATH. Install Python from python.org";
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      }

      cleanupAndRespond(500, {
        success: false,
        error: helpMessage,
        details: error.message,
<<<<<<< HEAD
        code: error.code,
        pythonExecutable: pythonExecutable,
        help: {
          windows: "Install Python from python.org and add to PATH",
          linux: "Run: sudo apt-get install python3",
          mac: "Run: brew install python3"
        }
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      });
    });

    pythonProcess.on("close", (code) => {
<<<<<<< HEAD
      console.log("Python process exited with code:", code);
      console.log("Python stdout length:", pythonOutput.length);
      console.log("Python stderr length:", pythonError.length);
=======
      console.log("🐍 Python exit code:", code);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

      if (hasResponded) return;

      if (code !== 0) {
<<<<<<< HEAD
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
=======
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
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        }

        cleanupAndRespond(500, {
          success: false,
          error: errorMessage,
<<<<<<< HEAD
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
=======
          details: pythonError,
          help: helpMessage,
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        });
        return;
      }

<<<<<<< HEAD
      // Success case - process output
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
      try {
        if (!pythonOutput.trim()) {
          cleanupAndRespond(500, {
            success: false,
<<<<<<< HEAD
            error: "No output from OCR script",
            stderr: pythonError,
            help: "Check if Python script is working correctly"
=======
            error: "No output from OCR",
            details: pythonError,
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
          });
          return;
        }

<<<<<<< HEAD
        const result = JSON.parse(pythonOutput);
        
        // Check if Python script reported an error
        if (!result.success) {
          cleanupAndRespond(500, {
            success: false,
            error: result.error || "OCR processing failed",
            details: result.traceback || pythonError,
            help: result.error
=======
        const result = JSON.parse(pythonOutput.trim());
        
        if (!result.success) {
          cleanupAndRespond(500, {
            success: false,
            error: result.error || "OCR failed",
            details: result.details || pythonError,
            help: result.help || ""
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
          });
          return;
        }

        const extractedText = result.extractedText || result.text || "";

<<<<<<< HEAD
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
=======
        console.log("✅ OCR Success:");
        console.log("📝 Text length:", extractedText.length);
        console.log("🔤 Script:", result.script);
        console.log("📄 Preview:", extractedText.substring(0, 100));
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682

        cleanupAndRespond(200, {
          success: true,
          extractedText,
<<<<<<< HEAD
          language: detectedLanguage,
          script: result.script || get_script_name(detectedLanguage),
          confidence: result.confidence || 0.95,
          processingTime: result.processingTime || 0,
          wordCount: result.word_count || 0
        });

      } catch (err) {
        console.error("JSON parse error:", err.message);
        console.error("Raw Python output:", pythonOutput);
=======
          language: uiLang, // Return UI language code (en/hi/kn)
          script: result.script,
          confidence: result.confidence || 0.95,
          processingTime: result.processingTime || 0,
          wordCount: extractedText.split(/\s+/).filter(Boolean).length
        });

      } catch (err) {
        console.error("❌ JSON parse error:", err.message);
        console.error("Raw output:", pythonOutput);
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        
        cleanupAndRespond(500, {
          success: false,
          error: "Failed to parse OCR output",
          details: err.message,
<<<<<<< HEAD
          raw_output: pythonOutput.substring(0, 500), // Limit size
          help: "Python script may have printed non-JSON output. Check Python logs."
=======
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
        });
      }
    });

<<<<<<< HEAD
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
=======
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
>>>>>>> e7926c957313db43ed13e15305fef5ca7b817682
