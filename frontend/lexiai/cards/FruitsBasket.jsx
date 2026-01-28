// frontend/lexiai/cards/FruitsBasket.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function FruitsBasket() {

  // 🍎 Common Fruits
  const commonFruits = [
    { word: 'apple', emoji: '🍎', audioText: 'Apple - Crunchy fruit', description: 'Keeps doctor away' },
    { word: 'banana', emoji: '🍌', audioText: 'Banana - Yellow fruit', description: 'Monkeys love it' },
    { word: 'orange', emoji: '🍊', audioText: 'Orange - Citrus fruit', description: 'Vitamin C rich' },
    { word: 'grape', emoji: '🍇', audioText: 'Grape - Small fruit in bunches', description: 'Purple or green' },
    { word: 'watermelon', emoji: '🍉', audioText: 'Watermelon - Big juicy fruit', description: 'Red inside' },
    { word: 'pear', emoji: '🍐', audioText: 'Pear - Soft fruit', description: 'Green or yellow' },
  ];

  // 🍓 Berries
  const berries = [
    { word: 'strawberry', emoji: '🍓', audioText: 'Strawberry - Red berry', description: 'Seeds outside' },
    { word: 'cherry', emoji: '🍒', audioText: 'Cherry - Small red fruit', description: 'Has pit' },
    { word: 'blueberry', emoji: '🔵', audioText: 'Blueberry - Tiny blue fruit', description: 'Very healthy' },
    { word: 'raspberry', emoji: '🔴', audioText: 'Raspberry - Red bumpy berry', description: 'Sweet and sour' },
    { word: 'blackberry', emoji: '⚫', audioText: 'Blackberry - Dark berry', description: 'Juicy' },
    { word: 'cranberry', emoji: '🟥', audioText: 'Cranberry - Tart berry', description: 'Used in juice' },
  ];

  // 🍋 Citrus Fruits
  const citrusFruits = [
    { word: 'lemon', emoji: '🍋', audioText: 'Lemon - Sour fruit', description: 'Very tangy' },
    { word: 'lime', emoji: '🟢', audioText: 'Lime - Green citrus', description: 'Like lemon' },
    { word: 'grapefruit', emoji: '🍊', audioText: 'Grapefruit - Large citrus', description: 'Bitter-sweet' },
    { word: 'tangerine', emoji: '🟠', audioText: 'Tangerine - Small orange', description: 'Easy to peel' },
  ];

  // 🏝️ Tropical Fruits
  const tropicalFruits = [
    { word: 'mango', emoji: '🥭', audioText: 'Mango - Sweet tropical fruit', description: 'King of fruits' },
    { word: 'pineapple', emoji: '🍍', audioText: 'Pineapple - Spiky fruit', description: 'Sweet and sour' },
    { word: 'coconut', emoji: '🥥', audioText: 'Coconut - Hard shell fruit', description: 'Has water inside' },
    { word: 'papaya', emoji: '🧡', audioText: 'Papaya - Orange fruit', description: 'Black seeds' },
    { word: 'dragon fruit', emoji: '🐉', audioText: 'Dragon fruit - Exotic fruit', description: 'Pink skin' },
    { word: 'passion fruit', emoji: '💜', audioText: 'Passion fruit - Wrinkly fruit', description: 'Very aromatic' },
    { word: 'guava', emoji: '🍏', audioText: 'Guava - Tropical fruit', description: 'Sweet smell' },
    { word: 'lychee', emoji: '🔴', audioText: 'Lychee - Small tropical fruit', description: 'White inside' },
    { word: 'jackfruit', emoji: '🌳', audioText: 'Jackfruit - Huge fruit', description: 'Largest tree fruit' },
  ];

  // 🍈 Melons
  const melons = [
    { word: 'cantaloupe', emoji: '🍈', audioText: 'Cantaloupe - Orange melon', description: 'Netted skin' },
    { word: 'honeydew', emoji: '🟢', audioText: 'Honeydew - Green melon', description: 'Very sweet' },
  ];

  // 🍑 Stone Fruits
  const stoneFruits = [
    { word: 'peach', emoji: '🍑', audioText: 'Peach - Soft fuzzy fruit', description: 'Sweet and juicy' },
    { word: 'plum', emoji: '🟣', audioText: 'Plum - Purple fruit', description: 'Has pit' },
    { word: 'apricot', emoji: '🟠', audioText: 'Apricot - Small orange fruit', description: 'Like peach' },
    { word: 'nectarine', emoji: '🍑', audioText: 'Nectarine - Smooth peach', description: 'No fuzz' },
  ];

  // 🌰 Other / Special Fruits
  const otherFruits = [
    { word: 'pomegranate', emoji: '🔴', audioText: 'Pomegranate - Many seeds', description: 'Red fruit' },
    { word: 'fig', emoji: '💜', audioText: 'Fig - Soft sweet fruit', description: 'Chewy texture' },
    { word: 'date', emoji: '🌴', audioText: 'Date - Sweet dried fruit', description: 'Sticky and sweet' },
    { word: 'avocado', emoji: '🥑', audioText: 'Avocado - Creamy fruit', description: 'Used in guacamole' },
    { word: 'olive', emoji: '🫒', audioText: 'Olive - Used for oil', description: 'Green or black' },
    { word: 'tomato', emoji: '🍅', audioText: 'Tomato - Fruit used as vegetable', description: 'Is it fruit?' },
    { word: 'persimmon', emoji: '🟠', audioText: 'Persimmon - Autumn fruit', description: 'Very sweet' },
    { word: 'starfruit', emoji: '⭐', audioText: 'Starfruit - Star shaped', description: 'Also carambola' },
  ];

  return (
    <>
      <LearningCard title="Common Fruits" subtitle="Everyday fruits" category="🍎 Fruits" categoryColor="#FF6B6B" items={commonFruits} />
      <LearningCard title="Berries" subtitle="Small juicy fruits" category="🍓 Fruits" categoryColor="#E84393" items={berries} />
      <LearningCard title="Citrus Fruits" subtitle="Sour & tangy" category="🍋 Fruits" categoryColor="#FDCB6E" items={citrusFruits} />
      <LearningCard title="Tropical Fruits" subtitle="Warm climate fruits" category="🏝️ Fruits" categoryColor="#00B894" items={tropicalFruits} />
      <LearningCard title="Melons" subtitle="Big juicy fruits" category="🍈 Fruits" categoryColor="#55EFC4" items={melons} />
      <LearningCard title="Stone Fruits" subtitle="Fruits with pits" category="🍑 Fruits" categoryColor="#FAB1A0" items={stoneFruits} />
      <LearningCard title="Other Fruits" subtitle="Special & unique" category="🌰 Fruits" categoryColor="#A29BFE" items={otherFruits} />
    </>
  );
}

export default FruitsBasket;
