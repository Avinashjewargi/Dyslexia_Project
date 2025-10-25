// backend/server.js - FINAL CONSOLIDATED VERSION

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const fs = require('fs'); // Node's File System
const multer = require('multer'); 

// 1. IMPORT ALL ROUTES
const apiRoutes = require('./routes/api.js');      // For /api/data, /api/student-profile, OCR
const nlpRoutes = require('./routes/nlp.js');      // For /api/nlp/analyze
const speechRoutes = require('./routes/speech.js'); // For /api/speech/tts

// 2. DEFINE PATHS AND UPLOAD CONFIGURATION
const uploadDir = path.join(__dirname, 'uploads');
const audioPath = path.join(__dirname, 'audio_temp'); 

// Configure Multer for file uploads (OCR)
const upload = multer({ 
    dest: uploadDir,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}); 

// 3. MIDDLEWARE SETUP (Order is crucial!)

// Middleware to parse incoming JSON requests (needed for NLP/TTS POST bodies)
app.use(express.json());

// Middleware to ensure the temporary upload directory exists
app.use((req, res, next) => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    // Also ensure the audio temp directory exists before the TTS script runs
    if (!fs.existsSync(audioPath)) {
        fs.mkdirSync(audioPath);
    }
    next();
});

// 4. ROUTE USAGE

// Route A: API routes requiring Multer/Upload middleware (e.g., /api/ocr)
app.use('/api', apiRoutes(upload)); 

// Route B: Analysis Routes (Regular POST requests)
app.use('/api/nlp', nlpRoutes);
app.use('/api/speech', speechRoutes); 

// Route C: Static File Serving (TTS Audio)
// **This is the fix:** It tells Express to expose the audio folder content
// under the URL prefix '/audio'. The audioPath must be correct.
app.use('/audio', express.static(audioPath)); 

// Simple test route (root endpoint)
app.get('/', (req, res) => {
    res.send('Welcome to the Adaptive Reading Assistant Backend!');
});

// 5. START SERVER
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});