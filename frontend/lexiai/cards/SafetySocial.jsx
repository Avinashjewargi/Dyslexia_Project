// frontend/lexiai/cards/SafetySocial.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function SafetySocial() {
  return (
    <>
      {/* 🛑 Stay Safe Outside */}
      <LearningCard
        title="Stay Safe Outside"
        subtitle="Road, Stranger & Water Safety"
        category="🛡️ Safety & Social Skills"
        categoryColor="#FFB703"
        items={[
          { word: 'look both ways', emoji: '👀🚦', description: 'Check before crossing' },
          { word: 'hold hands', emoji: '🤝', description: 'Stay with adult' },
          { word: 'stranger danger', emoji: '🚫🧍', description: 'Avoid strangers' },
          { word: 'helmet', emoji: '🪖', description: 'Protect your head' },
          { word: 'seatbelt', emoji: '🔒', description: 'Car safety' },
          { word: 'life jacket', emoji: '🦺', description: 'Water safety' },
          { word: 'crosswalk', emoji: '🚶‍♂️', description: 'Safe crossing' },
          { word: 'traffic light', emoji: '🚦', description: 'Follow signals' }
        ]}
      />

      {/* 🏠 Stay Safe at Home */}
      <LearningCard
        title="Stay Safe at Home"
        subtitle="Fire, Doors & Emergency Safety"
        category="🛡️ Safety & Social Skills"
        categoryColor="#FB8500"
        items={[
          { word: 'fire alarm', emoji: '🚨', description: 'Fire warning' },
          { word: 'emergency exit', emoji: '🚪', description: 'Way out' },
          { word: 'don’t touch hot', emoji: '🔥✋', description: 'Avoid burns' },
          { word: 'lock door', emoji: '🔐', description: 'Keep home secure' },
          { word: 'call emergency', emoji: '📞', description: 'Get help fast' }
        ]}
      />

      {/* 🤝 Good Manners & Kindness */}
      <LearningCard
        title="Good Manners & Kindness"
        subtitle="Being Polite & Caring"
        category="🛡️ Safety & Social Skills"
        categoryColor="#8ECAE6"
        items={[
          { word: 'please', emoji: '🙏', description: 'Polite asking' },
          { word: 'thank you', emoji: '🙏💛', description: 'Show gratitude' },
          { word: 'sorry', emoji: '😔', description: 'Apologize' },
          { word: 'excuse me', emoji: '✋', description: 'Be polite' },
          { word: 'share', emoji: '🤲', description: 'Give to others' },
          { word: 'take turns', emoji: '🔄', description: 'Fair play' },
          { word: 'be kind', emoji: '💝', description: 'Care for others' }
        ]}
      />

      {/* 👫 Social Rules & Behavior */}
      <LearningCard
        title="Social Rules & Behavior"
        subtitle="How We Act With Others"
        category="🛡️ Safety & Social Skills"
        categoryColor="#219EBC"
        items={[
          { word: 'raise hand', emoji: '✋', description: 'Ask to speak' },
          { word: 'wait in line', emoji: '🚶‍♀️🚶‍♂️', description: 'Be patient' },
          { word: 'inside voice', emoji: '🤫', description: 'Speak softly' },
          { word: 'wash hands', emoji: '🧼', description: 'Stay clean' },
          { word: 'cover mouth', emoji: '😷', description: 'Stop germs' },
          { word: 'no hitting', emoji: '🚫👊', description: 'Be gentle' },
          { word: 'no yelling', emoji: '🔇', description: 'Use calm voice' }
        ]}
      />

      {/* 💬 Feelings, Help & Teamwork */}
      <LearningCard
        title="Feelings, Help & Teamwork"
        subtitle="Talking, Helping & Trying"
        category="🛡️ Safety & Social Skills"
        categoryColor="#90DBF4"
        items={[
          { word: 'use words', emoji: '💬', description: 'Talk about feelings' },
          { word: 'ask for help', emoji: '🙋', description: 'It’s okay to ask' },
          { word: 'tell truth', emoji: '✅', description: 'Be honest' },
          { word: 'be patient', emoji: '⏳', description: 'Wait calmly' },
          { word: 'be brave', emoji: '💪', description: 'Face fears' },
          { word: 'try your best', emoji: '⭐', description: 'Give effort' },
          { word: 'teamwork', emoji: '🤝', description: 'Work together' }
        ]}
      />
    </>
  );
}

export default SafetySocial;
