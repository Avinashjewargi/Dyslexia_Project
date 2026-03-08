// backend/controllers/progressController.js
// Reading Progress Controller

const ReadingProgress = require('../models/ReadingProgress');
const StoryProgress = require('../models/StoryProgress');

// Save reading progress
const saveReadingProgress = async (req, res) => {
  try {
    const {
      sessionType,
      storyId,
      storyTitle,
      content,
      wpm,
      accuracy,
      readingTimeSec,
      difficultWords,
      language
    } = req.body;

    const userId = req.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const readingProgress = new ReadingProgress({
      userId,
      sessionType: sessionType || 'custom',
      storyId: storyId || null,
      storyTitle: storyTitle || null,
      content,
      contentLength: content.length,
      wpm: wpm || 0,
      accuracy: accuracy || 0,
      readingTimeSec: readingTimeSec || 0,
      difficultWords: (difficultWords || []).map(word => ({
        word: typeof word === 'string' ? word : word.word,
        count: typeof word === 'string' ? 1 : (word.count || 1),
        timestamp: new Date()
      })),
      language: language || 'en',
      completed: true,
      completedAt: new Date()
    });

    await readingProgress.save();

    res.status(201).json({
      success: true,
      message: 'Reading progress saved successfully',
      progress: {
        id: readingProgress._id,
        sessionType: readingProgress.sessionType,
        wpm: readingProgress.wpm,
        accuracy: readingProgress.accuracy,
        createdAt: readingProgress.createdAt
      }
    });

  } catch (error) {
    console.error('Progress save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save reading progress'
    });
  }
};

// Get user's reading progress
const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const { sessionType, limit = 50, skip = 0 } = req.query;

    const query = { userId };
    if (sessionType) query.sessionType = sessionType;

    const progress = await ReadingProgress.find(query)
      .populate('storyId', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ReadingProgress.countDocuments(query);

    res.json({
      success: true,
      progress,
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

// Get reading analytics
const getReadingAnalytics = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    const allProgress = await ReadingProgress.find({ userId });

    if (allProgress.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalSessions: 0,
          totalReadingTime: 0,
          averageReadingTime: 0,
          totalDifficultWords: 0,
          uniqueDifficultWords: 0,
          averageWPM: 0,
          averageAccuracy: 0,
          mostCommonWords: []
        }
      });
    }

    const totalSessions = allProgress.length;
    const totalReadingTime = allProgress.reduce((sum, p) => sum + (p.readingTimeSec || 0), 0);
    const averageReadingTime = Math.round(totalReadingTime / totalSessions);
    
    const allWPM = allProgress.map(p => p.wpm || 0).filter(w => w > 0);
    const averageWPM = allWPM.length > 0 
      ? Math.round(allWPM.reduce((a, b) => a + b, 0) / allWPM.length)
      : 0;

    const allAccuracy = allProgress.map(p => p.accuracy || 0).filter(a => a > 0);
    const averageAccuracy = allAccuracy.length > 0
      ? Math.round(allAccuracy.reduce((a, b) => a + b, 0) / allAccuracy.length)
      : 0;

    const allDifficultWords = allProgress.flatMap(p => p.difficultWords || []);
    const wordFreq = {};
    allDifficultWords.forEach(dw => {
      const word = dw.word || dw;
      wordFreq[word] = (wordFreq[word] || 0) + (dw.count || 1);
    });

    const mostCommonWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    res.json({
      success: true,
      analytics: {
        totalSessions,
        totalReadingTime,
        averageReadingTime,
        totalDifficultWords: allDifficultWords.length,
        uniqueDifficultWords: Object.keys(wordFreq).length,
        averageWPM,
        averageAccuracy,
        mostCommonWords
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
  saveReadingProgress,
  getUserProgress,
  getReadingAnalytics
};
