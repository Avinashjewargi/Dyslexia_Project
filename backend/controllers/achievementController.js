// backend/controllers/achievementController.js
// Achievements Controller

const Achievement = require('../models/Achievement');
const ReadingProgress = require('../models/ReadingProgress');
const StoryProgress = require('../models/StoryProgress');
const PhonologyGame = require('../models/PhonologyGame');

// Helper to create or get an achievement record
const createAchievement = async ({ userId, achievementType, title, description, icon, value, metadata }) => {
  const existing = await Achievement.findOne({ userId, achievementType });
  if (existing) return existing;

  const ach = new Achievement({
    userId,
    achievementType,
    title,
    description: description || '',
    icon: icon || '🏆',
    value: value || 0,
    metadata: metadata || {},
    unlockedAt: new Date()
  });

  await ach.save();
  return ach;
};

// Get user achievements
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    const achievements = await Achievement.find({ userId })
      .sort({ unlockedAt: -1 });

    res.json({
      success: true,
      achievements,
      count: achievements.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Unlock achievement (HTTP endpoint)
const unlockAchievement = async (req, res) => {
  try {
    const { userId, achievementType, title, description, icon, value, metadata } = req.body;

    if (!userId || !achievementType || !title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Check if achievement already exists
    const existing = await Achievement.findOne({ userId, achievementType });
    if (existing) {
      return res.json({
        success: true,
        message: 'Achievement already unlocked',
        achievement: existing
      });
    }

    const achievement = new Achievement({
      userId,
      achievementType,
      title,
      description: description || '',
      icon: icon || '🏆',
      value: value || 0,
      metadata: metadata || {},
      unlockedAt: new Date()
    });

    await achievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement unlocked!',
      achievement
    });

  } catch (error) {
    console.error('Achievement unlock error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to unlock achievement'
    });
  }
};

// Check and award achievements (called after activities)
const checkAchievements = async (userId) => {
  try {
    const achievements = [];

    // Get user stats
    const readingSessions = await ReadingProgress.countDocuments({ userId });
    const storiesRead = await StoryProgress.countDocuments({ userId });
    const gamesPlayed = await PhonologyGame.countDocuments({ userId });

    // First Read Achievement
    if (readingSessions === 1) {
      const exists = await Achievement.findOne({ userId, achievementType: 'first_read' });
      if (!exists) {
        achievements.push({
          userId,
          achievementType: 'first_read',
          title: 'First Steps',
          description: 'Completed your first reading session!',
          icon: '🌟'
        });
      }
    }

    // Story Completer
    if (storiesRead >= 5) {
      const exists = await Achievement.findOne({ userId, achievementType: 'story_completer' });
      if (!exists) {
        achievements.push({
          userId,
          achievementType: 'story_completer',
          title: 'Story Explorer',
          description: 'Read 5 stories!',
          icon: '📚',
          value: storiesRead
        });
      }
    }

    // Phonology Champion
    if (gamesPlayed >= 10) {
      const exists = await Achievement.findOne({ userId, achievementType: 'phonology_champion' });
      if (!exists) {
        achievements.push({
          userId,
          achievementType: 'phonology_champion',
          title: 'Phonology Champion',
          description: 'Played 10 phonology games!',
          icon: '🎮',
          value: gamesPlayed
        });
      }
    }

    // Save achievements
    const created = [];
    for (const ach of achievements) {
      const saved = await createAchievement(ach);
      if (saved) created.push(saved);
    }

    return created;

  } catch (error) {
    console.error('Achievement check error:', error);
    return [];
  }
};

module.exports = {
  getUserAchievements,
  unlockAchievement,
  checkAchievements
};
