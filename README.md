# 📚 Adaptive Reading Assistant for Dyslexia

> **Empowering students with dyslexia through AI-powered reading tools, personalized learning, and engaging gamification.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org/)

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

- **🔊 Text-to-Speech (TTS)** - Natural voice reading with adjustable speed
- **🎤 Speech-to-Text (STT)** - Real-time pronunciation feedback
- **📸 OCR Technology** - Extract text from images instantly
- **🎨 Color Coding** - Visual aids for confusing letter pairs (b/d/p/q)
- **🏆 Gamification** - Points, badges, and leaderboards for motivation
- **📊 Progress Tracking** - Detailed analytics for students and teachers
- **♿ Accessibility** - OpenDyslexic font, adjustable sizes, high contrast modes

---

## ✨ Features

### For Students

| Feature | Description |
|---------|-------------|
| **Smart OCR Upload** | Upload images of textbooks, worksheets, or any printed text |
| **Adaptive Reading Interface** | Color-coded letters, dyslexia-friendly fonts, adjustable spacing |
| **Interactive Learning** | Click words to hear pronunciation, see syllable breakdowns |
| **Pronunciation Practice** | Speak words aloud and get instant feedback via STT |
| **Gamification System** | Earn points, unlock badges, climb the leaderboard |
| **Progress Dashboard** | Track reading speed (WPM), accuracy, and improvement over time |
| **Pre-loaded Stories** | Practice with curated dyslexia-friendly stories |
| **Phonology Games** | Spelling tests, letter replacement, odd-one-out challenges |

### For Teachers

| Feature | Description |
|---------|-------------|
| **Class Overview** | Monitor overall class performance at a glance |
| **Student Tracking** | View individual progress, reading speed, and accuracy |
| **Identify Struggles** | Red flags for students who need extra support |
| **Assign Content** | Share stories and exercises with students |
| **Analytics Dashboard** | Beautiful charts showing trends and improvements |
| **Export Reports** | Generate progress reports for parent-teacher meetings |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2 with Vite
- **UI Library:** React Bootstrap 5
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Styling:** CSS3, Bootstrap, Custom CSS

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js
- **File Upload:** Multer
- **API Architecture:** RESTful

### Machine Learning
- **Language:** Python 3.11
- **NLP:** NLTK
- **OCR:** Tesseract OCR
- **TTS:** gTTS (Google Text-to-Speech)
- **Framework:** Flask (ML API)

### Additional Tools
- **Version Control:** Git
- **Package Manager:** npm, pip
- **Development:** Nodemon, Vite HMR

---

## 📁 Project Structure

```
Adaptive-Reading-Assistant-for-Dyslexia/
│
├── 📂 frontend/                    # React Application
│   ├── 📂 src/
│   │   ├── App.jsx                # Main app component
│   │   ├── LandingPage.jsx        # Homepage with user guides
│   │   └── main.jsx               # Entry point
│   ├── 📂 components/
│   │   ├── Navbar.jsx             # Navigation bar
│   │   ├── Footer.jsx             # Footer component
│   │   ├── Settings.jsx           # Accessibility settings
│   │   └── AccessibilityContext.jsx  # Global settings state
│   ├── 📂 reader/
│   │   ├── ReaderPage.jsx         # Main reading interface
│   │   ├── TextToSpeech.jsx       # TTS controls
│   │   ├── OCRUploader.jsx        # Image upload & text extraction
│   │   ├── ColorCoding.jsx        # Letter color coding
│   │   ├── WordLearning.jsx       # Practice difficult words
│   │   └── Gamification.jsx       # Points, badges, leaderboard
│   ├── 📂 dashboard/
│   │   ├── StudentDashboard.jsx   # Student analytics
│   │   └── TeacherDashboard.jsx   # Teacher overview
│   ├── 📂 phonology/
│   │   ├── PhonologyHub.jsx       # Games hub
│   │   ├── SpellingTest.jsx       # Spelling practice
│   │   ├── LetterReplacement.jsx  # Letter swap game
│   │   └── OddOneOut.jsx          # Find the different word
│   ├── 📂 stories/
│   │   └── StoriesReader.jsx      # Pre-written stories
│   └── 📂 utils/
│       └── firebase.js            # Firebase integration
│
├── 📂 backend/                     # Node.js Express Server
│   ├── server.js                  # Main server file
│   ├── 📂 routes/
│   │   ├── api.js                 # General API routes
│   │   ├── ocr.js                 # OCR processing
│   │   ├── nlp.js                 # Text analysis
│   │   ├── speech.js              # TTS/STT endpoints
│   │   └── reading.js             # Session management
│   ├── 📂 uploads/                # Uploaded files
│   └── 📂 data/
│       └── reading-sessions/      # Saved sessions
│
├── 📂 ml/                          # Python ML Services
│   ├── api.py                     # Flask ML API
│   ├── 📂 ocr/
│   │   └── process_text.py        # OCR processing
│   ├── 📂 nlp/
│   │   └── reading_analysis.py    # Text difficulty analysis
│   ├── 📂 speech/
│   │   └── recognition.py         # TTS/STT implementation
│   └── 📂 backend/
│       └── audio_temp/            # Generated audio files
│
├── 📄 README.md                    # This file
├── 📄 package.json                # Project dependencies
└── 📄 .gitignore                  # Git ignore rules
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **Python** (v3.11 or higher)
- **npm** (comes with Node.js)
- **Git**

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

#### OCR Upload
```http
POST http://localhost:5000/api/ocr/upload
Content-Type: multipart/form-data

Body:
{
  "image": <file>
}

Response:
{
  "success": true,
  "text": "Extracted text here",
  "confidence": 0.95
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
    "challenging_words": ["challenging", "analyze"],
    "difficulty_score": 0.65
  }
}
```

#### Text-to-Speech
```http
POST http://localhost:5000/api/speech/tts
Content-Type: application/json

Body:
{
  "text": "Hello world"
}

Response:
{
  "success": true,
  "audioUrl": "/audio/12345.mp3"
}
```

#### Save Reading Session
```http
POST http://localhost:5000/api/reading/sessions
Content-Type: application/json

Body:
{
  "userId": "student-123",
  "wpm": 125,
  "readingTimeSec": 180,
  "analysis": {...}
}

Response:
{
  "success": true,
  "sessionId": "session_12345"
}
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

**Project Maintainer:** [Your Name]

- 📧 Email: your.email@example.com
- 🌐 Website: [yourwebsite.com](https://yourwebsite.com)
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- **Dyslexia Research:** Based on evidence-based practices for dyslexia intervention
- **OpenDyslexic Font:** Created by Abelardo Gonzalez
- **NLTK:** Natural Language Toolkit for text analysis
- **React Community:** For excellent documentation and support
- **Contributors:** Thanks to all who have contributed to this project

---

## 🔮 Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app (React Native)
- [ ] Multilingual support (Spanish, French, German)
- [ ] Advanced ML models for better text analysis
- [ ] Parent portal for home tracking
- [ ] Integration with Google Classroom
- [ ] Voice commands ("Read this", "Next page")
- [ ] AR features for interactive learning

### Version 1.5 (In Progress)
- [x] Landing page with user guides
- [x] Feedback system
- [x] Enhanced dashboards with Recharts
- [x] Leaderboard functionality
- [ ] User authentication system
- [ ] Database integration (MongoDB)

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **Components:** 30+
- **API Endpoints:** 10+
- **Supported Features:** 20+
- **Languages:** JavaScript, Python
- **Development Time:** 3 months

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

If this project helped you, please ⭐ star the repository!

[Report Bug](https://github.com/yourusername/repo/issues) · [Request Feature](https://github.com/yourusername/repo/issues) · [Documentation](https://github.com/yourusername/repo/wiki)

</div>