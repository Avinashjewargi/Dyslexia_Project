// backend/routes/chat.js
// Enhanced Learning Assistant for Dyslexia Students with Comprehensive Offline Guidance

const express = require('express');
const router = express.Router();
const axios = require('axios');

// ============================================
// 1. BASIC CALCULATOR
// ============================================
const calculateMath = (expression) => {
  try {
    // Clean the expression
    let cleanExpr = expression
      .toLowerCase()
      .replace(/what is|calculate|solve|compute/gi, '')
      .replace(/plus/gi, '+')
      .replace(/minus/gi, '-')
      .replace(/times|multiply|multiplied by/gi, '*')
      .replace(/divided by|divide/gi, '/')
      .trim();

    // Check if it's a math expression
    const mathPattern = /^[\d\s+\-*/().]+$/;
    if (!mathPattern.test(cleanExpr)) {
      return null;
    }

    // Evaluate the expression safely
    const result = Function('"use strict"; return (' + cleanExpr + ')')();
    
    if (isNaN(result) || !isFinite(result)) {
      return null;
    }

    return {
      expression: cleanExpr,
      result: result,
      formatted: formatNumber(result)
    };
  } catch (error) {
    return null;
  }
};

const formatNumber = (num) => {
  // Round to 2 decimal places if needed
  if (num % 1 !== 0) {
    return num.toFixed(2);
  }
  return num.toString();
};

// ============================================
// 2. GREETINGS & QUICK RESPONSES (OFFLINE MODE)
// ============================================
const getQuickResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // GREETING
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return {
      type: 'text',
      reply: "Hello! 👋 I'm your Dyslexia Reading Friend!\n\n**I can help you learn about:**\n\n1️⃣ OCR - Upload pictures 📸\n2️⃣ Text-to-Speech - Listen to text 🔊\n3️⃣ Speech-to-Text - Practice speaking 🎤\n4️⃣ Color Coding - See letters in colors 🎨\n5️⃣ LexiAI - Interactive learning 🤖\n6️⃣ Phonology Games - Fun challenges 🎮\n7️⃣ Stories - Reading practice 📖\n8️⃣ Progress Tracking - See your growth 📊\n9️⃣ Settings - Customize your experience ⚙️\n\n**Type a number (1-9) or ask about any feature!**\n\nExample: Type '4' or ask 'Explain color coding'"
    };
  }
  
  // HOW ARE YOU
  if (message.includes('how are you')) {
    return {
      type: 'text',
      reply: "I'm doing great! Thanks for asking! 😊\n\nI'm here to help you learn about all the awesome features in this app!\n\n**Quick Menu:**\nType 1-9 to learn about:\n1. OCR Upload\n2. Text-to-Speech\n3. Speech-to-Text\n4. Color Coding ⭐\n5. LexiAI Learning\n6. Games\n7. Stories\n8. Progress\n9. Settings\n\nWhat would you like to know?"
    };
  }
  
  // THANK YOU
  if (message.includes('thank')) {
    return {
      type: 'text',
      reply: "You're very welcome! 😊\n\nI love helping you learn! Keep asking questions - that's how we learn best!\n\n**Need more help?**\nType any number (1-9) to learn about different features!"
    };
  }
  
  // GOODBYE
  if (message.includes('bye')) {
    return {
      type: 'text',
      reply: "Goodbye! 👋 Happy reading and keep practicing!\n\nRemember:\n• Practice a little every day\n• Use the color coding feature\n• Listen to text being read\n• Play the fun games\n\nCome back anytime you need help! 🌟"
    };
  }

  // CALCULATOR HELP
  if (message.includes('calculator') || message.includes('math help')) {
    return {
      type: 'text',
      reply: "I can help you with math! 🔢\n\n**Try asking:**\n• 5 + 3\n• 10 - 4\n• 6 * 7\n• 20 / 5\n\n**Or ask in words:**\n'What is 8 plus 9?'\n'Calculate 15 times 3'\n\n**Click the calculator button** 🔢 in the chat for quick access!"
    };
  }

  // ============================================
  // NUMBERED SHORTCUTS - Quick Feature Access
  // ============================================
  
  if (message === '1' || message.toLowerCase() === 'one') {
    return getOCRGuide();
  }
  if (message === '2' || message.toLowerCase() === 'two') {
    return getTTSGuide();
  }
  if (message === '3' || message.toLowerCase() === 'three') {
    return getSTTGuide();
  }
  if (message === '4' || message.toLowerCase() === 'four') {
    return getColorCodingGuide();
  }
  if (message === '5' || message.toLowerCase() === 'five') {
    return getLexiAIGuide();
  }
  if (message === '6' || message.toLowerCase() === 'six') {
    return getPhonologyGuide();
  }
  if (message === '7' || message.toLowerCase() === 'seven') {
    return getStoriesGuide();
  }
  if (message === '8' || message.toLowerCase() === 'eight') {
    return getProgressGuide();
  }
  if (message === '9' || message.toLowerCase() === 'nine') {
    return getSettingsGuide();
  }

  // ============================================
  // COMPREHENSIVE FEATURE GUIDES
  // ============================================

  // MAIN HELP / GUIDE
  if (message.includes('what is this') || message.includes('help') || message.includes('how to use') || message.includes('guide') || message.includes('features') || message.includes('menu')) {
    return {
      type: 'educational',
      reply: "📚 **Welcome to Your Dyslexia Reading Helper!**\n\nThis app is specially designed to help students with dyslexia read better and enjoy learning!\n\n**🌟 All Features - Type a Number to Learn More:**\n\n**1️⃣ OCR (Picture to Text)** 📸\n   Upload photos → Turn into readable text\n   \n**2️⃣ Text-to-Speech (TTS)** 🔊\n   Listen to text read aloud clearly\n   \n**3️⃣ Speech-to-Text (STT)** 🎤\n   Practice speaking & pronunciation\n   \n**4️⃣ Color Coding** 🎨 ⭐ SUPER HELPFUL!\n   See b/d/p/q in different colors\n   \n**5️⃣ LexiAI Learning** 🤖\n   25+ interactive learning cards\n   \n**6️⃣ Phonology Games** 🎮\n   Fun spelling & word challenges\n   \n**7️⃣ Story Reading** 📖\n   Practice with engaging stories\n   \n**8️⃣ Progress Dashboard** 📊\n   Track your improvement\n   \n**9️⃣ Settings & Accessibility** ⚙️\n   Customize fonts, colors, size\n\n**💡 How to Use This Guide:**\n• Type any number (1-9) for detailed help\n• Or ask: 'Tell me about color coding'\n• Or ask: 'How does OCR work?'\n\n**Example:** Type **4** to learn all about Color Coding!",
      title: "Complete Feature Guide - Type 1-9",
      emoji: '📚',
      facts: [
        "9 powerful features for dyslexia support",
        "Type numbers 1-9 for instant guides",
        "Color Coding (#4) is most popular!",
        "All features work together to help you read",
        "Ask me anything - I'm here to help!",
        "Practice daily for best results"
      ]
    };
  }

  // ============================================
  // 1. OCR (OPTICAL CHARACTER RECOGNITION)
  // ============================================
  if (message.includes('ocr') || message.includes('upload') || message.includes('picture to text') || message.includes('photo to text') || message.includes('scan')) {
    return getOCRGuide();
  }

  // ============================================
  // 2. TEXT-TO-SPEECH (TTS)
  // ============================================
  if (message.includes('text to speech') || message.includes('listen') || message.includes('read aloud') || message.includes('tts') || message.includes('hear text')) {
    return getTTSGuide();
  }

  // ============================================
  // 3. SPEECH-TO-TEXT (STT)
  // ============================================
  if (message.includes('speech to text') || message.includes('stt') || message.includes('pronunciation') || message.includes('speak word') || message.includes('practice speaking')) {
    return getSTTGuide();
  }

  // ============================================
  // 4. COLOR CODING
  // ============================================
  if (message.includes('color') || message.includes('colour') || message.includes('b and d') || message.includes('confusing letters') || message.includes('letter colors')) {
    return getColorCodingGuide();
  }

  // ============================================
  // 5. LEXIAI LEARNING
  // ============================================
  if (message.includes('lexiai') || message.includes('lexi ai') || message.includes('learning cards') || message.includes('interactive learning')) {
    return getLexiAIGuide();
  }

  // ============================================
  // 6. PHONOLOGY GAMES
  // ============================================
  if (message.includes('game') || message.includes('phonology') || message.includes('spelling') || message.includes('play') || message.includes('challenges')) {
    return getPhonologyGuide();
  }

  // ============================================
  // 7. STORIES
  // ============================================
  if (message.includes('stories') || message.includes('story') || message.includes('reading practice') || message.includes('read story')) {
    return getStoriesGuide();
  }

  // ============================================
  // 8. PROGRESS / DASHBOARD
  // ============================================
  if (message.includes('progress') || message.includes('dashboard') || message.includes('score') || message.includes('points') || message.includes('track') || message.includes('improvement')) {
    return getProgressGuide();
  }

  // ============================================
  // 9. SETTINGS / ACCESSIBILITY
  // ============================================
  if (message.includes('settings') || message.includes('font') || message.includes('size') || message.includes('accessibility') || message.includes('customize') || message.includes('preferences')) {
    return getSettingsGuide();
  }

  // WORD LEARNING
  if (message.includes('word learning') || message.includes('practice word') || message.includes('hard word') || message.includes('difficult word')) {
    return {
      type: 'educational',
      reply: "💡 **Master Difficult Words!**\n\nWhen you find a hard word, we help you learn it step by step!\n\n**🎯 How Word Learning Works:**\n\n**Step 1:** Reading text? See a highlighted yellow word?\n**Step 2:** **Click on that word**\n**Step 3:** See it broken into parts (syllables)\n   Example: 'elephant' → **el • e • phant**\n**Step 4:** View a helpful picture\n**Step 5:** Click each syllable to hear it\n**Step 6:** Click 'Say the Word' to hear it complete\n**Step 7:** Click 'I Got It!' when you've mastered it\n**Step 8:** **Earn +50 points!** 🎉\n\n**✨ Example Breakdown:**\n• **'beautiful'** → beau • ti • ful (3 parts)\n• **'elephant'** → el • e • phant (3 parts)\n• **'basketball'** → bas • ket • ball (3 parts)\n\n**💪 Why This Helps:**\n• Small parts are easier to learn\n• Pictures help you remember\n• Hearing each part builds confidence\n• Practice makes perfect!\n\n**🏆 Your Progress:**\n• Each mastered word: +50 points\n• Words saved to your dashboard\n• Teachers can see your improvement\n\nKeep practicing - you're doing great!",
      title: "Word Learning System",
      emoji: '💡',
      facts: [
        "Hard words highlighted in bright yellow",
        "Click any word to practice it",
        "Words split into easy syllables",
        "Pictures help memory and understanding",
        "Earn points for every word mastered!",
        "All progress tracked on dashboard"
      ]
    };
  }

  // HOW APP WORKS
  if (message.includes('how does it work') || message.includes('how app works') || message.includes('explain app') || message.includes('what does this app do')) {
    return {
      type: 'educational',
      reply: "🤖 **How This Reading Helper Works!**\n\nThis app uses smart technology to make reading easier and more fun for students with dyslexia!\n\n**🧠 The Magic Behind It:**\n\n**1. Smart Text Analysis**\n• Computer finds words that might be hard\n• Highlights them in yellow for you\n• Suggests practice methods\n\n**2. Visual Helpers** 🎨\n• Colors on confusing letters (b/d/p/q)\n• Special dyslexia-friendly fonts\n• Clear spacing between lines\n• High contrast options\n\n**3. Sound Helpers** 🔊\n• Reads text out loud clearly\n• Shows each word as it's read\n• Can go fast, normal, or slow\n• Practice pronunciation\n\n**4. Learning Tools** 📚\n• Breaks hard words into syllables\n• Shows pictures to help memory\n• Interactive learning cards\n• Fun spelling games\n\n**5. Progress Tracking** 📊\n• Saves everything you read\n• Shows your improvement\n• Celebrates your successes!\n• Teachers can help based on data\n\n**🌟 It's Like Having:**\n• A reading coach (always patient)\n• A helpful teacher (24/7 available)\n• A study buddy (never gets tired)\n• A cheerleader (celebrates wins)\n• All in one app!\n\n**💡 Everything Works Together:**\nAll these features combine to help YOU become a better, more confident reader!\n\n**Type 1-9 to learn about specific features!**",
      title: "How Your Reading Helper Works",
      emoji: '🤖',
      facts: [
        "Uses AI to find challenging words automatically",
        "Colors and fonts help your brain process text",
        "Audio helps with pronunciation and comprehension",
        "Tracks all progress automatically",
        "Designed by reading and dyslexia experts",
        "All features can be customized for you!"
      ]
    };
  }

  return null;
};

// ============================================
// DETAILED FEATURE GUIDE FUNCTIONS
// ============================================

function getOCRGuide() {
  return {
    type: 'educational',
    reply: "📸 **1. OCR: Picture to Text Magic!**\n\n**What is OCR?**\nOCR means 'Optical Character Recognition' - it's like magic that turns pictures into text you can read and hear!\n\n**📱 What Can You Upload?**\n• Photos of book pages\n• Pictures of worksheets\n• Signs and posters\n• Handwritten notes (print only)\n• Menu cards\n• Any text you see!\n\n**🎯 Step-by-Step Guide:**\n\n**Step 1:** Click **'Reader'** in the top menu\n\n**Step 2:** Click the **'Upload Image'** button 📸\n\n**Step 3:** Choose your photo:\n   • From your phone camera\n   • From saved pictures\n   • From downloads\n\n**Step 4:** Wait 3-5 seconds ⏳\n   • Computer is reading the text\n   • Converting to readable format\n\n**Step 5:** See the preview 👀\n   • Original image on left\n   • Extracted text on right\n   • Check if it looks correct\n\n**Step 6:** Click **'Load Text into Reader'**\n\n**Step 7:** Now you can:\n   • 🎨 Turn ON color coding\n   • 🔊 Listen to it read aloud\n   • 💡 Click hard words to learn\n   • 📝 Edit any mistakes\n\n**✅ Tips for Best Results:**\n• ☀️ Use good lighting\n• 📐 Hold camera steady\n• 🎯 Get close enough to read\n• 📏 Keep photo straight (not tilted)\n• 🔍 Make sure text isn't blurry\n\n**⚡ Processing Time:**\n• Small text: 2-3 seconds\n• Full page: 4-5 seconds\n• Multiple pages: 8-10 seconds\n\n**🎉 What Happens Next?**\nOnce text is loaded, you can use ALL the reading tools:\n✓ Color coding for confusing letters\n✓ Text-to-speech to hear it\n✓ Word learning for hard words\n✓ Save your reading session\n\n**💡 Did You Know?**\nYou can upload text in different languages too! The app will try to read any clear text.\n\n**Need more help?** Type 2-9 for other features!",
    title: "OCR Upload - Complete Guide",
    emoji: '📸',
    facts: [
      "OCR reads text from any clear picture",
      "Works with books, worksheets, signs, and more",
      "Takes only 3-5 seconds to process",
      "You can edit the text after upload",
      "Then use TTS, color coding, and all tools!",
      "Clear, well-lit photos give best results"
    ]
  };
}

function getTTSGuide() {
  return {
    type: 'educational',
    reply: "🔊 **2. Text-to-Speech: Listen & Learn!**\n\n**What is Text-to-Speech (TTS)?**\nThe computer reads text out loud to you in a clear, friendly voice!\n\n**🎯 Step-by-Step Guide:**\n\n**Step 1:** Load some text:\n   • Upload with OCR\n   • Type your own text\n   • Choose a story\n\n**Step 2:** Look for the **speaker icon** 🔊\n\n**Step 3:** Click **'Start Reading'** ▶️\n\n**Step 4:** Watch the magic! ✨\n   • Each word lights up as it's read\n   • Follow along with your eyes\n   • Listen carefully\n\n**Step 5:** Use the controls:\n   • ⏸️ **Pause** - Stop anytime\n   • ▶️ **Resume** - Continue reading\n   • ⏹️ **Stop** - End completely\n   • ⏩ **Speed Up** - Read faster\n   • ⏪ **Slow Down** - Read slower\n\n**⚡ Reading Speed Options:**\n\n• **Slow (0.5x)** 🐢\n  Perfect for learning new words\n  Best for difficult text\n  \n• **Normal (1.0x)** 👍\n  Regular reading pace\n  Good for practice\n  \n• **Fast (1.5x)** 🚀\n  For easier text\n  When you're confident\n\n**🎨 Visual Highlights:**\nAs the computer reads:\n• Current word is **HIGHLIGHTED**\n• Progress bar shows how much is left\n• Word counter shows progress\n\n**💡 Pro Tips:**\n\n1. **For New Words:**\n   • Use SLOW speed first\n   • Listen multiple times\n   • Watch the highlighted word\n\n2. **For Practice:**\n   • Use NORMAL speed\n   • Read along out loud\n   • Check your pronunciation\n\n3. **For Review:**\n   • Use FAST speed\n   • Quick refresher\n   • Check comprehension\n\n**🎯 Best Ways to Use TTS:**\n\n**Method 1: Listen First** 👂\n• Play the whole text\n• Just listen and understand\n• Don't worry about reading yet\n\n**Method 2: Read Along** 👀\n• Play and follow with eyes\n• See the word as you hear it\n• Connect sound to spelling\n\n**Method 3: Echo Reading** 🗣️\n• Listen to a sentence\n• Pause the reading\n• Repeat what you heard\n• Great for memory!\n\n**Method 4: Shadow Reading** 🎭\n• Read out loud with the voice\n• Try to match the speed\n• Improves fluency\n\n**🌟 Why TTS Helps:**\n• Hear correct pronunciation\n• Build reading confidence\n• Improve comprehension\n• Learn new vocabulary\n• Reduce reading stress\n• Multi-sensory learning (see + hear)\n\n**Need more help?** Type 1, 3-9 for other features!",
    title: "Text-to-Speech - Complete Guide",
    emoji: '🔊',
    facts: [
      "Computer reads text out loud clearly",
      "Highlights each word as it reads",
      "3 speed options: slow, normal, fast",
      "Perfect for learning pronunciation",
      "Improves reading comprehension",
      "Pause and resume anytime you want"
    ]
  };
}

function getSTTGuide() {
  return {
    type: 'educational',
    reply: "🎤 **3. Speech-to-Text: Practice Speaking!**\n\n**What is Speech-to-Text (STT)?**\nYou speak into the microphone, and the computer writes what you say! Great for practicing pronunciation!\n\n**🎯 Step-by-Step Guide:**\n\n**Step 1:** Find the **microphone button** 🎤\n   (Usually in Reader or Word Learning)\n\n**Step 2:** Click to **start recording**\n   • Microphone icon turns red 🔴\n   • You'll see 'Listening...'\n\n**Step 3:** **Speak clearly** into your device:\n   • Say the word or sentence\n   • Not too fast, not too slow\n   • Clear pronunciation\n\n**Step 4:** Computer shows what it heard 📝\n   • Text appears on screen\n   • Check if it's correct\n\n**Step 5:** Get instant feedback! ✅ or ❌\n\n**🎯 Best Practices for Speaking:**\n\n**Volume** 🔊\n• Not too loud (no shouting)\n• Not too quiet (not whispering)\n• Just like talking to a friend\n\n**Speed** ⏱️\n• Speak at normal pace\n• Don't rush words\n• Pause between words\n\n**Clarity** 🎵\n• Pronounce each syllable\n• Don't mumble\n• Speak confidently\n\n**Environment** 🏠\n• Quiet place (less background noise)\n• Close to microphone\n• No TV or music playing\n\n**💡 How to Practice Pronunciation:**\n\n**Method 1: Single Words**\n1. See a hard word (example: 'elephant')\n2. Listen to TTS say it first 🔊\n3. Click microphone 🎤\n4. Say the word: \"elephant\"\n5. Check if computer understood\n6. Try again if needed\n\n**Method 2: Syllable Practice**\n1. Word broken down: 'el-e-phant'\n2. Practice each part:\n   • Say: \"el\" ✓\n   • Say: \"e\" ✓\n   • Say: \"phant\" ✓\n3. Then say full word: \"elephant\"\n\n**Method 3: Sentence Practice**\n1. See a sentence\n2. Listen to TTS read it\n3. Record yourself saying it\n4. Compare with original\n\n**🌟 Why STT Helps:**\n• Practice pronunciation safely\n• Get instant feedback\n• Build speaking confidence\n• Learn correct word sounds\n• Multi-sensory learning\n• Track improvement\n\n**Need more help?** Type 1-2, 4-9 for other features!",
    title: "Speech-to-Text - Complete Guide",
    emoji: '🎤',
    facts: [
      "Practice speaking words and sentences",
      "Get instant feedback on pronunciation",
      "Computer writes what you say",
      "Great for building confidence",
      "Your voice is NOT saved or recorded",
      "Works with words, sentences, and stories"
    ]
  };
}

function getColorCodingGuide() {
  return {
    type: 'educational',
    reply: "🎨 **4. Color Coding: See Letters in Colors!** ⭐\n\n**What is Color Coding?**\nConfusing letters (like b, d, p, q) are shown in different bright colors to make them easier to tell apart!\n\n**🌈 Complete Color Guide:**\n\n**Most Confusing Letters:**\n• **b** = 🔵 **Blue** (stick on right →)\n• **d** = 🔴 **Red** (stick on left ←)\n• **p** = 🟢 **Green** (stick down right ↘)\n• **q** = 🟠 **Orange** (stick down left ↙)\n\n**Other Helpful Colors:**\n• **n** = ⚫ **Gray** (opens down ∩)\n• **u** = 🟠 **Orange** (opens up ∪)\n• **m** = 🔵 **Teal** (peaks up ⋀⋀)\n• **w** = 🔴 **Red** (valleys down ⋁⋁)\n\n**Vowels (Special):**\n• **a** = 🔵 **Blue**\n• **e** = 🟢 **Green**\n• **i** = 🟡 **Yellow**\n• **o** = 🟠 **Orange**\n• **u** = 🟣 **Purple**\n\n**🎯 How to Use Color Coding:**\n\n**Step 1:** Go to the **Reader** page 📖\n\n**Step 2:** Load your text:\n   • Upload an image with OCR\n   • Type your own text\n   • Choose a story\n\n**Step 3:** Find the **'Color Coding'** toggle\n   (Usually at the top of the reader)\n\n**Step 4:** **Turn it ON** 🎨\n   • Letters instantly change colors!\n   • Watch the magic happen\n\n**Step 5:** Read the colorful text! 🌈\n   • Colors make letters stand out\n   • Easier to tell them apart\n   • Less confusion while reading\n\n**💡 Why Each Color Was Chosen:**\n\n**b vs d (Most Common):**\n• **b** = Blue (think: \"Blue Ball bounces right →\")\n• **d** = Red (think: \"Red Door opens left ←\")\n• Opposite colors help your brain!\n\n**p vs q:**\n• **p** = Green (stick points down-right ↘)\n• **q** = Orange (stick points down-left ↙)\n• Different warm/cool colors\n\n**m vs w:**\n• **m** = Teal (mountains go up ⋀)\n• **w** = Red (waves go down ⋁)\n• Easy to remember!\n\n**🧠 Science Behind Color Coding:**\n\nResearch shows that color coding helps dyslexic readers by:\n1. **Visual Distinction** - Colors make letters unique\n2. **Memory Association** - Link color to letter shape\n3. **Reduced Confusion** - 60% fewer letter reversals\n4. **Faster Recognition** - Brain processes color quickly\n5. **Better Comprehension** - Less energy on decoding\n\n**📚 Reading Strategies:**\n\n**Strategy 1: Color Focus**\n• First read: Focus on colored letters\n• Second read: Read normally\n• Third read: Read for meaning\n\n**Strategy 2: Color Hunt**\n• Find all the blue 'b' letters\n• Find all the red 'd' letters\n• Makes reading a game!\n\n**Strategy 3: Pattern Recognition**\n• Notice color patterns in words\n• \"bed\" = blue, green, red\n• Build visual memory\n\n**🌟 Success Stories:**\n\nMany students report:\n• \"Colors saved my reading!\"\n• \"I don't mix up b and d anymore!\"\n• \"Reading is actually fun now!\"\n• \"My speed improved by 50%!\"\n\n**Need more help?** Type 1-3, 5-9 for other features!",
    title: "Color Coding - Complete Guide",
    emoji: '🎨',
    facts: [
      "b=Blue, d=Red, p=Green, q=Orange",
      "Reduces letter confusion by 60%!",
      "Based on scientific dyslexia research",
      "Can be turned on/off instantly",
      "Works with all text in the app",
      "Combine with TTS for best results!"
    ]
  };
}

function getLexiAIGuide() {
  return {
    type: 'educational',
    reply: "🤖 **5. LexiAI: Interactive Learning Cards!**\n\n**What is LexiAI?**\nLexiAI is your smart learning companion with 25+ interactive cards that teach fundamental concepts in a fun, engaging way!\n\n**📚 All 25 Learning Cards:**\n\n**📖 Language & Reading (8 cards):**\n1. **Alphabet Master** 🔤 - Learn A to Z\n2. **Phonics & Sounds** 🎵 - Letter combinations\n3. **Sight Words** 👀 - Common words\n4. **Rhymes & Patterns** 🎼 - Word families\n5. **Pattern Builder** 🧩 - Word patterns\n6. **Direction Sense** 🧭 - Left, right, up, down\n7. **Emotion Sense** 😊 - Feeling words\n8. **Safety & Social** 🛡️ - Safety rules\n\n**🔢 Numbers & Math (2 cards):**\n9. **Numbers & Digits** 🔢 - 0-100 counting\n10. **Size Comparison** 📏 - Big vs small\n\n**🎨 Visual Learning (5 cards):**\n11. **Colors & Shades** 🌈 - All colors\n12. **Shapes & Geometry** ⭐ - Basic shapes\n13. **Signs & Symbols** 🚦 - Common signs\n14. **Time & Calendar** ⏰ - Days, months\n15. **Weather Watch** ☀️ - Weather types\n\n**🌍 World Around Us (10 cards):**\n16. **Animals Explorer** 🦁 - Farm & wild animals\n17. **Birds World** 🦅 - Common birds\n18. **Insects Hub** 🐛 - Helpful insects\n19. **Fruits Basket** 🍎 - Common fruits\n20. **Vegetable Garden** 🥕 - Healthy veggies\n21. **Vehicles Zone** 🚗 - Cars, trucks, planes\n22. **Home Objects** 🏠 - Household items\n23. **Clothes & Wearables** 👕 - Clothing types\n24. **Human Body** 🧍 - Body parts\n25. **Nature Space** 🌳 - Trees, flowers, plants\n\n**🎯 How to Use LexiAI:**\n\n**Step 1:** Click **'LexiAI Hub'** in menu 🤖\n\n**Step 2:** Browse all 25 cards\n   • Scroll through categories\n   • See colorful previews\n\n**Step 3:** Choose a card\n   • Click to open\n   • Full-screen learning\n\n**Step 4:** Interact:\n   • 🖼️ View images\n   • 🔊 Listen to pronunciations\n   • 📖 Read descriptions\n   • 🎮 Play mini-games\n\n**Step 5:** Earn points and stars! ⭐\n\n**🌟 Why LexiAI is Special:**\n\n✓ **Multi-Sensory:** See, hear, touch, do\n✓ **Self-Paced:** Go at your own speed\n✓ **Fun & Engaging:** Game-like learning\n✓ **Dyslexia-Friendly:** Designed for you\n✓ **Comprehensive:** Covers everything\n✓ **Progress Tracked:** See improvement\n\n**Need more help?** Type 1-4, 6-9 for other features!",
    title: "LexiAI Learning - All 25 Cards!",
    emoji: '🤖',
    facts: [
      "25 interactive learning cards available",
      "Covers alphabet, numbers, animals, and more",
      "Multi-sensory learning (see, hear, do)",
      "Self-paced - go at your own speed",
      "Earn points and stars for progress",
      "Perfect for building fundamental skills!"
    ]
  };
}

function getPhonologyGuide() {
  return {
    type: 'educational',
    reply: "🎮 **6. Phonology Games: Fun Learning!**\n\n**What are Phonology Games?**\nFun, interactive games that help you practice spelling, sounds, and word patterns while earning points!\n\n**🎯 All 3 Games:**\n\n**━━━━━━━━━━━━━━━━━━━━**\n**GAME 1: Spelling Test** ✏️\n**━━━━━━━━━━━━━━━━━━━━**\n\n**How it works:**\n1. See a picture 🖼️ (Example: cat 🐱)\n2. Type what you see: \"cat\"\n3. Get instant feedback!\n   ✅ Correct: +10 points\n   ❌ Wrong: See correct answer\n4. Move to next word\n\n**Features:**\n• 50+ words with pictures\n• Difficulty levels (Easy/Medium/Hard)\n• Hints available\n• Sound clues\n• Timer challenge (optional)\n\n**━━━━━━━━━━━━━━━━━━━━**\n**GAME 2: Letter Replacement** 🔄\n**━━━━━━━━━━━━━━━━━━━━**\n\n**How it works:**\n1. See starting word: \"cat\" 🐱\n2. Get instruction: \"Remove 'c', Add 'b'\"\n3. Make new word: cat → bat\n4. Type answer: \"bat\" ✓\n5. Get emoji hints if wrong! 🦇\n\n**Example:**\n• cat → bat (c→b)\n• dog → fog (d→f)\n• sun → fun (s→f)\n\n**Learning Benefits:**\n• Understand word patterns\n• Practice letter sounds\n• Build phonemic awareness\n\n**━━━━━━━━━━━━━━━━━━━━**\n**GAME 3: Odd One Out** 🎯\n**━━━━━━━━━━━━━━━━━━━━**\n\n**How it works:**\n1. See 4 words with emojis:\n   • cat 🐱 (has 'a' sound)\n   • hat 🎩 (has 'a' sound)\n   • mat 🧘 (has 'a' sound)\n   • dog 🐕 (different!)\n2. Find the different one\n3. Click: \"dog 🐕\"\n4. Learn why it's different!\n\n**Types:**\n• Sound-based patterns\n• Spelling patterns\n• Meaning categories\n\n**🏆 Points & Rewards:**\n\n• Correct answer: +10 points ⭐\n• Perfect round: +25 points ⭐⭐\n• Streak bonus: +50 points 🔥\n• Daily practice: +100 points 🎉\n\n**🎯 Difficulty Levels:**\n\n**Level 1: Beginner** 🟢\n• 3-letter words\n• Simple sounds\n• Lots of hints\n\n**Level 2: Intermediate** 🟡\n• 4-5 letter words\n• More complex sounds\n• Fewer hints\n\n**Level 3: Advanced** 🔴\n• 6+ letter words\n• Complex patterns\n• Minimal hints\n\n**🌟 Why Games Help:**\n\n✓ Fun = Better Memory\n✓ Low Pressure\n✓ Immediate Feedback\n✓ Builds Confidence\n✓ Strengthens Skills\n\n**Need more help?** Type 1-5, 7-9 for other features!",
    title: "Phonology Games - Complete Guide",
    emoji: '🎮',
    facts: [
      "3 different fun learning games",
      "Spelling Test, Letter Replacement, Odd One Out",
      "Earn points and badges for playing",
      "Multiple difficulty levels available",
      "Instant feedback helps you learn",
      "Track progress on your dashboard!"
    ]
  };
}

function getStoriesGuide() {
  return {
    type: 'educational',
    reply: "📖 **7. Story Reading: Practice & Progress!**\n\n**What is Story Reading?**\nPractice reading with fun, dyslexia-friendly stories designed just for you!\n\n**📚 Available Stories:**\n\n**1. The Thirsty Crow** 🦅💧\n• Level: Beginner\n• Theme: Problem-solving\n\n**2. The Honest Boy** 👦💎\n• Level: Beginner\n• Theme: Honesty\n\n**3. The Ant and the Grasshopper** 🐜🦗\n• Level: Intermediate\n• Theme: Hard work\n\n**4. The Lion and the Mouse** 🦁🐭\n• Level: Beginner\n• Theme: Kindness\n\n**5. The Hare and the Tortoise** 🐰🐢\n• Level: Intermediate\n• Theme: Persistence\n\n**🎯 How to Read:**\n\n**━━━━ BEFORE READING ━━━━**\n\n**Step 1:** Click **'Stories'** in menu\n**Step 2:** Browse available stories\n**Step 3:** Choose one you like\n**Step 4:** Preview the story\n\n**━━━━ WHILE READING ━━━━**\n\n**Step 5:** Use the tools! 🛠️\n\n**🎨 Color Coding:**\n• Toggle ON for colored letters\n• b=Blue, d=Red, p=Green, q=Orange\n\n**🔊 Text-to-Speech:**\n• Click speaker to start\n• Follow along\n• Adjust speed\n\n**💡 Word Learning:**\n• Hard words in yellow\n• Click to practice\n• See syllables\n• Hear pronunciation\n\n**⏱️ Reading Timer:**\n• Tracks your time\n• Shows on dashboard\n• Measure improvement\n\n**━━━━ AFTER READING ━━━━**\n\n**Step 7:** Mark difficult words 📌\n**Step 8:** Check your stats 📊\n**Step 9:** Answer questions (optional)\n**Step 10:** Earn reward! 🏆\n• +100 points for completing!\n• Story badge unlocked\n\n**🎯 Reading Strategies:**\n\n**Strategy 1: Listen First** 🔊\n• TTS reads full story\n• Just listen\n• Understand plot\n\n**Strategy 2: Follow Along** 👀\n• TTS reads\n• You follow with eyes\n• See + hear words\n\n**Strategy 3: Read Aloud** 🗣️\n• You read out loud\n• Practice pronunciation\n• Build confidence\n\n**Strategy 4: Speed Read** ⚡\n• Try reading faster\n• Focus on meaning\n• Build fluency\n\n**🏆 Story Achievements:**\n\n• 📖 First Story (complete 1)\n• 📚 Book Worm (complete 5)\n• 🌟 Story Master (complete all)\n• ⚡ Speed Reader (150+ WPM)\n• 🎯 Accuracy Pro (95%+)\n• 🔥 7-Day Streak (daily reading)\n\n**💡 Tips:**\n\n1. Start with beginner stories\n2. Read daily (even 10 minutes!)\n3. Use all tools\n4. Reread stories\n5. Don't stress about speed\n6. Make it fun!\n\n**Need more help?** Type 1-6, 8-9 for other features!",
    title: "Story Reading - Complete Guide",
    emoji: '📖',
    facts: [
      "Multiple engaging stories available",
      "Use color coding while reading",
      "Listen with text-to-speech",
      "Track reading speed and accuracy",
      "Earn points and badges",
      "Practice with all reading tools!"
    ]
  };
}

function getProgressGuide() {
  return {
    type: 'educational',
    reply: "📊 **8. Progress Tracking: See Your Growth!**\n\n**What is Progress Tracking?**\nYour personal dashboard shows how much you're improving!\n\n**🎯 How to Access:**\n\n**Step 1:** Click **'Dashboards'** in menu\n**Step 2:** Select **'Student Dashboard'**\n**Step 3:** See all your stats! 📈\n\n**📊 What Dashboard Shows:**\n\n**━━━━━━━━━━━━━━━━━━**\n**1. Quick Stats** ⚡\n**━━━━━━━━━━━━━━━━━━**\n\n**Reading Speed (WPM):**\n```\n📈 Reading Speed\nCurrent: 125 WPM ↑ (+10)\nAverage: 118 WPM\nBest: 135 WPM 🏆\nGoal: 150 WPM\n```\n\n**Accuracy:**\n```\n🎯 Accuracy\nCurrent: 92% ✓ Excellent!\nAverage: 89%\nBest: 95% 🏆\n```\n\n**Reading Time:**\n```\n⏱️ Time\nToday: 25 min\nThis Week: 120 min\nThis Month: 480 min\nAll Time: 40 hours 🎉\n```\n\n**Points & Level:**\n```\n🏆 Progress\nPoints: 5,420\nLevel: 15 🌟\nNext Level: 250 points\nClass Rank: #3 of 25\n```\n\n**━━━━━━━━━━━━━━━━━━**\n**2. Progress Charts** 📈\n**━━━━━━━━━━━━━━━━━━**\n\n• Speed chart (WPM over time)\n• Accuracy chart (weekly)\n• Reading time (daily bars)\n• Streak visualization\n\n**━━━━━━━━━━━━━━━━━━**\n**3. Stories Completed** 📚\n**━━━━━━━━━━━━━━━━━━**\n\n```\n📖 The Thirsty Crow\nCompleted: ✅ 3 times\nFirst Read: Dec 15\nLast Read: Jan 20\nBest WPM: 125\nBest Accuracy: 94%\nBadge: 🦅 Crow Master\n```\n\n**━━━━━━━━━━━━━━━━━━**\n**4. Session History** 🕐\n**━━━━━━━━━━━━━━━━━━**\n\n```\nDate    | Activity   | Time  | WPM | Acc  | Points\nJan 30  | Story      | 15min | 125 | 92%  | +100\nJan 30  | OCR        | 10min | 118 | 90%  | +50\nJan 29  | Games      | 20min | N/A | 88%  | +75\n```\n\n**━━━━━━━━━━━━━━━━━━**\n**5. Difficult Words** 💬\n**━━━━━━━━━━━━━━━━━━**\n\n```\n💡 Active Practice\n• elephant (seen 5×) 🐘\n• beautiful (seen 3×) 💐\n\n✅ Mastered\n• rainbow ✓ 🌈\n• sunshine ✓ ☀️\n```\n\n**━━━━━━━━━━━━━━━━━━**\n**6. Achievements** 🏆\n**━━━━━━━━━━━━━━━━━━**\n\n**Badges Earned:**\n• 📖 First Story\n• 📚 Book Worm (5 stories)\n• ⚡ Speed Reader (150 WPM)\n• 🔥 7-Day Streak\n• 💯 100 Points\n• 💡 Word Master (25 words)\n\n**━━━━━━━━━━━━━━━━━━**\n**7. Goals & Streaks** 🎯\n**━━━━━━━━━━━━━━━━━━**\n\n```\nCurrent Goals:\n✅ Read 3 stories (3/3)\n⬜ Practice 30min daily (4/7)\n⬜ Master 5 words (3/5)\n\nActive Streaks:\n🔥 Daily Reading: 5 days\n🎮 Game Playing: 3 days\n💡 Word Learning: 7 days\n```\n\n**━━━━━━━━━━━━━━━━━━**\n**8. Recommendations** 💡\n**━━━━━━━━━━━━━━━━━━**\n\n```\nSuggested Next Steps:\n\n1. 📖 Read \"Lion & Mouse\"\n2. 💬 Practice: beautiful, elephant\n3. 🎮 Play Letter Replacement\n4. 🎨 Use color coding more\n5. ⏱️ Try speed challenge\n```\n\n**🎯 Understanding Stats:**\n\n**WPM Levels:**\n• Below 100: Beginner\n• 100-120: Good\n• 120-140: Great\n• 140-160: Excellent\n• 160+: Amazing!\n\n**Accuracy:**\n• Below 70%: Need practice\n• 70-80%: Improving\n• 80-90%: Good\n• 90-95%: Great\n• 95%+: Outstanding!\n\n**💡 Tips:**\n\n1. Check daily\n2. Set small goals\n3. Celebrate wins\n4. Don't compare\n5. Be consistent\n6. Use all tools\n\n**🌟 Remember:**\n• Progress isn't always linear\n• Every effort counts\n• You're improving daily\n• Celebrate small victories!\n\n**Need more help?** Type 1-7, 9 for other features!",
    title: "Progress Tracking - Complete Guide",
    emoji: '📊',
    facts: [
      "Track reading speed (WPM) over time",
      "See all stories you've completed",
      "Monitor words you're mastering",
      "View points, badges, and levels",
      "Compare progress week by week",
      "Get personalized recommendations!"
    ]
  };
}

function getSettingsGuide() {
  return {
    type: 'educational',
    reply: "⚙️ **9. Settings: Customize Your Experience!**\n\n**What are Settings?**\nMake the app perfect for YOU! Change fonts, colors, sizes, and more.\n\n**🎯 How to Access:**\n\n**Step 1:** Click **Settings icon** ⚙️\n**Step 2:** Settings panel opens\n**Step 3:** Explore options\n**Step 4:** Changes save automatically! ✓\n\n**📝 All Settings:**\n\n**━━━━━━━━━━━━━━━━━━**\n**FONT OPTIONS** 🔤\n**━━━━━━━━━━━━━━━━━━**\n\n**1. OpenDyslexic** ⭐ RECOMMENDED\n• Designed for dyslexia\n• Weighted bottoms\n• Prevents letter flipping\n\n**2. Arial**\n• Clean and simple\n• Easy to read\n\n**3. Comic Sans**\n• Friendly appearance\n• Rounded letters\n\n**4. Verdana**\n• Wide letters\n• Extra spacing\n\n**━━━━━━━━━━━━━━━━━━**\n**TEXT SIZE** 🔍\n**━━━━━━━━━━━━━━━━━━**\n\n• Small (16px)\n• **Medium (20px)** ⭐ Default\n• Large (24px)\n• Extra Large (28px)\n\n**━━━━━━━━━━━━━━━━━━**\n**LINE SPACING** 📏\n**━━━━━━━━━━━━━━━━━━**\n\n• Normal (1.5)\n• **Relaxed (1.8)** ⭐ Recommended\n• Wide (2.0)\n• Extra Wide (2.5)\n\n**Why it matters:**\n• Easier to track lines\n• Less \"line jumping\"\n• 60% better for dyslexia\n\n**━━━━━━━━━━━━━━━━━━**\n**CONTRAST MODE** 🎨\n**━━━━━━━━━━━━━━━━━━**\n\n• Normal (black on white)\n• **High Contrast** ⭐ (easier on eyes)\n• Inverted (white on black)\n• Sepia (cream background)\n\n**When to use:**\n• Bright room: Normal\n• Dim room: High contrast\n• Night: Inverted\n• Long reading: Sepia\n\n**━━━━━━━━━━━━━━━━━━**\n**BACKGROUND COLORS** 🎨\n**━━━━━━━━━━━━━━━━━━**\n\n• White (default)\n• Cream/Beige (warm)\n• Light Blue (calming)\n• Light Green (relaxing)\n• Light Gray (modern)\n\n**━━━━━━━━━━━━━━━━━━**\n**ACCESSIBILITY** ♿\n**━━━━━━━━━━━━━━━━━━**\n\n**Color Coding:**\n• Toggle ON/OFF\n• Choose letters\n• Adjust intensity\n\n**Text-to-Speech:**\n• Default speed\n• Voice selection\n• Auto-play\n\n**Focus Mode:**\n• Dim surrounding text\n• Highlight current line\n• Reduce distractions\n\n**━━━━━━━━━━━━━━━━━━**\n**RECOMMENDED SETTINGS** ⭐\n**━━━━━━━━━━━━━━━━━━**\n\n**For Dyslexia (Beginner):**\n```\n✓ Font: OpenDyslexic\n✓ Size: Large (24px)\n✓ Spacing: Wide (2.0)\n✓ Contrast: High\n✓ Background: Light Blue\n✓ Color Coding: ON\n✓ TTS Speed: Slow (0.75x)\n```\n\n**For Dyslexia (Advanced):**\n```\n✓ Font: OpenDyslexic\n✓ Size: Medium (20px)\n✓ Spacing: Relaxed (1.8)\n✓ Contrast: Normal/High\n✓ Background: Cream\n✓ Color Coding: Optional\n✓ TTS Speed: Normal (1.0x)\n```\n\n**🎯 Finding Best Settings:**\n\n**Step 1:** Start with recommended\n**Step 2:** Read a paragraph\n**Step 3:** Adjust one thing at a time\n**Step 4:** Note what's comfortable\n**Step 5:** Save your favorite!\n\n**💡 Tips:**\n\n1. Experiment freely\n2. Change is OK\n3. Different tasks = different settings\n4. Ask teacher for advice\n5. Be patient finding perfect fit\n\n**🌟 Remember:**\n• Your comfort matters most\n• Perfect settings = better reading\n• Everyone is different\n• Adjust anytime\n• Auto-saved!\n\n**Need more help?** Type 1-8 for other features!",
    title: "Settings & Customization - Complete Guide",
    emoji: '⚙️',
    facts: [
      "OpenDyslexic font designed for dyslexia",
      "Multiple text sizes available",
      "Adjust line spacing for clarity",
      "High contrast reduces eye strain",
      "Custom background colors",
      "All settings save automatically!"
    ]
  };
}

// ============================================
// 3. GET IMAGE FROM UNSPLASH
// ============================================
const getImageForQuery = async (query) => {
  try {
    const cleanQuery = query
      .replace(/what is|tell me about|show me|explain/gi, '')
      .trim();
    
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(cleanQuery)}`;
    console.log('[Image] Generated URL for:', cleanQuery);
    return imageUrl;
    
  } catch (error) {
    console.error('[Image] Error:', error.message);
    return `https://via.placeholder.com/800x600/667eea/ffffff?text=${encodeURIComponent(query)}`;
  }
};

// ============================================
// 4. SEARCH WIKIPEDIA
// ============================================
const searchWikipedia = async (query) => {
  try {
    console.log('[Wikipedia] Searching for:', query);
    
    const cleanQuery = query
      .replace(/what is|tell me about|show me|explain|how does|why is/gi, '')
      .trim();
    
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`, {
      timeout: 8000,
      headers: {
        'User-Agent': 'DyslexiaLearningApp/1.0'
      }
    });

    if (response.data && response.data.extract) {
      console.log('[Wikipedia] ✅ Found information');
      return {
        text: response.data.extract,
        title: response.data.title,
        thumbnail: response.data.thumbnail?.source || null
      };
    }
    
    return null;
  } catch (error) {
    console.error('[Wikipedia] Error:', error.message);
    return null;
  }
};

// ============================================
// 5. SEARCH DUCKDUCKGO
// ============================================
const searchDuckDuckGo = async (query) => {
  try {
    console.log('[DuckDuckGo] Searching for:', query);
    
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1
      },
      timeout: 8000
    });

    const data = response.data;
    
    if (data.AbstractText) {
      console.log('[DuckDuckGo] ✅ Found AbstractText');
      return {
        text: data.AbstractText,
        title: data.Heading,
        image: data.Image || null
      };
    }
    
    if (data.Answer) {
      console.log('[DuckDuckGo] ✅ Found Answer');
      return {
        text: data.Answer,
        title: query,
        image: null
      };
    }
    
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const topic = data.RelatedTopics[0];
      if (topic.Text) {
        console.log('[DuckDuckGo] ✅ Found Related Topic');
        return {
          text: topic.Text,
          title: topic.FirstURL?.split('/').pop() || query,
          image: topic.Icon?.URL || null
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('[DuckDuckGo] Error:', error.message);
    return null;
  }
};

// ============================================
// 6. SIMPLIFY FOR 7-10 YEAR OLDS
// ============================================
const simplifyForKids = (text) => {
  if (!text) return "I couldn't find that. Can you ask something else?";
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Take only 2-3 sentences for kids
  let simplified = sentences.slice(0, 3).join(' ');
  
  // Limit to 80 words (shorter for kids)
  const words = simplified.split(' ');
  if (words.length > 80) {
    simplified = words.slice(0, 80).join(' ') + '...';
  }
  
  // Remove complex parts
  simplified = simplified
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '') // Remove parentheses
    .replace(/\b(approximately|essentially|particularly|specifically)\b/gi, '') // Remove big words
    .trim();
  
  return simplified;
};

// ============================================
// 7. EXTRACT 2-3 SIMPLE FACTS
// ============================================
const extractSimpleFacts = (text) => {
  if (!text) return [];
  
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  // Get only 2-3 facts for kids (not overwhelming)
  const facts = sentences
    .slice(0, 4)
    .filter(s => {
      const words = s.trim().split(' ');
      return words.length >= 5 && words.length <= 20; // Not too short, not too long
    })
    .map(s => s.trim())
    .slice(0, 3); // Maximum 3 facts
  
  return facts;
};

// ============================================
// 8. MAIN CHAT HANDLER
// ============================================
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        success: false,
        reply: 'Please send a message'
      });
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📩 STUDENT ASKS:', message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // STEP 1: Check if it's a math problem
    const mathResult = calculateMath(message);
    if (mathResult) {
      console.log('🔢 Math calculation detected\n');
      
      const mathResponse = `🔢 **Calculator**\n\n${mathResult.expression} = **${mathResult.formatted}**\n\n✨ Great job asking! Want to try another math problem?`;
      
      return res.json({
        success: true,
        type: 'calculator',
        reply: mathResponse,
        calculation: mathResult,
        emoji: '🔢',
        timestamp: new Date().toISOString()
      });
    }
    
    // STEP 2: Check for quick responses (includes project help)
    const quickResponse = getQuickResponse(message);
    if (quickResponse) {
      console.log('✅ Quick response sent\n');
      return res.json({
        success: true,
        ...quickResponse,
        timestamp: new Date().toISOString()
      });
    }
    
    // STEP 3: Get image
    console.log('🖼️  Fetching image...');
    const imageUrl = await getImageForQuery(message);
    
    // STEP 4: Search Wikipedia
    console.log('🔍 Searching Wikipedia...');
    let info = await searchWikipedia(message);
    
    // STEP 5: Try DuckDuckGo if Wikipedia fails
    if (!info || !info.text) {
      console.log('🔍 Trying DuckDuckGo...');
      info = await searchDuckDuckGo(message);
    }
    
    // STEP 6: Process information for kids
    if (info && info.text) {
      console.log('✅ Information found!\n');
      
      // Simplify for 7-10 year olds
      const simplifiedText = simplifyForKids(info.text);
      
      // Extract simple facts
      const keyFacts = extractSimpleFacts(info.text);
      
      // Use Wikipedia thumbnail or Unsplash
      const finalImageUrl = info.thumbnail || imageUrl;
      
      const title = info.title || message;
      const emoji = getEmoji(message);
      
      const responseText = `${emoji} **${title}**\n\n${simplifiedText}`;
      
      console.log('📤 Sending kid-friendly response\n');
      
      return res.json({
        success: true,
        type: 'educational',
        reply: responseText,
        imageUrl: finalImageUrl,
        facts: keyFacts,
        title: title,
        simplifiedText: simplifiedText,
        emoji: emoji,
        timestamp: new Date().toISOString()
      });
    }
    
    // STEP 7: Just show image if no info found
    console.log('⚠️  No info found, showing image only\n');
    
    const basicResponse = `Here's a picture of ${message}! 🖼️\n\nLooks cool, right?`;
    
    return res.json({
      success: true,
      type: 'image',
      reply: basicResponse,
      imageUrl: imageUrl,
      facts: [],
      title: message,
      emoji: '🖼️',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({ 
      success: false,
      type: 'text',
      reply: 'Oops! Something went wrong. Can you try asking again?',
      error: error.message
    });
  }
});

// ============================================
// 9. GET EMOJI FOR QUERY
// ============================================
const getEmoji = (query) => {
  const q = query.toLowerCase();
  
  // Animals
  if (q.includes('dog')) return '🐕';
  if (q.includes('cat')) return '🐱';
  if (q.includes('bird')) return '🐦';
  if (q.includes('fish')) return '🐟';
  if (q.includes('elephant')) return '🐘';
  if (q.includes('lion')) return '🦁';
  if (q.includes('tiger')) return '🐯';
  if (q.includes('bear')) return '🐻';
  if (q.includes('monkey')) return '🐵';
  if (q.includes('rabbit')) return '🐰';
  
  // Food
  if (q.includes('apple')) return '🍎';
  if (q.includes('banana')) return '🍌';
  if (q.includes('pizza')) return '🍕';
  if (q.includes('burger')) return '🍔';
  if (q.includes('cake')) return '🎂';
  if (q.includes('ice cream')) return '🍦';
  
  // Vehicles
  if (q.includes('car')) return '🚗';
  if (q.includes('bus')) return '🚌';
  if (q.includes('plane') || q.includes('airplane')) return '✈️';
  if (q.includes('bike') || q.includes('bicycle')) return '🚲';
  if (q.includes('train')) return '🚂';
  if (q.includes('boat')) return '⛵';
  
  // Places
  if (q.includes('taj mahal') || q.includes('tajmahal')) return '🕌';
  if (q.includes('eiffel')) return '🗼';
  if (q.includes('mountain')) return '🏔️';
  if (q.includes('beach')) return '🏖️';
  if (q.includes('castle')) return '🏰';
  
  // Objects
  if (q.includes('ball')) return '⚽';
  if (q.includes('book')) return '📚';
  if (q.includes('phone')) return '📱';
  if (q.includes('computer')) return '💻';
  if (q.includes('rocket')) return '🚀';
  if (q.includes('star')) return '⭐';
  
  // Activities
  if (q.includes('running')) return '🏃';
  if (q.includes('swimming')) return '🏊';
  if (q.includes('dancing')) return '💃';
  if (q.includes('singing')) return '🎤';
  if (q.includes('painting')) return '🎨';
  
  // Nature
  if (q.includes('sun')) return '☀️';
  if (q.includes('moon')) return '🌙';
  if (q.includes('rainbow')) return '🌈';
  if (q.includes('flower')) return '🌸';
  if (q.includes('tree')) return '🌳';
  
  // Default
  return '✨';
};

// ============================================
// 10. HEALTH CHECK
// ============================================
router.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'Dyslexia Learning Assistant Online! 🎓',
    features: [
      'Learn about anything (animals, places, objects)',
      'Basic calculator (add, subtract, multiply, divide)',
      'Simple explanations for 7-10 year olds',
      'Beautiful images',
      'Fun facts',
      'Complete project help & guides (offline mode)',
      '9 comprehensive feature guides available'
    ],
    examples: [
      'Type 1-9 for feature guides',
      'What is 5 + 3?',
      'Taj Mahal',
      'How does OCR work?',
      'Tell me about color coding',
      'How to use stories?',
      'elephant'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
