// backend/models/Achievement.js
// Achievements and Badges Model

const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  achievementType: {
    type: String,
    enum: [
      'first_read',
      'speed_reader',
      'accuracy_master',
      'story_completer',
      'word_learner',
      'daily_streak',
      'week_streak',
      'month_streak',
      'phonology_champion',
      'lexiai_explorer',
      'ocr_master',
      'reading_marathon',
      'perfect_session',
      'improvement_star'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  // Achievement metrics
  value: {
    type: Number, // e.g., WPM achieved, stories completed, etc.
    default: 0
  },
  // Achievement metadata
  unlockedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Additional data
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ userId: 1, unlockedAt: -1 });
achievementSchema.index({ userId: 1, achievementType: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);
