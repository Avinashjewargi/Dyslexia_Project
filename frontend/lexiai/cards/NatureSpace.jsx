// frontend/lexiai/cards/NatureSpace.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function NatureSpace() {

  // ☀️ Sky & Weather
  const skyWeather = [
    { word: 'sun', emoji: '☀️', audioText: 'Sun - Bright star in the sky', description: 'Gives light and warmth' },
    { word: 'moon', emoji: '🌙', audioText: 'Moon - Shines at night', description: 'Earth’s satellite' },
    { word: 'star', emoji: '⭐', audioText: 'Star - Twinkles in the sky', description: 'Shining object far away' },
    { word: 'cloud', emoji: '☁️', audioText: 'Cloud - Fluffy shape in sky', description: 'Made of water vapor' },
    { word: 'rainbow', emoji: '🌈', audioText: 'Rainbow - Colors after rain', description: 'Seven colors' }
  ];

  // 🌱 Plants & Trees
  const plantsTrees = [
    { word: 'tree', emoji: '🌳', audioText: 'Tree - Tall plant with trunk', description: 'Gives oxygen' },
    { word: 'flower', emoji: '🌸', audioText: 'Flower - Colorful plant', description: 'Smells nice' },
    { word: 'grass', emoji: '🌱', audioText: 'Grass - Green ground plant', description: 'Covers land' },
    { word: 'leaf', emoji: '🍃', audioText: 'Leaf - Part of plant', description: 'Grows on trees' },
    { word: 'bush', emoji: '🌿', audioText: 'Bush - Small plant', description: 'Short and thick' },
    { word: 'rose', emoji: '🌹', audioText: 'Rose - Red flower', description: 'Symbol of love' },
    { word: 'sunflower', emoji: '🌻', audioText: 'Sunflower - Big yellow flower', description: 'Faces the sun' },
    { word: 'tulip', emoji: '🌷', audioText: 'Tulip - Cup-shaped flower', description: 'Spring flower' },
    { word: 'cactus', emoji: '🌵', audioText: 'Cactus - Desert plant', description: 'Stores water' }
  ];

  // 🏞️ Land & Water
  const landWater = [
    { word: 'mountain', emoji: '⛰️', audioText: 'Mountain - Very tall land', description: 'High peak' },
    { word: 'hill', emoji: '🏔️', audioText: 'Hill - Smaller than mountain', description: 'Raised land' },
    { word: 'valley', emoji: '🏞️', audioText: 'Valley - Low land area', description: 'Between mountains' },
    { word: 'river', emoji: '🏞️', audioText: 'River - Flowing water', description: 'Fresh water stream' },
    { word: 'lake', emoji: '🏕️', audioText: 'Lake - Water surrounded by land', description: 'Still water body' },
    { word: 'ocean', emoji: '🌊', audioText: 'Ocean - Big salty water', description: 'Largest water body' },
    { word: 'beach', emoji: '🏖️', audioText: 'Beach - Sandy shore', description: 'Near ocean' },
    { word: 'island', emoji: '🏝️', audioText: 'Island - Land with water all around', description: 'Surrounded by water' },
    { word: 'forest', emoji: '🌲', audioText: 'Forest - Many trees together', description: 'Woods' },
    { word: 'desert', emoji: '🏜️', audioText: 'Desert - Dry land', description: 'Very little rain' },
    { word: 'waterfall', emoji: '💦', audioText: 'Waterfall - Falling water', description: 'From height' },
    { word: 'cave', emoji: '🕳️', audioText: 'Cave - Hole in ground or mountain', description: 'Dark hollow space' },
    { word: 'volcano', emoji: '🌋', audioText: 'Volcano - Lava mountain', description: 'Can erupt' }
  ];

  // 🔥 Natural Elements
  const naturalElements = [
    { word: 'rock', emoji: '🪨', audioText: 'Rock - Hard stone', description: 'Natural solid' },
    { word: 'sand', emoji: '🏖️', audioText: 'Sand - Tiny grains', description: 'Found on beach' },
    { word: 'soil', emoji: '🌱', audioText: 'Soil - Dirt for plants', description: 'Plants grow in it' },
    { word: 'water', emoji: '💧', audioText: 'Water - Liquid we drink', description: 'Essential for life' },
    { word: 'fire', emoji: '🔥', audioText: 'Fire - Hot flames', description: 'Gives heat and light' }
  ];

  // 🚀 Space & Universe
  const spaceUniverse = [
    { word: 'planet', emoji: '🪐', audioText: 'Planet - Orbits the sun', description: 'Like Earth' },
    { word: 'Earth', emoji: '🌍', audioText: 'Earth - Our home planet', description: 'We live here' },
    { word: 'rocket', emoji: '🚀', audioText: 'Rocket - Travels to space', description: 'Space vehicle' },
    { word: 'satellite', emoji: '🛰️', audioText: 'Satellite - Orbits Earth', description: 'Communication helper' },
    { word: 'comet', emoji: '☄️', audioText: 'Comet - Space ice rock', description: 'Has tail' },
    { word: 'meteor', emoji: '💫', audioText: 'Meteor - Shooting star', description: 'Burns in sky' },
    { word: 'galaxy', emoji: '🌌', audioText: 'Galaxy - Group of stars', description: 'Millions together' },
    { word: 'universe', emoji: '✨', audioText: 'Universe - Everything that exists', description: 'All space and time' }
  ];

  return (
    <>
      <LearningCard title="Sky & Weather" subtitle="Look up above" category="☀️ Nature" categoryColor="#FDCB6E" items={skyWeather} />
      <LearningCard title="Plants & Trees" subtitle="Green world" category="🌱 Nature" categoryColor="#55EFC4" items={plantsTrees} />
      <LearningCard title="Land & Water" subtitle="Earth surfaces" category="🏞️ Nature" categoryColor="#74B9FF" items={landWater} />
      <LearningCard title="Natural Elements" subtitle="Basic building blocks" category="🔥 Nature" categoryColor="#FF7675" items={naturalElements} />
      <LearningCard title="Space & Universe" subtitle="Beyond Earth" category="🚀 Space" categoryColor="#A29BFE" items={spaceUniverse} />
    </>
  );
}

export default NatureSpace;
