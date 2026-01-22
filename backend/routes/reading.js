// backend/routes/reading.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Directory to store reading data
const DATA_DIR = path.join(__dirname, '..', 'data', 'reading-sessions');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Save a single difficult word immediately
 * POST /api/reading/difficult-word
 */
router.post('/difficult-word', (req, res) => {
    const { userId, storyId, storyTitle, word, timestamp } = req.body;

    if (!userId || !word) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // File path for this user's difficult words
        const filePath = path.join(DATA_DIR, `${userId}_difficult_words.txt`);

        // Create log entry
        const logEntry = `${timestamp} | Story: ${storyTitle} (ID: ${storyId}) | Word: ${word}\n`;

        // Append to file
        fs.appendFileSync(filePath, logEntry, 'utf8');

        console.log(`✅ Saved difficult word for ${userId}: ${word}`);

        res.json({ 
            success: true, 
            message: 'Difficult word saved',
            word: word
        });

    } catch (error) {
        console.error('Error saving difficult word:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save difficult word' 
        });
    }
});

/**
 * Save complete reading session with all difficult words
 * POST /api/reading/save-session
 */
router.post('/save-session', (req, res) => {
    const { userId, storyId, storyTitle, difficultWords, readingDuration, timestamp } = req.body;

    if (!userId || !storyId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Create session summary file
        const sessionFilePath = path.join(DATA_DIR, `${userId}_session_${Date.now()}.json`);

        const sessionData = {
            userId,
            storyId,
            storyTitle,
            difficultWords: difficultWords || [],
            wordCount: difficultWords ? difficultWords.length : 0,
            readingDuration: readingDuration || 0,
            timestamp: timestamp || new Date().toISOString(),
            completed: true
        };

        // Save as JSON for easy analysis later
        fs.writeFileSync(sessionFilePath, JSON.stringify(sessionData, null, 2), 'utf8');

        // Also append to master log
        const masterLogPath = path.join(DATA_DIR, 'master_reading_log.txt');
        const masterEntry = `[${timestamp}] User: ${userId} | Story: "${storyTitle}" | Difficult Words: ${difficultWords.length} | Duration: ${readingDuration}s\n`;
        fs.appendFileSync(masterLogPath, masterEntry, 'utf8');

        console.log(`✅ Saved reading session for ${userId}: ${storyTitle}`);

        res.json({ 
            success: true, 
            message: 'Reading session saved successfully',
            sessionId: path.basename(sessionFilePath),
            wordCount: sessionData.wordCount
        });

    } catch (error) {
        console.error('Error saving reading session:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save reading session' 
        });
    }
});

/**
 * NEW: Save story progress
 * POST /api/reading/story-progress
 */
router.post('/story-progress', (req, res) => {
    const { userId, storyId, storyTitle, difficultWords, readingDuration, timestamp } = req.body;

    if (!userId || !storyId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const progressFilePath = path.join(DATA_DIR, `${userId}_story_progress.json`);
        
        let allProgress = {};
        if (fs.existsSync(progressFilePath)) {
            allProgress = JSON.parse(fs.readFileSync(progressFilePath, 'utf8'));
        }

        // Update progress for this story
        if (!allProgress[storyId]) {
            allProgress[storyId] = {
                storyId,
                storyTitle,
                firstRead: timestamp,
                timesRead: 0,
                totalDuration: 0,
                difficultWords: []
            };
        }

        allProgress[storyId].timesRead += 1;
        allProgress[storyId].totalDuration += readingDuration || 0;
        allProgress[storyId].lastRead = timestamp;
        
        // Add new difficult words (avoid duplicates)
        if (difficultWords && difficultWords.length > 0) {
            const existingWords = allProgress[storyId].difficultWords || [];
            const newWords = difficultWords.filter(w => !existingWords.includes(w));
            allProgress[storyId].difficultWords = [...existingWords, ...newWords];
        }

        fs.writeFileSync(progressFilePath, JSON.stringify(allProgress, null, 2), 'utf8');

        console.log(`✅ Saved story progress for ${userId}: ${storyTitle}`);

        res.json({ 
            success: true, 
            message: 'Story progress saved',
            progress: allProgress[storyId]
        });

    } catch (error) {
        console.error('Error saving story progress:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save story progress' 
        });
    }
});

/**
 * NEW: Get story progress for a user
 * GET /api/reading/story-progress/:userId
 */
router.get('/story-progress/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const progressFilePath = path.join(DATA_DIR, `${userId}_story_progress.json`);
        
        if (!fs.existsSync(progressFilePath)) {
            return res.json({ 
                success: true, 
                progress: {},
                message: 'No story progress yet'
            });
        }

        const progress = JSON.parse(fs.readFileSync(progressFilePath, 'utf8'));

        res.json({
            success: true,
            progress: progress,
            totalStoriesRead: Object.keys(progress).length
        });

    } catch (error) {
        console.error('Error fetching story progress:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch story progress' 
        });
    }
});

/**
 * NEW: Get all students' story progress (for dashboard)
 * GET /api/reading/all-story-progress
 */
router.get('/all-story-progress', (req, res) => {
    try {
        const files = fs.readdirSync(DATA_DIR);
        const progressFiles = files.filter(file => file.endsWith('_story_progress.json'));
        
        const allStudentsProgress = progressFiles.map(file => {
            const userId = file.replace('_story_progress.json', '');
            const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
            const progress = JSON.parse(content);
            
            const totalStories = Object.keys(progress).length;
            const totalDifficultWords = Object.values(progress).reduce((sum, story) => 
                sum + (story.difficultWords?.length || 0), 0);
            const totalReads = Object.values(progress).reduce((sum, story) => 
                sum + (story.timesRead || 0), 0);
            
            return {
                userId,
                totalStories,
                totalDifficultWords,
                totalReads,
                stories: progress
            };
        });

        res.json({
            success: true,
            students: allStudentsProgress
        });

    } catch (error) {
        console.error('Error fetching all story progress:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch all story progress' 
        });
    }
});

/**
 * Get all difficult words for a user
 * GET /api/reading/difficult-words/:userId
 */
router.get('/difficult-words/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const filePath = path.join(DATA_DIR, `${userId}_difficult_words.txt`);

        if (!fs.existsSync(filePath)) {
            return res.json({ 
                success: true, 
                words: [],
                message: 'No difficult words recorded yet'
            });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse words from log
        const words = lines.map(line => {
            const match = line.match(/Word: (.+)$/);
            return match ? match[1] : null;
        }).filter(Boolean);

        // Get unique words with frequency
        const wordFrequency = {};
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        res.json({
            success: true,
            totalWords: words.length,
            uniqueWords: Object.keys(wordFrequency).length,
            wordFrequency: wordFrequency,
            allWords: words
        });

    } catch (error) {
        console.error('Error fetching difficult words:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch difficult words' 
        });
    }
});

/**
 * Get reading sessions for a user
 * GET /api/reading/sessions/:userId
 */
router.get('/sessions/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const files = fs.readdirSync(DATA_DIR);
        const userSessions = files
            .filter(file => file.startsWith(`${userId}_session_`) && file.endsWith('.json'))
            .map(file => {
                const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
                return JSON.parse(content);
            })
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Most recent first

        res.json({
            success: true,
            count: userSessions.length,
            sessions: userSessions
        });

    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch sessions' 
        });
    }
});

/**
 * Get analytics/summary for a user
 * GET /api/reading/analytics/:userId
 */
router.get('/analytics/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        // Get all sessions
        const files = fs.readdirSync(DATA_DIR);
        const userSessions = files
            .filter(file => file.startsWith(`${userId}_session_`) && file.endsWith('.json'))
            .map(file => {
                const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
                return JSON.parse(content);
            });

        if (userSessions.length === 0) {
            return res.json({
                success: true,
                message: 'No sessions found',
                analytics: null
            });
        }

        // Calculate analytics
        const totalSessions = userSessions.length;
        const totalReadingTime = userSessions.reduce((sum, s) => sum + (s.readingDuration || 0), 0);
        const allDifficultWords = userSessions.flatMap(s => s.difficultWords || []);
        
        // Word frequency analysis
        const wordFrequency = {};
        allDifficultWords.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });

        // Most common difficult words
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));

        // Stories read
        const storiesRead = [...new Set(userSessions.map(s => s.storyId))];

        const analytics = {
            totalSessions,
            totalReadingTime,
            averageReadingTime: Math.round(totalReadingTime / totalSessions),
            totalDifficultWords: allDifficultWords.length,
            uniqueDifficultWords: Object.keys(wordFrequency).length,
            mostCommonWords: sortedWords,
            storiesRead: storiesRead.length,
            lastSession: userSessions[userSessions.length - 1].timestamp
        };

        res.json({
            success: true,
            analytics
        });

    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate analytics' 
        });
    }
});

/**
 * Delete all data for a user (for testing/privacy)
 * DELETE /api/reading/user/:userId
 */
router.delete('/user/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const files = fs.readdirSync(DATA_DIR);
        const userFiles = files.filter(file => file.startsWith(`${userId}_`));

        userFiles.forEach(file => {
            fs.unlinkSync(path.join(DATA_DIR, file));
        });

        console.log(`🗑️ Deleted ${userFiles.length} files for user ${userId}`);

        res.json({
            success: true,
            message: `Deleted ${userFiles.length} files for user ${userId}`
        });

    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete user data' 
        });
    }
});

module.exports = router;