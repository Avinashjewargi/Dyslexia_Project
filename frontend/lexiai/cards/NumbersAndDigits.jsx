// frontend/lexiai/cards/NumbersAndDigits.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function NumbersAndDigits() {

  // 🔢 Numbers 0–20
  const basicNumbers = [
    { word: '0', emoji: '⭕', audioText: 'Zero', description: 'The number zero - nothing' },
    { word: '1', emoji: '1️⃣', audioText: 'One', description: 'The number one' },
    { word: '2', emoji: '2️⃣', audioText: 'Two', description: 'The number two' },
    { word: '3', emoji: '3️⃣', audioText: 'Three', description: 'The number three' },
    { word: '4', emoji: '4️⃣', audioText: 'Four', description: 'The number four' },
    { word: '5', emoji: '5️⃣', audioText: 'Five', description: 'The number five' },
    { word: '6', emoji: '6️⃣', audioText: 'Six (don’t confuse with nine)', description: 'The number six' },
    { word: '7', emoji: '7️⃣', audioText: 'Seven', description: 'The number seven' },
    { word: '8', emoji: '8️⃣', audioText: 'Eight', description: 'The number eight' },
    { word: '9', emoji: '9️⃣', audioText: 'Nine (don’t confuse with six)', description: 'The number nine' },
    { word: '10', emoji: '🔟', audioText: 'Ten', description: 'The number ten' },
    { word: '11', emoji: '⚽', audioText: 'Eleven', description: 'The number eleven' },
    { word: '12', emoji: '🕛', audioText: 'Twelve', description: 'The number twelve' },
    { word: '13', emoji: '🍀', audioText: 'Thirteen', description: 'The number thirteen' },
    { word: '14', emoji: '💝', audioText: 'Fourteen', description: 'The number fourteen' },
    { word: '15', emoji: '🎂', audioText: 'Fifteen', description: 'The number fifteen' },
    { word: '16', emoji: '🎉', audioText: 'Sixteen', description: 'The number sixteen' },
    { word: '17', emoji: '🌟', audioText: 'Seventeen', description: 'The number seventeen' },
    { word: '18', emoji: '🎈', audioText: 'Eighteen', description: 'The number eighteen' },
    { word: '19', emoji: '🎊', audioText: 'Nineteen', description: 'The number nineteen' },
    { word: '20', emoji: '🎯', audioText: 'Twenty', description: 'The number twenty' },
  ];

  // 🔟 Tens & Hundred
  const tensNumbers = [
    { word: '30', emoji: '📅', audioText: 'Thirty', description: 'Three tens' },
    { word: '40', emoji: '🎂', audioText: 'Forty', description: 'Four tens' },
    { word: '50', emoji: '💰', audioText: 'Fifty', description: 'Five tens' },
    { word: '60', emoji: '⏰', audioText: 'Sixty', description: 'Six tens' },
    { word: '70', emoji: '📊', audioText: 'Seventy', description: 'Seven tens' },
    { word: '80', emoji: '🎮', audioText: 'Eighty', description: 'Eight tens' },
    { word: '90', emoji: '📈', audioText: 'Ninety', description: 'Nine tens' },
    { word: '100', emoji: '💯', audioText: 'One hundred', description: 'Ten tens make one hundred' },
  ];

  // 🧮 Special Numbers
  const specialNumbers = [
    { word: '25', emoji: '🪙', audioText: 'Twenty-five', description: 'A quarter of one hundred' },
    { word: '50', emoji: '🪙', audioText: 'Fifty', description: 'Half of one hundred' },
  ];

  // 🥇 Ordinal Numbers
  const ordinalNumbers = [
    { word: 'first', emoji: '🥇', audioText: 'First', description: '1st position' },
    { word: 'second', emoji: '🥈', audioText: 'Second', description: '2nd position' },
    { word: 'third', emoji: '🥉', audioText: 'Third', description: '3rd position' },
  ];

  // 🍕 Fractions
  const fractions = [
    { word: 'half', emoji: '🍕', audioText: 'Half', description: 'One of two equal parts (½)' },
    { word: 'quarter', emoji: '🍕', audioText: 'Quarter', description: 'One of four equal parts (¼)' },
  ];

  // ➕ Math Symbols
  const mathSymbols = [
    { word: '+', emoji: '➕', audioText: 'Plus sign', description: 'Addition' },
    { word: '-', emoji: '➖', audioText: 'Minus sign', description: 'Subtraction' },
    { word: '×', emoji: '✖️', audioText: 'Times sign', description: 'Multiplication' },
    { word: '÷', emoji: '➗', audioText: 'Divide sign', description: 'Division' },
    { word: '=', emoji: '🟰', audioText: 'Equals sign', description: 'Shows equality' },
  ];

  return (
    <>
      <LearningCard title="Numbers 0–20" subtitle="Basic counting" category="🔢 Numbers" categoryColor="#FF6B6B" items={basicNumbers} />
      <LearningCard title="Tens & Hundred" subtitle="30 to 100" category="🔢 Numbers" categoryColor="#FFA94D" items={tensNumbers} />
      <LearningCard title="Special Numbers" subtitle="25 & 50" category="🔢 Numbers" categoryColor="#845EC2" items={specialNumbers} />
      <LearningCard title="Ordinal Numbers" subtitle="Positions" category="🔢 Numbers" categoryColor="#4ECDC4" items={ordinalNumbers} />
      <LearningCard title="Fractions" subtitle="Parts of a whole" category="🔢 Numbers" categoryColor="#2ECC71" items={fractions} />
      <LearningCard title="Math Symbols" subtitle="Basic operators" category="🔢 Numbers" categoryColor="#E17055" items={mathSymbols} />
    </>
  );
}

export default NumbersAndDigits;
