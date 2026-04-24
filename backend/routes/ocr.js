// backend/routes/ocr.js
// Hindi & Kannada OCR - FIXED VERSION
//
// BUGS FIXED:
// 1. Language validation was too strict — "hin"/"kan" sent from frontend
//    would pass the isValidLanguage() check but then get double-mapped,
//    sometimes resulting in an invalid tesseract code like "eng" as fallback.
// 2. Missing language pack error was only caught if stderr contained the exact
//    string `failed loading language '${tesseractLang}'` — but Tesseract 4/5
//    outputs a slightly different message. Added broader detection.
// 3. The Python process stdout encoding was set correctly but the JSON.parse
//    was done on .trim() of raw stdout which could include BOM or debug prints
//    from the Python script before the JSON line. Fixed with last-JSON-line extraction.
// 4. No pre-flight check for whether the Tesseract language pack is installed.
//    Added a check BEFORE spawning Python so the error is immediate and clear.
// 5. Timeout was 45s with no streaming progress — added stderr live-logging.

const express = require("express");
const router = express.Router();
const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const OCRUpload = require("../models/OCRUpload");

const {
  getLanguageConfig,
  isValidLanguage,
  DEFAULT_LANGUAGE,
} = require("../config/languageConfig");

const { detectLanguage } = require("../utils/languageDetector");

// ── Language code mappings ────────────────────────────────────────────────────

// Accepts BOTH short UI codes (en/hi/kn) and Tesseract codes (eng/hin/kan)
// Returns the Tesseract 3-letter code
const TO_TESSERACT = {
  en:  "eng", eng: "eng",
  hi:  "hin", hin: "hin",
  kn:  "kan", kan: "kan",
  ta:  "tam", tam: "tam",
  te:  "tel", tel: "tel",
  mr:  "mar", mar: "mar",
  bn:  "ben", ben: "ben",
};

// Maps Tesseract codes back to UI codes
const TO_UI = {
  eng: "en",
  hin: "hi",
  kan: "kn",
  tam: "ta",
  tel: "te",
  mar: "mr",
  ben: "bn",
};

function getScriptName(language) {
  const scripts = { en: "Latin", hi: "Devanagari", kn: "Kannada", ta: "Tamil", te: "Telugu" };
  return scripts[language] || "Unknown";
}

// ── FIX 4: Pre-flight — check if Tesseract language pack is installed ─────────
// Cached so we only run `tesseract --list-langs` once per server start
let _installedLangs = null;

function getInstalledTesseractLangs() {
  if (_installedLangs) return _installedLangs;
  try {
    // Tesseract prints to stderr on some versions, stdout on others
    const output = (() => {
      try { return execSync("tesseract --list-langs 2>&1", { timeout: 8000 }).toString(); }
      catch (e) { return e.stdout?.toString() || e.stderr?.toString() || ""; }
    })();
    _installedLangs = new Set(
      output
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("List") && !l.startsWith("Error") && !l.includes(" "))
    );
    console.log("✅ Installed Tesseract langs:", [..._installedLangs].join(", "));
  } catch (e) {
    console.warn("⚠️ Could not list Tesseract languages:", e.message);
    _installedLangs = new Set(["eng"]);
  }
  return _installedLangs;
}

function isTesseractLangInstalled(tessCode) {
  return getInstalledTesseractLangs().has(tessCode);
}

const LANG_INSTALL_COMMANDS = {
  hin: "sudo apt-get install tesseract-ocr-hin",
  kan: "sudo apt-get install tesseract-ocr-kan",
  tam: "sudo apt-get install tesseract-ocr-tam",
  tel: "sudo apt-get install tesseract-ocr-tel",
  mar: "sudo apt-get install tesseract-ocr-mar",
  ben: "sudo apt-get install tesseract-ocr-ben",
};

// ── FIX 3: Safely extract the last valid JSON line from Python stdout ─────────
// Python scripts sometimes print debug lines before the JSON payload.
function extractJsonFromOutput(output) {
  const lines = output.split("\n").map(l => l.trim()).filter(Boolean);
  // Walk backwards — the JSON payload is always the last line
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].startsWith("{") || lines[i].startsWith("[")) {
      return lines[i];
    }
  }
  return null;
}

// ── Python executable resolution ──────────────────────────────────────────────
const getPythonExecutable = () => {
  const envPython = process.env.ML_PYTHON;
  if (envPython && fs.existsSync(envPython)) {
    console.log("✅ Using Python from ML_PYTHON env:", envPython);
    return envPython;
  }

  const candidates = [
    path.join(__dirname, "..", "..", "ml", "venv", "Scripts", "python.exe"),
    path.join(__dirname, "..", "..", "ml", "venv", "bin", "python"),
    path.join(__dirname, "..", "..", "ml", "venv311", "Scripts", "python.exe"),
    path.join(__dirname, "..", "..", "ml", "venv311", "bin", "python"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log("✅ Using venv Python:", p);
      return p;
    }
  }

  console.warn("⚠️ No venv found — using system Python");
  return process.platform === "win32" ? "python" : "python3";
};

// ── Router factory ────────────────────────────────────────────────────────────
module.exports = (upload) => {
  const pythonScriptPath = path.join(__dirname, "..", "..", "ml", "ocr", "process_text.py");
  const pythonExecutable = getPythonExecutable();

  router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("\n=== OCR Upload Request ===");

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file uploaded" });
    }

    const filePath = req.file.path;

    // ── FIX 1: Unified language resolution ────────────────────────────────
    // Accept any code the frontend sends (en, hi, kn, eng, hin, kan …)
    const rawLang     = (req.body.language || DEFAULT_LANGUAGE).trim().toLowerCase();
    const tessLang    = TO_TESSERACT[rawLang] || "eng";
    const uiLang      = TO_UI[tessLang] || "en";
    const langConfig  = getLanguageConfig(uiLang);

    console.log(`📝 Language received: "${rawLang}" → tesseract: "${tessLang}" → ui: "${uiLang}" (${langConfig?.name})`);
    console.log("📁 File:", filePath);
    console.log("🐍 Python:", pythonExecutable);

    const cleanup = () => fs.unlink(filePath, (err) => {
      if (err) console.warn("File cleanup failed:", err.message);
    });

    // ── FIX 4: Check language pack BEFORE spawning Python ─────────────────
    if (!isTesseractLangInstalled(tessLang)) {
      cleanup();
      const installCmd = LANG_INSTALL_COMMANDS[tessLang] || `sudo apt-get install tesseract-ocr-${tessLang}`;
      return res.status(422).json({
        success: false,
        error: `Tesseract language pack "${tessLang}" is not installed on this server.`,
        help: `Install it by running: ${installCmd}`,
        details: `Or download ${tessLang}.traineddata from https://github.com/tesseract-ocr/tessdata and place it in your Tesseract tessdata directory.`,
        installedLanguages: [...getInstalledTesseractLangs()].sort(),
      });
    }

    // ── Pre-flight: check Python script exists ─────────────────────────────
    if (!fs.existsSync(pythonScriptPath)) {
      cleanup();
      return res.status(500).json({
        success: false,
        error: "OCR script not found on server",
        path: pythonScriptPath,
        help: "Make sure ml/ocr/process_text.py exists",
      });
    }

    // ── Spawn Python ───────────────────────────────────────────────────────
    const pythonProcess = spawn(
      pythonExecutable,
      [pythonScriptPath, filePath, tessLang],
      {
        env: {
          ...process.env,
          PYTHONIOENCODING: "utf-8",
          PYTHONUTF8: "1",           // Python 3.7+ — forces UTF-8 mode
          LANG: "en_US.UTF-8",
          LC_ALL: "en_US.UTF-8",
        },
      }
    );

    let stdout = "";
    let stderr = "";
    let hasResponded = false;
    let timeoutHandle = null;

    const sendResponse = (status, payload) => {
      if (hasResponded) return;
      hasResponded = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (!pythonProcess.killed) pythonProcess.kill("SIGTERM");
      cleanup();
      if (!res.headersSent) res.status(status).json(payload);
    };

    pythonProcess.stdout.setEncoding("utf8");
    pythonProcess.stderr.setEncoding("utf8");

    pythonProcess.stdout.on("data", (chunk) => { stdout += chunk; });

    pythonProcess.stderr.on("data", (msg) => {
      stderr += msg;
      // Live-log Python stderr so it appears in Node console in real time
      process.stderr.write(`[Python] ${msg}`);
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Python spawn error:", error);
      sendResponse(500, {
        success: false,
        error: error.code === "ENOENT"
          ? `Python executable "${pythonExecutable}" not found. Install Python or set ML_PYTHON env var.`
          : `Failed to start Python: ${error.message}`,
        details: error.message,
      });
    });

    pythonProcess.on("close", (code) => {
      if (hasResponded) return;

      console.log(`🐍 Python exited with code ${code}`);

      // ── FIX 2: Broader Tesseract error detection ───────────────────────
      if (code !== 0) {
        let errorMessage = "OCR processing failed";
        let helpMessage  = "";

        const errLower = stderr.toLowerCase();

        if (errLower.includes("no module named") || errLower.includes("modulenotfounderror")) {
          if (errLower.includes("pytesseract")) {
            errorMessage = "Missing Python package: pytesseract";
            helpMessage  = "Run in your venv: pip install pytesseract";
          } else if (errLower.includes("pil") || errLower.includes("pillow")) {
            errorMessage = "Missing Python package: Pillow";
            helpMessage  = "Run in your venv: pip install Pillow";
          } else {
            errorMessage = "Missing required Python packages";
            helpMessage  = "Run in your venv: pip install pytesseract Pillow";
          }
        } else if (errLower.includes("tesseractnotfounderror") || errLower.includes("tesseract is not installed")) {
          errorMessage = "Tesseract OCR engine is not installed on this server";
          helpMessage  = "Linux: sudo apt-get install tesseract-ocr | Windows: https://github.com/UB-Mannheim/tesseract/wiki";
        } else if (
          // FIX 2: Tesseract 4/5 uses slightly different messages
          errLower.includes(`failed loading language '${tessLang}'`) ||
          errLower.includes(`error, could not initialize tesseract`) ||
          errLower.includes(`failed to load any language`) ||
          errLower.includes(`please make sure the tesseract`) ||
          errLower.includes(`traineddata`)
        ) {
          const installCmd = LANG_INSTALL_COMMANDS[tessLang] || `sudo apt-get install tesseract-ocr-${tessLang}`;
          errorMessage = `Tesseract language pack "${tessLang}" is not installed`;
          helpMessage  = `Run: ${installCmd}`;
          // Invalidate cache so the next request re-checks
          _installedLangs = null;
        }

        return sendResponse(500, {
          success: false,
          error: errorMessage,
          details: stderr || "No stderr output",
          exitCode: code,
          help: helpMessage,
        });
      }

      // ── FIX 3: Extract JSON safely from Python output ──────────────────
      if (!stdout.trim()) {
        return sendResponse(500, {
          success: false,
          error: "No output from OCR script",
          stderr,
          help: "Check that process_text.py prints a JSON object to stdout",
        });
      }

      const jsonLine = extractJsonFromOutput(stdout);
      if (!jsonLine) {
        return sendResponse(500, {
          success: false,
          error: "OCR script output is not valid JSON",
          rawOutput: stdout.substring(0, 500),
          help: "Ensure process_text.py prints ONLY a JSON object on the last line of stdout",
        });
      }

      let result;
      try {
        result = JSON.parse(jsonLine);
      } catch (err) {
        return sendResponse(500, {
          success: false,
          error: "Failed to parse OCR JSON output",
          details: err.message,
          rawOutput: jsonLine.substring(0, 500),
        });
      }

      if (!result.success) {
        return sendResponse(500, {
          success: false,
          error: result.error || "OCR processing failed",
          details: result.traceback || result.details || stderr,
          help: result.help || "",
        });
      }

      const extractedText = (result.extractedText || result.text || "").trim();

      if (!extractedText) {
        return sendResponse(200, {
          success: false,
          error: "OCR found no text in the image",
          help: "Try a clearer image with higher contrast. Make sure the correct language is selected.",
        });
      }

      console.log(`✅ OCR success — ${extractedText.length} chars, lang: ${uiLang}`);
      console.log("📄 Preview:", extractedText.substring(0, 120));

      // ── Auto language detection ──────────────────────────────────────────
      let detectedLanguage = uiLang;
      if (!req.body.language && extractedText) {
        try {
          detectedLanguage = detectLanguage(extractedText);
          console.log("Auto-detected language:", detectedLanguage);
        } catch (e) {
          console.warn("Language detection failed:", e.message);
        }
      }

      // ── Save to DB ───────────────────────────────────────────────────────
      (async () => {
        try {
          const ocrDoc = new OCRUpload({
            userId:         req.body.userId || null,
            imageUrl:       req.body.imageUrl || null,
            imagePath:      filePath,
            extractedText,
            language:       detectedLanguage || "en",
            script:         result.script || getScriptName(detectedLanguage),
            confidence:     typeof result.confidence === "number" ? result.confidence : 0,
            wordCount:      result.word_count || extractedText.split(/\s+/).filter(Boolean).length,
            processingTime: result.processingTime || 0,
            metadata: {
              originalFilename: req.file.originalname,
              fileSize:         req.file.size,
              mimeType:         req.file.mimetype,
            },
          });
          await ocrDoc.save();
          console.log("✅ OCR saved to database");
        } catch (saveErr) {
          console.warn("⚠️ DB save failed:", saveErr.message);
        }
      })();

      sendResponse(200, {
        success:        true,
        extractedText,
        language:       detectedLanguage,
        script:         result.script || getScriptName(detectedLanguage),
        confidence:     result.confidence || 0.95,
        processingTime: result.processingTime || 0,
        wordCount:      result.word_count || extractedText.split(/\s+/).filter(Boolean).length,
      });
    });

    // ── Timeout ──────────────────────────────────────────────────────────────
    timeoutHandle = setTimeout(() => {
      console.error("❌ OCR timeout after 45s");
      sendResponse(504, {
        success: false,
        error: "OCR Timeout: Process took too long",
        help: "Try with a smaller or simpler image",
      });
    }, 45000);
  });

  // ── Stats endpoint ────────────────────────────────────────────────────────
  router.get("/stats", async (req, res) => {
    try {
      const total  = await OCRUpload.countDocuments();
      const latest = await OCRUpload.find().sort({ createdAt: -1 }).limit(5);
      res.json({ success: true, total, latest });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ── Debug: list installed Tesseract languages ─────────────────────────────
  router.get("/langs", (req, res) => {
    res.json({
      success: true,
      installedLanguages: [...getInstalledTesseractLangs()].sort(),
      pythonExecutable,
    });
  });

  return router;
};