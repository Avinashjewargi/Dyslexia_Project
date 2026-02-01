const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// ===============================
// DATA DIRECTORY
// ===============================
const DATA_DIR = path.join(__dirname, '..', 'data', 'reading-sessions');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// =======================================================
// NEW: SAVE GENERIC READING SESSION (WITH LANGUAGE)
// POST /api/reading/sessions
// =======================================================
router.post('/sessions', async (req, res) => {
  try {
    const {
      userId,
      sessionType,
      storyId,
      content,
      wpm,
      accuracy,
      readingTimeSec,
      difficultWords,
      timestamp,
      language
    } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and content'
      });
    }

    const session = {
      sessionId: `session_${Date.now()}`,
      userId,
      sessionType: sessionType || 'custom',
      storyId: storyId || null,
      content,
      wpm: wpm || 0,
      accuracy: accuracy || 0,
      readingTimeSec: readingTimeSec || 0,
      difficultWords: difficultWords || [],
      language: language || 'en',
      timestamp: timestamp || new Date().toISOString()
    };

    const filename = `${userId}_session_${Date.now()}.json`;
    const filepath = path.join(DATA_DIR, filename);

    fs.writeFileSync(filepath, JSON.stringify(session, null, 2), 'utf8');

    res.json({
      success: true,
      sessionId: session.sessionId,
      message: 'Session saved successfully'
    });

  } catch (error) {
    console.error('Session Save Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save session',
      details: error.message
    });
  }
});

// =======================================================
// SAVE A SINGLE DIFFICULT WORD
// POST /api/reading/difficult-word
// =======================================================
router.post('/difficult-word', (req, res) => {
  const { userId, storyId, storyTitle, word, timestamp } = req.body;

  if (!userId || !word) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const filePath = path.join(DATA_DIR, `${userId}_difficult_words.txt`);
    const logEntry = `${timestamp} | Story: ${storyTitle} (ID: ${storyId}) | Word: ${word}\n`;

    fs.appendFileSync(filePath, logEntry, 'utf8');

    res.json({
      success: true,
      message: 'Difficult word saved',
      word
    });

  } catch (error) {
    console.error('Error saving difficult word:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save difficult word'
    });
  }
});

// =======================================================
// SAVE COMPLETE READING SESSION (STORY BASED)
// POST /api/reading/save-session
// =======================================================
router.post('/save-session', (req, res) => {
  const {
    userId,
    storyId,
    storyTitle,
    difficultWords,
    readingDuration,
    timestamp,
    language
  } = req.body;

  if (!userId || !storyId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sessionFilePath = path.join(
      DATA_DIR,
      `${userId}_session_${Date.now()}.json`
    );

    const sessionData = {
      userId,
      storyId,
      storyTitle,
      difficultWords: difficultWords || [],
      wordCount: difficultWords ? difficultWords.length : 0,
      readingDuration: readingDuration || 0,
      language: language || 'en',
      timestamp: timestamp || new Date().toISOString(),
      completed: true
    };

    fs.writeFileSync(
      sessionFilePath,
      JSON.stringify(sessionData, null, 2),
      'utf8'
    );

    const masterLogPath = path.join(DATA_DIR, 'master_reading_log.txt');
    const masterEntry =
      `[${sessionData.timestamp}] User: ${userId} | Story: "${storyTitle}" | Difficult Words: ${sessionData.wordCount} | Duration: ${readingDuration}s\n`;

    fs.appendFileSync(masterLogPath, masterEntry, 'utf8');

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

// =======================================================
// STORY PROGRESS
// =======================================================
router.post('/story-progress', (req, res) => {
  const { userId, storyId, storyTitle, difficultWords, readingDuration, timestamp } = req.body;

  if (!userId || !storyId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const progressFilePath = path.join(DATA_DIR, `${userId}_story_progress.json`);
    let allProgress = fs.existsSync(progressFilePath)
      ? JSON.parse(fs.readFileSync(progressFilePath, 'utf8'))
      : {};

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

    if (difficultWords?.length) {
      const existing = allProgress[storyId].difficultWords;
      const unique = difficultWords.filter(w => !existing.includes(w));
      allProgress[storyId].difficultWords.push(...unique);
    }

    fs.writeFileSync(progressFilePath, JSON.stringify(allProgress, null, 2));

    res.json({
      success: true,
      message: 'Story progress saved',
      progress: allProgress[storyId]
    });

  } catch (error) {
    console.error('Error saving story progress:', error);
    res.status(500).json({ success: false, error: 'Failed to save story progress' });
  }
});

// =======================================================
// GET STORY PROGRESS
// =======================================================
router.get('/story-progress/:userId', (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.userId}_story_progress.json`);

  if (!fs.existsSync(filePath)) {
    return res.json({ success: true, progress: {} });
  }

  res.json({
    success: true,
    progress: JSON.parse(fs.readFileSync(filePath, 'utf8'))
  });
});

// =======================================================
// GET USER SESSIONS
// =======================================================
router.get('/sessions/:userId', (req, res) => {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith(`${req.params.userId}_session_`))
    .map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    success: true,
    count: files.length,
    sessions: files
  });
});

// =======================================================
// ANALYTICS
// =======================================================
router.get('/analytics/:userId', (req, res) => {
  const sessions = fs.readdirSync(DATA_DIR)
    .filter(f => f.startsWith(`${req.params.userId}_session_`))
    .map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')));

  if (!sessions.length) {
    return res.json({ success: true, analytics: null });
  }

  const totalTime = sessions.reduce((s, x) => s + (x.readingDuration || 0), 0);
  const words = sessions.flatMap(s => s.difficultWords || []);

  const freq = {};
  words.forEach(w => (freq[w] = (freq[w] || 0) + 1));

  res.json({
    success: true,
    analytics: {
      totalSessions: sessions.length,
      totalReadingTime: totalTime,
      averageReadingTime: Math.round(totalTime / sessions.length),
      totalDifficultWords: words.length,
      uniqueDifficultWords: Object.keys(freq).length,
      mostCommonWords: Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))
    }
  });
});

// =======================================================
// DELETE USER DATA
// =======================================================
router.delete('/user/:userId', (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith(req.params.userId));
  files.forEach(f => fs.unlinkSync(path.join(DATA_DIR, f)));

  res.json({
    success: true,
    message: `Deleted ${files.length} files`
  });
});

module.exports = router;
