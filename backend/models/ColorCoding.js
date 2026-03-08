// backend/models/ColorCoding.js
// Color Coding Preferences and Usage Model

const mongoose = require('mongoose');

const colorCodingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Color preferences
  enabled: {
    type: Boolean,
    default: true
  },
  colorScheme: {
    type: String,
    enum: ['default', 'high_contrast', 'custom'],
    default: 'default'
  },
  // Letter color mappings
  letterColors: {
    b: { type: String, default: '#0000FF' }, // blue
    d: { type: String, default: '#FF0000' }, // red
    p: { type: String, default: '#00FF00' }, // green
    q: { type: String, default: '#FFA500' }  // orange
  },
  // Usage statistics
  timesUsed: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  // Custom colors (if user wants to customize)
  customColors: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

// Index
colorCodingSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('ColorCoding', colorCodingSchema);
