// backend/models/ReadingProgress.js
// Reading Progress and Session Tracking Model

const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['ocr', 'story', 'custom', 'phonology', 'lexiai'],
    default: 'custom'
  },
  // Story-related fields
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    default: null
  },
  storyTitle: {
    type: String,
    default: null
  },
  // Content fields
  content: {
    type: String,
    required: true
  },
  contentLength: {
    type: Number,
    default: 0
  },
  // Reading metrics
  wpm: {
    type: Number, // Words per minute
    default: 0
  },
  accuracy: {
    type: Number, // Percentage (0-100)
    default: 0,
    min: 0,
    max: 100
  },
  readingTimeSec: {
    type: Number,
    default: 0
  },
  // Difficult words tracking
  difficultWords: [{
    word: String,
    count: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
  }],
  // Language
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn']
  },
  // Session metadata
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Additional metrics
  pauses: {
    type: Number,
    default: 0
  },
  errors: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
readingProgressSchema.index({ userId: 1, createdAt: -1 });
readingProgressSchema.index({ userId: 1, storyId: 1 });
readingProgressSchema.index({ sessionType: 1 });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
