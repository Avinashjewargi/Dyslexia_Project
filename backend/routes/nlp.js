// backend/routes/nlp.js

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '..', '..', 'ml', 'nlp', 'reading_analysis.py');

const pythonExecutable = 'python'; 
router.post('/analyze', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' field for analysis." });
    }

    
    const pythonProcess = spawn(pythonExecutable, [scriptPath, text]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}. Error: ${pythonError}`);
            return res.status(500).json({ error: 'Failed to run NLP analysis script.', details: pythonError });
        }

        try {
            
            const results = JSON.parse(pythonOutput);
            res.json(results);
        } catch (e) {
            console.error("Failed to parse Python output:", pythonOutput);
            res.status(500).json({ error: 'Failed to parse NLP results.', rawOutput: pythonOutput });
        }
    });
});

module.exports = router;