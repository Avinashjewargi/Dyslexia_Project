// frontend/lexiai/cards/PatternBuilder.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function PatternBuilder() {

  // 🎨 Color Patterns
  const colorPatterns = [
    { word: 'red-blue', emoji: '🔴🔵', audioText: 'Red blue pattern repeating', description: 'Alternating colors' },
    { word: 'rainbow', emoji: '🌈', audioText: 'Rainbow pattern', description: 'Seven colors in order' }
  ];

  // 🔢 Number Patterns
  const numberPatterns = [
    { word: 'counting 1–10', emoji: '🔢', audioText: 'Counting from one to ten', description: 'Number sequence' },
    { word: 'even numbers', emoji: '⚖️', audioText: 'Even numbers pattern', description: '2, 4, 6, 8' },
    { word: 'odd numbers', emoji: '🎯', audioText: 'Odd numbers pattern', description: '1, 3, 5, 7' },
    { word: 'skip counting', emoji: '⏭️', audioText: 'Skip counting by five', description: 'Jump counting' },
    { word: 'increasing by 2', emoji: '📈', audioText: 'Add two each time', description: 'Growing number pattern' },
    { word: 'doubling', emoji: '✖️2️⃣', audioText: 'Doubling numbers', description: 'Multiply by two' }
  ];

  // 🔺 Shape & Size Patterns
  const shapePatterns = [
    { word: 'circle-square', emoji: '⭕🟦', audioText: 'Circle square repeating', description: 'Two-shape pattern' },
    { word: 'triangle chain', emoji: '🔺🔺🔺', audioText: 'Same shape repeating', description: 'Uniform pattern' },
    { word: 'big-small', emoji: '🔵🔹', audioText: 'Big small pattern', description: 'Size alternation' },
    { word: 'growing', emoji: '🌱➡️🌳', audioText: 'Growing pattern', description: 'Gets bigger each step' },
    { word: 'shrinking', emoji: '🌳➡️🌱', audioText: 'Shrinking pattern', description: 'Gets smaller each step' }
  ];

  // 🧭 Direction & Movement Patterns
  const directionPatterns = [
    { word: 'up-down', emoji: '⬆️⬇️', audioText: 'Up down pattern', description: 'Vertical movement' },
    { word: 'left-right', emoji: '⬅️➡️', audioText: 'Left right pattern', description: 'Side to side movement' },
    { word: 'rotation', emoji: '🔄', audioText: 'Rotation pattern', description: 'Turning motion' }
  ];

  // 🎭 Action & Emotion Patterns
  const actionPatterns = [
    { word: 'clap-stomp', emoji: '👏🦶', audioText: 'Clap stomp pattern', description: 'Action sequence' },
    { word: 'happy-sad', emoji: '😊😢', audioText: 'Happy sad pattern', description: 'Emotion alternation' }
  ];

  // 🧠 Logic & Sequence Patterns
  const logicPatterns = [
    { word: 'AB pattern', emoji: '🅰️🅱️', audioText: 'AB pattern repeating', description: 'Two-part pattern' },
    { word: 'ABC pattern', emoji: '🅰️🅱️🅲', audioText: 'ABC pattern repeating', description: 'Three-part pattern' },
    { word: 'AAB pattern', emoji: '🅰️🅰️🅱️', audioText: 'AAB pattern', description: 'Two same, one different' },
    { word: 'ABBA pattern', emoji: '🔁', audioText: 'ABBA mirror pattern', description: 'Symmetry pattern' },
    { word: 'repeating three', emoji: '🔂', audioText: 'Repeat three times', description: 'Triple repetition' }
  ];

  return (
    <>
      <LearningCard title="Color Patterns" subtitle="Learn with colors" category="🎨 Patterns" categoryColor="#FFD6A5" items={colorPatterns} />
      <LearningCard title="Number Patterns" subtitle="Counting & math patterns" category="🔢 Patterns" categoryColor="#FDFFB6" items={numberPatterns} />
      <LearningCard title="Shape & Size Patterns" subtitle="Visual shape sequences" category="🔺 Patterns" categoryColor="#CAFFBF" items={shapePatterns} />
      <LearningCard title="Direction Patterns" subtitle="Movement & direction" category="🧭 Patterns" categoryColor="#9BF6FF" items={directionPatterns} />
      <LearningCard title="Action & Emotion Patterns" subtitle="Body & feeling sequences" category="🎭 Patterns" categoryColor="#A0C4FF" items={actionPatterns} />
      <LearningCard title="Logic Patterns" subtitle="Thinking sequences" category="🧠 Patterns" categoryColor="#BDB2FF" items={logicPatterns} />
    </>
  );
}

export default PatternBuilder;
