# 📚 Adaptive Reading Assistant for Dyslexia

> **Empowering students with dyslexia through AI-powered reading tools, personalized learning, and engaging gamification.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb)](https://mongodb.com/)

---

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

The **Adaptive Reading Assistant** is a comprehensive web application designed to help students with dyslexia improve their reading skills through:

- **🔊 Text-to-Speech (TTS)** - Natural voice reading with adjustable speed and multi-language support
- **🎤 Speech-to-Text (STT)** - Real-time pronunciation feedback and accuracy tracking
- **📸 OCR Technology** - Extract text from images instantly (English, Hindi, Kannada)
- **🎨 Color Coding** - Visual aids for confusing letter pairs (b/d/p/q)
- **🏆 Gamification** - Points, badges, achievements, and leaderboards for motivation
- **📊 Progress Tracking** - Detailed analytics for students and teachers with MongoDB storage
- **🤖 LexiAI** - Interactive learning with 24 specialized card types
- **🎮 Phonology Games** - Spelling tests, letter replacement, odd-one-out challenges
- **📖 Pre-loaded Stories** - Curated dyslexia-friendly stories with progress tracking
- **🌐 Multi-language Support** - English, Hindi, and Kannada with translation features
- **🔐 User Authentication** - Secure login system with role-based access (Student/Teacher/Admin)
- **♿ Accessibility** - OpenDyslexic font, adjustable sizes, high contrast modes

---

## ✅ Current Status (April 2026)

**🎉 Fully Functional Production-Ready Application**

The Adaptive Reading Assistant is a complete, end-to-end solution with:

- **🔐 Secure user authentication** with role-based access control
- **💾 Persistent data storage** using MongoDB with 11 comprehensive models
- **🌐 Multi-language support** for English, Hindi, and Kannada
- **🤖 AI-powered features** including OCR, TTS, STT, and text analysis
- **📊 Advanced analytics** with interactive dashboards and progress tracking
- **🎮 Complete gamification** system with achievements and leaderboards
- **📱 Responsive design** optimized for desktop and mobile devices

**All major features are implemented and working.** The application successfully combines modern web technologies with machine learning to provide a comprehensive dyslexia support platform.

---

### For Students

| Feature | Description |
|---------|-------------|
| **Smart OCR Upload** | Upload images of textbooks, worksheets, or any printed text (English, Hindi, Kannada) |
| **Adaptive Reading Interface** | Color-coded letters, dyslexia-friendly fonts, adjustable spacing |
| **Interactive Learning** | Click words to hear pronunciation, see syllable breakdowns |
| **Pronunciation Practice** | Speak words aloud and get instant feedback via STT with accuracy tracking |
| **LexiAI Interactive Learning** | 24 specialized learning card types covering alphabet, numbers, colors, animals, and more |
| **Gamification System** | Earn points, unlock achievements, climb leaderboards with MongoDB persistence |
| **Progress Dashboard** | Track reading speed (WPM), accuracy, and improvement over time with detailed analytics |
| **Pre-loaded Stories** | Practice with curated dyslexia-friendly stories with individual progress tracking |
| **Phonology Games** | Spelling tests, letter replacement, odd-one-out challenges with score tracking |
| **Multi-language Support** | Full support for English, Hindi, and Kannada with translation features |
| **User Authentication** | Secure login system with personalized profiles and settings |

### For Teachers

| Feature | Description |
|---------|-------------|
| **Class Overview** | Monitor overall class performance at a glance with real-time statistics |
| **Student Tracking** | View individual progress, reading speed, and accuracy for each student |
| **Identify Struggles** | Red flags for students who need extra support with detailed analytics |
| **Assign Content** | Share stories and exercises with students through the system |
| **Analytics Dashboard** | Beautiful charts showing trends and improvements using Recharts |
| **Export Reports** | Generate progress reports for parent-teacher meetings |
| **Achievement Monitoring** | Track student achievements and gamification progress |
| **Game Statistics** | Monitor phonology game performance and LexiAI learning progress |
| **Multi-language Oversight** | Support students learning in English, Hindi, and Kannada |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.1.1 with Vite
- **UI Library:** React Bootstrap 5.3.8
- **Icons:** Lucide React 0.554.0
- **Charts:** Recharts 3.7.0
- **Routing:** React Router DOM 7.13.0
- **State Management:** React Context API
- **Internationalization:** i18next 25.8.0
- **Styling:** CSS3, Bootstrap, Custom CSS

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB 8.x with Mongoose 8.23.0
- **Authentication:** JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **File Upload:** Multer 2.0.2
- **CORS:** cors 2.8.5
- **API Architecture:** RESTful

### Machine Learning
- **Language:** Python 3.11
- **NLP:** NLTK
- **OCR:** Tesseract OCR
- **TTS:** gTTS (Google Text-to-Speech)
- **Web Framework:** Flask with Flask-CORS
- **Supported Languages:** English, Hindi, Kannada

### Additional Tools
- **Version Control:** Git
- **Package Manager:** npm, pip
- **Development:** Nodemon, Vite HMR

---

## 📁 Project Structure

```
Dyslexia_Project/
│
├── 📂 frontend/                    # React Application
│   ├── 📂 src/
│   │   ├── App.jsx                # Main app component
│   │   ├── AuthPage.jsx           # User authentication
│   │   ├── LandingPage.jsx        # Homepage with user guides
│   │   └── main.jsx               # Entry point
│   ├── 📂 components/
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── Footer.jsx             # Footer component
│   │   ├── Settings.jsx           # Accessibility settings
│   │   ├── Chatbot.jsx            # AI assistant chatbot
│   │   ├── LanguageSelector.jsx   # Language selection
│   │   └── AccessibilityContext.jsx  # Global settings state
│   ├── 📂 reader/
│   │   ├── ReaderPage.jsx         # Main reading interface
│   │   ├── TextToSpeech.jsx       # TTS controls
│   │   ├── OCRUploader.jsx        # Image upload & text extraction
│   │   ├── ColorCoding.jsx        # Letter color coding
│   │   ├── WordLearning.jsx       # Practice difficult words
│   │   ├── Gamification.jsx       # Points, badges, leaderboard
│   │   └── Pronunciation.jsx      # Speech-to-text practice
│   ├── 📂 dashboard/
│   │   ├── StudentDashboard.jsx   # Student analytics
│   │   └── TeacherDashboard.jsx   # Teacher overview
│   ├── 📂 lexiai/
│   │   ├── LexiAIHub.jsx          # LexiAI main hub
│   │   ├── LearningCard.jsx       # Base learning card component
│   │   └── 📂 cards/              # 24 specialized learning cards
│   │       ├── AlphabetMaster.jsx
│   │       ├── NumbersAndDigits.jsx
│   │       ├── ColorsShades.jsx
│   │       └── ... (21 more cards)
│   ├── 📂 phonology/
│   │   ├── PhonologyHub.jsx       # Games hub
│   │   ├── SpellingTest.jsx       # Spelling practice
│   │   ├── LetterReplacement.jsx  # Letter swap game
│   │   └── OddOneOut.jsx          # Find the different word
│   ├── 📂 stories/
│   │   └── StoriesReader.jsx      # Pre-written stories
│   └── 📂 locales/                 # Internationalization files
│
├── 📂 backend/                     # Node.js Express Server
│   ├── server.js                  # Main server file
│   ├── 📂 config/
│   │   ├── database.js            # MongoDB connection
│   │   └── languageConfig.js      # Language settings
│   ├── 📂 middleware/
│   │   ├── auth.js                # JWT authentication
│   │   └── languageMiddleware.js  # Language handling
│   ├── 📂 models/                 # MongoDB Models (11 models)
│   │   ├── User.js                # User accounts
│   │   ├── OCRUpload.js           # OCR uploads
│   │   ├── Story.js               # Reading stories
│   │   ├── ReadingProgress.js     # Progress tracking
│   │   └── ... (7 more models)
│   ├── 📂 controllers/            # Business logic (8 controllers)
│   │   ├── ocrController.js       # OCR operations
│   │   ├── authController.js      # Authentication
│   │   ├── storyController.js     # Story management
│   │   └── ... (5 more controllers)
│   ├── 📂 routes/                 # API routes
│   │   ├── auth.js                # Authentication routes
│   │   ├── storage.js             # MongoDB storage routes
│   │   ├── ocr.js                 # OCR processing
│   │   ├── speech.js              # TTS/STT routes
│   │   ├── chat.js                # Chatbot routes
│   │   └── ... (5 more route files)
│   ├── 📂 uploads/                # User uploaded files
│   └── 📂 audio_temp/             # Generated audio files
│
├── 📂 ml/                          # Python ML Services
│   ├── api.py                     # Flask ML API server
│   ├── 📂 ocr/
│   │   └── process_text.py        # OCR text extraction
│   ├── 📂 nlp/
│   │   └── reading_analysis.py    # Text difficulty analysis
│   ├── 📂 speech/
│   │   └── recognition.py         # TTS/STT implementation
│   └── 📂 config/
│       └── languageConfig.py      # Language configuration
│
├── 📄 README.md                    # This file
├── 📄 package.json                # Root dependencies
└── 📄 .gitignore                  # Git ignore rules
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **Python** (v3.11 or higher)
- **MongoDB** (v6.x or higher)
- **npm** (comes with Node.js)
- **Git**

### Database Setup

#### Install MongoDB

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Follow the installation wizard
- MongoDB will run as a service automatically

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/Adaptive-Reading-Assistant-for-Dyslexia.git
cd Adaptive-Reading-Assistant-for-Dyslexia-main
```

### Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### Step 3: Backend Setup

```bash
cd ../backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB connection string:
# MONGODB_URI=mongodb://localhost:27017/dyslexia_app
# JWT_SECRET=your_jwt_secret_here

npm run dev
```

**Backend will run on:** `http://localhost:5000`

### Step 4: Python ML Setup

```bash
cd ../ml
python -m venv venv

# Activate virtual environment:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
python api.py
```

**ML API will run on:** `http://localhost:5050`

### Step 5: Install Tesseract OCR (for OCR functionality)

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Add to PATH

**Mac:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt install tesseract-ocr
```

---

## 💻 Usage

### Starting the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start ML Service:**
   ```bash
   cd ml
   python api.py
   ```

4. **Access the App:**
   - Open browser: `http://localhost:5173`
   - Default page shows user guides
   - Navigate to "Reader" to start

### Quick Start Guide

#### For Students:
1. Click **"Reader"** in navigation
2. Upload an image or type text
3. Click **"Accessibility"** to customize font, size, colors
4. Use **Text-to-Speech** to listen
5. Click highlighted words to practice
6. View **Dashboard** to see progress

#### For Teachers:
1. Navigate to **"Dashboards" → "Teacher Dashboard"**
2. View class overview statistics
3. Monitor individual student performance
4. Click **"View Details"** on any student
5. Export reports for parents

---

## 📡 API Documentation

### Backend Endpoints

#### Authentication
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // "student", "teacher", or "admin"
}

POST http://localhost:5000/api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### OCR Upload
```http
POST http://localhost:5000/api/ocr/upload
Content-Type: multipart/form-data

Body:
{
  "image": <file>,
  "language": "en" // "en", "hi", "kn"
}

Response:
{
  "success": true,
  "text": "Extracted text here",
  "confidence": 0.95,
  "language": "en"
}
```

#### Text-to-Speech
```http
POST http://localhost:5000/api/speech/tts
Content-Type: application/json

Body:
{
  "text": "Hello world",
  "language": "en", // "en", "hi", "kn"
  "speed": 1.0
}

Response:
{
  "success": true,
  "audioUrl": "/audio/12345.mp3"
}
```

#### Text Analysis
```http
POST http://localhost:5000/api/ml/analyze
Content-Type: application/json

Body:
{
  "text": "Sample text to analyze"
}

Response:
{
  "success": true,
  "analysis": {
    "language": "en",
    "script": "Latin",
    "reading_level": "Intermediate",
    "difficulty_score": 0.65,
    "challenging_words": ["challenging", "analyze"],
    "statistics": {...}
  }
}
```

#### MongoDB Storage Endpoints

##### Stories
```http
POST http://localhost:5000/api/storage/stories
GET  http://localhost:5000/api/storage/stories
GET  http://localhost:5000/api/storage/stories/:id
```

##### Reading Progress
```http
POST http://localhost:5000/api/storage/progress
GET  http://localhost:5000/api/storage/progress/:userId
GET  http://localhost:5000/api/storage/progress/:userId/analytics
```

##### Achievements
```http
GET  http://localhost:5000/api/storage/achievements/:userId
POST http://localhost:5000/api/storage/achievements/unlock
```

##### Leaderboard
```http
GET http://localhost:5000/api/storage/leaderboard
GET http://localhost:5000/api/storage/leaderboard/rank/:userId
```

##### Phonology Games
```http
POST http://localhost:5000/api/storage/games
GET  http://localhost:5000/api/storage/games/:userId
GET  http://localhost:5000/api/storage/games/:userId/statistics
```

##### LexiAI Sessions
```http
POST http://localhost:5000/api/storage/lexiai
GET  http://localhost:5000/api/storage/lexiai/:userId
```

---

## 📸 Screenshots

### Landing Page
*Modern, attractive homepage with user guides and features*

### Reader Interface
*Main reading area with color coding, TTS controls, and OCR upload*

### Student Dashboard
*Comprehensive analytics with charts showing progress over time*

### Teacher Dashboard
*Class overview with individual student performance tracking*

### Phonology Games
*Interactive spelling tests and word games*

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contact

**Project Developer:** Avinash Jewargi

- 📧 Email: avinashjewargi@gmail.com
- 🌐 GitHub: [@Avinashjewargi](https://github.com/Avinashjewargi)
- 📱 LinkedIn: [Avinash Jewargi](https://linkedin.com/in/avinash-jewargi)
- 🐙 Repository: [Dyslexia_Project](https://github.com/Avinashjewargi/Dyslexia_Project)

---

## 🙏 Acknowledgments

- **Dyslexia Research Community** - Evidence-based practices for dyslexia intervention
- **OpenDyslexic Font** - Created by Abelardo Gonzalez for dyslexia-friendly typography
- **MongoDB** - NoSQL database for scalable data storage and management
- **React Ecosystem** - React, React Router, Bootstrap, Recharts for modern UI development
- **Node.js & Express** - Backend framework for robust API development
- **Python & Flask** - ML service architecture for AI-powered features
- **NLTK & Tesseract OCR** - Natural language processing and optical character recognition
- **gTTS (Google Text-to-Speech)** - High-quality text-to-speech synthesis
- **JWT & bcrypt** - Secure authentication and password hashing
- **Open-source contributors** - Libraries and frameworks that made this project possible

---

## 🔮 Roadmap

### ✅ Version 1.0 (Completed - April 2026)
- [x] **Full-stack web application** with React, Node.js, Python ML
- [x] **MongoDB integration** with 11 models and comprehensive data storage
- [x] **User authentication system** with JWT and role-based access
- [x] **Multi-language OCR support** (English, Hindi, Kannada)
- [x] **Text-to-Speech** with adjustable speed and language support
- [x] **Speech-to-Text** with pronunciation accuracy tracking
- [x] **Color coding system** for dyslexia-friendly reading
- [x] **LexiAI interactive learning** with 24 specialized card types
- [x] **Phonology games** (spelling, letter replacement, odd-one-out)
- [x] **Progress tracking** with detailed analytics and dashboards
- [x] **Achievement system** with badges and gamification
- [x] **Leaderboard functionality** with rankings and statistics
- [x] **Story reading system** with progress tracking
- [x] **Teacher dashboard** for class management and monitoring
- [x] **Student dashboard** with personal analytics
- [x] **Translation features** for multi-language support
- [x] **Accessibility features** (OpenDyslexic font, high contrast, etc.)
- [x] **Responsive design** with Bootstrap and mobile support

### 🚧 Version 1.1 (In Development)
- [ ] **AR/VR Features** - Augmented reality reading assistance (prototype in progress)
- [ ] **Offline mode** - Core features work without internet
- [ ] **Parent portal** - Home monitoring and communication
- [ ] **Advanced analytics** - Machine learning insights for teachers
- [ ] **Custom story creation** - Teacher-generated content tools

### 📋 Version 2.0 (Planned)
- [ ] **Mobile app** (React Native) for iOS and Android
- [ ] **Additional languages** (Spanish, French, German, Arabic)
- [ ] **School integration** - Google Classroom, Canvas LMS integration
- [ ] **Advanced ML models** - Better text analysis and personalization
- [ ] **Voice commands** - Hands-free operation ("Read this", "Next page")
- [ ] **Collaborative features** - Group reading sessions and peer learning

---

## 📊 Project Stats

- **Lines of Code:** ~25,000+
- **Components:** 50+ React components
- **API Endpoints:** 25+ RESTful endpoints
- **Database Models:** 11 MongoDB models
- **Supported Features:** 25+ core features
- **Languages Supported:** English, Hindi, Kannada
- **LexiAI Cards:** 24 specialized learning cards
- **Development Time:** 6+ months
- **Technology Stack:** React, Node.js, Python, MongoDB

---

## ⚠️ Important Notes

1. **Medical Disclaimer:** This tool is for educational support only. It does not diagnose or treat dyslexia. Consult healthcare professionals for medical advice.

2. **Browser Compatibility:** Best experienced on:
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

3. **Microphone Access:** STT features require microphone permissions.

4. **Internet Connection:** Required for TTS and some ML features.

---

## 🐛 Known Issues

- OCR accuracy depends on image quality
- TTS voices limited to browser's available voices
- Some features require stable internet connection
- Large images may take time to process

For bug reports, please [open an issue](https://github.com/yourusername/repo/issues).

---

<div align="center">

**Made with ❤️ for students with dyslexia**

*Developed in 2025-2026 • Empowering learners worldwide*

If this project helped you, please ⭐ star the repository!

[Report Bug](https://github.com/Avinashjewargi/Dyslexia_Project/issues) · [Request Feature](https://github.com/Avinashjewargi/Dyslexia_Project/issues) · [Documentation](https://github.com/Avinashjewargi/Dyslexia_Project#readme)

</div>