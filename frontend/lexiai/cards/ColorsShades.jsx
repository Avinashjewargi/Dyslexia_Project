// frontend/lexiai/cards/ColorsShades.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function ColorsShades() {

  // 🎨 Primary Colors
  const primaryColors = [
    { word: 'red', emoji: '🍎', audioText: 'Red - Like an apple or fire', description: 'Primary color' },
    { word: 'blue', emoji: '🌊', audioText: 'Blue - Like sky and ocean', description: 'Primary color' },
    { word: 'yellow', emoji: '☀️', audioText: 'Yellow - Like sun and banana', description: 'Primary color' },
  ];

  // 🧩 Secondary Colors
  const secondaryColors = [
    { word: 'orange', emoji: '🍊', audioText: 'Orange - Mix of red and yellow', description: 'Secondary color' },
    { word: 'green', emoji: '🌱', audioText: 'Green - Mix of blue and yellow', description: 'Secondary color' },
    { word: 'purple', emoji: '🍇', audioText: 'Purple - Mix of red and blue', description: 'Secondary color' },
  ];

  // ⚪ Common & Neutral Colors
  const neutralColors = [
    { word: 'pink', emoji: '🌸', audioText: 'Pink - Soft light red', description: 'Common color' },
    { word: 'brown', emoji: '🌳', audioText: 'Brown - Like wood or soil', description: 'Earthy color' },
    { word: 'black', emoji: '🌑', audioText: 'Black - Like night sky', description: 'Darkest color' },
    { word: 'white', emoji: '❄️', audioText: 'White - Like snow', description: 'Lightest color' },
    { word: 'gray', emoji: '🌫️', audioText: 'Gray - Between black and white', description: 'Neutral color' },
  ];

  // 🔴 Shades of Red
  const redShades = [
    { word: 'crimson', emoji: '❤️', audioText: 'Crimson - Deep red', description: 'Dark red shade' },
    { word: 'scarlet', emoji: '🚗', audioText: 'Scarlet - Bright red', description: 'Vivid red shade' },
    { word: 'maroon', emoji: '🍷', audioText: 'Maroon - Brownish red', description: 'Deep red-brown' },
    { word: 'magenta', emoji: '💗', audioText: 'Magenta - Pinkish purple', description: 'Bright reddish purple' },
  ];

  // 🔵 Shades of Blue
  const blueShades = [
    { word: 'navy', emoji: '⚓', audioText: 'Navy - Very dark blue', description: 'Deep blue shade' },
    { word: 'sky blue', emoji: '☁️', audioText: 'Sky blue - Light blue', description: 'Color of sky' },
    { word: 'turquoise', emoji: '🏝️', audioText: 'Turquoise - Blue green', description: 'Tropical water color' },
    { word: 'indigo', emoji: '🌌', audioText: 'Indigo - Blue purple', description: 'Between blue and violet' },
    { word: 'cyan', emoji: '💧', audioText: 'Cyan - Bright blue green', description: 'Electric blue' },
  ];

  // 🟢 Shades of Green
  const greenShades = [
    { word: 'lime', emoji: '🍋', audioText: 'Lime - Bright green', description: 'Yellow green shade' },
    { word: 'olive', emoji: '🫒', audioText: 'Olive - Earthy green', description: 'Brownish green' },
    { word: 'mint', emoji: '🍃', audioText: 'Mint - Fresh green', description: 'Light green shade' },
  ];

  // ✨ Metallic & Special Shades
  const specialShades = [
    { word: 'gold', emoji: '🥇', audioText: 'Gold - Shiny yellow metal', description: 'Metallic color' },
    { word: 'silver', emoji: '🥈', audioText: 'Silver - Shiny gray metal', description: 'Metallic color' },
    { word: 'bronze', emoji: '🥉', audioText: 'Bronze - Brownish metal', description: 'Metallic color' },
    { word: 'beige', emoji: '🏖️', audioText: 'Beige - Sandy light brown', description: 'Soft neutral shade' },
    { word: 'ivory', emoji: '🦷', audioText: 'Ivory - Creamy white', description: 'Off white shade' },
    { word: 'lavender', emoji: '💐', audioText: 'Lavender - Pale purple', description: 'Flower color' },
    { word: 'violet', emoji: '🟣', audioText: 'Violet - Blue purple', description: 'Rich purple shade' },
  ];

  return (
    <>
      <LearningCard title="Primary Colors" subtitle="Basic building blocks" category="🎨 Colors" categoryColor="#FF7675" items={primaryColors} />
      <LearningCard title="Secondary Colors" subtitle="Mixed from primaries" category="🎨 Colors" categoryColor="#55EFC4" items={secondaryColors} />
      <LearningCard title="Common Colors" subtitle="Everyday colors" category="⚪ Colors" categoryColor="#B2BEC3" items={neutralColors} />
      <LearningCard title="Red Shades" subtitle="Warm red tones" category="🔴 Colors" categoryColor="#D63031" items={redShades} />
      <LearningCard title="Blue Shades" subtitle="Cool blue tones" category="🔵 Colors" categoryColor="#0984E3" items={blueShades} />
      <LearningCard title="Green Shades" subtitle="Natural green tones" category="🟢 Colors" categoryColor="#00B894" items={greenShades} />
      <LearningCard title="Special Shades" subtitle="Metallic & soft tones" category="✨ Colors" categoryColor="#A29BFE" items={specialShades} />
    </>
  );
}

export default ColorsShades;
