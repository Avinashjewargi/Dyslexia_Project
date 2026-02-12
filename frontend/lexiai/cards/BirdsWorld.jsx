// frontend/lexiai/cards/BirdsWorld.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function BirdsWorld() {

  // 🐦 Common Birds
  const commonBirds = [
    { word: 'sparrow', emoji: '🐦', audioText: 'Sparrow - Small brown bird', description: 'Very common bird' },
    { word: 'pigeon', emoji: '🕊️', audioText: 'Pigeon - Gray city bird', description: 'Symbol of peace' },
    { word: 'crow', emoji: '🐦‍⬛', audioText: 'Crow - Black bird', description: 'Very intelligent' },
    { word: 'robin', emoji: '🐤', audioText: 'Robin - Red-breasted bird', description: 'Sign of spring' },
    { word: 'blue jay', emoji: '🔵', audioText: 'Blue Jay - Blue bird', description: 'Noisy bird' },
    { word: 'cardinal', emoji: '🔴', audioText: 'Cardinal - Bright red bird', description: 'Male red, female brown' },
  ];

  // 🌊 Water Birds
  const waterBirds = [
    { word: 'duck', emoji: '🦆', audioText: 'Duck - Swims and quacks', description: 'Water bird' },
    { word: 'swan', emoji: '🦢', audioText: 'Swan - Elegant water bird', description: 'Long neck' },
    { word: 'goose', emoji: '🪿', audioText: 'Goose - Large water bird', description: 'Flies in V shape' },
    { word: 'pelican', emoji: '🦩', audioText: 'Pelican - Big beak pouch', description: 'Scoops fish' },
    { word: 'flamingo', emoji: '🌸', audioText: 'Flamingo - Pink bird', description: 'Long legs' },
    { word: 'seagull', emoji: '🌊', audioText: 'Seagull - Beach bird', description: 'Near ocean' },
    { word: 'kingfisher', emoji: '🎣', audioText: 'Kingfisher - Dives for fish', description: 'Colorful water bird' },
  ];

  // 🦅 Birds of Prey
  const birdsOfPrey = [
    { word: 'eagle', emoji: '🦅', audioText: 'Eagle - Powerful bird', description: 'Sharp eyesight' },
    { word: 'hawk', emoji: '🪶', audioText: 'Hawk - Fast hunter', description: 'Sharp talons' },
    { word: 'falcon', emoji: '⚡', audioText: 'Falcon - Fastest bird', description: 'High-speed dive' },
    { word: 'owl', emoji: '🌙', audioText: 'Owl - Night bird', description: 'Turns head around' },
    { word: 'vulture', emoji: '☠️', audioText: 'Vulture - Scavenger bird', description: 'Cleans environment' },
  ];

  // 🌈 Colorful Birds
  const colorfulBirds = [
    { word: 'parrot', emoji: '🦜', audioText: 'Parrot - Talks and mimics', description: 'Very colorful' },
    { word: 'peacock', emoji: '🦚', audioText: 'Peacock - Beautiful feathers', description: 'National bird of India' },
    { word: 'hummingbird', emoji: '✨', audioText: 'Hummingbird - Tiny hovering bird', description: 'Fast wings' },
    { word: 'canary', emoji: '💛', audioText: 'Canary - Yellow singing bird', description: 'Sweet voice' },
    { word: 'toucan', emoji: '🌈', audioText: 'Toucan - Big colorful beak', description: 'Tropical bird' },
    { word: 'macaw', emoji: '🎨', audioText: 'Macaw - Large parrot', description: 'Bright colors' },
  ];

  // 🐔 Farm Birds
  const farmBirds = [
    { word: 'chicken', emoji: '🐔', audioText: 'Chicken - Lays eggs', description: 'Farm bird' },
    { word: 'rooster', emoji: '⏰', audioText: 'Rooster - Crows in morning', description: 'Wakes farmers' },
    { word: 'turkey', emoji: '🦃', audioText: 'Turkey - Large farm bird', description: 'Thanksgiving bird' },
  ];

  // 🚫✈️ Flightless Birds
  const flightlessBirds = [
    { word: 'penguin', emoji: '🐧', audioText: 'Penguin - Cannot fly', description: 'Great swimmer' },
    { word: 'ostrich', emoji: '🏃', audioText: 'Ostrich - Tallest bird', description: 'Runs very fast' },
    { word: 'emu', emoji: '🇦🇺', audioText: 'Emu - Australian bird', description: 'Cannot fly' },
  ];

  // 🌿 Special Birds
  const specialBirds = [
    { word: 'woodpecker', emoji: '🌳', audioText: 'Woodpecker - Pecks trees', description: 'Tapping sound' },
    { word: 'stork', emoji: '👶', audioText: 'Stork - Long legs bird', description: 'Story bird' },
    { word: 'crane', emoji: '🏗️', audioText: 'Crane - Tall elegant bird', description: 'Long neck' },
    { word: 'magpie', emoji: '💎', audioText: 'Magpie - Likes shiny things', description: 'Black and white bird' },
    { word: 'nightingale', emoji: '🎵', audioText: 'Nightingale - Famous singer bird', description: 'Beautiful song' },
  ];

  return (
    <>
      <LearningCard title="Common Birds" subtitle="Everyday birds" category="🐦 Birds" categoryColor="#4ECDC4" items={commonBirds} />
      <LearningCard title="Water Birds" subtitle="Birds that swim" category="🌊 Birds" categoryColor="#3498DB" items={waterBirds} />
      <LearningCard title="Birds of Prey" subtitle="Strong hunters" category="🦅 Birds" categoryColor="#2ECC71" items={birdsOfPrey} />
      <LearningCard title="Colorful Birds" subtitle="Bright & beautiful" category="🌈 Birds" categoryColor="#F39C12" items={colorfulBirds} />
      <LearningCard title="Farm Birds" subtitle="Birds on farms" category="🐔 Birds" categoryColor="#A0522D" items={farmBirds} />
      <LearningCard title="Flightless Birds" subtitle="Cannot fly" category="🚫✈️ Birds" categoryColor="#95A5A6" items={flightlessBirds} />
      <LearningCard title="Special Birds" subtitle="Unique birds" category="✨ Birds" categoryColor="#9B59B6" items={specialBirds} />
    </>
  );
}

export default BirdsWorld;
