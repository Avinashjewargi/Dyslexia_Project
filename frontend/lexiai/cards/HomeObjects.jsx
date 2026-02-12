// frontend/lexiai/cards/HomeObjects.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function HomeObjects() {

  // 🛋️ Living Room
  const livingRoom = [
    { word: 'sofa', emoji: '🛋️', audioText: 'Sofa - Long comfortable seat', description: 'Couch for sitting' },
    { word: 'chair', emoji: '🪑', audioText: 'Chair - Seat for one person', description: 'Place to sit' },
    { word: 'table', emoji: '🪟', audioText: 'Table - Flat surface on legs', description: 'For eating or working' },
    { word: 'television', emoji: '📺', audioText: 'Television - Watch shows and movies', description: 'TV screen' },
    { word: 'lamp', emoji: '💡', audioText: 'Lamp - Gives light', description: 'Light source' },
    { word: 'carpet', emoji: '🧶', audioText: 'Carpet - Soft floor covering', description: 'Floor rug' },
    { word: 'curtains', emoji: '🪟', audioText: 'Curtains - Cover windows', description: 'Window cloth' },
    { word: 'cushion', emoji: '🧸', audioText: 'Cushion - Soft pad for comfort', description: 'Decor pillow' }
  ];

  // 🛏️ Bedroom
  const bedroom = [
    { word: 'bed', emoji: '🛏️', audioText: 'Bed - Sleep on it', description: 'For sleeping' },
    { word: 'mattress', emoji: '🧩', audioText: 'Mattress - Soft bed layer', description: 'Sleep surface' },
    { word: 'blanket', emoji: '🧣', audioText: 'Blanket - Keeps you warm', description: 'Bed covering' },
    { word: 'sheet', emoji: '📄', audioText: 'Sheet - Cloth on mattress', description: 'Bed linen' },
    { word: 'wardrobe', emoji: '🚪', audioText: 'Wardrobe - Stores clothes', description: 'Clothes cupboard' },
    { word: 'mirror', emoji: '🪞', audioText: 'Mirror - See yourself', description: 'Reflection' },
    { word: 'alarm clock', emoji: '⏰', audioText: 'Alarm clock - Wakes you up', description: 'Time alarm' },
    { word: 'pillow', emoji: '🧸', audioText: 'Pillow - Rest your head', description: 'Soft support' }
  ];

  // 🍳 Kitchen
  const kitchen = [
    { word: 'refrigerator', emoji: '🧊', audioText: 'Refrigerator - Keeps food cold', description: 'Fridge' },
    { word: 'oven', emoji: '🔥', audioText: 'Oven - Bakes food', description: 'Cooking appliance' },
    { word: 'stove', emoji: '🍳', audioText: 'Stove - Cooks food', description: 'Gas stove' },
    { word: 'microwave', emoji: '📦', audioText: 'Microwave - Heats food fast', description: 'Quick heating' },
    { word: 'sink', emoji: '🚰', audioText: 'Sink - Wash dishes', description: 'Water basin' },
    { word: 'kettle', emoji: '☕', audioText: 'Kettle - Boils water', description: 'Tea kettle' },
    { word: 'toaster', emoji: '🍞', audioText: 'Toaster - Toasts bread', description: 'Bread toaster' },
    { word: 'pot', emoji: '🍲', audioText: 'Pot - Deep cooking container', description: 'Cooking pot' },
    { word: 'pan', emoji: '🍳', audioText: 'Pan - Fry food', description: 'Frying pan' },
    { word: 'plate', emoji: '🍽️', audioText: 'Plate - Eat food from it', description: 'Dish' },
    { word: 'bowl', emoji: '🥣', audioText: 'Bowl - Deep dish', description: 'Soup bowl' },
    { word: 'spoon', emoji: '🥄', audioText: 'Spoon - Scoop food', description: 'Utensil' },
    { word: 'fork', emoji: '🍴', audioText: 'Fork - Pick food', description: 'Utensil' },
    { word: 'knife', emoji: '🔪', audioText: 'Knife - Cut food', description: 'Sharp tool' }
  ];

  // 🚿 Bathroom
  const bathroom = [
    { word: 'toilet', emoji: '🚽', audioText: 'Toilet - Bathroom seat', description: 'Restroom fixture' },
    { word: 'bathtub', emoji: '🛁', audioText: 'Bathtub - Take bath', description: 'Bath tub' },
    { word: 'shower', emoji: '🚿', audioText: 'Shower - Wash standing', description: 'Water spray' },
    { word: 'towel', emoji: '🧻', audioText: 'Towel - Dry body', description: 'Drying cloth' },
    { word: 'soap', emoji: '🧼', audioText: 'Soap - Cleans body', description: 'For washing' },
    { word: 'toothbrush', emoji: '🪥', audioText: 'Toothbrush - Clean teeth', description: 'Dental tool' },
    { word: 'toothpaste', emoji: '🦷', audioText: 'Toothpaste - Used with brush', description: 'Dental paste' }
  ];

  // 🏠 General Home
  const generalHome = [
    { word: 'door', emoji: '🚪', audioText: 'Door - Enter or exit', description: 'Entrance' },
    { word: 'window', emoji: '🪟', audioText: 'Window - Look outside', description: 'Glass opening' },
    { word: 'stairs', emoji: '🪜', audioText: 'Stairs - Go up or down', description: 'Steps' },
    { word: 'fan', emoji: '🌀', audioText: 'Fan - Blows air', description: 'Cooling air' },
    { word: 'heater', emoji: '🔥', audioText: 'Heater - Makes warm', description: 'Heating device' },
    { word: 'air conditioner', emoji: '❄️', audioText: 'Air conditioner - Makes cool', description: 'Cooling device' },
    { word: 'vacuum cleaner', emoji: '🧹', audioText: 'Vacuum cleaner - Cleans floor', description: 'Cleaning machine' },
    { word: 'broom', emoji: '🧹', audioText: 'Broom - Sweeps floor', description: 'Cleaning tool' },
    { word: 'trash can', emoji: '🗑️', audioText: 'Trash can - Throw waste', description: 'Dustbin' }
  ];

  return (
    <>
      <LearningCard title="Living Room Objects" subtitle="Things in the living room" category="🏠 Home" categoryColor="#74B9FF" items={livingRoom} />
      <LearningCard title="Bedroom Objects" subtitle="Things in the bedroom" category="🛏️ Home" categoryColor="#A29BFE" items={bedroom} />
      <LearningCard title="Kitchen Objects" subtitle="Things used for cooking" category="🍳 Home" categoryColor="#FDCB6E" items={kitchen} />
      <LearningCard title="Bathroom Objects" subtitle="Things for hygiene" category="🚿 Home" categoryColor="#55EFC4" items={bathroom} />
      <LearningCard title="General Home Objects" subtitle="Used everywhere" category="🏡 Home" categoryColor="#FF7675" items={generalHome} />
    </>
  );
}

export default HomeObjects;
