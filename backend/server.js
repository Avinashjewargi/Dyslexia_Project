// backend/server.js

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const port = process.env.PORT || 5000;

// =======================================
// MONGODB DATABASE CONNECTION
// =======================================
const connectDB = require("./config/database");
connectDB();

// =======================================
// GLOBAL MIDDLEWARE
// =======================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================================
// 🌍 LANGUAGE MIDDLEWARE (NEW)
// =======================================
const languageMiddleware = require("./middleware/languageMiddleware");
app.use(languageMiddleware);

// =======================================
// ML ANALYSIS PROXY (EXISTING)
// =======================================
app.post("/api/ml/analyze", async (req, res) => {
  try {
    const { text, source, saveToFile } = req.body;

    const response = await axios.post(
      "http://localhost:5050/api/v1/analyze-content",
      { text }
    );

    if (saveToFile && text) {
      const uploadsDir = path.join(__dirname, "uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const sourceLabel = (source || "text").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${sourceLabel}_${timestamp}.txt`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, text, "utf8");
      console.log(`✅ Text saved to: ${filepath}`);

      response.data.savedFile = filename;
      response.data.savedPath = filepath;
    }

    res.json(response.data);
  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({
      success: false,
      error:
        "Failed to connect to ML service. Make sure Python service is running on port 5050.",
    });
  }
});

// =======================================
// FILE UPLOAD SETUP (MULTER)
// =======================================
const uploadDir = path.join(__dirname, "audio_temp");
const uploadsPath = path.join(uploadDir, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const upload = multer({ dest: uploadsPath });

// =======================================
// STATIC FILE SERVING
// =======================================
app.use("/audio", express.static(uploadDir));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================================
// ROUTES
// =======================================

// Core API routes (if any)
const apiRoutes = require("./routes/api.js")();

// OCR / Speech / NLP / Reading
const ocrRoutes = require("./routes/ocr.js")(upload);
const speechRoutes = require("./routes/speech.js")(upload);
const nlpRoutes = require("./routes/nlp.js");
const readingRoutes = require("./routes/reading.js");

// Chatbot / AI Assistant
const chatRoutes = require("./routes/chat.js");

// ✅ NEW: Translation routes
const translateRoutes = require("./routes/translate.js");

// ✅ NEW: Authentication routes
const authRoutes = require("./routes/auth.js");

// ✅ NEW: Storage routes (MongoDB)
const storageRoutes = require("./routes/storage.js");

// Mount routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes); // ✅ NEW: Authentication
app.use("/api/storage", storageRoutes); // ✅ NEW: MongoDB Storage
app.use("/api/ocr", ocrRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/nlp", nlpRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api", chatRoutes);
app.use("/api/translate", translateRoutes); // ✅ NEW

// =======================================
// ROOT ROUTE
// =======================================
app.get("/", (req, res) => {
  res.send("Welcome to the Adaptive Reading Assistant Backend!");
});

// =======================================
// START SERVER
// =======================================
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`✅ MongoDB:        Connected`);
  console.log(`✅ Auth API:       http://localhost:${port}/api/auth`);
  console.log(`✅ Storage API:    http://localhost:${port}/api/storage`);
  console.log(`✅ OCR API:        http://localhost:${port}/api/ocr`);
  console.log(`✅ Speech API:     http://localhost:${port}/api/speech`);
  console.log(`✅ NLP API:        http://localhost:${port}/api/nlp`);
  console.log(`✅ Reading API:    http://localhost:${port}/api/reading`);
  console.log(`✅ Chat API:       http://localhost:${port}/api/chat`);
  console.log(`✅ Translate API:  http://localhost:${port}/api/translate`);
  console.log(`✅ Chat Health:    http://localhost:${port}/api/chat/health`);
});