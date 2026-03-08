// backend/models/LexiAISession.js
// LexiAI Interactive Learning Sessions Model

const mongoose = require('mongoose');

const lexiAISessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cardType: {
    type: String,
    required: true,
    enum: [
      'alphabet',
      'numbers',
      'colors',
      'animals',
      'fruits',
      'vegetables',
      'shapes',
      'weather',
      'time',
      'emotions',
      'body',
      'clothes',
      'vehicles',
      'nature',
      'safety',
      'sight_words',
      'phonics',
      'rhymes',
      'patterns',
      'directions',
      'signs',
      'sizes',
      'birds',
      'insects'
    ]
  },
  cardTitle: {
    type: String,
    required: true
  },
  // Session metrics
  interactions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Time tracking
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  // Learning progress
  wordsLearned: [{
    word: String,
    timesPracticed: { type: Number, default: 1 },
    mastered: { type: Boolean, default: false }
  }],
  // Session status
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
lexiAISessionSchema.index({ userId: 1, createdAt: -1 });
lexiAISessionSchema.index({ userId: 1, cardType: 1 });

module.exports = mongoose.model('LexiAISession', lexiAISessionSchema);
