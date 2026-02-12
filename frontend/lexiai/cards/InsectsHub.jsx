// frontend/lexiai/cards/InsectsHub.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function InsectsHub() {

  // 🪽 Flying Insects
  const flyingInsects = [
    { word: 'butterfly', emoji: '🦋', audioText: 'Butterfly - Colorful wings', description: 'Starts as caterpillar' },
    { word: 'bee', emoji: '🐝', audioText: 'Bee - Makes honey', description: 'Helps flowers grow' },
    { word: 'fly', emoji: '🪰', audioText: 'Fly - Small flying insect', description: 'Has two wings' },
    { word: 'mosquito', emoji: '🦟', audioText: 'Mosquito - Tiny biting insect', description: 'Buzzing sound' },
    { word: 'dragonfly', emoji: '🚁', audioText: 'Dragonfly - Fast flying insect', description: 'Four wings' },
    { word: 'wasp', emoji: '⚠️', audioText: 'Wasp - Can sting', description: 'Yellow and black' },
    { word: 'hornet', emoji: '🚨', audioText: 'Hornet - Large stinging insect', description: 'Very strong sting' },
    { word: 'moth', emoji: '🌙', audioText: 'Moth - Night flyer', description: 'Attracted to light' },
    { word: 'firefly', emoji: '✨', audioText: 'Firefly - Glows at night', description: 'Lightning bug' },
  ];

  // 🐜 Crawling Insects
  const crawlingInsects = [
    { word: 'ant', emoji: '🐜', audioText: 'Ant - Works in groups', description: 'Very strong' },
    { word: 'beetle', emoji: '🪲', audioText: 'Beetle - Hard shell insect', description: 'Many types' },
    { word: 'ladybug', emoji: '🐞', audioText: 'Ladybug - Red with spots', description: 'Good luck insect' },
    { word: 'cockroach', emoji: '🪳', audioText: 'Cockroach - Flat brown insect', description: 'Survives easily' },
    { word: 'worm', emoji: '🪱', audioText: 'Worm - No legs', description: 'Good for soil' },
    { word: 'aphid', emoji: '🌱', audioText: 'Aphid - Plant pest', description: 'Feeds on sap' },
    { word: 'termite', emoji: '🏠', audioText: 'Termite - Eats wood', description: 'Damages houses' },
  ];

  // 🦗 Jumping Insects
  const jumpingInsects = [
    { word: 'grasshopper', emoji: '🦗', audioText: 'Grasshopper - Jumps far', description: 'Strong legs' },
    { word: 'cricket', emoji: '🎶', audioText: 'Cricket - Chirps at night', description: 'Rubs wings' },
    { word: 'flea', emoji: '⚡', audioText: 'Flea - Tiny jumper', description: 'Lives on animals' },
    { word: 'praying mantis', emoji: '🙏', audioText: 'Praying mantis - Holds legs together', description: 'Looks like praying' },
  ];

  // ✨ Special / Unique Insects
  const specialInsects = [
    { word: 'caterpillar', emoji: '🐛', audioText: 'Caterpillar - Baby butterfly', description: 'Turns into butterfly' },
    { word: 'centipede', emoji: '➰', audioText: 'Centipede - Many legs', description: 'Fast crawler' },
    { word: 'millipede', emoji: '🌀', audioText: 'Millipede - Lots of legs', description: 'Slow mover' },
    { word: 'snail', emoji: '🐌', audioText: 'Snail - Has shell', description: 'Very slow' },
    { word: 'slug', emoji: '💧', audioText: 'Slug - No shell', description: 'Slimy trail' },
  ];

  // ⚠️ Harmful / Creepy Bugs
  const harmfulBugs = [
    { word: 'spider', emoji: '🕷️', audioText: 'Spider - Eight legs', description: 'Spins webs' },
    { word: 'scorpion', emoji: '🦂', audioText: 'Scorpion - Stinger tail', description: 'Lives in desert' },
    { word: 'tick', emoji: '📍', audioText: 'Tick - Bites skin', description: 'Attaches to body' },
    { word: 'lice', emoji: '😖', audioText: 'Lice - In hair', description: 'Very itchy' },
    { word: 'stink bug', emoji: '🤢', audioText: 'Stink bug - Smells bad', description: 'Releases odor' },
  ];

  return (
    <>
      <LearningCard title="Flying Insects" subtitle="Insects with wings" category="🐞 Insects" categoryColor="#74B9FF" items={flyingInsects} />
      <LearningCard title="Crawling Insects" subtitle="Ground insects" category="🐞 Insects" categoryColor="#55EFC4" items={crawlingInsects} />
      <LearningCard title="Jumping Insects" subtitle="Hopping insects" category="🐞 Insects" categoryColor="#FDCB6E" items={jumpingInsects} />
      <LearningCard title="Special Insects" subtitle="Unique life cycles" category="🐞 Insects" categoryColor="#A29BFE" items={specialInsects} />
      <LearningCard title="Harmful Bugs" subtitle="Be careful!" category="🐞 Insects" categoryColor="#FF7675" items={harmfulBugs} />
    </>
  );
}

export default InsectsHub;
