// backend/models/StoryProgress.js
// Individual Story Progress Tracking Model

const mongoose = require('mongoose');

const storyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
    index: true
  },
  storyTitle: {
    type: String,
    required: true
  },
  // Progress tracking
  firstRead: {
    type: Date,
    default: Date.now
  },
  lastRead: {
    type: Date,
    default: Date.now
  },
  timesRead: {
    type: Number,
    default: 1,
    min: 0
  },
  // Reading metrics
  totalDuration: {
    type: Number, // Total reading time in seconds
    default: 0
  },
  averageWPM: {
    type: Number,
    default: 0
  },
  bestWPM: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  // Difficult words for this story
  difficultWords: [{
    word: String,
    occurrences: { type: Number, default: 1 },
    firstEncountered: { type: Date, default: Date.now },
    lastEncountered: { type: Date, default: Date.now }
  }],
  // Completion status
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Progress percentage (if story has chapters/sections)
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique user-story combination
storyProgressSchema.index({ userId: 1, storyId: 1 }, { unique: true });
storyProgressSchema.index({ userId: 1, lastRead: -1 });

module.exports = mongoose.model('StoryProgress', storyProgressSchema);
