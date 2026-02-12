// frontend/reader/ColorCoding.jsx — FIXED: grapheme-safe splitting for Kannada/Hindi

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCompleteColorMap } from '../config/colorCodingConfig';
import { CONFUSING_LETTERS } from '../config/languageConfig';

// ── Grapheme-safe splitter ─────────────────────────────────────────────────
// Intl.Segmenter is supported in Chrome 87+, Firefox 104+, Safari 16+, Edge 87+.
// Fallback: a regex that keeps base + all following combining / dependent marks
// together for Devanagari (0900-097F) and Kannada (0C80-0CFF).
function splitGraphemes(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
    return [...segmenter.segment(str)].map(s => s.segment);
  }

  // Regex fallback — matches one base character + any number of combining marks
  // that follow it.  Handles Devanagari, Kannada, and generic combining marks.
  return (
    str.match(
      /[\u0900-\u097F\u0C80-\u0CFF][\u0900-\u097F\u0C80-\u0CFF\u0300-\u036F]*|./gs
    ) || []
  );
}

const ColorCoding = ({
  text,
  enabled = false,
  colorIntensity = 70,
  onWordClick = null,
  highlightDifficultWords = false,
  difficultWords = []
}) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const { currentLanguage } = useLanguage();

  // ── Build color map whenever language changes ──────────────────────────
  const colorMap = useMemo(() => {
    const langLetters = CONFUSING_LETTERS[currentLanguage] || {};

    if (Object.keys(langLetters).length > 0) {
      const map = {};
      Object.keys(langLetters).forEach(letter => {
        map[letter] = langLetters[letter].color;
        // For English we also want case-insensitive lookup
        map[letter.toLowerCase()] = langLetters[letter].color;
        map[letter.toUpperCase()] = langLetters[letter].color;
      });
      console.log(`✅ ColorCoding: using ${currentLanguage} map`, map);
      return map;
    }

    console.log(`⚠️ ColorCoding: no map for "${currentLanguage}", falling back to English`);
    return getCompleteColorMap();
  }, [currentLanguage]);

  // ── Early returns ───────────────────────────────────────────────────────
  if (!text) return null;

  if (!enabled || colorIntensity < 50) {
    return (
      <div className="colored-text" style={{ lineHeight: '1.8', fontSize: '1.2rem', color: '#000000' }}>
        {text}
      </div>
    );
  }

  // ── Intensity → RGB (smooth fade to black) ─────────────────────────────
  const applyColorWithIntensity = (hexColor, intensity) => {
    const strength = intensity / 100;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    return {
      color: `rgb(${Math.round(r * strength)}, ${Math.round(g * strength)}, ${Math.round(b * strength)})`,
      fontWeight: intensity > 70 ? 'bold' : intensity > 50 ? '600' : 'normal',
      transition: 'all 0.3s ease'
    };
  };

  // ── Tooltip for a base character ────────────────────────────────────────
  const getLetterTooltip = (baseChar) => {
    const cfg = CONFUSING_LETTERS[currentLanguage]?.[baseChar];
    return cfg?.confusedWith ? `Often confused with: ${cfg.confusedWith.join(', ')}` : null;
  };

  // ── Render one word ─────────────────────────────────────────────────────
  const renderColoredWord = (word, wordIndex) => {
    const cleanWord = word.trim().replace(/[.,!?;:'"।]/g, '');
    const isHovered   = hoveredWord === wordIndex;
    const isDifficult = difficultWords.includes(cleanWord.toLowerCase());

    const handleWordClick = () => {
      if (onWordClick && cleanWord) onWordClick(cleanWord);
    };

    // Split into proper grapheme clusters — safe for Kannada / Hindi / English
    const graphemes = splitGraphemes(word);

    return (
      <span
        key={wordIndex}
        className="word-wrapper"
        onMouseEnter={() => setHoveredWord(wordIndex)}
        onMouseLeave={() => setHoveredWord(null)}
        onClick={handleWordClick}
        style={{
          display: 'inline-block',
          cursor: onWordClick ? 'pointer' : 'default',
          padding: '2px 4px',
          margin: '0 2px',
          borderRadius: '4px',
          backgroundColor: isHovered
            ? '#FFF9C4'
            : isDifficult && highlightDifficultWords ? '#FFE0E0' : 'transparent',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease',
          position: 'relative',
          boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {graphemes.map((grapheme, gIdx) => {
          // The COLOR KEY is the very first codepoint of the cluster.
          // For "ಬಾ" that is "ಬ", for "कु" that is "क", for "b" that is "b".
          const baseChar = grapheme[0];
          const color    = colorMap[baseChar];
          const tooltip  = getLetterTooltip(baseChar);

          if (color) {
            return (
              <span key={gIdx} style={applyColorWithIntensity(color, colorIntensity)} title={tooltip || undefined}>
                {grapheme}
              </span>
            );
          }
          return <span key={gIdx}>{grapheme}</span>;
        })}

        {/* Difficult-word badge */}
        {isDifficult && highlightDifficultWords && (
          <span style={{
            position: 'absolute', top: '-8px', right: '-8px',
            backgroundColor: '#ff4444', color: 'white', borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>!</span>
        )}

        {/* "Click to hear" tooltip */}
        {isHovered && onWordClick && (
          <span style={{
            position: 'absolute', bottom: '-24px', left: '50%',
            transform: 'translateX(-50%)', backgroundColor: '#333', color: 'white',
            padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
            whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>🔊 Click to hear</span>
        )}
      </span>
    );
  };

  // ── Split text into words, preserving whitespace spans ─────────────────
  const words = text.split(/(\s+)/);

  return (
    <div className="colored-text" style={{ lineHeight: '1.8', fontSize: '1.2rem' }}>
      {words.map((word, index) =>
        word.match(/^\s+$/) ? <span key={index}>{word}</span> : renderColoredWord(word, index)
      )}
    </div>
  );
};

export default ColorCoding;