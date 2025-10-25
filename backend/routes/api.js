// backend/routes/api.js

const express = require('express');
const router = express.Router();
const fs = require('fs'); // Node's File System module to delete temp file

// We export a function that takes the upload middleware as an argument
module.exports = (upload) => { 

    // GET /api/data test route
    router.get('/data', (req, res) => {
        res.json({ message: "Data endpoint reached successfully." });
    });

    // GET /api/student-profile (Your existing route)
    router.get('/student-profile', (req, res) => {
        // ... (Your existing student-profile data) ...
         const studentProfile = {
            id: 101,
            name: "Alex Johnson",
            readingLevel: "Grade 4 Equivalent",
            weeklyGoalHours: 5,
            weeklyProgressHours: 3.5,
            badgesEarned: 2,
            lastLogin: new Date().toISOString()
        };
        res.json(studentProfile);
    });

    // POST /api/ocr - NOW USES MULTER MIDDLEWARE
    // `upload.single('image')` tells Multer to expect one file named 'image'
    router.post('/ocr', upload.single('image'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded." });
        }

        // The file information is now in req.file
        const filePath = req.file.path;
        const originalName = req.file.originalname;

        console.log(`Received file: ${originalName} stored at: ${filePath}`);

        // --- ML INTEGRATION PLACEHOLDER ---
        // In a real implementation, you would:
        // 1. Call a Python script (ml/ocr/process_text.py) using 'child_process'
        // 2. Pass the filePath to the Python script.
        // 3. The Python script runs the OCR and returns the text result.

        // Dummy OCR result:
        const extractedText = `OCR successful! Text extracted from ${originalName}. This text is now ready for adaptive reading features.`;

        // CLEANUP: IMPORTANT! Delete the temporary file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete temp file:", err);
        });

        // Send the extracted text back to the frontend
        res.json({ 
            success: true, 
            extractedText: extractedText 
        });
    });

    return router; // Return the configured router
};