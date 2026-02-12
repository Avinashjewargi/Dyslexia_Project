// frontend/lexiai/cards/PhonicsAndSounds.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function PhonicsAndSounds() {

  // 🔤 Short Vowels
  const shortVowels = [
    { word: 'a', emoji: '🍎', audioText: 'Short a sound, like apple, cat, hat', description: 'Short vowel /æ/' },
    { word: 'e', emoji: '🥚', audioText: 'Short e sound, like egg, bed, red', description: 'Short vowel /ɛ/' },
    { word: 'i', emoji: '🐷', audioText: 'Short i sound, like pig, sit, big', description: 'Short vowel /ɪ/' },
    { word: 'o', emoji: '🐙', audioText: 'Short o sound, like octopus, hot, dog', description: 'Short vowel /ɒ/' },
    { word: 'u', emoji: '☂️', audioText: 'Short u sound, like umbrella, cup, bug', description: 'Short vowel /ʌ/' },
  ];

  // 🔠 Long Vowels
  const longVowels = [
    { word: 'ā', emoji: '🍰', audioText: 'Long a sound, like cake, make, rain', description: 'Long vowel /eɪ/' },
    { word: 'ē', emoji: '🐝', audioText: 'Long e sound, like bee, see, tree', description: 'Long vowel /iː/' },
    { word: 'ī', emoji: '🚲', audioText: 'Long i sound, like bike, kite, ice', description: 'Long vowel /aɪ/' },
    { word: 'ō', emoji: '🚤', audioText: 'Long o sound, like boat, go, snow', description: 'Long vowel /oʊ/' },
    { word: 'ū', emoji: '🎺', audioText: 'Long u sound, like tube, cube, flute', description: 'Long vowel /juː/' },
  ];

  // 🔊 Consonant Sounds
  const consonants = [
    { word: 'b', emoji: '⚽', audioText: 'B sound, like ball, bat, bee', description: 'Consonant /b/' },
    { word: 'd', emoji: '🦆', audioText: 'D sound, like duck, dog, dad', description: 'Consonant /d/' },
    { word: 'f', emoji: '🐟', audioText: 'F sound, like fish, fan, fox', description: 'Consonant /f/' },
    { word: 'g', emoji: '🎁', audioText: 'G sound, like gift, go, gate', description: 'Consonant /g/' },
    { word: 'h', emoji: '🏠', audioText: 'H sound, like house, hat, hop', description: 'Consonant /h/' },
    { word: 'j', emoji: '🤸', audioText: 'J sound, like jump, jar, jet', description: 'Consonant /dʒ/' },
    { word: 'k', emoji: '🔑', audioText: 'K sound, like key, kit, king', description: 'Consonant /k/' },
    { word: 'l', emoji: '🍋', audioText: 'L sound, like lemon, leg, lip', description: 'Consonant /l/' },
    { word: 'm', emoji: '🐭', audioText: 'M sound, like mouse, mom, map', description: 'Consonant /m/' },
    { word: 'n', emoji: '🥜', audioText: 'N sound, like nut, net, nose', description: 'Consonant /n/' },
    { word: 'p', emoji: '🍕', audioText: 'P sound, like pizza, pig, pen', description: 'Consonant /p/' },
    { word: 'r', emoji: '🌧️', audioText: 'R sound, like rain, red, run', description: 'Consonant /r/' },
    { word: 's', emoji: '☀️', audioText: 'S sound, like sun, sit, snake', description: 'Consonant /s/' },
    { word: 't', emoji: '🌳', audioText: 'T sound, like tree, tap, top', description: 'Consonant /t/' },
    { word: 'v', emoji: '🚐', audioText: 'V sound, like van, vest, vet', description: 'Consonant /v/' },
    { word: 'w', emoji: '🌊', audioText: 'W sound, like wave, wet, win', description: 'Consonant /w/' },
    { word: 'y', emoji: '💛', audioText: 'Y sound, like yellow, yes, yak', description: 'Consonant /j/' },
    { word: 'z', emoji: '🦓', audioText: 'Z sound, like zebra, zip, zoo', description: 'Consonant /z/' },
  ];

  // 🔗 Digraphs
  const digraphs = [
    { word: 'ch', emoji: '🪑', audioText: 'CH sound, like chair, chip, chat', description: 'Digraph /tʃ/' },
    { word: 'sh', emoji: '🤫', audioText: 'SH sound, like ship, shop, shush', description: 'Digraph /ʃ/' },
    { word: 'th', emoji: '👍', audioText: 'TH sound, like this, that, those', description: 'Voiced TH /ð/' },
    { word: 'th', emoji: '🦷', audioText: 'TH sound, like thin, tooth, bath', description: 'Unvoiced TH /θ/' },
    { word: 'wh', emoji: '🐋', audioText: 'WH sound, like whale, what, when', description: 'Digraph /w/' },
    { word: 'ph', emoji: '📞', audioText: 'PH sound, like phone, photo', description: 'Digraph /f/' },
    { word: 'ng', emoji: '🔔', audioText: 'NG sound, like ring, sing, king', description: 'Digraph /ŋ/' },
  ];

  // 🧩 Blends
  const blends = [
    { word: 'bl', emoji: '💙', audioText: 'BL blend, like blue, black, blow', description: 'Consonant blend' },
    { word: 'br', emoji: '🧱', audioText: 'BR blend, like brick, brave, brown', description: 'Consonant blend' },
    { word: 'cl', emoji: '☁️', audioText: 'CL blend, like cloud, clap, clean', description: 'Consonant blend' },
    { word: 'cr', emoji: '🦀', audioText: 'CR blend, like crab, cry, crop', description: 'Consonant blend' },
    { word: 'dr', emoji: '🥁', audioText: 'DR blend, like drum, draw, drop', description: 'Consonant blend' },
    { word: 'fl', emoji: '🌸', audioText: 'FL blend, like flower, fly, flag', description: 'Consonant blend' },
    { word: 'fr', emoji: '🐸', audioText: 'FR blend, like frog, free, from', description: 'Consonant blend' },
    { word: 'gr', emoji: '🍇', audioText: 'GR blend, like grapes, green, grow', description: 'Consonant blend' },
    { word: 'pl', emoji: '🌱', audioText: 'PL blend, like plant, play, plus', description: 'Consonant blend' },
    { word: 'pr', emoji: '🎁', audioText: 'PR blend, like present, pray, print', description: 'Consonant blend' },
  ];

  return (
    <>
      <LearningCard title="Short Vowel Sounds" subtitle="a e i o u" category="🅰️ Language & Literacy" categoryColor="#FF6B6B" items={shortVowels} />
      <LearningCard title="Long Vowel Sounds" subtitle="ā ē ī ō ū" category="🅰️ Language & Literacy" categoryColor="#FFA94D" items={longVowels} />
      <LearningCard title="Consonant Sounds" subtitle="Basic consonants" category="🅰️ Language & Literacy" categoryColor="#4ECDC4" items={consonants} />
      <LearningCard title="Digraph Sounds" subtitle="ch sh th ph" category="🅰️ Language & Literacy" categoryColor="#6C5CE7" items={digraphs} />
      <LearningCard title="Blend Sounds" subtitle="bl br cl cr" category="🅰️ Language & Literacy" categoryColor="#2ECC71" items={blends} />
    </>
  );
}

export default PhonicsAndSounds;
