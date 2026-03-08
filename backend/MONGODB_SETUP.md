# MongoDB Setup and Usage Guide

## 📋 Overview

This document provides complete instructions for setting up and using MongoDB with the Dyslexia Learning Application.

## 🚀 Installation

### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
- Run the installer and follow the setup wizard
- MongoDB will be installed as a Windows service

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. Install Node.js Dependencies

```bash
cd backend
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### 3. Configure MongoDB Connection

The default connection string is: `mongodb://localhost:27017/dyslexia_learning`

To use a custom MongoDB URI, set the environment variable:
```bash
# Windows
set MONGODB_URI=mongodb://localhost:27017/dyslexia_learning

# Linux/macOS
export MONGODB_URI=mongodb://localhost:27017/dyslexia_learning
```

For MongoDB Atlas (cloud), use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dyslexia_learning
```

## 📊 Database Models

### 1. **User Model** (`models/User.js`)
Stores user accounts (students, teachers, admins)

**Fields:**
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `role` - 'student', 'teacher', or 'admin'
- `studentId` - Student ID (for students)
- `teacherCode` - Teacher code (for teachers)
- `grade` - Student grade level
- `teacherId` - Reference to teacher (for students)
- `settings` - User preferences (font size, color coding, etc.)
- `language` - Preferred language ('en', 'hi', 'kn')

### 2. **OCRUpload Model** (`models/OCRUpload.js`)
Stores OCR image uploads and extracted text

**Fields:**
- `userId` - Reference to User
- `imageUrl` - URL of uploaded image
- `imagePath` - File system path
- `extractedText` - Text extracted from image
- `language` - Detected language
- `confidence` - OCR confidence score
- `wordCount` - Number of words extracted
- `processingTime` - Time taken to process

### 3. **Story Model** (`models/Story.js`)
Stores reading stories

**Fields:**
- `title` - Story title
- `content` - Story text content
- `language` - Story language
- `difficulty` - 'beginner', 'intermediate', 'advanced'
- `category` - Story category
- `wordCount` - Total word count
- `readingTime` - Estimated reading time
- `assignedBy` - Teacher who assigned it
- `assignedTo` - Students assigned to read

### 4. **ReadingProgress Model** (`models/ReadingProgress.js`)
Tracks reading sessions

**Fields:**
- `userId` - Reference to User
- `sessionType` - 'ocr', 'story', 'custom', 'phonology', 'lexiai'
- `storyId` - Reference to Story (if applicable)
- `content` - Text content read
- `wpm` - Words per minute
- `accuracy` - Reading accuracy percentage
- `readingTimeSec` - Time spent reading
- `difficultWords` - Array of difficult words encountered
- `language` - Language of content

### 5. **StoryProgress Model** (`models/StoryProgress.js`)
Tracks individual story reading progress

**Fields:**
- `userId` - Reference to User
- `storyId` - Reference to Story
- `timesRead` - Number of times story was read
- `totalDuration` - Total reading time
- `averageWPM` - Average words per minute
- `bestWPM` - Best WPM achieved
- `averageAccuracy` - Average accuracy
- `bestAccuracy` - Best accuracy achieved
- `difficultWords` - Words that were difficult

### 6. **Achievement Model** (`models/Achievement.js`)
Stores user achievements and badges

**Fields:**
- `userId` - Reference to User
- `achievementType` - Type of achievement
- `title` - Achievement title
- `description` - Achievement description
- `icon` - Emoji icon
- `value` - Achievement value/metric
- `unlockedAt` - When achievement was unlocked

### 7. **PhonologyGame Model** (`models/PhonologyGame.js`)
Stores phonology game sessions

**Fields:**
- `userId` - Reference to User
- `gameType` - 'spelling_test', 'letter_replacement', 'odd_one_out'
- `score` - Game score
- `totalQuestions` - Total questions
- `correctAnswers` - Correct answers count
- `accuracy` - Accuracy percentage
- `timeTaken` - Time taken in seconds
- `difficulty` - 'easy', 'medium', 'hard'
- `questions` - Array of questions and answers

### 8. **LexiAISession Model** (`models/LexiAISession.js`)
Stores LexiAI interactive learning sessions

**Fields:**
- `userId` - Reference to User
- `cardType` - Type of learning card
- `cardTitle` - Card title
- `interactions` - Number of interactions
- `correctAnswers` - Correct answers count
- `accuracy` - Accuracy percentage
- `timeSpent` - Time spent in seconds
- `wordsLearned` - Array of words learned

### 9. **SpeechSession Model** (`models/SpeechSession.js`)
Stores Text-to-Speech and Speech-to-Text sessions

**Fields:**
- `userId` - Reference to User
- `sessionType` - 'text_to_speech' or 'speech_to_text'
- `textContent` - Text content (for TTS)
- `audioUrl` - Audio file URL
- `spokenText` - Spoken text (for STT)
- `expectedText` - Expected text (for STT)
- `accuracy` - Accuracy percentage (for STT)
- `speechRate` - Speech rate
- `language` - Language used

### 10. **Leaderboard Model** (`models/Leaderboard.js`)
Stores leaderboard rankings

**Fields:**
- `userId` - Reference to User
- `userName` - User's name
- `totalPoints` - Total points
- `totalReadingTime` - Total reading time
- `totalStoriesRead` - Stories read count
- `averageWPM` - Average words per minute
- `averageAccuracy` - Average accuracy
- `gamesPlayed` - Games played count
- `achievementsCount` - Achievements count
- `rank` - Current rank
- `period` - 'daily', 'weekly', 'monthly', 'alltime'

### 11. **ColorCoding Model** (`models/ColorCoding.js`)
Stores color coding preferences

**Fields:**
- `userId` - Reference to User
- `enabled` - Whether color coding is enabled
- `colorScheme` - Color scheme type
- `letterColors` - Color mappings for letters (b, d, p, q)
- `timesUsed` - Usage count
- `customColors` - Custom color settings

## 🔐 Authentication API

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student",
  "studentId": "STU001",
  "grade": "5"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## 💾 Storage API Endpoints

All storage endpoints require authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### OCR Storage

**Save OCR Upload:**
```http
POST /api/storage/ocr
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "imageUrl": "url_to_image",
  "imagePath": "path_to_image",
  "extractedText": "Text extracted from image",
  "language": "en",
  "confidence": 0.95,
  "wordCount": 100
}
```

**Get User OCR Uploads:**
```http
GET /api/storage/ocr/:userId?limit=20&skip=0
Authorization: Bearer <token>
```

### Story Storage

**Create Story:**
```http
POST /api/storage/stories
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Magic Forest",
  "content": "Once upon a time...",
  "language": "en",
  "difficulty": "beginner",
  "category": "adventure"
}
```

**Get Stories:**
```http
GET /api/storage/stories?language=en&difficulty=beginner&limit=20
Authorization: Bearer <token>
```

**Save Story Progress:**
```http
POST /api/storage/stories/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "storyId": "story_id",
  "wpm": 120,
  "accuracy": 85,
  "readingTimeSec": 300,
  "difficultWords": ["forest", "magic"]
}
```

### Reading Progress

**Save Reading Progress:**
```http
POST /api/storage/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionType": "custom",
  "content": "Text content here",
  "wpm": 100,
  "accuracy": 80,
  "readingTimeSec": 180,
  "difficultWords": ["word1", "word2"],
  "language": "en"
}
```

**Get User Progress:**
```http
GET /api/storage/progress/:userId?sessionType=story&limit=50
Authorization: Bearer <token>
```

**Get Analytics:**
```http
GET /api/storage/progress/:userId/analytics
Authorization: Bearer <token>
```

### Achievements

**Get User Achievements:**
```http
GET /api/storage/achievements/:userId
Authorization: Bearer <token>
```

**Unlock Achievement:**
```http
POST /api/storage/achievements/unlock
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_id",
  "achievementType": "first_read",
  "title": "First Steps",
  "description": "Completed first reading session",
  "icon": "🌟"
}
```

### Phonology Games

**Save Game Session:**
```http
POST /api/storage/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "gameType": "spelling_test",
  "gameTitle": "Spelling Challenge",
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "accuracy": 80,
  "timeTaken": 120,
  "difficulty": "medium"
}
```

**Get User Games:**
```http
GET /api/storage/games/:userId?gameType=spelling_test&limit=50
Authorization: Bearer <token>
```

### LexiAI Sessions

**Save LexiAI Session:**
```http
POST /api/storage/lexiai
Authorization: Bearer <token>
Content-Type: application/json

{
  "cardType": "animals",
  "cardTitle": "Animal Explorer",
  "interactions": 20,
  "correctAnswers": 18,
  "totalQuestions": 20,
  "accuracy": 90,
  "timeSpent": 300
}
```

### Speech Sessions (TTS/STT)

**Save Speech Session:**
```http
POST /api/storage/speech
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionType": "text_to_speech",
  "textContent": "Hello world",
  "audioUrl": "url_to_audio",
  "speechRate": 1.0,
  "language": "en"
}
```

### Leaderboard

**Get Leaderboard:**
```http
GET /api/storage/leaderboard?period=alltime&sortBy=totalPoints&limit=50
Authorization: Bearer <token>
```

**Get User Rank:**
```http
GET /api/storage/leaderboard/rank/:userId?period=alltime
Authorization: Bearer <token>
```

## 🔄 Migration from File Storage

The application previously stored data in JSON files. To migrate existing data:

1. **Reading Sessions:** Data in `backend/data/reading-sessions/` can be imported
2. **User Data:** Create users through the registration API
3. **Stories:** Import stories through the story creation API

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/dyslexia_learning
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

## 🧪 Testing

### Test MongoDB Connection
```bash
# Start MongoDB (if not running as service)
mongod

# Start backend server
cd backend
npm run dev
```

Check console for: `✅ MongoDB Connected`

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "student"
  }'
```

## 🛠️ Troubleshooting

### MongoDB Not Starting
- Check if MongoDB service is running
- Verify MongoDB is installed: `mongod --version`
- Check MongoDB logs for errors

### Connection Errors
- Verify MongoDB URI is correct
- Check if MongoDB is listening on port 27017
- Ensure firewall allows MongoDB connections

### Authentication Errors
- Verify JWT_SECRET is set
- Check token expiration (default: 30 days)
- Ensure token is included in Authorization header

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Authentication](https://jwt.io/)

## ✅ Features Covered

- ✅ User Authentication (Login/Register)
- ✅ OCR Image Uploads Storage
- ✅ Stories Management
- ✅ Reading Progress Tracking
- ✅ Story Progress Tracking
- ✅ Achievements System
- ✅ Phonology Games Storage
- ✅ LexiAI Sessions Storage
- ✅ Speech Sessions (TTS/STT)
- ✅ Leaderboard System
- ✅ Color Coding Preferences
- ✅ Teacher Dashboard Data
- ✅ Student Dashboard Data
- ✅ Progress Analytics
- ✅ Accessibility Settings

All data is now stored in MongoDB with proper relationships, indexes, and validation!
