// backend/routes/ocr.js

const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// upload is the multer instance passed from server.js
module.exports = (upload) => {
  const pythonScriptPath = path.join(
    __dirname,
    "..",
    "..",
    "ml",
    "ocr",
    "process_text.py"
  );
  const pythonExecutable = "python"; // or 'py' on some Windows setups

  router.post("/upload", upload.single("image"), (req, res) => {
    console.log("\n--- /api/ocr/upload called ---");

    if (!req.file) {
      console.error("Error: No file uploaded.");
      return res.status(400).json({ success: false, error: "No image file uploaded." });
    }

    const filePath = req.file.path;
    console.log("Image saved at:", filePath);
    console.log("Using Python script:", pythonScriptPath);

    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, filePath]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString();
      pythonError += msg;
      console.error("Python STDERR:", msg);
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process exited with code:", code);

      // Delete temp upload
      fs.unlink(filePath, (err) => {
        if (err) console.error("Warning: Failed to delete temp file:", err.message);
      });

      if (code !== 0) {
        console.error("Python exited with non-zero code. Error:", pythonError);
        return res.status(500).json({
          success: false,
          error: "OCR Processing Failed on Server.",
          details: pythonError || "Unknown Python error.",
        });
      }

      try {
        const result = JSON.parse(pythonOutput);
        // Ensure JSON always has success flag
        if (typeof result.success === "undefined") {
          result.success = true;
        }
        console.log("Sending OCR result back to client.");
        return res.json(result);
      } catch (e) {
        console.error("Failed to parse Python JSON output:", e.message);
        console.error("Raw output was:", pythonOutput);
        return res.status(500).json({
          success: false,
          error: "Failed to parse OCR results from Python.",
          raw_output: pythonOutput,
        });
      }
    });

    // Safety timeout
    setTimeout(() => {
      if (!pythonProcess.killed) {
        console.error("Timeout: Python script took too long. Killing process.");
        pythonProcess.kill("SIGKILL");
        if (!res.headersSent) {
          return res.status(504).json({
            success: false,
            error: "OCR Timeout: Python script took too long (>30s).",
          });
        }
      }
    }, 30000);
  });

  return router;
};
