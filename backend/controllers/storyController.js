// backend/controllers/storyController.js
// Stories Storage Controller

const Story = require('../models/Story');
const StoryProgress = require('../models/StoryProgress');
const ReadingProgress = require('../models/ReadingProgress');

// Create story
const createStory = async (req, res) => {
  try {
    const { title, content, language, difficulty, category, tags, coverImage, assignedTo } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      });
    }

    const wordCount = content.split(/\s+/).length;
    const estimatedReadingTime = Math.ceil(wordCount / 200); // Assuming 200 WPM average

    const story = new Story({
      title,
      content,
      language: language || 'en',
      difficulty: difficulty || 'beginner',
      category: category || 'general',
      tags: tags || [],
      coverImage: coverImage || null,
      wordCount,
      readingTime: estimatedReadingTime,
      assignedBy: req.userId,
      assignedTo: assignedTo || [],
      isPublished: true,
      isPublic: true
    });

    await story.save();

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      story
    });

  } catch (error) {
    console.error('Story creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create story'
    });
  }
};

// Get all stories
const getStories = async (req, res) => {
  try {
    const { language, difficulty, category, search, limit = 20, skip = 0 } = req.query;
    const userId = req.userId;

    const query = {
      isPublished: true,
      $or: [
        { isPublic: true },
        { assignedTo: userId }
      ]
    };

    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const stories = await Story.find(query)
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      stories,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single story
const getStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.userId;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found'
      });
    }

    // Check if user has access
    if (!story.isPublic && !story.assignedTo.includes(userId)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get user's progress for this story
    const progress = await StoryProgress.findOne({ userId, storyId });

    res.json({
      success: true,
      story,
      progress: progress || null
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Save story reading progress
const saveStoryProgress = async (req, res) => {
  try {
    const { storyId, wpm, accuracy, readingTimeSec, difficultWords } = req.body;
    const userId = req.userId;

    if (!storyId) {
      return res.status(400).json({
        success: false,
        error: 'Story ID is required'
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        error: 'Story not found'
      });
    }

    // Update or create story progress
    let storyProgress = await StoryProgress.findOne({ userId, storyId });

    if (!storyProgress) {
      storyProgress = new StoryProgress({
        userId,
        storyId,
        storyTitle: story.title,
        firstRead: new Date(),
        timesRead: 1,
        totalDuration: readingTimeSec || 0,
        averageWPM: wpm || 0,
        bestWPM: wpm || 0,
        averageAccuracy: accuracy || 0,
        bestAccuracy: accuracy || 0,
        difficultWords: (difficultWords || []).map(word => ({
          word,
          occurrences: 1,
          firstEncountered: new Date(),
          lastEncountered: new Date()
        })),
        completed: true,
        completedAt: new Date()
      });
    } else {
      storyProgress.timesRead += 1;
      storyProgress.lastRead = new Date();
      storyProgress.totalDuration += readingTimeSec || 0;
      
      // Update averages
      const totalSessions = storyProgress.timesRead;
      storyProgress.averageWPM = ((storyProgress.averageWPM * (totalSessions - 1)) + (wpm || 0)) / totalSessions;
      storyProgress.averageAccuracy = ((storyProgress.averageAccuracy * (totalSessions - 1)) + (accuracy || 0)) / totalSessions;
      
      // Update bests
      if (wpm > storyProgress.bestWPM) storyProgress.bestWPM = wpm;
      if (accuracy > storyProgress.bestAccuracy) storyProgress.bestAccuracy = accuracy;

      // Update difficult words
      if (difficultWords && difficultWords.length > 0) {
        difficultWords.forEach(word => {
          const existing = storyProgress.difficultWords.find(dw => dw.word === word);
          if (existing) {
            existing.occurrences += 1;
            existing.lastEncountered = new Date();
          } else {
            storyProgress.difficultWords.push({
              word,
              occurrences: 1,
              firstEncountered: new Date(),
              lastEncountered: new Date()
            });
          }
        });
      }

      storyProgress.completed = true;
      storyProgress.completedAt = new Date();
    }

    await storyProgress.save();

    // Save reading progress session
    const readingProgress = new ReadingProgress({
      userId,
      sessionType: 'story',
      storyId,
      storyTitle: story.title,
      content: story.content,
      contentLength: story.content.length,
      wpm: wpm || 0,
      accuracy: accuracy || 0,
      readingTimeSec: readingTimeSec || 0,
      difficultWords: (difficultWords || []).map(word => ({
        word,
        count: 1,
        timestamp: new Date()
      })),
      language: story.language,
      completed: true,
      completedAt: new Date()
    });

    await readingProgress.save();

    res.json({
      success: true,
      message: 'Story progress saved successfully',
      progress: storyProgress
    });

  } catch (error) {
    console.error('Story progress save error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save story progress'
    });
  }
};

// Get user's story progress
const getUserStoryProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    const progress = await StoryProgress.find({ userId })
      .populate('storyId', 'title content difficulty category')
      .sort({ lastRead: -1 });

    res.json({
      success: true,
      progress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createStory,
  getStories,
  getStory,
  saveStoryProgress,
  getUserStoryProgress
};
