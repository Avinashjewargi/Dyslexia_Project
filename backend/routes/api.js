const express = require('express');
const router = express.Router();

// Export a function that accepts the 'upload' middleware
// (Even if we don't use 'upload' here right now, we keep the signature consistent)
module.exports = (upload) => { 
    
    // --- GET /api/test (Simple Health Check) ---
    router.get('/test', (req, res) => {
        res.json({ message: "API is working!" });
    });

    // --- GET /api/content/sample (Sample Text for Reader) ---
    router.get('/content/sample', (req, res) => {
        res.json({
            title: "Sample Reading Passage",
            text: "The Adaptive Reading Assistant project is designed to help students with dyslexia by using tailored fonts, colors, and interactive features like text-to-speech. Our goal is to make reading a less challenging and more rewarding experience."
        });
    });

    // --- GET /api/student-profile (Mock Student Data) ---
    router.get('/student-profile', (req, res) => {
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

    // NOTE: The OCR route has been moved to 'routes/ocr.js' to prevent errors.
    // Do not add router.post('/ocr'...) here.

    return router;
};