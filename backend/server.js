// backend/server.js - UPDATED VERSION with Reading Routes

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
const axios = require('axios');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ML Analysis endpoint (existing)
app.post('/api/ml/analyze', async (req, res) => {
  try {
    const { text, source, saveToFile } = req.body;
  
    const response = await axios.post('http://localhost:5050/api/v1/analyze-content', {
      text: text
    });
   
    if (saveToFile && text) {
      const uploadsDir = path.join(__dirname, "uploads");
  
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const sourceLabel = (source || 'text').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${sourceLabel}_${timestamp}.txt`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, text, 'utf8');
      console.log(`✅ Text saved to: ${filepath}`);

      response.data.savedFile = filename;
      response.data.savedPath = filepath;
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to ML service. Make sure Python service is running on port 5050.' 
    });
  }
});

// Setup multer for file uploads
const uploadDir = path.join(__dirname, "audio_temp");
const uploadsPath = path.join(uploadDir, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const upload = multer({ dest: uploadsPath });

// Import existing routes
const apiRoutes = require("./routes/api.js")();
const speechRoutes = require("./routes/speech.js")(upload);
const ocrRoutes = require("./routes/ocr.js")(upload);

// NEW: Import reading routes
const readingRoutes = require("./routes/reading.js");

// Serve static files
app.use("/audio", express.static(uploadDir));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use routes
app.use("/api", apiRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/reading", readingRoutes); // NEW: Reading routes

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Adaptive Reading Assistant Backend!");
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
  console.log(`✅ Reading API available at http://localhost:${port}/api/reading`);
});