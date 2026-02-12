// frontend/lexiai/cards/SizeComparison.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function SizeComparison() {
  const sizeItems = [
    // 🐘 Basic Size
    { word: 'big', emoji: '🐘', audioText: 'Big - Large in size', description: 'More than normal size' },
    { word: 'small', emoji: '🐁', audioText: 'Small - Little in size', description: 'Less than normal size' },
    { word: 'medium', emoji: '🐕', audioText: 'Medium - Middle size', description: 'Not big, not small' },
    { word: 'tiny', emoji: '🐜', audioText: 'Tiny - Very small', description: 'Extremely small' },
    { word: 'huge', emoji: '🦕', audioText: 'Huge - Very big', description: 'Extremely large' },

    // 📏 Height
    { word: 'tall', emoji: '🦒', audioText: 'Tall - High from bottom to top', description: 'Great height' },
    { word: 'short (height)', emoji: '🧒', audioText: 'Short - Not very tall', description: 'Small height' },
    { word: 'high', emoji: '🏔️', audioText: 'High - Far above ground', description: 'Up above' },
    { word: 'low', emoji: '⬇️', audioText: 'Low - Near the ground', description: 'Down below' },

    // 📐 Length
    { word: 'long', emoji: '🚂', audioText: 'Long - Goes far', description: 'Great length' },
    { word: 'short (length)', emoji: '✂️', audioText: 'Short - Does not go far', description: 'Small length' },

    // ↔️ Width & Thickness
    { word: 'wide', emoji: '🛣️', audioText: 'Wide - Big from side to side', description: 'Large width' },
    { word: 'narrow', emoji: '🚪', audioText: 'Narrow - Not wide', description: 'Small width' },
    { word: 'thick', emoji: '📚', audioText: 'Thick - Fat and solid', description: 'Large thickness' },
    { word: 'thin', emoji: '📄', audioText: 'Thin - Not thick', description: 'Small thickness' },

    // ⚖️ Weight
    { word: 'heavy', emoji: '🪨', audioText: 'Heavy - Weighs a lot', description: 'Hard to lift' },
    { word: 'light', emoji: '🪶', audioText: 'Light - Not heavy', description: 'Easy to lift' },

    // 🥛 Capacity
    { word: 'full', emoji: '🥛', audioText: 'Full - All filled', description: 'No space left' },
    { word: 'half', emoji: '🥛➗2️⃣', audioText: 'Half - Middle amount', description: 'Half filled' },
    { word: 'empty', emoji: '🫙', audioText: 'Empty - Nothing inside', description: 'No content' },

    // 📊 Comparison Words
    { word: 'bigger', emoji: '📈', audioText: 'Bigger - More big', description: 'Larger than another' },
    { word: 'smaller', emoji: '📉', audioText: 'Smaller - More small', description: 'Less than another' },
    { word: 'tallest', emoji: '🥇', audioText: 'Tallest - Most tall', description: 'Highest in group' },
    { word: 'shortest', emoji: '🥉', audioText: 'Shortest - Least tall', description: 'Lowest in group' },

    // 🟰 Equality
    { word: 'same', emoji: '🟰', audioText: 'Same - Exactly alike', description: 'No difference' },
    { word: 'different', emoji: '🔀', audioText: 'Different - Not same', description: 'Changed or unequal' },
    { word: 'equal', emoji: '⚖️', audioText: 'Equal - Balanced and same', description: 'Exactly equal' }
  ];

  return (
    <LearningCard
      title="Size & Comparison"
      subtitle="Big, Small, Tall & More"
      category="🔷 Thinking, Math & Life Skills"
      categoryColor="#AA96DA"
      items={sizeItems}
    />
  );
}

export default SizeComparison;
