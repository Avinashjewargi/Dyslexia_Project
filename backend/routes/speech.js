// backend/routes/speech.js

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '..', '..', 'ml', 'speech', 'recognition.py');
const pythonExecutable = 'python'; 

router.post('/tts', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Missing 'text' field for TTS." });
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
            console.error(`Python TTS script failed. Code ${code}. Error: ${pythonError}`);
            return res.status(500).json({ error: 'Failed to run TTS script.', details: pythonError });
        }

        try {
            const results = JSON.parse(pythonOutput);
            if (results.success) {
                // Send the full audio URL path back to the frontend
                // Uses the static route defined in server.js
                res.json({ success: true, audioUrl: `/audio/${results.audio_filename}` });
            } else {
                res.status(500).json({ error: results.error });
            }
        } catch (e) {
            console.error("Failed to parse Python TTS output:", pythonOutput);
            res.status(500).json({ error: 'Failed to parse TTS results.' });
        }
    });
});

module.exports = router;