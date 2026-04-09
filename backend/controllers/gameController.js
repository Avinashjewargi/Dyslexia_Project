// backend/controllers/gameController.js
// Phonology Games Controller

const PhonologyGame = require('../models/PhonologyGame');
const { checkAchievements } = require('./achievementController');
const { updateLeaderboard } = require('./leaderboardController');

// Save game session
const saveGameSession = async (req, res) => {
  try {
    const {
      gameType,
      gameTitle,
      score,
      totalQuestions,
      correctAnswers,
      accuracy,
      timeTaken,
      difficulty,
      language,
      questions,
      completed
    } = req.body;

    const userId = req.userId;

    if (!gameType || !gameTitle) {
      return res.status(400).json({
        success: false,
        error: 'Game type and title are required'
      });
    }

    const game = new PhonologyGame({
      userId,
      gameType,
      gameTitle,
      score: score || 0,
      totalQuestions: totalQuestions || 0,
      correctAnswers: correctAnswers || 0,
      accuracy: accuracy || 0,
      timeTaken: timeTaken || 0,
      difficulty: difficulty || 'easy',
      language: language || 'en',
      questions: questions || [],
      completed: completed !== undefined ? completed : true,
      completedAt: completed ? new Date() : null
    });

    await game.save();

    // Check for achievements
    await checkAchievements(userId);

    // Update leaderboard
    updateLeaderboard(userId).catch(err => {
      console.error('Leaderboard update error after game session:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Game session saved successfully',
      game: {
        id: game._id,
        gameType: game.gameType,
        score: game.score,
        accuracy: game.accuracy,
        createdAt: game.createdAt
      }
    });

  } catch (error) {
    console.error('Game save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save game session'
    });
  }
};

// Get user's game history
const getUserGames = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const { gameType, difficulty, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (gameType) query.gameType = gameType;
    if (difficulty) query.difficulty = difficulty;

    const games = await PhonologyGame.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await PhonologyGame.countDocuments(query);

    res.json({
      success: true,
      games,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get game statistics
const getGameStatistics = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    const allGames = await PhonologyGame.find({ userId });

    if (allGames.length === 0) {
      return res.json({
        success: true,
        statistics: {
          totalGames: 0,
          totalScore: 0,
          averageAccuracy: 0,
          gamesByType: {},
          gamesByDifficulty: {}
        }
      });
    }

    const totalGames = allGames.length;
    const totalScore = allGames.reduce((sum, g) => sum + (g.score || 0), 0);
    const allAccuracy = allGames.map(g => g.accuracy || 0).filter(a => a > 0);
    const averageAccuracy = allAccuracy.length > 0
      ? Math.round(allAccuracy.reduce((a, b) => a + b, 0) / allAccuracy.length)
      : 0;

    const gamesByType = {};
    const gamesByDifficulty = {};

    allGames.forEach(game => {
      gamesByType[game.gameType] = (gamesByType[game.gameType] || 0) + 1;
      gamesByDifficulty[game.difficulty] = (gamesByDifficulty[game.difficulty] || 0) + 1;
    });

    res.json({
      success: true,
      statistics: {
        totalGames,
        totalScore,
        averageAccuracy,
        gamesByType,
        gamesByDifficulty
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  saveGameSession,
  getUserGames,
  getGameStatistics
};
