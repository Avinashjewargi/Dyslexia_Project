// frontend/lexiai/cards/ShapesGeometry.jsx

import React from 'react';
import LearningCard from '../LearningCard';

function ShapesGeometry() {

  // 🔵 Basic 2D Shapes
  const basic2DShapes = [
    { word: 'circle', emoji: '⭕', audioText: 'Circle - Round shape', description: 'No corners or sides' },
    { word: 'square', emoji: '🟦', audioText: 'Square - Four equal sides', description: 'All sides same length' },
    { word: 'rectangle', emoji: '▭', audioText: 'Rectangle - Four sides', description: 'Opposite sides equal' },
    { word: 'triangle', emoji: '🔺', audioText: 'Triangle - Three sides', description: 'Three corners' },
    { word: 'oval', emoji: '🥚', audioText: 'Oval - Stretched circle', description: 'Egg-shaped' }
  ];

  // 🔶 Advanced 2D Shapes
  const advanced2DShapes = [
    { word: 'diamond', emoji: '♦️', audioText: 'Diamond - Tilted square', description: 'Four equal sides' },
    { word: 'heart', emoji: '❤️', audioText: 'Heart - Love shape', description: 'Symbol of love' },
    { word: 'star', emoji: '⭐', audioText: 'Star - Pointed shape', description: 'Five points' },
    { word: 'pentagon', emoji: '⬟', audioText: 'Pentagon - Five sides', description: 'Five corners' },
    { word: 'hexagon', emoji: '⬡', audioText: 'Hexagon - Six sides', description: 'Honeycomb shape' },
    { word: 'octagon', emoji: '🛑', audioText: 'Octagon - Eight sides', description: 'Stop sign shape' },
    { word: 'crescent', emoji: '🌙', audioText: 'Crescent - Curved moon shape', description: 'Part of a circle' }
  ];

  // 🧊 3D Shapes
  const threeDShapes = [
    { word: 'sphere', emoji: '⚽', audioText: 'Sphere - Ball shape', description: 'Round in all directions' },
    { word: 'cube', emoji: '🎲', audioText: 'Cube - Six square faces', description: 'Like a dice' },
    { word: 'cylinder', emoji: '🥫', audioText: 'Cylinder - Tube shape', description: 'Round top and bottom' },
    { word: 'cone', emoji: '🍦', audioText: 'Cone - Pointed top', description: 'Ice cream shape' },
    { word: 'pyramid', emoji: '🔺', audioText: 'Pyramid - Pointed top', description: 'Triangle faces meet at top' }
  ];

  // 📏 Lines & Curves
  const linesAndCurves = [
    { word: 'line', emoji: '➖', audioText: 'Line - Straight path', description: 'No curves' },
    { word: 'curve', emoji: '➰', audioText: 'Curve - Bent line', description: 'Not straight' },
    { word: 'zigzag', emoji: '⚡', audioText: 'Zigzag - Sharp turns', description: 'Back and forth' },
    { word: 'spiral', emoji: '🌀', audioText: 'Spiral - Curved around center', description: 'Circles outward' },
    { word: 'wave', emoji: '🌊', audioText: 'Wave - Up and down line', description: 'Like ocean waves' }
  ];

  // 📐 Angles
  const angles = [
    { word: 'angle', emoji: '📐', audioText: 'Angle - Two lines meet', description: 'Forms a corner' },
    { word: 'right angle', emoji: '⬜', audioText: 'Right angle - Perfect corner', description: '90 degrees' }
  ];

  // 🎨 Patterns
  const patterns = [
    { word: 'dots', emoji: '⚫', audioText: 'Dots - Small round marks', description: 'Point pattern' },
    { word: 'stripes', emoji: '🟫', audioText: 'Stripes - Repeating lines', description: 'Parallel pattern' },
    { word: 'checkered', emoji: '♟️', audioText: 'Checkered - Square pattern', description: 'Chessboard style' },
    { word: 'grid', emoji: '⊞', audioText: 'Grid - Crossing lines', description: 'Rows and columns' }
  ];

  return (
    <>
      <LearningCard title="Basic Shapes" subtitle="Simple 2D shapes" category="🔵 Shapes" categoryColor="#AA96DA" items={basic2DShapes} />
      <LearningCard title="Advanced Shapes" subtitle="More 2D shapes" category="🔶 Shapes" categoryColor="#CDB4DB" items={advanced2DShapes} />
      <LearningCard title="3D Shapes" subtitle="Solid objects" category="🧊 Shapes" categoryColor="#FFC8DD" items={threeDShapes} />
      <LearningCard title="Lines & Curves" subtitle="Straight and curved lines" category="📏 Geometry" categoryColor="#BDE0FE" items={linesAndCurves} />
      <LearningCard title="Angles" subtitle="Corners and turns" category="📐 Geometry" categoryColor="#A2D2FF" items={angles} />
      <LearningCard title="Patterns" subtitle="Repeating designs" category="🎨 Patterns" categoryColor="#E4C1F9" items={patterns} />
    </>
  );
}

export default ShapesGeometry;
