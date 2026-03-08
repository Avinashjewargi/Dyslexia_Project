// backend/controllers/lexiaiController.js
// LexiAI Sessions Controller

const LexiAISession = require('../models/LexiAISession');

// Save LexiAI session
const saveLexiAISession = async (req, res) => {
  try {
    const {
      cardType,
      cardTitle,
      interactions,
      correctAnswers,
      totalQuestions,
      accuracy,
      timeSpent,
      wordsLearned,
      completed
    } = req.body;

    const userId = req.userId;

    if (!cardType || !cardTitle) {
      return res.status(400).json({
        success: false,
        error: 'Card type and title are required'
      });
    }

    const session = new LexiAISession({
      userId,
      cardType,
      cardTitle,
      interactions: interactions || 0,
      correctAnswers: correctAnswers || 0,
      totalQuestions: totalQuestions || 0,
      accuracy: accuracy || 0,
      timeSpent: timeSpent || 0,
      wordsLearned: wordsLearned || [],
      completed: completed !== undefined ? completed : true,
      completedAt: completed ? new Date() : null
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'LexiAI session saved successfully',
      session: {
        id: session._id,
        cardType: session.cardType,
        accuracy: session.accuracy,
        createdAt: session.createdAt
      }
    });

  } catch (error) {
    console.error('LexiAI session save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save LexiAI session'
    });
  }
};

// Get user's LexiAI sessions
const getUserLexiAISessions = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const { cardType, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (cardType) query.cardType = cardType;

    const sessions = await LexiAISession.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await LexiAISession.countDocuments(query);

    res.json({
      success: true,
      sessions,
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

module.exports = {
  saveLexiAISession,
  getUserLexiAISessions
};
