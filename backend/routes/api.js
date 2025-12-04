const express = require('express');
const router = express.Router();

module.exports = () => { 
    
    router.get('/test', (req, res) => {
        res.json({ message: "API is working!" });
    });

    router.get('/content/sample', (req, res) => {
        res.json({
            title: "Sample Reading Passage",
            text: "The Adaptive Reading Assistant project is designed to help students with dyslexia by using tailored fonts, colors, and interactive features like text-to-speech. Our goal is to make reading a less challenging and more rewarding experience."
        });
    });

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


    return router;
};