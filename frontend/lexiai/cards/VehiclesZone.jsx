// frontend/lexiai/cards/VehiclesZone.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function VehiclesZone() {

  // 🚗 Road Vehicles
  const roadVehicles = [
    { word: 'car', emoji: '🚗', audioText: 'Car - Family vehicle', description: 'Four wheels' },
    { word: 'bus', emoji: '🚌', audioText: 'Bus - Public transport', description: 'Carries many people' },
    { word: 'truck', emoji: '🚚', audioText: 'Truck - Carries goods', description: 'Heavy load vehicle' },
    { word: 'van', emoji: '🚐', audioText: 'Van - Medium vehicle', description: 'Cargo or people' },
    { word: 'taxi', emoji: '🚕', audioText: 'Taxi - Hire car', description: 'Paid ride' },
    { word: 'limousine', emoji: '🎩', audioText: 'Limousine - Luxury car', description: 'Long fancy car' },
    { word: 'camper', emoji: '🏕️', audioText: 'Camper - Home on wheels', description: 'Travel vehicle' },
  ];

  // 🛵 Two & Three Wheelers
  const twoWheelers = [
    { word: 'bicycle', emoji: '🚲', audioText: 'Bicycle - Pedal vehicle', description: 'Eco-friendly' },
    { word: 'motorcycle', emoji: '🏍️', audioText: 'Motorcycle - Fast bike', description: 'Motor powered' },
    { word: 'scooter', emoji: '🛴', audioText: 'Scooter - Small ride', description: 'Kick or electric' },
    { word: 'rickshaw', emoji: '🛺', audioText: 'Rickshaw - Three wheeler', description: 'Auto rickshaw' },
    { word: 'skateboard', emoji: '🛹', audioText: 'Skateboard - Board with wheels', description: 'Fun ride' },
    { word: 'golf cart', emoji: '⛳', audioText: 'Golf cart - Small vehicle', description: 'Golf course ride' },
  ];

  // 🚑 Emergency Vehicles
  const emergencyVehicles = [
    { word: 'ambulance', emoji: '🚑', audioText: 'Ambulance - Medical emergency', description: 'Hospital transport' },
    { word: 'fire truck', emoji: '🚒', audioText: 'Fire truck - Fire rescue', description: 'Puts out fires' },
    { word: 'police car', emoji: '🚓', audioText: 'Police car - Law enforcement', description: 'Keeps people safe' },
  ];

  // 🚜 Heavy & Construction Vehicles
  const heavyVehicles = [
    { word: 'bulldozer', emoji: '🏗️', audioText: 'Bulldozer - Pushes soil', description: 'Construction machine' },
    { word: 'excavator', emoji: '⛏️', audioText: 'Excavator - Digs ground', description: 'Digging machine' },
    { word: 'crane', emoji: '🏗️', audioText: 'Crane - Lifts heavy items', description: 'Construction tool' },
    { word: 'tractor', emoji: '🚜', audioText: 'Tractor - Farm vehicle', description: 'Plowing fields' },
    { word: 'dump truck', emoji: '🚛', audioText: 'Dump truck - Dumps dirt', description: 'Tilts to unload' },
  ];

  // 🚆 Rail Vehicles
  const railVehicles = [
    { word: 'train', emoji: '🚂', audioText: 'Train - Runs on tracks', description: 'Long distance travel' },
    { word: 'subway', emoji: '🚇', audioText: 'Subway - Underground train', description: 'Metro system' },
    { word: 'tram', emoji: '🚊', audioText: 'Tram - Street rail', description: 'City transport' },
    { word: 'cable car', emoji: '🚠', audioText: 'Cable car - Hangs on cable', description: 'Mountain transport' },
  ];

  // ✈️ Air & Space Vehicles
  const airVehicles = [
    { word: 'airplane', emoji: '✈️', audioText: 'Airplane - Flies in sky', description: 'Air travel' },
    { word: 'helicopter', emoji: '🚁', audioText: 'Helicopter - Vertical flight', description: 'Spinning blades' },
    { word: 'hot air balloon', emoji: '🎈', audioText: 'Hot air balloon - Floats', description: 'Uses hot air' },
    { word: 'rocket', emoji: '🚀', audioText: 'Rocket - Goes to space', description: 'Space travel' },
  ];

  // 🚢 Water Vehicles
  const waterVehicles = [
    { word: 'boat', emoji: '🚤', audioText: 'Boat - Small water vehicle', description: 'Moves on water' },
    { word: 'ship', emoji: '🚢', audioText: 'Ship - Large ocean vehicle', description: 'Cargo and travel' },
    { word: 'yacht', emoji: '🛥️', audioText: 'Yacht - Luxury boat', description: 'Pleasure craft' },
    { word: 'sailboat', emoji: '⛵', audioText: 'Sailboat - Wind powered', description: 'Uses sails' },
    { word: 'ferry', emoji: '⛴️', audioText: 'Ferry - Carries people', description: 'Crosses water' },
    { word: 'canoe', emoji: '🛶', audioText: 'Canoe - Paddle boat', description: 'Narrow boat' },
    { word: 'submarine', emoji: '🌊', audioText: 'Submarine - Underwater vehicle', description: 'Goes deep sea' },
  ];

  // ⭐ Special & Fun Vehicles
  const specialVehicles = [
    { word: 'race car', emoji: '🏎️', audioText: 'Race car - Very fast car', description: 'Racing track' },
    { word: 'snowmobile', emoji: '❄️', audioText: 'Snowmobile - Snow vehicle', description: 'Winter transport' },
    { word: 'sleigh', emoji: '🛷', audioText: 'Sleigh - Slides on snow', description: 'Winter ride' },
    { word: 'cart', emoji: '🛒', audioText: 'Cart - Push vehicle', description: 'Simple wheels' },
  ];

  return (
    <>
      <LearningCard title="Road Vehicles" subtitle="Everyday transport" category="🚗 Vehicles" categoryColor="#74B9FF" items={roadVehicles} />
      <LearningCard title="Two & Three Wheelers" subtitle="Small rides" category="🛵 Vehicles" categoryColor="#55EFC4" items={twoWheelers} />
      <LearningCard title="Emergency Vehicles" subtitle="Help & rescue" category="🚑 Vehicles" categoryColor="#FF7675" items={emergencyVehicles} />
      <LearningCard title="Heavy Vehicles" subtitle="Construction & farm" category="🚜 Vehicles" categoryColor="#FDCB6E" items={heavyVehicles} />
      <LearningCard title="Rail Vehicles" subtitle="On tracks" category="🚆 Vehicles" categoryColor="#A29BFE" items={railVehicles} />
      <LearningCard title="Air & Space Vehicles" subtitle="Fly high" category="✈️ Vehicles" categoryColor="#81ECEC" items={airVehicles} />
      <LearningCard title="Water Vehicles" subtitle="On water" category="🚢 Vehicles" categoryColor="#0984E3" items={waterVehicles} />
      <LearningCard title="Special Vehicles" subtitle="Fun & unique" category="⭐ Vehicles" categoryColor="#E84393" items={specialVehicles} />
    </>
  );
}

export default VehiclesZone;
