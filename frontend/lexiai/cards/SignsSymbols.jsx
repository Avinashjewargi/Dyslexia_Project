// frontend/lexiai/cards/SignsSymbols.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function SignsSymbols() {
  return (
    <>
      {/* 🛑 Traffic Signs */}
      <LearningCard
        title="Traffic Signs"
        subtitle="Road Safety Signs"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#FF595E"
        items={[
          { word: 'stop sign', emoji: '🛑', description: 'Must stop completely' },
          { word: 'yield sign', emoji: '⚠️', description: 'Slow down and give way' },
          { word: 'one way', emoji: '➡️', description: 'Go one direction only' },
          { word: 'no entry', emoji: '⛔', description: 'Entry not allowed' },
          { word: 'pedestrian crossing', emoji: '🚶', description: 'Safe crossing place' },
          { word: 'speed limit', emoji: '🚗', description: 'Maximum speed allowed' }
        ]}
      />

      {/* ⚠️ Warning Signs */}
      <LearningCard
        title="Warning Signs"
        subtitle="Be Careful & Stay Alert"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#FFCA3A"
        items={[
          { word: 'caution', emoji: '⚠️', description: 'Be careful' },
          { word: 'danger', emoji: '☢️', description: 'Something harmful ahead' },
          { word: 'slippery', emoji: '💦', description: 'Floor is wet' },
          { word: 'construction', emoji: '🚧', description: 'Work area ahead' }
        ]}
      />

      {/* 🏢 Public & Facility Signs */}
      <LearningCard
        title="Public & Facility Signs"
        subtitle="Places & Services"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#8AC926"
        items={[
          { word: 'restroom', emoji: '🚻', description: 'Bathroom location' },
          { word: 'elevator', emoji: '🛗', description: 'Lift to other floors' },
          { word: 'stairs', emoji: '🪜', description: 'Steps up or down' },
          { word: 'exit', emoji: '🚪', description: 'Way out' },
          { word: 'entrance', emoji: '🚪', description: 'Way in' },
          { word: 'hospital', emoji: '🏥', description: 'Medical care' },
          { word: 'pharmacy', emoji: '💊', description: 'Medicine store' },
          { word: 'restaurant', emoji: '🍽️', description: 'Place to eat' },
          { word: 'wifi', emoji: '📶', description: 'Internet available' },
          { word: 'telephone', emoji: '☎️', description: 'Phone service' }
        ]}
      />

      {/* 🚫 Prohibition Signs */}
      <LearningCard
        title="Prohibition Signs"
        subtitle="Not Allowed Signs"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#D00000"
        items={[
          { word: 'no smoking', emoji: '🚭', description: 'Smoking not allowed' },
          { word: 'no parking', emoji: '🅿️❌', description: 'Parking prohibited' },
          { word: 'no phones', emoji: '📵', description: 'Phones not allowed' },
          { word: 'no food', emoji: '🍔❌', description: 'Eating not allowed' },
          { word: 'no pets', emoji: '🐕‍🦺❌', description: 'Pets not allowed' }
        ]}
      />

      {/* ♿ Accessibility Signs */}
      <LearningCard
        title="Accessibility Signs"
        subtitle="Inclusive Facilities"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#1982C4"
        items={[
          { word: 'wheelchair access', emoji: '♿', description: 'Accessible area' },
          { word: 'hearing assistance', emoji: '🦻', description: 'Hearing support available' },
          { word: 'vision assistance', emoji: '👓', description: 'Vision support available' }
        ]}
      />

      {/* ⭐ Common Symbols */}
      <LearningCard
        title="Common Symbols"
        subtitle="Everyday Meaning Signs"
        category="🔷 Thinking, Math & Life Skills"
        categoryColor="#6A4C93"
        items={[
          { word: 'heart', emoji: '❤️', description: 'Love and care' },
          { word: 'star', emoji: '⭐', description: 'Favorite or best' },
          { word: 'checkmark', emoji: '✅', description: 'Correct or done' },
          { word: 'cross', emoji: '❌', description: 'Wrong or no' },
          { word: 'question mark', emoji: '❓', description: 'Question or doubt' },
          { word: 'exclamation', emoji: '❗', description: 'Important warning' },
          { word: 'plus', emoji: '➕', description: 'Add' },
          { word: 'minus', emoji: '➖', description: 'Subtract' },
          { word: 'equals', emoji: '🟰', description: 'Same value' },
          { word: 'recycling', emoji: '♻️', description: 'Reuse and recycle' }
        ]}
      />
    </>
  );
}

export default SignsSymbols;
