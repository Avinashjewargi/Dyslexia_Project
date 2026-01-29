// frontend/lexiai/cards/ClothesWearables.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function ClothesWearables() {

  // 👕 Upper Body Wear
  const upperWear = [
    { word: 'shirt', emoji: '👔', audioText: 'Shirt - Top you wear on upper body', description: 'Upper garment' },
    { word: 't-shirt', emoji: '👕', audioText: 'T-shirt - Casual short sleeve shirt', description: 'Everyday wear' },
    { word: 'blouse', emoji: '👚', audioText: 'Blouse - Dressy top', description: 'Formal top' },
    { word: 'sweater', emoji: '🧶', audioText: 'Sweater - Warm knitted clothing', description: 'Winter wear' },
    { word: 'hoodie', emoji: '🧥', audioText: 'Hoodie - Warm top with hood', description: 'Casual wear' },
    { word: 'jacket', emoji: '🥼', audioText: 'Jacket - Light outer wear', description: 'Outer layer' },
    { word: 'coat', emoji: '🧥', audioText: 'Coat - Long warm clothing', description: 'Winter coat' },
    { word: 'vest', emoji: '🦺', audioText: 'Vest - Sleeveless jacket', description: 'Safety or fashion wear' },
    { word: 'blazer', emoji: '🤵', audioText: 'Blazer - Formal jacket', description: 'Office wear' }
  ];

  // 👖 Lower Body Wear
  const lowerWear = [
    { word: 'pants', emoji: '👖', audioText: 'Pants - Clothing for legs', description: 'Trousers' },
    { word: 'jeans', emoji: '👖', audioText: 'Jeans - Denim pants', description: 'Casual wear' },
    { word: 'shorts', emoji: '🩳', audioText: 'Shorts - Short pants', description: 'Summer wear' },
    { word: 'skirt', emoji: '👗', audioText: 'Skirt - Clothing worn from waist', description: 'Lower body clothing' },
    { word: 'leggings', emoji: '🧘', audioText: 'Leggings - Stretchy pants', description: 'Flexible wear' }
  ];

  // 👗 Full Body Wear
  const fullBodyWear = [
    { word: 'dress', emoji: '👗', audioText: 'Dress - One piece outfit', description: 'Full body wear' },
    { word: 'suit', emoji: '🤵', audioText: 'Suit - Matching formal clothes', description: 'Business wear' },
    { word: 'uniform', emoji: '👮', audioText: 'Uniform - Special work clothes', description: 'School or job wear' },
    { word: 'jumpsuit', emoji: '🩱', audioText: 'Jumpsuit - One piece outfit', description: 'Top and pants together' },
    { word: 'pajamas', emoji: '🌙', audioText: 'Pajamas - Clothes for sleeping', description: 'Night wear' },
    { word: 'robe', emoji: '🛀', audioText: 'Robe - Loose long clothing', description: 'After bath wear' }
  ];

  // 👟 Footwear
  const footwear = [
    { word: 'shoes', emoji: '👞', audioText: 'Shoes - Protect your feet', description: 'Footwear' },
    { word: 'sneakers', emoji: '👟', audioText: 'Sneakers - Sports shoes', description: 'Running shoes' },
    { word: 'sandals', emoji: '👡', audioText: 'Sandals - Open footwear', description: 'Summer wear' },
    { word: 'boots', emoji: '👢', audioText: 'Boots - Cover feet and ankles', description: 'Winter or work wear' },
    { word: 'slippers', emoji: '🥿', audioText: 'Slippers - Soft indoor shoes', description: 'Home wear' },
    { word: 'flip-flops', emoji: '🩴', audioText: 'Flip-flops - Beach footwear', description: 'Casual wear' }
  ];

  // 🎒 Accessories
  const accessories = [
    { word: 'hat', emoji: '🎩', audioText: 'Hat - Head covering', description: 'Head wear' },
    { word: 'cap', emoji: '🧢', audioText: 'Cap - Hat with shade', description: 'Sun protection' },
    { word: 'scarf', emoji: '🧣', audioText: 'Scarf - Worn around neck', description: 'Keeps warm' },
    { word: 'gloves', emoji: '🧤', audioText: 'Gloves - Cover hands', description: 'Winter wear' },
    { word: 'belt', emoji: '🪢', audioText: 'Belt - Holds pants', description: 'Waist accessory' },
    { word: 'tie', emoji: '👔', audioText: 'Tie - Formal neck wear', description: 'Office accessory' },
    { word: 'bow tie', emoji: '🎀', audioText: 'Bow tie - Fancy tie', description: 'Formal wear' },
    { word: 'watch', emoji: '⌚', audioText: 'Watch - Shows time', description: 'Wrist accessory' },
    { word: 'glasses', emoji: '👓', audioText: 'Glasses - Help you see', description: 'Eye wear' },
    { word: 'sunglasses', emoji: '🕶️', audioText: 'Sunglasses - Protect eyes', description: 'Sun protection' },
    { word: 'backpack', emoji: '🎒', audioText: 'Backpack - Bag worn on back', description: 'Carries items' }
  ];

  return (
    <>
      <LearningCard title="Upper Body Clothes" subtitle="What we wear on top" category="👕 Clothes" categoryColor="#74B9FF" items={upperWear} />
      <LearningCard title="Lower Body Clothes" subtitle="What we wear below" category="👖 Clothes" categoryColor="#55EFC4" items={lowerWear} />
      <LearningCard title="Full Body Clothes" subtitle="One-piece outfits" category="👗 Clothes" categoryColor="#FDCB6E" items={fullBodyWear} />
      <LearningCard title="Footwear" subtitle="Protect your feet" category="👟 Clothes" categoryColor="#A29BFE" items={footwear} />
      <LearningCard title="Accessories" subtitle="Extra things we wear" category="🎒 Clothes" categoryColor="#FF7675" items={accessories} />
    </>
  );
}

export default ClothesWearables;
