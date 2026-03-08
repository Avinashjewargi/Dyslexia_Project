// backend/controllers/ocrController.js
// OCR Upload Storage Controller

const OCRUpload = require('../models/OCRUpload');
const ReadingProgress = require('../models/ReadingProgress');

// Save OCR upload
const saveOCRUpload = async (req, res) => {
  try {
    const { userId, imageUrl, imagePath, extractedText, language, script, confidence, wordCount, processingTime, metadata } = req.body;

    if (!userId || !extractedText) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and extractedText'
      });
    }

    const ocrUpload = new OCRUpload({
      userId,
      imageUrl: imageUrl || null,
      imagePath: imagePath || null,
      extractedText,
      language: language || 'en',
      script: script || 'Latin',
      confidence: confidence || 0,
      wordCount: wordCount || 0,
      processingTime: processingTime || 0,
      metadata: metadata || {}
    });

    await ocrUpload.save();

    // Also save as reading progress
    const readingProgress = new ReadingProgress({
      userId,
      sessionType: 'ocr',
      content: extractedText,
      contentLength: extractedText.length,
      language: language || 'en',
      completed: true,
      completedAt: new Date()
    });

    await readingProgress.save();

    res.status(201).json({
      success: true,
      message: 'OCR upload saved successfully',
      ocrUpload: {
        id: ocrUpload._id,
        extractedText: ocrUpload.extractedText,
        language: ocrUpload.language,
        wordCount: ocrUpload.wordCount,
        createdAt: ocrUpload.createdAt
      }
    });

  } catch (error) {
    console.error('OCR save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save OCR upload'
    });
  }
};

// Get user's OCR uploads
const getUserOCRUploads = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const uploads = await OCRUpload.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('-extractedText'); // Don't send full text in list

    const total = await OCRUpload.countDocuments({ userId });

    res.json({
      success: true,
      uploads,
      total,
      limit,
      skip
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get specific OCR upload
const getOCRUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const userId = req.params.userId || req.userId;

    const upload = await OCRUpload.findOne({ _id: uploadId, userId });

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: 'OCR upload not found'
      });
    }

    res.json({
      success: true,
      upload
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete OCR upload
const deleteOCRUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const userId = req.userId;

    const upload = await OCRUpload.findOneAndDelete({ _id: uploadId, userId });

    if (!upload) {
      return res.status(404).json({
        success: false,
        error: 'OCR upload not found'
      });
    }

    res.json({
      success: true,
      message: 'OCR upload deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  saveOCRUpload,
  getUserOCRUploads,
  getOCRUpload,
  deleteOCRUpload
};
