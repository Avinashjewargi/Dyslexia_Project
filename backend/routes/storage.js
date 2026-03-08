// backend/routes/storage.js
// Storage Routes for All Features

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Controllers
const ocrController = require('../controllers/ocrController');
const storyController = require('../controllers/storyController');
const progressController = require('../controllers/progressController');
const achievementController = require('../controllers/achievementController');
const gameController = require('../controllers/gameController');
const lexiaiController = require('../controllers/lexiaiController');
const speechController = require('../controllers/speechController');
const leaderboardController = require('../controllers/leaderboardController');

// =======================================================
// OCR Routes
// =======================================================
router.post('/ocr', authenticate, ocrController.saveOCRUpload);
router.get('/ocr/:userId', authenticate, ocrController.getUserOCRUploads);
router.get('/ocr/:userId/:id', authenticate, ocrController.getOCRUpload);
router.delete('/ocr/:id', authenticate, ocrController.deleteOCRUpload);

// =======================================================
// Story Routes
// =======================================================
router.post('/stories', authenticate, storyController.createStory);
router.get('/stories', authenticate, storyController.getStories);
router.get('/stories/:id', authenticate, storyController.getStory);
router.post('/stories/progress', authenticate, storyController.saveStoryProgress);
router.get('/stories/progress/:userId', authenticate, storyController.getUserStoryProgress);

// =======================================================
// Reading Progress Routes
// =======================================================
router.post('/progress', authenticate, progressController.saveReadingProgress);
router.get('/progress/:userId', authenticate, progressController.getUserProgress);
router.get('/progress/:userId/analytics', authenticate, progressController.getReadingAnalytics);

// =======================================================
// Achievement Routes
// =======================================================
router.get('/achievements/:userId', authenticate, achievementController.getUserAchievements);
router.post('/achievements/unlock', authenticate, achievementController.unlockAchievement);

// =======================================================
// Phonology Game Routes
// =======================================================
router.post('/games', authenticate, gameController.saveGameSession);
router.get('/games/:userId', authenticate, gameController.getUserGames);
router.get('/games/:userId/statistics', authenticate, gameController.getGameStatistics);

// =======================================================
// LexiAI Routes
// =======================================================
router.post('/lexiai', authenticate, lexiaiController.saveLexiAISession);
router.get('/lexiai/:userId', authenticate, lexiaiController.getUserLexiAISessions);

// =======================================================
// Speech Routes (TTS/STT)
// =======================================================
router.post('/speech', authenticate, speechController.saveSpeechSession);
router.get('/speech/:userId', authenticate, speechController.getUserSpeechSessions);

// =======================================================
// Leaderboard Routes
// =======================================================
router.get('/leaderboard', authenticate, leaderboardController.getLeaderboard);
router.get('/leaderboard/rank/:userId', authenticate, leaderboardController.getUserRank);

module.exports = router;
