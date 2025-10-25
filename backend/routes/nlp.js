// backend/routes/nlp.js

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Define the full path to the Python script
const scriptPath = path.join(__dirname, '..', '..', 'ml', 'nlp', 'reading_analysis.py');
// NOTE: If using the virtual environment, you would use:
// const pythonExecutable = path.join(__dirname, '..', '..', 'ml', 'venv', 'bin', 'python');
// For simplicity, we assume 'python' is in your PATH.
const pythonExecutable = 'python'; 


router.post('/analyze', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' field for analysis." });
    }

    // 1. Spawn a child process to run the Python script
    // Arguments passed to Python: [script path, text_to_analyze]
    const pythonProcess = spawn(pythonExecutable, [scriptPath, text]);

    let pythonOutput = '';
    let pythonError = '';

    // 2. Capture data from Python's standard output (stdout)
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    // 3. Capture errors from Python's standard error (stderr)
    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    // 4. Handle the process closing
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}. Error: ${pythonError}`);
            return res.status(500).json({ error: 'Failed to run NLP analysis script.', details: pythonError });
        }

        try {
            // The Python script printed a JSON string, so we parse it here
            const results = JSON.parse(pythonOutput);
            res.json(results);
        } catch (e) {
            console.error("Failed to parse Python output:", pythonOutput);
            res.status(500).json({ error: 'Failed to parse NLP results.', rawOutput: pythonOutput });
        }
    });
});

module.exports = router;