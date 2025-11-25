// backend/routes/ocr.js

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

module.exports = (upload) => {
  // Correct path from backend/routes/ocr.js to ml/ocr/process_text.py
  const pythonScriptPath = path.join(__dirname, "..", "..", "ml", "ocr", "process_text.py");
  const pythonExecutable = "py"; // Try "python3" if this doesn't work

  router.post("/upload", upload.single("image"), (req, res) => {
    console.log("\n=== OCR Upload Request ===");

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ 
        success: false, 
        error: "No image file uploaded." 
      });
    }

    const filePath = req.file.path;
    console.log("✓ File saved:", filePath);
    console.log("✓ Script path:", pythonScriptPath);
    console.log("✓ Script exists?", fs.existsSync(pythonScriptPath));

    // Verify script exists
    if (!fs.existsSync(pythonScriptPath)) {
      console.error("❌ Python script not found!");
      fs.unlink(filePath, () => {});
      return res.status(500).json({
        success: false,
        error: "OCR script not found on server.",
        path: pythonScriptPath
      });
    }

    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, filePath]);

    let pythonOutput = "";
    let pythonError = "";
    let hasResponded = false;
    let timeoutHandle = null;

    const sendResponse = (statusCode, data) => {
      if (hasResponded) return;
      hasResponded = true;
      
      if (timeoutHandle) clearTimeout(timeoutHandle);
      if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill('SIGTERM');
      }
      
      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠  Failed to delete temp file:", err.message);
      });
      
      if (!res.headersSent) {
        res.status(statusCode).json(data);
      }
    };

    pythonProcess.stdout.on("data", (data) => {
      const chunk = data.toString();
      pythonOutput += chunk;
      console.log("Python output:", chunk);
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString();
      pythonError += msg;
      console.error("Python error:", msg);
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Failed to start Python:", error.message);
      sendResponse(500, {
        success: false,
        error: "Failed to start OCR process. Check if Python is installed.",
        details: error.message,
      });
    });

    pythonProcess.on("close", (code) => {
      console.log("Python exited with code:", code);

      if (hasResponded) return;

      if (code !== 0) {
        console.error("❌ Python failed:", pythonError);
        sendResponse(500, {
          success: false,
          error: "OCR Processing Failed.",
          details: pythonError || "Unknown error",
        });
        return;
      }

      try {
        if (!pythonOutput.trim()) {
          sendResponse(500, {
            success: false,
            error: "No output from Python script.",
          });
          return;
        }

        const result = JSON.parse(pythonOutput);
        console.log("✓ OCR Success:", result.success);
        sendResponse(200, result);
        
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e.message);
        console.error("Raw output:", pythonOutput);
        sendResponse(500, {
          success: false,
          error: "Failed to parse OCR results.",
          raw_output: pythonOutput,
        });
      }
    });

    timeoutHandle = setTimeout(() => {
      if (!hasResponded) {
        console.error("❌ Timeout after 35 seconds");
        sendResponse(504, {
          success: false,
          error: "OCR Timeout: Process took too long.",
        });
      }
    }, 35000);
  });

  return router;
};