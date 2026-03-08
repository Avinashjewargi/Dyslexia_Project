# MongoDB Quick Reference Guide

## 🚀 Setup Commands

```bash
# Install dependencies
npm install

# Start MongoDB (if not running as service)
mongod

# Start backend server
npm run dev
```

## 🔑 Authentication Flow

### 1. Register User
```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

### 2. Login
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
// Returns: { token, user }
```

### 3. Use Token
```javascript
// Include in all API requests:
Authorization: Bearer <token>
```

## 📝 Common Operations

### Save OCR Upload
```javascript
POST /api/storage/ocr
Authorization: Bearer <token>
{
  "userId": "user_id",
  "extractedText": "Text from image",
  "language": "en",
  "confidence": 0.95
}
```

### Save Reading Progress
```javascript
POST /api/storage/progress
Authorization: Bearer <token>
{
  "sessionType": "story",
  "storyId": "story_id",
  "content": "Text read",
  "wpm": 120,
  "accuracy": 85,
  "readingTimeSec": 300
}
```

### Save Story Progress
```javascript
POST /api/storage/stories/progress
Authorization: Bearer <token>
{
  "storyId": "story_id",
  "wpm": 120,
  "accuracy": 85,
  "difficultWords": ["word1", "word2"]
}
```

### Save Game Session
```javascript
POST /api/storage/games
Authorization: Bearer <token>
{
  "gameType": "spelling_test",
  "score": 85,
  "accuracy": 80,
  "totalQuestions": 10
}
```

### Get User Progress
```javascript
GET /api/storage/progress/:userId
Authorization: Bearer <token>
```

### Get Analytics
```javascript
GET /api/storage/progress/:userId/analytics
Authorization: Bearer <token>
```

## 📊 Model Relationships

```
User (1) ──→ (N) OCRUpload
User (1) ──→ (N) ReadingProgress
User (1) ──→ (N) StoryProgress
User (1) ──→ (N) Achievement
User (1) ──→ (N) PhonologyGame
User (1) ──→ (N) LexiAISession
User (1) ──→ (N) SpeechSession
User (1) ──→ (1) Leaderboard
User (1) ──→ (1) ColorCoding

Story (1) ──→ (N) StoryProgress
Story (1) ──→ (N) ReadingProgress
```

## 🔍 Common Queries

### Get User's Reading Sessions
```javascript
ReadingProgress.find({ userId }).sort({ createdAt: -1 })
```

### Get User's Story Progress
```javascript
StoryProgress.find({ userId })
  .populate('storyId')
  .sort({ lastRead: -1 })
```

### Get Leaderboard
```javascript
Leaderboard.find({ period: 'alltime' })
  .sort({ totalPoints: -1 })
  .limit(50)
```

### Get User Achievements
```javascript
Achievement.find({ userId })
  .sort({ unlockedAt: -1 })
```

## 🛠️ Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/dyslexia_learning
JWT_SECRET=your-secret-key
PORT=5000
```

## 📦 Models Quick Reference

| Model | Purpose | Key Fields |
|-------|---------|------------|
| User | User accounts | email, password, role, settings |
| OCRUpload | OCR images | extractedText, language, confidence |
| Story | Reading stories | title, content, difficulty, language |
| ReadingProgress | Reading sessions | wpm, accuracy, readingTimeSec |
| StoryProgress | Story progress | timesRead, averageWPM, difficultWords |
| Achievement | Achievements | achievementType, title, unlockedAt |
| PhonologyGame | Game sessions | gameType, score, accuracy |
| LexiAISession | LexiAI sessions | cardType, accuracy, wordsLearned |
| SpeechSession | TTS/STT | sessionType, accuracy, language |
| Leaderboard | Rankings | totalPoints, rank, period |
| ColorCoding | Preferences | enabled, letterColors |

## 🔐 Security Notes

- All routes except `/api/auth/register` and `/api/auth/login` require authentication
- Passwords are hashed with bcrypt
- JWT tokens expire after 30 days
- User passwords are never returned in API responses

## 📈 Performance Tips

- Indexes are already set up on common query fields
- Use pagination (limit/skip) for large result sets
- Populate relationships only when needed
- Use select() to limit returned fields

## 🐛 Troubleshooting

**MongoDB not connecting:**
- Check if MongoDB is running: `mongod --version`
- Verify MONGODB_URI in .env
- Check MongoDB logs

**Authentication failing:**
- Verify token is in Authorization header
- Check token expiration
- Ensure JWT_SECRET matches

**Data not saving:**
- Check required fields
- Verify user authentication
- Check MongoDB connection
- Review server logs

## 📚 Full Documentation

See `MONGODB_SETUP.md` for complete documentation.
