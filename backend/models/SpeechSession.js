// backend/models/SpeechSession.js
// Text-to-Speech and Speech-to-Text Sessions Model

const mongoose = require('mongoose');

const speechSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['text_to_speech', 'speech_to_text'],
    required: true
  },
  // Text-to-Speech fields
  textContent: {
    type: String,
    default: null
  },
  audioUrl: {
    type: String,
    default: null
  },
  audioPath: {
    type: String,
    default: null
  },
  speechRate: {
    type: Number,
    default: 1.0
  },
  voice: {
    type: String,
    default: 'default'
  },
  // Speech-to-Text fields
  spokenText: {
    type: String,
    default: null
  },
  expectedText: {
    type: String,
    default: null
  },
  accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Language
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn']
  },
  // Session metadata
  duration: {
    type: Number, // in seconds
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

// Indexes
speechSessionSchema.index({ userId: 1, createdAt: -1 });
speechSessionSchema.index({ userId: 1, sessionType: 1 });

module.exports = mongoose.model('SpeechSession', speechSessionSchema);
