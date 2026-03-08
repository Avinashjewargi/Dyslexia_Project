// backend/models/Story.js
// Stories Model for Reading Practice

const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Story content is required']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // estimated reading time in minutes
    default: 0
  },
  category: {
    type: String,
    default: 'general'
  },
  tags: [{
    type: String
  }],
  // Story metadata
  author: {
    type: String,
    default: 'System'
  },
  coverImage: {
    type: String,
    default: null
  },
  // Teacher assignment
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Story status
  isPublished: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
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

// Indexes
storySchema.index({ language: 1, difficulty: 1 });
storySchema.index({ assignedTo: 1 });
storySchema.index({ isPublished: 1, isPublic: 1 });

module.exports = mongoose.model('Story', storySchema);
