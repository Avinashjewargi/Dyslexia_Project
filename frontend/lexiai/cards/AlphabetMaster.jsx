// frontend/lexiai/cards/AlphabetMaster.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function AlphabetMaster() {

  // 🔠 Capital Letters A–Z
  const capitalAlphabetItems = [
    { word: 'A', emoji: '🍎', audioText: 'Capital A, like Apple', description: 'Capital letter A' },
    { word: 'B', emoji: '🐝', audioText: 'Capital B, like Bee', description: 'Capital letter B' },
    { word: 'C', emoji: '😺', audioText: 'Capital C, like Cat', description: 'Capital letter C' },
    { word: 'D', emoji: '🐕', audioText: 'Capital D, like Dog', description: 'Capital letter D' },
    { word: 'E', emoji: '🐘', audioText: 'Capital E, like Elephant', description: 'Capital letter E' },
    { word: 'F', emoji: '🐸', audioText: 'Capital F, like Frog', description: 'Capital letter F' },
    { word: 'G', emoji: '🦒', audioText: 'Capital G, like Giraffe', description: 'Capital letter G' },
    { word: 'H', emoji: '🏠', audioText: 'Capital H, like House', description: 'Capital letter H' },
    { word: 'I', emoji: '🍦', audioText: 'Capital I, like Ice cream', description: 'Capital letter I' },
    { word: 'J', emoji: '🧃', audioText: 'Capital J, like Juice', description: 'Capital letter J' },
    { word: 'K', emoji: '🔑', audioText: 'Capital K, like Key', description: 'Capital letter K' },
    { word: 'L', emoji: '🦁', audioText: 'Capital L, like Lion', description: 'Capital letter L' },
    { word: 'M', emoji: '🐵', audioText: 'Capital M, like Monkey', description: 'Capital letter M' },
    { word: 'N', emoji: '🥜', audioText: 'Capital N, like Nut', description: 'Capital letter N' },
    { word: 'O', emoji: '🐙', audioText: 'Capital O, like Octopus', description: 'Capital letter O' },
    { word: 'P', emoji: '🐧', audioText: 'Capital P, like Penguin', description: 'Capital letter P' },
    { word: 'Q', emoji: '👸', audioText: 'Capital Q, like Queen', description: 'Capital letter Q' },
    { word: 'R', emoji: '🚀', audioText: 'Capital R, like Rocket', description: 'Capital letter R' },
    { word: 'S', emoji: '⭐', audioText: 'Capital S, like Star', description: 'Capital letter S' },
    { word: 'T', emoji: '🌳', audioText: 'Capital T, like Tree', description: 'Capital letter T' },
    { word: 'U', emoji: '☂️', audioText: 'Capital U, like Umbrella', description: 'Capital letter U' },
    { word: 'V', emoji: '🎻', audioText: 'Capital V, like Violin', description: 'Capital letter V' },
    { word: 'W', emoji: '🍉', audioText: 'Capital W, like Watermelon', description: 'Capital letter W' },
    { word: 'X', emoji: '❌', audioText: 'Capital X, like X-ray', description: 'Capital letter X' },
    { word: 'Y', emoji: '🧶', audioText: 'Capital Y, like Yarn', description: 'Capital letter Y' },
    { word: 'Z', emoji: '🦓', audioText: 'Capital Z, like Zebra', description: 'Capital letter Z' },
  ];

  // 🔡 Small Letters a–z
  const smallAlphabetItems = [
    { word: 'a', emoji: '🍎', audioText: 'Lowercase a, like apple', description: 'Lowercase letter a' },
    { word: 'b', emoji: '⚽', audioText: 'Lowercase b, like ball', description: 'Lowercase letter b (don’t confuse with d)' },
    { word: 'c', emoji: '🚗', audioText: 'Lowercase c, like car', description: 'Lowercase letter c' },
    { word: 'd', emoji: '🦆', audioText: 'Lowercase d, like duck', description: 'Lowercase letter d (don’t confuse with b)' },
    { word: 'e', emoji: '🥚', audioText: 'Lowercase e, like egg', description: 'Lowercase letter e' },
    { word: 'f', emoji: '🐟', audioText: 'Lowercase f, like fish', description: 'Lowercase letter f' },
    { word: 'g', emoji: '🍇', audioText: 'Lowercase g, like grapes', description: 'Lowercase letter g' },
    { word: 'h', emoji: '🏠', audioText: 'Lowercase h, like house', description: 'Lowercase letter h' },
    { word: 'i', emoji: '🍦', audioText: 'Lowercase i, like ice cream', description: 'Lowercase letter i' },
    { word: 'j', emoji: '🧃', audioText: 'Lowercase j, like juice', description: 'Lowercase letter j' },
    { word: 'k', emoji: '🪁', audioText: 'Lowercase k, like kite', description: 'Lowercase letter k' },
    { word: 'l', emoji: '🍋', audioText: 'Lowercase l, like lemon', description: 'Lowercase letter l' },
    { word: 'm', emoji: '🌙', audioText: 'Lowercase m, like moon', description: 'Lowercase letter m' },
    { word: 'n', emoji: '🥜', audioText: 'Lowercase n, like nut', description: 'Lowercase letter n' },
    { word: 'o', emoji: '🍊', audioText: 'Lowercase o, like orange', description: 'Lowercase letter o' },
    { word: 'p', emoji: '🍕', audioText: 'Lowercase p, like pizza', description: 'Lowercase letter p (don’t confuse with q)' },
    { word: 'q', emoji: '❓', audioText: 'Lowercase q, like question', description: 'Lowercase letter q (don’t confuse with p)' },
    { word: 'r', emoji: '🌧️', audioText: 'Lowercase r, like rain', description: 'Lowercase letter r' },
    { word: 's', emoji: '☀️', audioText: 'Lowercase s, like sun', description: 'Lowercase letter s' },
    { word: 't', emoji: '🌳', audioText: 'Lowercase t, like tree', description: 'Lowercase letter t' },
    { word: 'u', emoji: '☂️', audioText: 'Lowercase u, like umbrella', description: 'Lowercase letter u' },
    { word: 'v', emoji: '🎻', audioText: 'Lowercase v, like violin', description: 'Lowercase letter v' },
    { word: 'w', emoji: '🌊', audioText: 'Lowercase w, like wave', description: 'Lowercase letter w' },
    { word: 'x', emoji: '❌', audioText: 'Lowercase x, like x-ray', description: 'Lowercase letter x' },
    { word: 'y', emoji: '💛', audioText: 'Lowercase y, like yellow', description: 'Lowercase letter y' },
    { word: 'z', emoji: '0️⃣', audioText: 'Lowercase z, like zero', description: 'Lowercase letter z' },
  ];

  return (
    <>
      <LearningCard
        title="Alphabet Master – Capital Letters"
        subtitle="Learn A–Z"
        category="🅰️ Language & Literacy"
        categoryColor="#FF6B6B"
        items={capitalAlphabetItems}
      />

      <LearningCard
        title="Alphabet Master – Small Letters"
        subtitle="Learn a–z"
        category="🅰️ Language & Literacy"
        categoryColor="#4ECDC4"
        items={smallAlphabetItems}
      />
    </>
  );
}

export default AlphabetMaster;
