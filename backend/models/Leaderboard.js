// backend/models/Leaderboard.js
// Leaderboard Model for Rankings

const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  // Points and scores
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  // Reading metrics
  totalReadingTime: {
    type: Number, // in seconds
    default: 0
  },
  totalStoriesRead: {
    type: Number,
    default: 0
  },
  averageWPM: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  // Game metrics
  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesWon: {
    type: Number,
    default: 0
  },
  // Achievements
  achievementsCount: {
    type: Number,
    default: 0
  },
  // Streaks
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  // Rankings (calculated fields)
  rank: {
    type: Number,
    default: 0
  },
  // Period tracking
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'alltime'],
    default: 'alltime',
    index: true
  },
  periodStart: {
    type: Date,
    default: Date.now
  },
  periodEnd: {
    type: Date,
    default: null
  },
  // Last updated
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for leaderboard queries
leaderboardSchema.index({ period: 1, totalPoints: -1 });
leaderboardSchema.index({ period: 1, averageWPM: -1 });
leaderboardSchema.index({ userId: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
