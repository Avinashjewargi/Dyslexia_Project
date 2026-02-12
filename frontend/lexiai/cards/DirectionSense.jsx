// frontend/lexiai/cards/DirectionSense.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function DirectionSense() {
  // 1️⃣ Basic Directions
  const basicDirections = [
    { word: 'up', emoji: '⬆️', audioText: 'Up - Toward the sky', description: 'Moving upward' },
    { word: 'down', emoji: '⬇️', audioText: 'Down - Toward the ground', description: 'Moving downward' },
    { word: 'left', emoji: '⬅️', audioText: 'Left - This side', description: 'Left direction' },
    { word: 'right', emoji: '➡️', audioText: 'Right - This side', description: 'Right direction' }
  ];

  // 2️⃣ Compass Directions
  const compassDirections = [
    { word: 'north', emoji: '🧭⬆️', audioText: 'North - Top of the map', description: 'Compass direction' },
    { word: 'south', emoji: '🧭⬇️', audioText: 'South - Bottom of the map', description: 'Compass direction' },
    { word: 'east', emoji: '🌅', audioText: 'East - Where sun rises', description: 'Right side on map' },
    { word: 'west', emoji: '🌇', audioText: 'West - Where sun sets', description: 'Left side on map' }
  ];

  // 3️⃣ Position Words
  const positionWords = [
    { word: 'in', emoji: '📦', audioText: 'In - Inside something', description: 'Inside space' },
    { word: 'out', emoji: '🚪', audioText: 'Out - Outside something', description: 'Outside space' },
    { word: 'on', emoji: '📘', audioText: 'On - On top of surface', description: 'Touching top' },
    { word: 'under', emoji: '🧸⬇️', audioText: 'Under - Below something', description: 'Beneath' },
    { word: 'over', emoji: '🧸⬆️', audioText: 'Over - Above something', description: 'Higher position' },
    { word: 'above', emoji: '☁️', audioText: 'Above - Higher place', description: 'Overhead' },
    { word: 'below', emoji: '🌱', audioText: 'Below - Lower place', description: 'Down under' }
  ];

  // 4️⃣ Distance & Relative Position
  const relativePosition = [
    { word: 'near', emoji: '🤝', audioText: 'Near - Close by', description: 'Small distance' },
    { word: 'far', emoji: '🏔️', audioText: 'Far - Long distance', description: 'Not close' },
    { word: 'next to', emoji: '👫', audioText: 'Next to - Beside', description: 'Side by side' },
    { word: 'between', emoji: '👈🧍👉', audioText: 'Between - In the middle of two', description: 'Center space' },
    { word: 'behind', emoji: '🚶‍♂️⬅️', audioText: 'Behind - At the back', description: 'Rear position' },
    { word: 'in front', emoji: '➡️🚶‍♂️', audioText: 'In front - At the front', description: 'Before something' },
    { word: 'around', emoji: '🔄', audioText: 'Around - All sides', description: 'Surrounding' },
    { word: 'center', emoji: '🎯', audioText: 'Center - Exact middle', description: 'Central point' }
  ];

  return (
    <>
      <LearningCard
        title="Basic Directions"
        subtitle="Up, Down, Left & Right"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#AA96DA"
        items={basicDirections}
      />

      <LearningCard
        title="Compass Directions"
        subtitle="North, South, East & West"
        category="🧭 Spatial Awareness"
        categoryColor="#B39DDB"
        items={compassDirections}
      />

      <LearningCard
        title="Position Words"
        subtitle="In, On, Under & Over"
        category="📦 Spatial Language"
        categoryColor="#9FA8DA"
        items={positionWords}
      />

      <LearningCard
        title="Relative Position"
        subtitle="Near, Far, Between & Around"
        category="📍 Spatial Relationships"
        categoryColor="#90CAF9"
        items={relativePosition}
      />
    </>
  );
}

export default DirectionSense;
