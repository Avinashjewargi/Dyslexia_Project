// backend/server.js

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");

const port = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors());
app.use(express.json());

// --- Multer setup for uploads (audio + images) ---
const uploadDir = path.join(__dirname, "audio_temp");        // base folder
const uploadsPath = path.join(uploadDir, "uploads");         // actual files

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Multer instance – passed into speech + ocr routes
const upload = multer({ dest: uploadsPath });

// --- Import routes ---
const apiRoutes = require("./routes/api.js");
const speechRoutes = require("./routes/speech.js")(upload);
const ocrRoutes = require("./routes/ocr.js")(upload);

// Static serving of audio / uploaded files
// => http://localhost:5000/audio/<filename>
app.use("/audio", express.static(uploadDir));

// --- Register routes ---
app.use("/api", apiRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/ocr", ocrRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Adaptive Reading Assistant Backend!");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
