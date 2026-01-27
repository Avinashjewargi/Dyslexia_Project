// frontend/config/colorCodingConfig.js

/**
 * Color Coding Configuration for Dyslexia Support
 * 
 * This configuration defines color mappings for commonly confused characters
 * in dyslexic readers. Colors are chosen based on:
 * 1. High contrast for visibility
 * 2. Distinct hues to maximize differentiation
 * 3. Colorblind-friendly palette
 * 4. Research-backed color theory for learning
 */

export const COLOR_CODING_CONFIG = {
  // Primary confused letter pairs
  confusedLetters: {
    'b': {
      color: '#3498db',      // Blue
      pair: 'd',
      description: 'b (blue) - faces right',
      mnemonic: 'Blue ball bounces to the right'
    },
    'd': {
      color: '#e74c3c',      // Red
      pair: 'b',
      description: 'd (red) - faces left',
      mnemonic: 'Red door opens to the left'
    },
    'p': {
      color: '#2ecc71',      // Green
      pair: 'q',
      description: 'p (green) - hangs down on right',
      mnemonic: 'Green plant grows up on the right'
    },
    'q': {
      color: '#f39c12',      // Orange
      pair: 'p',
      description: 'q (orange) - hangs down on left',
      mnemonic: 'Orange queue lines up on the left'
    },
  },

  // Confused numbers
  confusedNumbers: {
    '6': {
      color: '#9b59b6',      // Purple
      pair: '9',
      description: '6 (purple) - circle at bottom',
      mnemonic: 'Purple six sits on the ground'
    },
    '9': {
      color: '#1abc9c',      // Teal
      pair: '6',
      description: '9 (teal) - circle at top',
      mnemonic: 'Teal nine floats in the sky'
    },
  },

  // Additional commonly confused pairs
  additionalPairs: {
    'n': {
      color: '#34495e',      // Dark Gray
      pair: 'u',
      description: 'n (gray) - opens down',
    },
    'u': {
      color: '#e67e22',      // Carrot Orange
      pair: 'n',
      description: 'u (orange) - opens up',
    },
    'm': {
      color: '#16a085',      // Green Sea
      pair: 'w',
      description: 'm (teal) - peaks point up',
    },
    'w': {
      color: '#c0392b',      // Pomegranate
      pair: 'm',
      description: 'w (red) - valleys point down',
    },
  },

  // Alternative color schemes
  colorSchemes: {
    default: {
      name: 'Default',
      description: 'Research-based high contrast colors',
    },
    pastel: {
      name: 'Soft Pastel',
      description: 'Gentler colors for light sensitivity',
      colors: {
        'b': '#85C1E2',
        'd': '#F08080',
        'p': '#90EE90',
        'q': '#FFB347',
        '6': '#DDA0DD',
        '9': '#7FDBDA',
        'n': '#778899',
        'u': '#FFA07A',
        'm': '#20B2AA',
        'w': '#CD5C5C',
      }
    },
    bold: {
      name: 'Bold & Bright',
      description: 'Maximum contrast for better visibility',
      colors: {
        'b': '#0066CC',
        'd': '#CC0000',
        'p': '#00AA00',
        'q': '#FF8800',
        '6': '#8800CC',
        '9': '#00CCAA',
        'n': '#444444',
        'u': '#DD6600',
        'm': '#008877',
        'w': '#AA0000',
      }
    },
    colorblind: {
      name: 'Colorblind-Friendly',
      description: 'Optimized for color vision deficiency',
      colors: {
        'b': '#0173B2',  // Blue
        'd': '#DE8F05',  // Orange
        'p': '#029E73',  // Teal
        'q': '#CC78BC',  // Pink
        '6': '#CA9161',  // Tan
        '9': '#949494',  // Gray
        'n': '#56B4E9',  // Sky Blue
        'u': '#E69F00',  // Yellow-Orange
        'm': '#009E73',  // Bluish Green
        'w': '#F0E442',  // Yellow
      }
    }
  },

  // Learning activities suggestions
  learningActivities: [
    {
      title: 'Color Memory Game',
      description: 'Practice remembering which color belongs to which letter',
      difficulty: 'easy',
    },
    {
      title: 'Find & Highlight',
      description: 'Find all the colored letters in a sentence',
      difficulty: 'medium',
    },
    {
      title: 'Pattern Recognition',
      description: 'Identify words with both confused letters (e.g., "bad", "bed")',
      difficulty: 'hard',
    },
  ],

  // Educational tips for teachers/parents
  teachingTips: [
    'Start with one pair at a time (e.g., b and d)',
    'Practice writing colored letters in the air',
    'Create flashcards with colored letters',
    'Use physical objects in matching colors (blue ball for "b", red door for "d")',
    'Gradually fade the colors as the child becomes more confident',
    'Combine with multisensory learning (touch, movement, sound)',
  ],
};

/**
 * Get the complete color map combining all character types
 */
export const getCompleteColorMap = (scheme = 'default') => {
  if (scheme !== 'default' && COLOR_CODING_CONFIG.colorSchemes[scheme]) {
    return COLOR_CODING_CONFIG.colorSchemes[scheme].colors;
  }

  return {
    ...Object.keys(COLOR_CODING_CONFIG.confusedLetters).reduce((acc, key) => {
      acc[key] = COLOR_CODING_CONFIG.confusedLetters[key].color;
      return acc;
    }, {}),
    ...Object.keys(COLOR_CODING_CONFIG.confusedNumbers).reduce((acc, key) => {
      acc[key] = COLOR_CODING_CONFIG.confusedNumbers[key].color;
      return acc;
    }, {}),
    ...Object.keys(COLOR_CODING_CONFIG.additionalPairs).reduce((acc, key) => {
      acc[key] = COLOR_CODING_CONFIG.additionalPairs[key].color;
      return acc;
    }, {}),
  };
};

/**
 * Get mnemonic hints for a specific character
 */
export const getMnemonic = (char) => {
  const lower = char.toLowerCase();
  
  if (COLOR_CODING_CONFIG.confusedLetters[lower]) {
    return COLOR_CODING_CONFIG.confusedLetters[lower].mnemonic;
  }
  if (COLOR_CODING_CONFIG.confusedNumbers[lower]) {
    return COLOR_CODING_CONFIG.confusedNumbers[lower].mnemonic;
  }
  
  return null;
};

/**
 * Get the confused pair for a character
 */
export const getConfusedPair = (char) => {
  const lower = char.toLowerCase();
  
  if (COLOR_CODING_CONFIG.confusedLetters[lower]) {
    return COLOR_CODING_CONFIG.confusedLetters[lower].pair;
  }
  if (COLOR_CODING_CONFIG.confusedNumbers[lower]) {
    return COLOR_CODING_CONFIG.confusedNumbers[lower].pair;
  }
  if (COLOR_CODING_CONFIG.additionalPairs[lower]) {
    return COLOR_CODING_CONFIG.additionalPairs[lower].pair;
  }
  
  return null;
};

export default COLOR_CODING_CONFIG;