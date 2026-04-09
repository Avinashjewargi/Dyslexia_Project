// backend/models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedbackType: {
      type: String,
      required: true,
      enum: ['bug', 'feature', 'improvement', 'general'],
    },
    feedbackText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 320,
      default: '',
    },
    userAgent: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ feedbackType: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
