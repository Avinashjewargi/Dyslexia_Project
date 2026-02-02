const express = require("express");
const router = express.Router();

// Helper: pick random response
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

router.post("/chat", (req, res) => {
  const userMsg = req.body.message?.toLowerCase() || "";
  let reply = "";

  // 1️⃣ Greeting
  if (["hello", "hi", "hey"].some(w => userMsg.includes(w))) {
    reply = pick([
      "Hello 👋 I’m here to help you.",
      "Hi 😊 How can I support you today?",
      "Hey! Let’s learn together 🌈"
    ]);
  }

  // 2️⃣ Dyslexia explanation
  else if (userMsg.includes("dyslexia")) {
    reply = pick([
      "Dyslexia affects reading and writing, not intelligence.",
      "People with dyslexia learn differently, and that’s okay 💙",
      "Many successful people have dyslexia 🌟"
    ]);
  }

  // 3️⃣ Reading difficulty
  else if (userMsg.includes("reading") || userMsg.includes("read")) {
    reply = pick([
      "Take your time. Read slowly, one word at a time.",
      "Try reading aloud. It can help your brain understand.",
      "Break long words into smaller parts 😊"
    ]);
  }

  // 4️⃣ Confusion
  else if (userMsg.includes("confused") || userMsg.includes("confusion")) {
    reply = pick([
      "It’s okay to feel confused 💙 Take a small break.",
      "Confusion means your brain is learning something new.",
      "Let’s go step by step. You’re doing well 👍"
    ]);
  }

  // 5️⃣ Pronunciation request
  else if (userMsg.includes("pronounce")) {
    const word = userMsg.split("pronounce")[1]?.trim();

    if (word) {
      reply = `Sure 😊 The word "${word}" sounds like: ${word
        .split("")
        .join("-")}. You can say it slowly.`;
    } else {
      reply = "Please tell me the word you want to pronounce 😊";
    }
  }

  // 6️⃣ Emotional support
  else if (
    userMsg.includes("hard") ||
    userMsg.includes("difficult") ||
    userMsg.includes("sad")
  ) {
    reply = pick([
      "Learning can be hard, but you are not alone 💙",
      "It’s okay to struggle. Keep trying 🌱",
      "You are doing your best, and that matters 😊"
    ]);
  }

  // 7️⃣ Default
  else {
    reply = pick([
      "I’m here to help 😊 Can you tell me more?",
      "Let’s try together. What do you need help with?",
      "I didn’t understand fully. Can you explain again?"
    ]);
  }

  res.json({ reply });
});

module.exports = router;
