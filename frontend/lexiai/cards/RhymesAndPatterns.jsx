// frontend/lexiai/cards/RhymesAndPatterns.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function RhymesAndPatterns() {

  // -at family
  const atFamily = [
    { word: 'cat', emoji: '🐱', audioText: 'Cat rhymes with bat, hat, mat', description: '-at word family' },
    { word: 'bat', emoji: '🦇', audioText: 'Bat rhymes with cat, hat, mat', description: '-at word family' },
    { word: 'hat', emoji: '🎩', audioText: 'Hat rhymes with cat, bat, mat', description: '-at word family' },
  ];

  // -an family
  const anFamily = [
    { word: 'man', emoji: '👨', audioText: 'Man rhymes with can, pan, ran', description: '-an word family' },
    { word: 'can', emoji: '🥫', audioText: 'Can rhymes with man, pan, ran', description: '-an word family' },
    { word: 'pan', emoji: '🍳', audioText: 'Pan rhymes with man, can, ran', description: '-an word family' },
  ];

  // -ig family
  const igFamily = [
    { word: 'big', emoji: '🐘', audioText: 'Big rhymes with pig, dig, wig', description: '-ig word family' },
    { word: 'pig', emoji: '🐷', audioText: 'Pig rhymes with big, dig, wig', description: '-ig word family' },
    { word: 'dig', emoji: '⛏️', audioText: 'Dig rhymes with big, pig, wig', description: '-ig word family' },
  ];

  // -og family
  const ogFamily = [
    { word: 'dog', emoji: '🐕', audioText: 'Dog rhymes with log, fog, jog', description: '-og word family' },
    { word: 'log', emoji: '🪵', audioText: 'Log rhymes with dog, fog, jog', description: '-og word family' },
    { word: 'fog', emoji: '🌫️', audioText: 'Fog rhymes with dog, log, jog', description: '-og word family' },
  ];

  // -ug family
  const ugFamily = [
    { word: 'bug', emoji: '🐛', audioText: 'Bug rhymes with hug, mug, rug', description: '-ug word family' },
    { word: 'hug', emoji: '🤗', audioText: 'Hug rhymes with bug, mug, rug', description: '-ug word family' },
    { word: 'mug', emoji: '☕', audioText: 'Mug rhymes with bug, hug, rug', description: '-ug word family' },
  ];

  // -op family
  const opFamily = [
    { word: 'top', emoji: '⬆️', audioText: 'Top rhymes with hop, mop, stop', description: '-op word family' },
    { word: 'hop', emoji: '🐰', audioText: 'Hop rhymes with top, mop, stop', description: '-op word family' },
    { word: 'mop', emoji: '🧹', audioText: 'Mop rhymes with top, hop, stop', description: '-op word family' },
  ];

  // -en family
  const enFamily = [
    { word: 'pen', emoji: '🖊️', audioText: 'Pen rhymes with hen, ten, den', description: '-en word family' },
    { word: 'hen', emoji: '🐔', audioText: 'Hen rhymes with pen, ten, den', description: '-en word family' },
    { word: 'ten', emoji: '🔟', audioText: 'Ten rhymes with pen, hen, den', description: '-en word family' },
  ];

  // -un family
  const unFamily = [
    { word: 'sun', emoji: '☀️', audioText: 'Sun rhymes with run, fun, bun', description: '-un word family' },
    { word: 'run', emoji: '🏃', audioText: 'Run rhymes with sun, fun, bun', description: '-un word family' },
    { word: 'fun', emoji: '🎉', audioText: 'Fun rhymes with sun, run, bun', description: '-un word family' },
  ];

  // -ay family
  const ayFamily = [
    { word: 'day', emoji: '☀️', audioText: 'Day rhymes with play, say, way', description: '-ay word family' },
    { word: 'play', emoji: '🎮', audioText: 'Play rhymes with day, say, way', description: '-ay word family' },
    { word: 'say', emoji: '💬', audioText: 'Say rhymes with day, play, way', description: '-ay word family' },
  ];

  // -ake family
  const akeFamily = [
    { word: 'cake', emoji: '🍰', audioText: 'Cake rhymes with make, take, lake', description: '-ake word family' },
    { word: 'make', emoji: '🛠️', audioText: 'Make rhymes with cake, take, lake', description: '-ake word family' },
    { word: 'lake', emoji: '🏞️', audioText: 'Lake rhymes with cake, make, take', description: '-ake word family' },
  ];

  return (
    <>
      <LearningCard title="-at Family" subtitle="cat, bat, hat" category="🅰️ Rhymes" categoryColor="#FF6B6B" items={atFamily} />
      <LearningCard title="-an Family" subtitle="man, can, pan" category="🅰️ Rhymes" categoryColor="#FFA94D" items={anFamily} />
      <LearningCard title="-ig Family" subtitle="big, pig, dig" category="🅰️ Rhymes" categoryColor="#4ECDC4" items={igFamily} />
      <LearningCard title="-og Family" subtitle="dog, log, fog" category="🅰️ Rhymes" categoryColor="#845EC2" items={ogFamily} />
      <LearningCard title="-ug Family" subtitle="bug, hug, mug" category="🅰️ Rhymes" categoryColor="#2ECC71" items={ugFamily} />
      <LearningCard title="-op Family" subtitle="top, hop, mop" category="🅰️ Rhymes" categoryColor="#E17055" items={opFamily} />
      <LearningCard title="-en Family" subtitle="pen, hen, ten" category="🅰️ Rhymes" categoryColor="#6C5CE7" items={enFamily} />
      <LearningCard title="-un Family" subtitle="sun, run, fun" category="🅰️ Rhymes" categoryColor="#00B894" items={unFamily} />
      <LearningCard title="-ay Family" subtitle="day, play, say" category="🅰️ Rhymes" categoryColor="#FDCB6E" items={ayFamily} />
      <LearningCard title="-ake Family" subtitle="cake, make, lake" category="🅰️ Rhymes" categoryColor="#D63031" items={akeFamily} />
    </>
  );
}

export default RhymesAndPatterns;
