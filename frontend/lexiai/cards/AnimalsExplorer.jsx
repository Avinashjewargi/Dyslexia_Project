// frontend/lexiai/cards/AnimalsExplorer.jsx

import LearningCard from '../LearningCard';

function AnimalsExplorer() {

  // 🏠 Domestic / Farm Animals
  const domesticAnimals = [
    { word: 'dog', emoji: '🐕', audioText: 'Dog - A loyal pet that barks', description: 'Man’s best friend' },
    { word: 'cat', emoji: '🐈', audioText: 'Cat - A soft pet that meows', description: 'Independent pet' },
    { word: 'cow', emoji: '🐄', audioText: 'Cow - Gives us milk', description: 'Farm animal' },
    { word: 'horse', emoji: '🐴', audioText: 'Horse - Fast animal we can ride', description: 'Used for riding' },
    { word: 'pig', emoji: '🐷', audioText: 'Pig - Pink farm animal that oinks', description: 'Farm animal' },
    { word: 'sheep', emoji: '🐑', audioText: 'Sheep - Woolly animal that baas', description: 'Gives us wool' },
    { word: 'goat', emoji: '🐐', audioText: 'Goat - Animal with horns', description: 'Climbs mountains' },
    { word: 'chicken', emoji: '🐔', audioText: 'Chicken - Gives us eggs', description: 'Farm bird' },
    { word: 'rabbit', emoji: '🐰', audioText: 'Rabbit - Hops and has long ears', description: 'Fluffy pet' },
    { word: 'duck', emoji: '🦆', audioText: 'Duck - Swims and quacks', description: 'Water bird' },
  ];

  // 🌴 Jungle Animals
  const jungleAnimals = [
    { word: 'lion', emoji: '🦁', audioText: 'Lion - King of the jungle', description: 'Big cat with mane' },
    { word: 'tiger', emoji: '🐯', audioText: 'Tiger - Striped big cat', description: 'Orange with black stripes' },
    { word: 'elephant', emoji: '🐘', audioText: 'Elephant - Largest land animal', description: 'Has a long trunk' },
    { word: 'giraffe', emoji: '🦒', audioText: 'Giraffe - Tallest animal', description: 'Long neck' },
    { word: 'zebra', emoji: '🦓', audioText: 'Zebra - Black and white stripes', description: 'Looks like a horse' },
    { word: 'monkey', emoji: '🐵', audioText: 'Monkey - Swings in trees', description: 'Loves bananas' },
    { word: 'gorilla', emoji: '🦍', audioText: 'Gorilla - Very strong ape', description: 'Largest primate' },
    { word: 'panda', emoji: '🐼', audioText: 'Panda - Black and white bear', description: 'Eats bamboo' },
    { word: 'bear', emoji: '🐻', audioText: 'Bear - Large furry animal', description: 'Loves honey' },
    { word: 'fox', emoji: '🦊', audioText: 'Fox - Clever animal', description: 'Bushy tail' },
  ];

  // 🌍 Safari & Desert Animals
  const safariAnimals = [
    { word: 'rhino', emoji: '🦏', audioText: 'Rhinoceros - Has a horn', description: 'Very strong' },
    { word: 'hippo', emoji: '🦛', audioText: 'Hippopotamus - Lives in water', description: 'Huge animal' },
    { word: 'camel', emoji: '🐪', audioText: 'Camel - Desert animal', description: 'Has humps' },
    { word: 'kangaroo', emoji: '🦘', audioText: 'Kangaroo - Hops and has a pouch', description: 'From Australia' },
    { word: 'koala', emoji: '🐨', audioText: 'Koala - Sleeps in trees', description: 'Eats eucalyptus' },
  ];

  // 🌊 Sea Animals
  const seaAnimals = [
    { word: 'dolphin', emoji: '🐬', audioText: 'Dolphin - Smart sea animal', description: 'Very friendly' },
    { word: 'whale', emoji: '🐋', audioText: 'Whale - Biggest ocean animal', description: 'Giant mammal' },
    { word: 'shark', emoji: '🦈', audioText: 'Shark - Sharp teeth fish', description: 'Ocean predator' },
    { word: 'octopus', emoji: '🐙', audioText: 'Octopus - Eight arms', description: 'Very intelligent' },
    { word: 'crab', emoji: '🦀', audioText: 'Crab - Walks sideways', description: 'Has claws' },
    { word: 'seal', emoji: '🦭', audioText: 'Seal - Claps flippers', description: 'Loves fish' },
  ];

  // ❄️ Arctic / Cold Climate
  const coldAnimals = [
    { word: 'penguin', emoji: '🐧', audioText: 'Penguin - Cannot fly', description: 'Great swimmer' },
    { word: 'polar bear', emoji: '🐻‍❄️', audioText: 'Polar bear - White bear', description: 'Lives on ice' },
  ];

  // 🐭 Small Animals
  const smallAnimals = [
    { word: 'mouse', emoji: '🐭', audioText: 'Mouse - Small animal', description: 'Loves cheese' },
    { word: 'rat', emoji: '🐀', audioText: 'Rat - Bigger than mouse', description: 'Very smart' },
    { word: 'hamster', emoji: '🐹', audioText: 'Hamster - Small pet', description: 'Stores food in cheeks' },
    { word: 'squirrel', emoji: '🐿️', audioText: 'Squirrel - Climbs trees', description: 'Eats nuts' },
  ];

  // 🦎 Reptiles
  const reptiles = [
    { word: 'snake', emoji: '🐍', audioText: 'Snake - No legs', description: 'Slithers' },
    { word: 'turtle', emoji: '🐢', audioText: 'Turtle - Has a shell', description: 'Moves slowly' },
    { word: 'crocodile', emoji: '🐊', audioText: 'Crocodile - Big reptile', description: 'Sharp teeth' },
  ];

  return (
    <>
      <LearningCard title="Domestic Animals" subtitle="Pets & farm animals" category="🐾 Animals" categoryColor="#4ECDC4" items={domesticAnimals} />
      <LearningCard title="Jungle Animals" subtitle="Animals of the forest" category="🐾 Animals" categoryColor="#2ECC71" items={jungleAnimals} />
      <LearningCard title="Safari & Desert Animals" subtitle="Hot climate animals" category="🐾 Animals" categoryColor="#F39C12" items={safariAnimals} />
      <LearningCard title="Sea Animals" subtitle="Ocean life" category="🐾 Animals" categoryColor="#3498DB" items={seaAnimals} />
      <LearningCard title="Cold Climate Animals" subtitle="Arctic animals" category="🐾 Animals" categoryColor="#74B9FF" items={coldAnimals} />
      <LearningCard title="Small Animals" subtitle="Tiny creatures" category="🐾 Animals" categoryColor="#A29BFE" items={smallAnimals} />
      <LearningCard title="Reptiles" subtitle="Cold-blooded animals" category="🐾 Animals" categoryColor="#27AE60" items={reptiles} />
    </>
  );
}

export default AnimalsExplorer;
