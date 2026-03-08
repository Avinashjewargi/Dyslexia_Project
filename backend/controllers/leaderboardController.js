// backend/controllers/leaderboardController.js
// Leaderboard Controller

const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const ReadingProgress = require('../models/ReadingProgress');
const StoryProgress = require('../models/StoryProgress');
const PhonologyGame = require('../models/PhonologyGame');
const Achievement = require('../models/Achievement');

// Update leaderboard for user
const updateLeaderboard = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'student') return;

    // Calculate metrics
    const readingSessions = await ReadingProgress.find({ userId });
    const stories = await StoryProgress.find({ userId });
    const games = await PhonologyGame.find({ userId });
    const achievements = await Achievement.find({ userId });

    const totalReadingTime = readingSessions.reduce((sum, s) => sum + (s.readingTimeSec || 0), 0);
    const totalStoriesRead = stories.length;
    
    const allWPM = readingSessions.map(s => s.wpm || 0).filter(w => w > 0);
    const averageWPM = allWPM.length > 0
      ? Math.round(allWPM.reduce((a, b) => a + b, 0) / allWPM.length)
      : 0;

    const allAccuracy = readingSessions.map(s => s.accuracy || 0).filter(a => a > 0);
    const averageAccuracy = allAccuracy.length > 0
      ? Math.round(allAccuracy.reduce((a, b) => a + b, 0) / allAccuracy.length)
      : 0;

    const gamesPlayed = games.length;
    const gamesWon = games.filter(g => g.completed && g.accuracy >= 70).length;
    const achievementsCount = achievements.length;

    // Calculate points (custom scoring system)
    const totalPoints = 
      (totalStoriesRead * 10) +
      (Math.floor(totalReadingTime / 60) * 1) + // 1 point per minute
      (gamesWon * 5) +
      (achievementsCount * 20) +
      (averageWPM * 0.1) +
      (averageAccuracy * 0.1);

    // Update or create leaderboard entry
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { userId, period: 'alltime' },
      {
        userId,
        userName: user.name,
        userRole: user.role,
        totalPoints: Math.round(totalPoints),
        totalReadingTime,
        totalStoriesRead,
        averageWPM,
        averageAccuracy,
        gamesPlayed,
        gamesWon,
        achievementsCount,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return leaderboard;

  } catch (error) {
    console.error('Leaderboard update error:', error);
    return null;
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { period = 'alltime', limit = 50, skip = 0, sortBy = 'totalPoints' } = req.query;

    const sortOptions = {};
    sortOptions[sortBy] = -1; // Descending

    const leaderboard = await Leaderboard.find({ period })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('userId', 'name email avatar');

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: parseInt(skip) + index + 1
    }));

    const total = await Leaderboard.countDocuments({ period });

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      period
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's leaderboard position
const getUserRank = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const { period = 'alltime', sortBy = 'totalPoints' } = req.query;

    const userEntry = await Leaderboard.findOne({ userId, period });
    if (!userEntry) {
      return res.json({
        success: true,
        rank: null,
        message: 'User not found on leaderboard'
      });
    }

    const sortOptions = {};
    sortOptions[sortBy] = -1;

    const entriesAbove = await Leaderboard.countDocuments({
      period,
      [sortBy]: { $gt: userEntry[sortBy] }
    });

    const rank = entriesAbove + 1;

    res.json({
      success: true,
      rank,
      entry: userEntry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  updateLeaderboard,
  getLeaderboard,
  getUserRank
};
