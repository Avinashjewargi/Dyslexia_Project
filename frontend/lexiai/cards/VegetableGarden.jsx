// frontend/lexiai/cards/VegetableGarden.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function VegetableGarden() {

  // 🥕 Root Vegetables
  const rootVegetables = [
    { word: 'carrot', emoji: '🥕', audioText: 'Carrot - Orange root vegetable', description: 'Good for eyes' },
    { word: 'potato', emoji: '🥔', audioText: 'Potato - Starchy vegetable', description: 'Grows underground' },
    { word: 'sweet potato', emoji: '🍠', audioText: 'Sweet potato - Orange inside', description: 'Sweeter than potato' },
    { word: 'radish', emoji: '🔴', audioText: 'Radish - Crunchy root', description: 'Red and white' },
    { word: 'beet', emoji: '🟣', audioText: 'Beet - Deep red root', description: 'Also beetroot' },
    { word: 'turnip', emoji: '⚪', audioText: 'Turnip - White root vegetable', description: 'Round shape' },
    { word: 'ginger', emoji: '🫚', audioText: 'Ginger - Spicy root', description: 'Used in cooking' },
    { word: 'parsnip', emoji: '🥕', audioText: 'Parsnip - White carrot-like root', description: 'Sweet when cooked' },
  ];

  // 🥬 Leafy Greens
  const leafyGreens = [
    { word: 'lettuce', emoji: '🥬', audioText: 'Lettuce - Green leaves', description: 'Used in salads' },
    { word: 'spinach', emoji: '💪', audioText: 'Spinach - Makes you strong', description: 'Dark green leaves' },
    { word: 'cabbage', emoji: '🥬', audioText: 'Cabbage - Round leafy vegetable', description: 'Green or purple' },
    { word: 'kale', emoji: '🌿', audioText: 'Kale - Curly green leaves', description: 'Very healthy' },
    { word: 'chard', emoji: '🌈', audioText: 'Chard - Colorful stems', description: 'Rainbow colors' },
    { word: 'brussels sprouts', emoji: '🟢', audioText: 'Brussels sprouts - Mini cabbages', description: 'Tiny green balls' },
    { word: 'artichoke', emoji: '🌵', audioText: 'Artichoke - Spiky vegetable', description: 'Eat the heart' },
  ];

  // 🥒 Vine / Gourd Vegetables
  const vineVegetables = [
    { word: 'cucumber', emoji: '🥒', audioText: 'Cucumber - Long green vegetable', description: 'Crunchy and watery' },
    { word: 'zucchini', emoji: '🟩', audioText: 'Zucchini - Green squash', description: 'Cooked vegetable' },
    { word: 'pumpkin', emoji: '🎃', audioText: 'Pumpkin - Big orange vegetable', description: 'Used on Halloween' },
    { word: 'squash', emoji: '🟠', audioText: 'Squash - Soft cooked vegetable', description: 'Many varieties' },
    { word: 'okra', emoji: '✋', audioText: 'Okra - Finger-like pods', description: 'Slimy when cooked' },
  ];

  // 🫛 Pod Vegetables
  const podVegetables = [
    { word: 'peas', emoji: '🫛', audioText: 'Peas - Tiny green balls', description: 'Inside pods' },
    { word: 'green beans', emoji: '🫘', audioText: 'Green beans - Long thin pods', description: 'Also string beans' },
  ];

  // 🌶️ Peppers
  const peppers = [
    { word: 'bell pepper', emoji: '🫑', audioText: 'Bell pepper - Sweet pepper', description: 'Red, green, yellow' },
    { word: 'chili pepper', emoji: '🌶️', audioText: 'Chili pepper - Very spicy', description: 'Hot!' },
    { word: 'jalapeño', emoji: '🔥', audioText: 'Jalapeño - Medium hot pepper', description: 'Green chili' },
  ];

  // 🌽 Stalk & Seed Vegetables
  const stalkVegetables = [
    { word: 'corn', emoji: '🌽', audioText: 'Corn - Yellow kernels', description: 'Sweet and crunchy' },
    { word: 'celery', emoji: '🥗', audioText: 'Celery - Crunchy stalks', description: 'Stringy texture' },
    { word: 'asparagus', emoji: '🟢', audioText: 'Asparagus - Green spears', description: 'Tender tips' },
    { word: 'leek', emoji: '🧅', audioText: 'Leek - Like giant onion', description: 'Mild flavor' },
    { word: 'onion', emoji: '🧅', audioText: 'Onion - Makes you cry', description: 'Has layers' },
    { word: 'garlic', emoji: '🧄', audioText: 'Garlic - Strong smell', description: 'Has cloves' },
  ];

  // 🍄 Other / Special Vegetables
  const otherVegetables = [
    { word: 'mushroom', emoji: '🍄', audioText: 'Mushroom - Fungi', description: 'Not really a vegetable' },
    { word: 'eggplant', emoji: '🍆', audioText: 'Eggplant - Purple vegetable', description: 'Spongy inside' },
  ];

  return (
    <>
      <LearningCard title="Root Vegetables" subtitle="Grow underground" category="🥕 Vegetables" categoryColor="#E17055" items={rootVegetables} />
      <LearningCard title="Leafy Greens" subtitle="Healthy green leaves" category="🥬 Vegetables" categoryColor="#00B894" items={leafyGreens} />
      <LearningCard title="Vine Vegetables" subtitle="Grow on vines" category="🥒 Vegetables" categoryColor="#55EFC4" items={vineVegetables} />
      <LearningCard title="Pod Vegetables" subtitle="Grow in pods" category="🫛 Vegetables" categoryColor="#81ECEC" items={podVegetables} />
      <LearningCard title="Peppers" subtitle="Sweet & spicy" category="🌶️ Vegetables" categoryColor="#D63031" items={peppers} />
      <LearningCard title="Stalk & Seed Vegetables" subtitle="Stems and seeds" category="🌽 Vegetables" categoryColor="#FDCB6E" items={stalkVegetables} />
      <LearningCard title="Other Vegetables" subtitle="Special cases" category="🍄 Vegetables" categoryColor="#A29BFE" items={otherVegetables} />
    </>
  );
}

export default VegetableGarden;
