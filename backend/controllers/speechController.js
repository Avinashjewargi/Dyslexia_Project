// backend/controllers/speechController.js
// Speech (TTS/STT) Sessions Controller

const SpeechSession = require('../models/SpeechSession');

// Save speech session
const saveSpeechSession = async (req, res) => {
  try {
    const {
      sessionType,
      textContent,
      audioUrl,
      audioPath,
      speechRate,
      voice,
      spokenText,
      expectedText,
      accuracy,
      language,
      duration
    } = req.body;

    const userId = req.userId;

    if (!sessionType) {
      return res.status(400).json({
        success: false,
        error: 'Session type is required'
      });
    }

    const session = new SpeechSession({
      userId,
      sessionType,
      textContent: textContent || null,
      audioUrl: audioUrl || null,
      audioPath: audioPath || null,
      speechRate: speechRate || 1.0,
      voice: voice || 'default',
      spokenText: spokenText || null,
      expectedText: expectedText || null,
      accuracy: accuracy || 0,
      language: language || 'en',
      duration: duration || 0
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Speech session saved successfully',
      session: {
        id: session._id,
        sessionType: session.sessionType,
        createdAt: session.createdAt
      }
    });

  } catch (error) {
    console.error('Speech session save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save speech session'
    });
  }
};

// Get user's speech sessions
const getUserSpeechSessions = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const { sessionType, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (sessionType) query.sessionType = sessionType;

    const sessions = await SpeechSession.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await SpeechSession.countDocuments(query);

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
  saveSpeechSession,
  getUserSpeechSessions
};
