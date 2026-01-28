// frontend/lexiai/cards/SightWords.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function SightWords() {

  // 📘 Articles & Determiners
  const articlesAndDeterminers = [
    { word: 'the', emoji: '👉', audioText: 'The', description: 'Used before nouns' },
    { word: 'a', emoji: '🅰️', audioText: 'A', description: 'One of something' },
    { word: 'an', emoji: '🅰️', audioText: 'An', description: 'Used before vowel sounds' },
    { word: 'this', emoji: '👇', audioText: 'This', description: 'Something close' },
    { word: 'that', emoji: '👈', audioText: 'That', description: 'Something far' },
    { word: 'all', emoji: '💯', audioText: 'All', description: 'Everything' },
    { word: 'each', emoji: '👤', audioText: 'Each', description: 'Every one' },
    { word: 'one', emoji: '1️⃣', audioText: 'One', description: 'Number word' },
  ];

  // 👤 Pronouns
  const pronouns = [
    { word: 'I', emoji: '🙋', audioText: 'I', description: 'Myself' },
    { word: 'you', emoji: '👤', audioText: 'You', description: 'The person spoken to' },
    { word: 'he', emoji: '👨', audioText: 'He', description: 'A boy or man' },
    { word: 'she', emoji: '👩', audioText: 'She', description: 'A girl or woman' },
    { word: 'it', emoji: '🔵', audioText: 'It', description: 'A thing or object' },
    { word: 'we', emoji: '👥', audioText: 'We', description: 'I and others' },
    { word: 'they', emoji: '👥', audioText: 'They', description: 'More than one person' },
    { word: 'his', emoji: '👨', audioText: 'His', description: 'Belonging to him' },
    { word: 'your', emoji: '👤', audioText: 'Your', description: 'Belonging to you' },
    { word: 'their', emoji: '👥', audioText: 'Their', description: 'Belonging to them' },
  ];

  // 🔗 Prepositions & Adverbs
  const prepositionsAndAdverbs = [
    { word: 'to', emoji: '👉', audioText: 'To', description: 'Direction or purpose' },
    { word: 'in', emoji: '📦', audioText: 'In', description: 'Inside something' },
    { word: 'on', emoji: '🔛', audioText: 'On', description: 'On top of something' },
    { word: 'at', emoji: '📍', audioText: 'At', description: 'A specific place' },
    { word: 'from', emoji: '⬅️', audioText: 'From', description: 'Starting point' },
    { word: 'by', emoji: '👤', audioText: 'By', description: 'Near or beside' },
    { word: 'there', emoji: '👉', audioText: 'There', description: 'In that place' },
    { word: 'up', emoji: '⬆️', audioText: 'Up', description: 'Higher position' },
    { word: 'not', emoji: '❌', audioText: 'Not', description: 'Negative word' },
  ];

  // 🔧 Verbs & Helping Verbs
  const verbs = [
    { word: 'is', emoji: '🟰', audioText: 'Is', description: 'Present form of be' },
    { word: 'are', emoji: '🟰', audioText: 'Are', description: 'Plural form of is' },
    { word: 'was', emoji: '⏮️', audioText: 'Was', description: 'Past form of is' },
    { word: 'were', emoji: '⏮️', audioText: 'Were', description: 'Past plural form' },
    { word: 'be', emoji: '✨', audioText: 'Be', description: 'To exist' },
    { word: 'have', emoji: '🤲', audioText: 'Have', description: 'To possess' },
    { word: 'had', emoji: '⏮️', audioText: 'Had', description: 'Past form of have' },
    { word: 'do', emoji: '✅', audioText: 'Do', description: 'To perform' },
    { word: 'said', emoji: '💬', audioText: 'Said', description: 'Past form of say' },
    { word: 'use', emoji: '🔧', audioText: 'Use', description: 'To employ' },
  ];

  // 🔀 Conjunctions & Modals
  const conjunctionsAndModals = [
    { word: 'and', emoji: '➕', audioText: 'And', description: 'Connects words' },
    { word: 'or', emoji: '🔀', audioText: 'Or', description: 'Another choice' },
    { word: 'but', emoji: '🚫', audioText: 'But', description: 'Shows contrast' },
    { word: 'as', emoji: '↔️', audioText: 'As', description: 'Comparison word' },
    { word: 'if', emoji: '❓', audioText: 'If', description: 'Condition word' },
    { word: 'can', emoji: '✅', audioText: 'Can', description: 'Ability word' },
    { word: 'will', emoji: '⏭️', audioText: 'Will', description: 'Future action' },
  ];

  // ❓ Question Words
  const questionWords = [
    { word: 'what', emoji: '❓', audioText: 'What', description: 'Asks about something' },
    { word: 'when', emoji: '⏰', audioText: 'When', description: 'Asks about time' },
    { word: 'which', emoji: '❓', audioText: 'Which', description: 'Asks about choice' },
    { word: 'how', emoji: '❓', audioText: 'How', description: 'Asks about method' },
  ];

  return (
    <>
      <LearningCard title="Articles & Determiners" subtitle="a, an, the…" category="🅰️ Sight Words" categoryColor="#FF6B6B" items={articlesAndDeterminers} />
      <LearningCard title="Pronouns" subtitle="I, you, he, she…" category="🅰️ Sight Words" categoryColor="#4ECDC4" items={pronouns} />
      <LearningCard title="Prepositions & Adverbs" subtitle="in, on, at…" category="🅰️ Sight Words" categoryColor="#845EC2" items={prepositionsAndAdverbs} />
      <LearningCard title="Verbs & Helping Verbs" subtitle="is, was, have…" category="🅰️ Sight Words" categoryColor="#FFA94D" items={verbs} />
      <LearningCard title="Conjunctions & Modals" subtitle="and, but, can…" category="🅰️ Sight Words" categoryColor="#2ECC71" items={conjunctionsAndModals} />
      <LearningCard title="Question Words" subtitle="what, when, how…" category="🅰️ Sight Words" categoryColor="#E17055" items={questionWords} />
    </>
  );
}

export default SightWords;
