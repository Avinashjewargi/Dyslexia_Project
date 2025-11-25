
# Adaptive Reading Assistant for Dyslexia

> ⚠️ **Note:** This project is for informational purposes only. For medical advice or diagnosis, consult a professional.

A full-stack web application designed to assist students with dyslexia by providing adaptive reading interfaces, accessibility settings, gamification, and ML-powered tools like OCR, text-to-speech, and pronunciation assistance.

---

## Project Structure



Adaptive-Reading-Assistant-for-Dyslexia-main/
├── backend/ # Node.js/Express backend
│ ├── routes/
│ │ └── api.js
│ ├── server.js
│ └── package.json
├── frontend/ # React frontend
│ ├── components/
│ │ ├── Footer.jsx
│ │ ├── Navbar.jsx
│ │ ├── ProgressBar.jsx
│ │ └── Settings.jsx
│ ├── dashboard/
│ │ ├── StudentDashboard.jsx
│ │ └── TeacherDashboard.jsx
│ ├── reader/
│ │ ├── Gamification.jsx
│ │ ├── OverlayText.jsx
│ │ ├── Pronunciation.jsx
│ │ └── ReaderPage.jsx
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ ├── App.css
│ │ └── index.css
│ ├── package.json
│ └── vite.config.js
├── ml/ # Machine Learning services
│ ├── ocr/
│ ├── speech/
│ └── nlp/
├── package.json
└── README.md


---

## Step 1: Project Initialization and Base Structure

1. Create root directory:

```bash
mkdir Adaptive-Reading-Assistant-for-Dyslexia-main
cd Adaptive-Reading-Assistant-for-Dyslexia-main


Initialize npm:

npm init -y


Create top-level directories:

mkdir frontend backend ml

Step 2: Frontend Setup (React & Bootstrap)

Navigate to frontend:

cd frontend


Initialize React with Vite:

npm create vite@latest .
# Select framework: react
# Select variant: javascript


Install dependencies:

npm install
npm install react-bootstrap bootstrap


Create frontend subdirectories:

mkdir reader dashboard components

Step 3: Integrating Bootstrap and Creating Core Components

A. Integrate Bootstrap:
In src/main.jsx:

import 'bootstrap/dist/css/bootstrap.min.css';


B. Create Core Components:

components/Navbar.jsx:

import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function AppNavbar() {
  const toggleAccessibility = () => alert("Accessibility Toggle clicked!");
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home">Adaptive Reading Assistant</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/reader">Reader</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          </Nav>
          <Button variant="outline-primary" onClick={toggleAccessibility}>
            A A A (Accessibility Settings)
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;


components/Footer.jsx:

import React from 'react';
import { Container } from 'react-bootstrap';

function AppFooter() {
  return (
    <footer className="bg-light p-3 mt-auto border-top">
      <Container className="text-center text-muted">
        &copy; {new Date().getFullYear()} Adaptive Reading Assistant | Developed for Dyslexia Students
      </Container>
    </footer>
  );
}

export default AppFooter;

Step 4: Backend Setup (Node.js/Express)

Navigate to backend:

cd ../backend
npm init -y


Install dependencies:

npm install express
npm install --save-dev nodemon


Add scripts in package.json:

"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


server.js:

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const apiRoutes = require('./routes/api.js');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Adaptive Reading Assistant Backend!');
});

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));


routes/api.js:

const express = require('express');
const router = express.Router();

router.get('/data', (req, res) => res.json({ message: "Data endpoint reached." }));
router.post('/ocr', (req, res) => res.json({ result: "OCR processing initiated." }));

module.exports = router;

Step 5: ML Structure

ml/ocr/

ml/speech/

ml/nlp/

(Placeholders for Python ML scripts like OCR, text-to-speech, NLP analysis.)

Step 6: Accessibility Settings Component

components/Settings.jsx manages fonts, font sizes, line spacing, and high contrast mode.

Step 7 & 8: Student & Teacher Dashboards

dashboard/StudentDashboard.jsx

dashboard/TeacherDashboard.jsx

(These components will integrate progress, settings, and reader features.)

Step 9: Reader and Progress Components

components/ProgressBar.jsx – reusable progress bar.

reader/OverlayText.jsx – highlights challenging words based on ML analysis.

Step 10: Gamification and Pronunciation Components

reader/Gamification.jsx – displays points, badges, streaks.

reader/Pronunciation.jsx – text-to-speech and pronunciation practice.

Step 11: React Routing and Final Integration

Install React Router:

cd frontend
npm install react-router-dom


Update src/main.jsx:

import { BrowserRouter } from 'react-router-dom';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);


Update src/App.jsx with routes:

import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import AppFooter from '../components/Footer';
import StudentDashboard from '../dashboard/StudentDashboard';
import TeacherDashboard from '../dashboard/TeacherDashboard';
import ReaderPage from '../reader/ReaderPage';

const ReaderPageWrapper = () => (
  <div className="d-flex flex-column min-vh-100">
    <AppNavbar />
    <div className="flex-grow-1 container my-5"><ReaderPage /></div>
    <AppFooter />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student-dashboard" />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/reader" element={<ReaderPageWrapper />} />
      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
}

export default App;


reader/ReaderPage.jsx – combines OverlayText, Pronunciation, and Gamification components for the reading interface.

Next Steps

Connect frontend to backend via fetch/axios.

Implement ML services (OCR, text-to-speech, NLP analysis).

Add React Context for global accessibility settings.

Tech Stack

Frontend: React, JSX, Bootstrap, React Router DOM

Backend: Node.js, Express, Nodemon

ML Services: Python (OCR, NLP, Speech)


Table of Contents

Project Overview

Technologies Used

Folder Structure

Setup Instructions

Steps Completed

Step 12: OCR Uploader Integration

Step 13: Overlay Text Component

Step 14: Gamification Sidebar

Step 15: Accessibility Settings

Step 16: Pronunciation Component Integration

Step 17: NLP Logic (Python)

Step 18: Frontend Integration of NLP

Step 19: Backend Text-to-Speech (TTS) Endpoint

Testing & Verification

Next Steps

Project Overview

The Adaptive Reading Assistant helps students with dyslexia by:

Highlighting challenging words using NLP-based analysis

Allowing OCR uploads for reading real-world text

Providing pronunciation guidance for difficult words

Generating TTS audio for auditory support

Applying accessible fonts, colors, and layouts

Technologies Used

Frontend: React, React-Bootstrap, OverlayText, Pronunciation Component

Backend: Node.js, Express, Multer

Machine Learning / NLP: Python, NLTK

Text-to-Speech: Python, gTTS

Database: (Optional for future steps) MongoDB or other persistent storage

Folder Structure
Adaptive-Reading-Assistant-for-Dyslexia-main/
├─ backend/
│  ├─ routes/
│  │  ├─ api.js
│  │  ├─ nlp.js
│  │  └─ speech.js        # TTS endpoint
│  ├─ audio_temp/          # Temporary audio files
│  └─ server.js
├─ frontend/
│  ├─ reader/
│  │  ├─ ReaderPage.jsx
│  │  ├─ OverlayText.jsx
│  │  ├─ OCRUploader.jsx
│  │  ├─ Gamification.jsx
│  │  └─ Pronunciation.jsx
├─ ml/
|  |
   ├─ocr/
   |   └─process_text.py
│  ├─ speech/
│  │  └─ recognition.py   # Python TTS logic
│  └─ nlp_analysis.py     # NLP logic
└─ README.md

Setup Instructions

Clone the Repository

git clone <repo-url>
cd Adaptive-Reading-Assistant-for-Dyslexia-main


Backend Setup

cd backend
npm install
npm run dev


Frontend Setup

cd frontend
npm install
npm run dev


Python ML Environment

cd ml
python -m venv venv
# Activate venv:
# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate
pip install nltk gTTS


Verify Servers

Backend: http://localhost:5000

Frontend: http://localhost:5173/reader

Steps Completed
Step 12: OCR Uploader Integration

Implemented OCRUploader.jsx to accept image uploads.

Backend route /api/upload processes OCR and returns extracted text.

Step 13: Overlay Text Component

OverlayText.jsx highlights challenging words in the reader interface.

Receives text and list of words from the backend or frontend state.

Step 14: Gamification Sidebar

Gamification.jsx displays badges, scores, or points to motivate learners.

Integrated in the sidebar of ReaderPage.jsx.

Step 15: Accessibility Settings

Added accessibility options: font type (OpenDyslexic), font size, line spacing, and contrast modes.

Ensures a AAA-compliant reading experience.

Step 16: Pronunciation Component Integration

Added Pronunciation.jsx to allow users to practice pronouncing difficult words.

Integrated into ReaderPage.jsx alongside OCR text.

Step 17: NLP Logic (Python)

Developed Python script to analyze text and identify challenging words.

Returns JSON with:

challenging_words

difficulty_score

Integrated Node.js backend to execute Python NLP script.

Step 18: Frontend Integration of NLP

Updated ReaderPage.jsx to call /api/nlp/analyze when new text is loaded.

Displays highlighted words in red and shows difficulty score.

Works for both sample text and OCR-uploaded text.

Step 19: Backend Text-to-Speech (TTS) Endpoint

Installed gTTS in Python environment.

Updated ml/speech/recognition.py to generate MP3 files from text.

Added /api/speech/tts route in Express backend.

Exposed /audio folder as static resource to serve audio files.

Frontend will call this endpoint to play audio for pronunciation.

Testing & Verification

Sample Text Analysis

Open http://localhost:5173/reader

Confirm challenging words are highlighted.

Difficulty Score is displayed.

OCR Upload Analysis

Upload a text image.

Verify that extracted text is replaced and new words are highlighted.

Confirm updated difficulty score.

TTS Endpoint Verification

Send a POST request to /api/speech/tts with JSON: { "text": "Hello world" }

Confirm JSON response returns audioUrl.

Access http://localhost:5000/audio/<filename>.mp3 to verify audio plays.

Next Steps

Step 20: Frontend Integration of TTS (update Pronunciation.jsx to play audio).

Step 21: Persistent user system (login, progress tracking).

Step 22: Advanced NLP model (semantic difficulty, contextual analysis).

Step 23: Accessibility refinements and UI polish.

