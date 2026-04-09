// backend/controllers/feedbackController.js

const Feedback = require('../models/Feedback');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const submitFeedback = async (req, res) => {
  try {
    const { rating, feedbackType, feedbackText, name, email } = req.body;

    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be a whole number from 1 to 5.',
      });
    }

    const allowedTypes = ['bug', 'feature', 'improvement', 'general'];
    if (!feedbackType || !allowedTypes.includes(String(feedbackType))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid feedback type.',
      });
    }

    const text = typeof feedbackText === 'string' ? feedbackText.trim() : '';
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Feedback text is required.',
      });
    }
    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Feedback text is too long (max 5000 characters).',
      });
    }

    const nameStr = typeof name === 'string' ? name.trim().slice(0, 200) : '';
    let emailStr = typeof email === 'string' ? email.trim().toLowerCase().slice(0, 320) : '';
    if (emailStr && !EMAIL_RE.test(emailStr)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.',
      });
    }

    const userAgent = (req.get('user-agent') || '').slice(0, 500);

    const doc = await Feedback.create({
      rating: r,
      feedbackType: String(feedbackType),
      feedbackText: text,
      name: nameStr,
      email: emailStr,
      userAgent,
    });

    res.status(201).json({
      success: true,
      id: doc._id,
      message: 'Thank you — your feedback was saved.',
    });
  } catch (err) {
    console.error('submitFeedback:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Could not save feedback.',
    });
  }
};

module.exports = {
  submitFeedback,
};
