// frontend/lexiai/cards/HumanBody.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function HumanBody() {

  // 😀 Head & Face
  const headAndFace = [
    { word: 'head', emoji: '🧠', audioText: 'Head - Top part with brain inside', description: 'Contains your brain' },
    { word: 'face', emoji: '🙂', audioText: 'Face - Front part of head', description: 'Shows expressions' },
    { word: 'hair', emoji: '💇', audioText: 'Hair - Grows on your head', description: 'Can be different colors' },
    { word: 'forehead', emoji: '🪞', audioText: 'Forehead - Above eyebrows', description: 'Upper face area' },
    { word: 'eye', emoji: '👁️', audioText: 'Eye - You see with it', description: 'Organ of sight' },
    { word: 'eyebrow', emoji: '🤨', audioText: 'Eyebrow - Hair above eye', description: 'Protects eyes' },
    { word: 'eyelash', emoji: '✨', audioText: 'Eyelash - Tiny hairs on eyelids', description: 'Stops dust' },
    { word: 'nose', emoji: '👃', audioText: 'Nose - You smell with it', description: 'Organ of smell' },
    { word: 'ear', emoji: '👂', audioText: 'Ear - You hear sounds', description: 'Organ of hearing' },
    { word: 'cheek', emoji: '😊', audioText: 'Cheek - Side of face', description: 'Soft part' },
    { word: 'mouth', emoji: '👄', audioText: 'Mouth - Eat and talk', description: 'Speech and eating' },
    { word: 'lips', emoji: '💋', audioText: 'Lips - Soft mouth edges', description: 'Help speech' },
    { word: 'tongue', emoji: '👅', audioText: 'Tongue - Tastes food', description: 'Helps speak' },
    { word: 'teeth', emoji: '🦷', audioText: 'Teeth - Chew food', description: 'Biting and chewing' },
    { word: 'chin', emoji: '🧔', audioText: 'Chin - Bottom of face', description: 'Below mouth' },
    { word: 'neck', emoji: '🧣', audioText: 'Neck - Connects head to body', description: 'Holds head' },
  ];

  // 🧍 Upper Body
  const upperBody = [
    { word: 'shoulder', emoji: '🤷', audioText: 'Shoulder - Where arm meets body', description: 'Connects arm' },
    { word: 'chest', emoji: '❤️', audioText: 'Chest - Upper front body', description: 'Heart and lungs' },
    { word: 'back', emoji: '🔙', audioText: 'Back - Rear of body', description: 'Supports posture' },
    { word: 'stomach', emoji: '🍽️', audioText: 'Stomach - Digests food', description: 'Belly area' },
    { word: 'belly button', emoji: '🔘', audioText: 'Belly button - Spot on tummy', description: 'Navel' },
  ];

  // 💪 Arms & Hands
  const armsAndHands = [
    { word: 'arm', emoji: '💪', audioText: 'Arm - From shoulder to hand', description: 'Lifts and reaches' },
    { word: 'elbow', emoji: '📐', audioText: 'Elbow - Arm joint', description: 'Bends arm' },
    { word: 'wrist', emoji: '⌚', audioText: 'Wrist - Connects hand to arm', description: 'Watch area' },
    { word: 'hand', emoji: '✋', audioText: 'Hand - End of arm', description: 'Hold things' },
    { word: 'finger', emoji: '☝️', audioText: 'Finger - Five on each hand', description: 'Grasp objects' },
    { word: 'thumb', emoji: '👍', audioText: 'Thumb - Short thick finger', description: 'Helps grip' },
    { word: 'palm', emoji: '🤲', audioText: 'Palm - Inside of hand', description: 'Flat surface' },
    { word: 'nail', emoji: '💅', audioText: 'Nail - Hard finger cover', description: 'Protects fingertips' },
  ];

  // 🦵 Legs & Feet
  const legsAndFeet = [
    { word: 'leg', emoji: '🦵', audioText: 'Leg - Used for walking', description: 'From hip to foot' },
    { word: 'knee', emoji: '🦵', audioText: 'Knee - Bending joint', description: 'Middle of leg' },
    { word: 'ankle', emoji: '🔗', audioText: 'Ankle - Joint above foot', description: 'Connects leg and foot' },
    { word: 'foot', emoji: '🦶', audioText: 'Foot - Stand and walk', description: 'Bottom of leg' },
    { word: 'toe', emoji: '🧦', audioText: 'Toe - Five on each foot', description: 'Helps balance' },
    { word: 'heel', emoji: '👟', audioText: 'Heel - Back of foot', description: 'Rear foot part' },
  ];

  return (
    <>
      <LearningCard title="Head & Face" subtitle="See, hear, speak" category="😀 Body" categoryColor="#74B9FF" items={headAndFace} />
      <LearningCard title="Upper Body" subtitle="Chest & torso" category="🧍 Body" categoryColor="#55EFC4" items={upperBody} />
      <LearningCard title="Arms & Hands" subtitle="Hold & lift" category="💪 Body" categoryColor="#FDCB6E" items={armsAndHands} />
      <LearningCard title="Legs & Feet" subtitle="Walk & balance" category="🦵 Body" categoryColor="#A29BFE" items={legsAndFeet} />
    </>
  );
}

export default HumanBody;
