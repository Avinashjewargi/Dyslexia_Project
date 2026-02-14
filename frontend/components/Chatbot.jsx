// frontend/components/Chatbot.jsx - Modern AI Assistant with Enhanced Offline Mode - FIXED FLOATING BUTTON
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // 🔊 Text to Speech
  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const cleanText = text
      .replace(/[🔊⚡🎯⏸️📖🎨🎤📝✅💡🖼️👋📊📈🏆⏱️🔄🎲😊🎓📚✨🐕🐱🐦🐟🐘🦁🍎🍕🍔🎂🚗🚌✈️🚲🕌🗼🏔️🏖️⚽📚📱💻🏃🍽️🏊💃🔢🤖]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n/g, ' ')
      .trim();
    
    const speech = new SpeechSynthesisUtterance(cleanText);
    speech.lang = "en-US";
    speech.rate = 0.85;
    speech.pitch = 1.1;
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice needs Chrome or Edge browser!");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 🔢 Calculator Button Click
  const addToInput = (value) => {
    setInput(input + value);
  };

  // 🛑 Stop Generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // ============================================
  // ENHANCED OFFLINE RESPONSE HANDLER
  // ============================================
  const getOfflineResponse = (message) => {
    const msg = message.toLowerCase();
    
    // GREETING
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return {
        type: 'text',
        reply: "Hello! 👋 I'm your Dyslexia Reading Assistant. I'm here to help you with:\n• Reading practice\n• Text-to-speech features\n• OCR uploads\n• Progress tracking\n• Accessibility settings\n\nWhat would you like to know?",
        emoji: '👋'
      };
    }

    // HOW ARE YOU
    if (msg.includes('how are you')) {
      return {
        type: 'text',
        reply: "I'm great! Thanks for asking! 😊\n\nI'm excited to help you with your reading practice today!",
        emoji: '😊'
      };
    }
    
    // DYSLEXIA SPECIFIC QUERIES
    if (msg.includes('dyslexia') || msg.includes('reading tips')) {
      return {
        type: 'educational',
        reply: "I specialize in dyslexia support! Our platform offers:\n✅ Color-coded letters (b/d/p/q)\n✅ OpenDyslexic font\n✅ Text-to-speech reading\n✅ Speech recognition practice\n✅ OCR text extraction\n✅ Gamification & rewards\n\nTry the Reader page to get started!",
        title: "Dyslexia Support Features",
        emoji: '📚',
        facts: [
          "Color coding helps distinguish similar letters",
          "OpenDyslexic font is specially designed for easier reading",
          "Text-to-speech helps with pronunciation",
          "OCR extracts text from images instantly",
          "Games make learning fun and engaging"
        ]
      };
    }

    // READER PAGE HELP
    if (msg.includes('reader') || (msg.includes('read') && !msg.includes('already'))) {
      return {
        type: 'educational',
        reply: "The Reader page is your main learning area! Here you can:\n📖 Upload images with text (OCR)\n🎨 Enable color coding for confusing letters\n🔊 Listen to text being read aloud\n🎤 Practice pronunciation\n📝 Type or paste your own text\n\nClick 'Reader' in the navigation to start!",
        title: "Reader Page Guide",
        emoji: '📖',
        facts: [
          "Upload any image with text",
          "Color coding makes b/d/p/q easier to read",
          "Adjustable reading speed",
          "Practice mode for difficult words",
          "Save your progress automatically"
        ]
      };
    }
    
    // OCR HELP
    if (msg.includes('ocr') || msg.includes('upload') || msg.includes('image')) {
      return {
        type: 'educational',
        reply: "📸 **OCR: Picture to Text Magic!**\n\nOCR means 'Optical Character Recognition'. It turns pictures into text you can read!\n\n**How to use it:**\n\n**Step 1:** Go to the Reader page\n**Step 2:** Click 'Upload Image' button\n**Step 3:** Select a photo of text (book, worksheet, etc.)\n**Step 4:** Wait a few seconds for processing\n**Step 5:** The text will be extracted automatically\n**Step 6:** Use TTS, color coding, and other features!\n\n💡 Tip: Clear, well-lit images work best!",
        title: "OCR Guide - Extract Text from Images",
        emoji: '📸',
        facts: [
          "OCR reads words from pictures",
          "Works with photos of books and papers",
          "Processing takes about 3-5 seconds",
          "You can then listen to the text",
          "Clear pictures give best results"
        ]
      };
    }
    
    // TEXT-TO-SPEECH
    if (msg.includes('tts') || msg.includes('text to speech') || msg.includes('listen') || msg.includes('read aloud')) {
      return {
        type: 'educational',
        reply: "🔊 **Text-to-Speech (TTS) - Listen to Text!**\n\nText-to-Speech helps you listen to text:\n🔊 Click the play button in Reader\n⚡ Adjust reading speed (slow/normal/fast)\n🎯 Follow along with highlighted words\n⏸️ Pause and resume anytime\n\n**How to use:**\n\n**Step 1:** Load text in the Reader\n**Step 2:** Look for the speaker icon 🔊\n**Step 3:** Click 'Start Reading'\n**Step 4:** Listen and follow along!\n\nThis is great for practicing pronunciation and comprehension!",
        title: "Text-to-Speech Guide",
        emoji: '🔊',
        facts: [
          "Computer reads words out loud clearly",
          "Highlights each word as it reads",
          "You can pause and replay anytime",
          "Adjustable speed helps learning",
          "Perfect for pronunciation practice"
        ]
      };
    }
    
    // COLOR CODING
    if (msg.includes('color') || msg.includes('colour') || msg.includes('b and d') || msg.includes('confusing letters')) {
      return {
        type: 'educational',
        reply: "🎨 **Color Coding for Letters!**\n\nSome letters look similar and can be confusing. We use colors to help!\n\n**Letter Colors:**\n• **b** = Blue 🔵\n• **d** = Red 🔴\n• **p** = Green 🟢\n• **q** = Orange 🟠\n\n**How to use it:**\n\n**Step 1:** Go to Reader page\n**Step 2:** Load your text\n**Step 3:** Turn on 'Color Coding'\n**Step 4:** See the letters in bright colors!\n\nNow it's easier to tell them apart!\n\n**Why this helps:**\n• Each letter has its own color\n• Your brain remembers the color\n• Less confusion when reading",
        title: "Color Coding for Confusing Letters",
        emoji: '🎨',
        facts: [
          "Letters b, d, p, q get different colors",
          "Colors help your brain remember shapes",
          "Makes confusing letters easier to read",
          "You can turn it on/off anytime",
          "Works with all your text"
        ]
      };
    }
    
    // GAMES AND PHONOLOGY
    if (msg.includes('game') || msg.includes('phonology') || msg.includes('spelling')) {
      return {
        type: 'educational',
        reply: "🎮 **Fun Learning Games!**\n\nFun learning games are available:\n🎯 Spelling Tests - Practice difficult words\n🔄 Letter Replacement - Swap confusing letters\n🎲 Odd One Out - Find the different word\n\n**How to play:**\n\n**Step 1:** Click 'Phonology Games' in menu\n**Step 2:** Choose a game\n**Step 3:** Read the instructions\n**Step 4:** Start playing!\n**Step 5:** Earn points and stars!\n\nPlay games to earn points and badges! Access them from the Phonology Hub.",
        title: "Learning Games",
        emoji: '🎮',
        facts: [
          "3 different fun games available",
          "Practice spelling and sounds",
          "Get instant feedback",
          "Earn points and badges",
          "Play as many times as you want"
        ]
      };
    }
    
    // PROGRESS AND DASHBOARD
    if (msg.includes('progress') || msg.includes('dashboard') || msg.includes('track')) {
      return {
        type: 'educational',
        reply: "📊 **Track Your Learning Progress!**\n\nTrack your learning progress:\n📊 Student Dashboard - Your personal stats\n📈 Reading speed (WPM) over time\n🎯 Accuracy percentage\n🏆 Points, badges, and leaderboard\n⏱️ Time spent reading\n\n**Dashboard shows:**\n• Reading speed improvements\n• Stories you've completed\n• Hard words you're learning\n• Points and achievements\n\nCheck your dashboard to see how you're improving!",
        title: "Progress Tracking",
        emoji: '📊',
        facts: [
          "Track reading speed over time",
          "See all stories you've read",
          "Monitor hard words you're learning",
          "View points and badges earned",
          "Teachers can see your progress too"
        ]
      };
    }

    // SETTINGS
    if (msg.includes('settings') || msg.includes('font') || msg.includes('accessibility')) {
      return {
        type: 'educational',
        reply: "⚙️ **Customize Your Reading Experience!**\n\nChange how text looks to help you read better!\n\n**You can change:**\n\n📝 **Font Type**\n• OpenDyslexic (special for dyslexia)\n• Arial\n• Comic Sans\n• Other fonts\n\n🔍 **Text Size**\n• Small, Medium, or Large\n• Make it just right for you!\n\n🎨 **Contrast Mode**\n• High Contrast (easier to see)\n• Normal mode\n\n**How to change:**\nClick the Settings icon ⚙️ and try different options!",
        title: "Settings & Accessibility",
        emoji: '⚙️',
        facts: [
          "OpenDyslexic font designed for dyslexia",
          "Adjust text size anytime",
          "High contrast makes reading easier",
          "More line space reduces confusion",
          "All settings are saved automatically"
        ]
      };
    }

    // STORIES
    if (msg.includes('stories') || msg.includes('story')) {
      return {
        type: 'educational',
        reply: "📖 **Practice with Fun Stories!**\n\nWe have stories made just for you to practice reading!\n\n**Available stories:**\n• The Thirsty Crow\n• The Honest Boy\n• The Ant and the Grasshopper\n• And more!\n\n**How to read:**\n**Step 1:** Click 'Stories' in menu\n**Step 2:** Choose a story\n**Step 3:** Use helpful tools:\n   • 🔊 Listen to it read\n   • 🎨 See colors on letters\n   • 💡 Click hard words\n\n**After reading:**\n• Mark difficult words\n• See your reading time\n• Get points for completing!",
        title: "Story Reading Practice",
        emoji: '📖',
        facts: [
          "Stories are made for easy reading",
          "You can listen while reading",
          "Mark words that are hard",
          "Timer shows reading progress",
          "Earn badges for reading stories"
        ]
      };
    }

    // CALCULATOR HELP
    if (msg.includes('calculator') || msg.includes('math')) {
      return {
        type: 'text',
        reply: "🔢 **Calculator Help**\n\nI can help you with math problems!\n\n**Try asking:**\n• 5 + 3\n• 10 - 4\n• 6 × 7\n• 20 ÷ 5\n\nOr ask: 'What is 8 plus 9?'\n\nClick the calculator button 🔢 in the header for quick access!",
        emoji: '🔢'
      };
    }

    // HELP / GUIDE
    if (msg.includes('help') || msg.includes('guide') || msg.includes('how to use')) {
      return {
        type: 'educational',
        reply: "📚 **Welcome to Your Dyslexia Reading Assistant!**\n\nI can help you with:\n\n🔊 **Text-to-Speech** - Listen to text read aloud\n📸 **OCR** - Extract text from images\n🎨 **Color Coding** - See b/d/p/q in colors\n📖 **Stories** - Practice with fun stories\n🎮 **Games** - Spelling and phonology games\n📊 **Progress** - Track your improvements\n⚙️ **Settings** - Customize your experience\n\nAsk me about any feature!\n\nExamples:\n• 'How does OCR work?'\n• 'Tell me about color coding'\n• 'How to use text-to-speech?'",
        title: "Dyslexia Reading Assistant Guide",
        emoji: '📚',
        facts: [
          "All features designed for dyslexia support",
          "Upload pictures to extract text",
          "Colors help distinguish similar letters",
          "Listen to any text read aloud",
          "Track your reading progress"
        ]
      };
    }
    
    // THANK YOU
    if (msg.includes('thank')) {
      return {
        type: 'text',
        reply: "You're very welcome! 😊 Keep up the great work with your reading practice. I'm here anytime you need help!",
        emoji: '😊'
      };
    }
    
    // GOODBYE
    if (msg.includes('bye') || msg.includes('goodbye')) {
      return {
        type: 'text',
        reply: "Goodbye! 👋 Happy reading and keep practicing. Come back anytime you need assistance!",
        emoji: '👋'
      };
    }

    // DEFAULT OFFLINE MESSAGE
    return {
      type: 'text',
      reply: "I'm in offline mode right now! 📴\n\nI can help you learn how to use this app!\n\n**Try asking:**\n• 'How does OCR work?'\n• 'Tell me about color coding'\n• 'How to use text-to-speech?'\n• 'What are the games?'\n• 'How to check my progress?'\n• 'Tell me about dyslexia support'\n\nGo online to search for other topics!",
      emoji: '💡'
    };
  };

  // 📩 Send Message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "User", text: input, timestamp: new Date() };
    setChat((prev) => [...prev, userMsg]);
    const messageText = input;
    setInput("");
    setIsLoading(true);
    setIsGenerating(true);
    setShowCalculator(false);

    // OFFLINE MODE - Local processing only
    if (!isOnline) {
      try {
        // Simulate thinking time for better UX
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Process locally using the getOfflineResponse function
        const offlineResponse = getOfflineResponse(messageText);
        
        const botMsg = {
          sender: "Bot",
          text: offlineResponse.reply || "I can help you learn how to use this app!",
          type: offlineResponse.type || 'text',
          imageUrl: offlineResponse.imageUrl || null,
          facts: offlineResponse.facts || [],
          title: offlineResponse.title || null,
          simplifiedText: offlineResponse.simplifiedText || null,
          emoji: offlineResponse.emoji || '✨',
          calculation: offlineResponse.calculation || null,
          timestamp: new Date()
        };
        
        setChat((prev) => [...prev, botMsg]);
        
        // Speak the response in offline mode too
        const textToSpeak = offlineResponse.simplifiedText || offlineResponse.reply?.split('\n')[0] || offlineResponse.reply;
        if (textToSpeak) {
          speak(textToSpeak);
        }
        
        setIsLoading(false);
        setIsGenerating(false);
        return;
        
      } catch (error) {
        console.error("Offline processing error:", error);
        const errorMsg = "Oops! Something went wrong in offline mode.";
        setChat((prev) => [...prev, { 
          sender: "Bot", 
          text: errorMsg, 
          type: 'text', 
          timestamp: new Date() 
        }]);
        setIsLoading(false);
        setIsGenerating(false);
        return;
      }
    }

    // ONLINE MODE - API call
    abortControllerRef.current = new AbortController();

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: messageText,
      }, {
        signal: abortControllerRef.current.signal
      });

      const data = res.data;
      
      const botMsg = {
        sender: "Bot",
        text: data.reply || "Here's what I found!",
        type: data.type || 'text',
        imageUrl: data.imageUrl || null,
        facts: data.facts || [],
        title: data.title || null,
        simplifiedText: data.simplifiedText || null,
        emoji: data.emoji || '✨',
        calculation: data.calculation || null,
        timestamp: new Date()
      };
      
      setChat((prev) => [...prev, botMsg]);
      
      // Speak the response
      const textToSpeak = data.simplifiedText || data.reply?.split('\n')[0] || data.reply;
      if (textToSpeak) {
        speak(textToSpeak);
      }
      
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.log('Generation stopped by user');
        const stopMsg = "Generation stopped.";
        setChat((prev) => [...prev, { 
          sender: "Bot", 
          text: stopMsg, 
          type: 'text', 
          timestamp: new Date() 
        }]);
      } else {
        console.error("Error:", error);
        const errorMsg = "Oops! Something went wrong. Try again!";
        setChat((prev) => [...prev, { 
          sender: "Bot", 
          text: errorMsg, 
          type: 'text', 
          timestamp: new Date() 
        }]);
        speak(errorMsg);
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChat([]);
    window.speechSynthesis.cancel();
  };

  const chatWidth = isExpanded ? "680px" : "440px";
  const chatHeight = isExpanded ? "85vh" : "700px";

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }

          /* CRITICAL FIX: Maximum z-index and isolation */
          .chatbot-container {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            isolation: isolate !important;
            transform: translateZ(0) !important;
            will-change: transform !important;
          }
          
          .chatbot-window {
            position: fixed !important;
            bottom: 110px !important;
            right: 30px !important;
            z-index: 2147483646 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto !important;
            isolation: isolate !important;
            transform: translateZ(0) !important;
            will-change: transform !important;
          }

          .calculator-popup {
            position: fixed !important;
            bottom: 110px !important;
            right: 30px !important;
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            animation: slideUp 0.3s ease;
            z-index: 2147483645 !important;
            pointer-events: auto !important;
            isolation: isolate !important;
          }

          .chat-image {
            width: 100%;
            height: auto;
            max-height: 280px;
            object-fit: cover;
            border-radius: 12px;
            margin: 12px 0;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
          }
          
          .chat-image:hover {
            transform: scale(1.02);
          }

          .facts-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 3px solid #0ea5e9;
            padding: 16px;
            margin: 12px 0;
            border-radius: 12px;
          }

          .fact-item {
            padding: 8px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #1e293b;
            border-bottom: 1px dashed #bae6fd;
          }

          .fact-item:last-child {
            border-bottom: none;
          }

          .fact-item::before {
            content: "•";
            color: #0ea5e9;
            font-weight: bold;
            margin-right: 8px;
            font-size: 18px;
          }

          .title-box {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            margin: 8px 0;
            font-weight: 600;
            font-size: 15px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
          }

          .calculator-box {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            margin: 12px 0;
          }

          .calc-button {
            width: 56px;
            height: 56px;
            margin: 4px;
            font-size: 20px;
            font-weight: 600;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            background: white;
            color: #1e293b;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .calc-button:hover {
            background: #6366f1;
            color: white;
            border-color: #6366f1;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }

          .calc-button:active {
            transform: scale(0.95);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
            70% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
            100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          }

          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .message-enter {
            animation: fadeIn 0.3s ease;
          }

          .robot-icon {
            position: relative;
            font-size: 28px;
          }

          .loading-spinner {
            width: 28px;
            height: 28px;
            border: 3px solid #e2e8f0;
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          .modern-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .modern-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .modern-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .gradient-text {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          /* PULSE ANIMATION FOR BUTTON */
          @keyframes chatbot-pulse {
            0% {
              box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
            }
            50% {
              box-shadow: 0 8px 32px rgba(99, 102, 241, 0.6), 0 0 0 8px rgba(99, 102, 241, 0.1);
            }
            100% {
              box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
            }
          }

          .chatbot-button-pulse {
            animation: chatbot-pulse 2s infinite;
          }
        `}
      </style>

      {/* Calculator Popup (Circular) */}
      {showCalculator && (
        <div className="calculator-popup">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              🔢 Calculator
            </h4>
            <button 
              onClick={() => setShowCalculator(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['7', '8', '9', '+'].map(btn => (
                <button key={btn} className="calc-button" onClick={() => addToInput(btn)}>{btn}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['4', '5', '6', '-'].map(btn => (
                <button key={btn} className="calc-button" onClick={() => addToInput(btn)}>{btn}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['1', '2', '3', '*'].map(btn => (
                <button key={btn} className="calc-button" onClick={() => addToInput(btn)}>{btn}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['0', '.', '=', '/'].map(btn => (
                <button 
                  key={btn} 
                  className="calc-button" 
                  onClick={() => btn === '=' ? sendMessage() : addToInput(btn)}
                  style={btn === '=' ? { background: '#6366f1', color: 'white', borderColor: '#6366f1' } : {}}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="chatbot-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chatbot-button-pulse"
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            border: "none",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15) translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(99, 102, 241, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.4)";
          }}
        >
          {/* Robot Icon */}
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              position: 'relative',
              zIndex: 2
            }}
          >
            <path
              d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z"
              fill="white"
            />
            <path
              d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z"
              fill="white"
            />
          </svg>

          {/* Status Dot */}
          <span style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "14px",
            height: "14px",
            background: isOnline ? "#10b981" : "#ef4444",
            borderRadius: "50%",
            border: "2.5px solid white",
            boxShadow: isOnline 
              ? "0 2px 8px rgba(16, 185, 129, 0.4)" 
              : "0 2px 8px rgba(239, 68, 68, 0.4)",
            zIndex: 3,
          }}/>

          {chat.length > 0 && !isOpen && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              borderRadius: "50%",
              width: "26px",
              height: "26px",
              fontSize: "12px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
              zIndex: 4,
            }}>
              {chat.length > 9 ? "9+" : chat.length}
            </span>
          )}
        </button>
      </div>

      {/* Chat Window - REST OF THE CODE REMAINS THE SAME */}
      {isOpen && (
        <div className="chatbot-window" style={{
          width: chatWidth,
          height: chatHeight,
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
          animation: "slideUp 0.3s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z" fill="white"/>
                  <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z" fill="white"/>
                </svg>
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: "17px", fontWeight: "600" }}>
                  Dyslexia Assistant
                </h4>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  marginTop: "4px"
                }}>
                  {/* Online Button */}
                  <button
                    onClick={() => setIsOnline(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: isOnline ? "rgba(16, 185, 129, 0.25)" : "rgba(255,255,255,0.1)",
                      border: `1.5px solid ${isOnline ? "#10b981" : "rgba(255,255,255,0.3)"}`,
                      borderRadius: "12px",
                      padding: "3px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isOnline ? "rgba(16, 185, 129, 0.35)" : "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = isOnline ? "rgba(16, 185, 129, 0.25)" : "rgba(255,255,255,0.1)"}
                  >
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#10b981",
                      boxShadow: isOnline ? "0 0 6px #10b981" : "none",
                    }}/>
                    Online
                  </button>

                  {/* Offline Button */}
                  <button
                    onClick={() => setIsOnline(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: !isOnline ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.1)",
                      border: `1.5px solid ${!isOnline ? "#ef4444" : "rgba(255,255,255,0.3)"}`,
                      borderRadius: "12px",
                      padding: "3px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = !isOnline ? "rgba(239, 68, 68, 0.35)" : "rgba(255,255,255,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = !isOnline ? "rgba(239, 68, 68, 0.25)" : "rgba(255,255,255,0.1)"}
                  >
                    <span style={{ 
                      width: "6px", 
                      height: "6px", 
                      borderRadius: "50%", 
                      background: "#ef4444",
                      boxShadow: !isOnline ? "0 0 6px #ef4444" : "none",
                    }}/>
                    Offline
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button onClick={clearChat} style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "16px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              title="New Chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>

              <button 
                onClick={() => setShowCalculator(!showCalculator)}
                style={{
                  background: showCalculator ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.background = showCalculator ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)"}
                title="Calculator"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="8" y2="10"/>
                  <line x1="12" y1="10" x2="12" y2="10"/>
                  <line x1="16" y1="10" x2="16" y2="10"/>
                  <line x1="8" y1="14" x2="8" y2="14"/>
                  <line x1="12" y1="14" x2="12" y2="14"/>
                  <line x1="16" y1="14" x2="16" y2="14"/>
                  <line x1="8" y1="18" x2="16" y2="18"/>
                </svg>
              </button>

              <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                )}
              </button>

              <button onClick={() => setIsOpen(false)} style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "18px",
                color: "white",
                fontWeight: "400",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Area - CONTINUED IN NEXT MESSAGE DUE TO LENGTH... */}
          <div className="modern-scrollbar" style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
            background: "linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {chat.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "80px" }}>
                <div style={{ 
                  marginBottom: "24px",
                  display: "flex",
                  justifyContent: "center"
                }}>
                  <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)"
                  }}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C10.9 2 10 2.9 10 4H14C14 2.9 13.1 2 12 2Z" fill="white"/>
                      <path d="M20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM8 16C6.9 16 6 15.1 6 14C6 12.9 6.9 12 8 12C9.1 12 10 12.9 10 14C10 15.1 9.1 16 8 16ZM16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                <h3 style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  margin: "0 0 12px 0",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  {isOnline ? "Hello! I'm Your Dyslexia Assistant" : "Hello! I'm in Offline Mode"}
                </h3>
                <p style={{ 
                  fontSize: "15px", 
                  color: "#64748b", 
                  lineHeight: "1.6", 
                  margin: "0 0 32px 0",
                  maxWidth: "320px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}>
                  {isOnline 
                    ? "I can help you with reading, OCR, TTS, and answer questions about anything!" 
                    : "I can help you learn how to use this dyslexia app!"}
                </p>

                {!isOnline && (
                  <div style={{
                    background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    border: "1px solid #60a5fa",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    margin: "0 auto 20px auto",
                    maxWidth: "360px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "#1e40af",
                    fontWeight: "500"
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                    💡 Try: "How does OCR work?" or "Tell me about dyslexia support"
                  </div>
                )}
              </div>
            )}

            {chat.map((msg, index) => (
              <div key={index} className="message-enter" style={{
                alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}>
                <div style={{
                  padding: "14px 18px",
                  borderRadius: msg.sender === "User" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.sender === "User"
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "white",
                  color: msg.sender === "User" ? "white" : "#1e293b",
                  boxShadow: msg.sender === "User"
                    ? "0 4px 12px rgba(99, 102, 241, 0.25)"
                    : "0 2px 8px rgba(0,0,0,0.08)",
                  wordWrap: "break-word",
                }}>
                  {msg.sender === "User" ? (
                    <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", fontWeight: "500" }}>
                      {msg.text}
                    </p>
                  ) : (
                    <>
                      {msg.title && (
                        <div className="title-box">
                          {msg.emoji} {msg.title}
                        </div>
                      )}

                      {msg.imageUrl && (
                        <img 
                          src={msg.imageUrl}
                          alt={msg.title || 'Image'}
                          className="chat-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/800x600/6366f1/ffffff?text=${encodeURIComponent(msg.title || 'Image')}`;
                          }}
                        />
                      )}

                      {msg.simplifiedText && (
                        <p style={{ 
                          margin: "12px 0", 
                          fontSize: "15px", 
                          lineHeight: "1.8",
                          color: "#334155"
                        }}>
                          {msg.simplifiedText}
                        </p>
                      )}

                      {msg.calculation && (
                        <div className="calculator-box">
                          <div style={{ fontSize: "24px", fontWeight: "600", color: "#475569", textAlign: "center" }}>
                            {msg.calculation.expression}
                          </div>
                          <div style={{ fontSize: "18px", textAlign: "center", margin: "12px 0", color: "#94a3b8" }}>
                            =
                          </div>
                          <div style={{ fontSize: "36px", fontWeight: "700", color: "#6366f1", textAlign: "center" }}>
                            {msg.calculation.formatted}
                          </div>
                        </div>
                      )}

                      {msg.facts && msg.facts.length > 0 && (
                        <div className="facts-box">
                          <div style={{ 
                            fontWeight: "600", 
                            marginBottom: "12px", 
                            color: "#0ea5e9",
                            fontSize: "14px"
                          }}>
                            💡 Key Facts
                          </div>
                          {msg.facts.map((fact, i) => (
                            <div key={i} className="fact-item">
                              {fact}
                            </div>
                          ))}
                        </div>
                      )}

                      {!msg.simplifiedText && !msg.facts?.length && !msg.calculation && (
                        <p style={{ 
                          margin: 0, 
                          fontSize: "15px", 
                          lineHeight: "1.7",
                          whiteSpace: "pre-line"
                        }}>
                          {msg.text}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  textAlign: msg.sender === "User" ? "right" : "left",
                  fontWeight: "500"
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{
                alignSelf: "flex-start",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
                maxWidth: "85%"
              }}>
                <div style={{
                  padding: "16px 20px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div className="loading-spinner"></div>
                    <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
                      {isGenerating ? (isOnline ? "Searching..." : "Processing...") : "Thinking..."}
                    </span>
                  </div>
                  
                  {isGenerating && isOnline && (
                    <button
                      onClick={stopGeneration}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#dc2626"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#ef4444"}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <rect width="10" height="10" rx="1"/>
                      </svg>
                      Stop
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "20px 24px",
            background: "white",
            borderTop: "1px solid #e2e8f0",
          }}>
            <div style={{
              display: "flex",
              gap: "12px",
              background: "#f8fafc",
              borderRadius: "16px",
              padding: "8px",
              border: "2px solid #e2e8f0",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              {/* Circular Progress Indicator (shows when generating) */}
              {isGenerating && (
                <div style={{ 
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "8px"
                }}>
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 28 28"
                    style={{
                      animation: "spin 1s linear infinite"
                    }}
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeDasharray="69"
                      strokeDashoffset="17"
                      strokeLinecap="round"
                    />
                  </svg>
                  {isOnline && (
                    <button
                      onClick={stopGeneration}
                      style={{
                        position: "absolute",
                        width: "18px",
                        height: "18px",
                        background: "#6366f1",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#4f46e5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#6366f1"}
                      title="Stop generating"
                    >
                      <div style={{
                        width: "8px",
                        height: "8px",
                        background: "white",
                        borderRadius: "1px"
                      }}/>
                    </button>
                  )}
                </div>
              )}

              <input
                type="text"
                value={input}
                placeholder={
                  isGenerating 
                    ? (isOnline ? "Searching..." : "Processing...") 
                    : !isOnline 
                      ? "Ask me about dyslexia features! (Offline)" 
                      : "Ask me anything..."
                }
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  outline: "none",
                  background: "white",
                  color: "#1e293b",
                  fontWeight: "500",
                }}
              />

              <button
                onClick={startListening}
                disabled={isListening || isLoading}
                style={{
                  padding: "12px",
                  background: isListening 
                    ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isListening || isLoading ? "not-allowed" : "pointer",
                  fontSize: "20px",
                  minWidth: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                }}
                onMouseEnter={(e) => !isListening && !isLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {isListening ? "🎤" : "🎙️"}
              </button>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: "12px",
                  background: input.trim() && !isLoading
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "#e2e8f0",
                  color: input.trim() && !isLoading ? "white" : "#94a3b8",
                  border: "none",
                  borderRadius: "12px",
                  cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                  fontSize: "20px",
                  minWidth: "48px",
                  height: "48px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  boxShadow: input.trim() && !isLoading ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
                }}
                onMouseEnter={(e) => input.trim() && !isLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                title={!isOnline ? "Offline mode - dyslexia app help" : "Send message"}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}