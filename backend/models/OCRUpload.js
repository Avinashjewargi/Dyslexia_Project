// backend/models/OCRUpload.js
// OCR Image Upload Model

const mongoose = require('mongoose');

const ocrUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'kn']
  },
  script: {
    type: String,
    default: 'Latin'
  },
  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },
  wordCount: {
    type: Number,
    default: 0
  },
  processingTime: {
    type: Number,
    default: 0 // in milliseconds
  },
  metadata: {
    originalFilename: String,
    fileSize: Number,
    mimeType: String,
    dimensions: {
      width: Number,
      height: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
ocrUploadSchema.index({ userId: 1, createdAt: -1 });
ocrUploadSchema.index({ language: 1 });

module.exports = mongoose.model('OCRUpload', ocrUploadSchema);
