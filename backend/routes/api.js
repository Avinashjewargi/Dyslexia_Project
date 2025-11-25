// --- backend/routes/api.js ---

const express = require('express');
const router = express.Router();

// Export a function that accepts the 'upload' middleware
// (Even if we don't use 'upload' here right now, we keep the signature consistent)
module.exports = () => { 
    
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

    // --- GET /api/teacher-dashboard (Mock Teacher Analytics) ---
    router.get('/teacher-dashboard', (req, res) => {
        const summary = {
            teacherName: "Ms. Eleanor Vance",
            totalStudents: 18,
            classAverageDifficultyScore: 0.65,
            classAverageAccuracy: 0.81,
            weeklyReadingMinutes: 247,
            studentsOnTrack: 14,
            alerts: [
                { id: 101, name: "Jamie C.", issue: "Low accuracy", detail: "Avg accuracy dropped below 55% this week." },
                { id: 102, name: "Taylor D.", issue: "Missed sessions", detail: "No recorded sessions in the last 5 days." }
            ],
            recentStudents: [
                { id: 1, name: "Alex B.", sessions: 5, avgScore: 0.72 },
                { id: 2, name: "Jamie C.", sessions: 3, avgScore: 0.58 },
                { id: 3, name: "Taylor D.", sessions: 4, avgScore: 0.68 },
                { id: 4, name: "Jordan E.", sessions: 6, avgScore: 0.81 },
                { id: 5, name: "Sam H.", sessions: 2, avgScore: 0.54 }
            ],
            readingTrends: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                minutes: [32, 48, 41, 55, 39, 12, 20],
                comprehension: [0.72, 0.75, 0.7, 0.78, 0.74, 0.6, 0.67]
            }
        };

        res.json(summary);
    });

    // NOTE: The OCR route has been moved to 'routes/ocr.js' to prevent errors.
    // Do not add router.post('/ocr'...) here.

    return router;
};