// backend/routes/speech.js - FINAL CORRECTED VERSION (Fixes ReferenceError)

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs'); // Needed to delete the temp file

// Export a function that accepts the 'upload' middleware from server.js
module.exports = (upload) => { 
    
    // --- CRITICAL FIX: DEFINE PATHS INSIDE THE SCOPE ---
    const recognitionScriptPath = path.join(__dirname, '..', '..', 'ml', 'speech', 'recognition.py');
    const pythonExecutable = 'python'; 
    // --- END FIX ---

    // --- 1. POST /api/speech/tts (Text-to-Speech) ---
    router.post('/tts', (req, res) => {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Missing 'text' field for TTS." });
        }

        // Use the defined paths here
        const pythonProcess = spawn(pythonExecutable, [recognitionScriptPath, text]); 
        
        // ... (rest of the TTS logic remains the same) ...
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

    // --- 2. POST /api/speech/stt (Speech-to-Text) ---
    router.post('/stt', upload.single('audio'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded." });
        }

        const filePath = req.file.path;
        const targetWord = req.body.word || ''; 

        // Use the defined paths here
        const pythonProcess = spawn(pythonExecutable, [
            recognitionScriptPath, 
            'stt_mode', 
            filePath, 
            targetWord
        ]);

        let pythonOutput = '';
        let pythonError = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on('close', (code) => {
            fs.unlink(filePath, (err) => {
                if (err) console.error("Failed to delete temp audio file:", err);
            });

            if (code !== 0) {
                console.error(`Python STT script failed. Error: ${pythonError}`);
                return res.status(500).json({ error: 'Failed to run STT analysis script.', details: pythonError });
            }

            try {
                const results = JSON.parse(pythonOutput);
                res.json(results);
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse STT results.', rawOutput: pythonOutput });
            }
        });
    });

    return router;
};