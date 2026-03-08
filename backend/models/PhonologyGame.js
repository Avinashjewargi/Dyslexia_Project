// backend/models/PhonologyGame.js
// Phonology Games Progress Model

const mongoose = require('mongoose');

const phonologyGameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    enum: ['spelling_test', 'letter_replacement', 'odd_one_out'],
    required: true
  },
  gameTitle: {
    type: String,
    required: true
  },
  // Game results
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
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
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  // Game details
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn']
  },
  // Questions and answers
  questions: [{
    question: String,
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number
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
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes
phonologyGameSchema.index({ userId: 1, createdAt: -1 });
phonologyGameSchema.index({ userId: 1, gameType: 1 });
phonologyGameSchema.index({ userId: 1, difficulty: 1 });

module.exports = mongoose.model('PhonologyGame', phonologyGameSchema);
