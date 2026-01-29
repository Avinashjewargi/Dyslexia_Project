// frontend/lexiai/cards/EmotionSense.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function EmotionSense() {
  // 😊 Happy & Positive Emotions
  const happyEmotions = [
    { word: 'happy', emoji: '😊', audioText: 'Happy - Feeling good and joyful', description: 'Positive cheerful feeling' },
    { word: 'joyful', emoji: '😄', audioText: 'Joyful - Full of happiness', description: 'Very happy and delighted' },
    { word: 'excited', emoji: '🤩', audioText: 'Excited - Eager and energetic', description: 'Looking forward to something' },
    { word: 'cheerful', emoji: '😁', audioText: 'Cheerful - Bright and happy', description: 'Full of good spirits' },
    { word: 'proud', emoji: '😌', audioText: 'Proud - Feeling accomplished', description: 'Satisfied with achievement' },
    { word: 'grateful', emoji: '🙏', audioText: 'Grateful - Thankful and appreciative', description: 'Feeling thankful' },
    { word: 'loved', emoji: '🥰', audioText: 'Loved - Feeling cared for', description: 'Feeling affection' }
  ];

  // 😢 Sad & Hurt Emotions
  const sadEmotions = [
    { word: 'sad', emoji: '😢', audioText: 'Sad - Feeling unhappy', description: 'Down and tearful' },
    { word: 'crying', emoji: '😭', audioText: 'Crying - Tears falling', description: 'Very sad with tears' },
    { word: 'lonely', emoji: '😔', audioText: 'Lonely - Feeling alone', description: 'Missing company' },
    { word: 'disappointed', emoji: '😞', audioText: 'Disappointed - Let down', description: 'Expectations not met' },
    { word: 'hurt', emoji: '😣', audioText: 'Hurt - Feeling pain or upset', description: 'Emotionally wounded' }
  ];

  // 😠 Angry Emotions
  const angryEmotions = [
    { word: 'angry', emoji: '😠', audioText: 'Angry - Feeling mad', description: 'Upset and annoyed' },
    { word: 'annoyed', emoji: '😒', audioText: 'Annoyed - Slightly bothered', description: 'Mildly irritated' },
    { word: 'frustrated', emoji: '😤', audioText: 'Frustrated - Annoyed and stuck', description: 'Unable to succeed' },
    { word: 'furious', emoji: '😡', audioText: 'Furious - Very very angry', description: 'Extremely mad' }
  ];

  // 😨 Fear & Worry Emotions
  const fearEmotions = [
    { word: 'scared', emoji: '😨', audioText: 'Scared - Feeling afraid', description: 'Frightened' },
    { word: 'afraid', emoji: '😱', audioText: 'Afraid - Feeling fear', description: 'Scared of danger' },
    { word: 'worried', emoji: '😟', audioText: 'Worried - Feeling concerned', description: 'Anxious about something' },
    { word: 'nervous', emoji: '😰', audioText: 'Nervous - Feeling uneasy', description: 'Anxious and tense' },
    { word: 'shocked', emoji: '😲', audioText: 'Shocked - Sudden surprise', description: 'Unexpected reaction' }
  ];

  // 😌 Calm & Energy States
  const calmEmotions = [
    { word: 'calm', emoji: '😌', audioText: 'Calm - Feeling peaceful', description: 'Relaxed and quiet' },
    { word: 'relaxed', emoji: '😊', audioText: 'Relaxed - Free from tension', description: 'At ease' },
    { word: 'peaceful', emoji: '☮️', audioText: 'Peaceful - Serene and quiet', description: 'Tranquil feeling' },
    { word: 'sleepy', emoji: '😴', audioText: 'Sleepy - Feeling tired', description: 'Ready for sleep' },
    { word: 'tired', emoji: '🥱', audioText: 'Tired - Needing rest', description: 'Low energy' }
  ];

  // 🎭 Social & Mixed Emotions
  const socialEmotions = [
    { word: 'bored', emoji: '😑', audioText: 'Bored - Nothing interesting', description: 'Uninterested' },
    { word: 'confused', emoji: '😕', audioText: 'Confused - Not understanding', description: 'Uncertain and puzzled' },
    { word: 'jealous', emoji: '😒', audioText: 'Jealous - Wanting what others have', description: 'Envious feeling' },
    { word: 'embarrassed', emoji: '😳', audioText: 'Embarrassed - Feeling awkward', description: 'Self-conscious' },
    { word: 'shy', emoji: '🙈', audioText: 'Shy - Feeling timid', description: 'Nervous around others' },
    { word: 'brave', emoji: '💪', audioText: 'Brave - Feeling courageous', description: 'Not afraid' },
    { word: 'silly', emoji: '🤪', audioText: 'Silly - Playful and goofy', description: 'Fun and foolish' }
  ];

  return (
    <>
      <LearningCard
        title="Happy Feelings"
        subtitle="Joy & Positive Emotions"
        category="😊 Emotional Awareness"
        categoryColor="#FFD166"
        items={happyEmotions}
      />

      <LearningCard
        title="Sad Feelings"
        subtitle="When We Feel Low"
        category="😢 Emotional Awareness"
        categoryColor="#6C9BCF"
        items={sadEmotions}
      />

      <LearningCard
        title="Angry Feelings"
        subtitle="Big Mad Emotions"
        category="😠 Emotional Awareness"
        categoryColor="#EF476F"
        items={angryEmotions}
      />

      <LearningCard
        title="Fear & Worry"
        subtitle="Scared & Nervous Feelings"
        category="😨 Emotional Awareness"
        categoryColor="#8ECAE6"
        items={fearEmotions}
      />

      <LearningCard
        title="Calm & Tired"
        subtitle="Resting & Peaceful Feelings"
        category="😌 Emotional Awareness"
        categoryColor="#A8DADC"
        items={calmEmotions}
      />

      <LearningCard
        title="Social Emotions"
        subtitle="Mixed & Social Feelings"
        category="🎭 Emotional Awareness"
        categoryColor="#CDB4DB"
        items={socialEmotions}
      />
    </>
  );
}

export default EmotionSense;
