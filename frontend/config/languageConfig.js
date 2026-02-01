// Supported languages array
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    direction: 'ltr',
    ocrLang: 'eng',
    ttsCode: 'en-US'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    ocrLang: 'hin',
    ttsCode: 'hi-IN'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    direction: 'ltr',
    ocrLang: 'kan',
    ttsCode: 'kn-IN'
  }
];

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Confusing letters configuration for each language
export const CONFUSING_LETTERS = {
  // English confusing letters
  en: {
    'b': {
      color: '#3498db', // Blue
      confusedWith: ['d'],
      description: 'Stick on right'
    },
    'd': {
      color: '#e74c3c', // Red
      confusedWith: ['b'],
      description: 'Stick on left'
    },
    'p': {
      color: '#2ecc71', // Green
      confusedWith: ['q'],
      description: 'Stick down right'
    },
    'q': {
      color: '#f39c12', // Orange
      confusedWith: ['p'],
      description: 'Stick down left'
    },
    'n': {
      color: '#34495e', // Gray
      confusedWith: ['u'],
      description: 'Opens down'
    },
    'u': {
      color: '#e67e22', // Orange
      confusedWith: ['n'],
      description: 'Opens up'
    },
    'm': {
      color: '#16a085', // Teal
      confusedWith: ['w'],
      description: 'Peaks up'
    },
    'w': {
      color: '#c0392b', // Dark red
      confusedWith: ['m'],
      description: 'Valleys down'
    }
  },
  
  // Hindi confusing letters (Devanagari script)
  hi: {
    'क': {
      color: '#3498db', // Blue
      confusedWith: ['ख'],
      description: 'ka - simple curve'
    },
    'ख': {
      color: '#e74c3c', // Red
      confusedWith: ['क'],
      description: 'kha - has vertical line'
    },
    'ग': {
      color: '#2ecc71', // Green
      confusedWith: ['घ'],
      description: 'ga - simple'
    },
    'घ': {
      color: '#f39c12', // Orange
      confusedWith: ['ग'],
      description: 'gha - has spiral'
    },
    'च': {
      color: '#9b59b6', // Purple
      confusedWith: ['छ'],
      description: 'cha'
    },
    'छ': {
      color: '#1abc9c', // Turquoise
      confusedWith: ['च'],
      description: 'chha - has vertical line'
    },
    'ड': {
      color: '#34495e', // Dark gray
      confusedWith: ['ढ'],
      description: 'da'
    },
    'ढ': {
      color: '#e67e22', // Orange
      confusedWith: ['ड'],
      description: 'dha - has dot'
    },
    'त': {
      color: '#16a085', // Teal
      confusedWith: ['थ'],
      description: 'ta - simple horizontal line'
    },
    'थ': {
      color: '#c0392b', // Dark red
      confusedWith: ['त'],
      description: 'tha - has vertical line'
    },
    'ब': {
      color: '#8e44ad', // Purple
      confusedWith: ['भ'],
      description: 'ba'
    },
    'भ': {
      color: '#27ae60', // Green
      confusedWith: ['ब'],
      description: 'bha - has vertical line'
    }
  },
  
  // Kannada confusing letters
  kn: {
    'ಕ': {
      color: '#3498db', // Blue
      confusedWith: ['ಖ'],
      description: 'ka'
    },
    'ಖ': {
      color: '#e74c3c', // Red
      confusedWith: ['ಕ'],
      description: 'kha'
    },
    'ಗ': {
      color: '#2ecc71', // Green
      confusedWith: ['ಘ'],
      description: 'ga'
    },
    'ಘ': {
      color: '#f39c12', // Orange
      confusedWith: ['ಗ'],
      description: 'gha'
    },
    'ಚ': {
      color: '#9b59b6', // Purple
      confusedWith: ['ಛ'],
      description: 'cha'
    },
    'ಛ': {
      color: '#1abc9c', // Turquoise
      confusedWith: ['ಚ'],
      description: 'chha'
    },
    'ಡ': {
      color: '#34495e', // Dark gray
      confusedWith: ['ಢ'],
      description: 'da'
    },
    'ಢ': {
      color: '#e67e22', // Orange
      confusedWith: ['ಡ'],
      description: 'dha'
    },
    'ತ': {
      color: '#16a085', // Teal
      confusedWith: ['ಥ'],
      description: 'ta'
    },
    'ಥ': {
      color: '#c0392b', // Dark red
      confusedWith: ['ತ'],
      description: 'tha'
    },
    'ಬ': {
      color: '#8e44ad', // Purple
      confusedWith: ['ಭ'],
      description: 'ba'
    },
    'ಭ': {
      color: '#27ae60', // Green
      confusedWith: ['ಬ'],
      description: 'bha'
    },
    'ನ': {
      color: '#d35400', // Orange
      confusedWith: ['ಣ'],
      description: 'na'
    },
    'ಣ': {
      color: '#2980b9', // Blue
      confusedWith: ['ನ'],
      description: 'ṇa'
    }
  }
};

// Language-specific configurations
const LANGUAGE_CONFIGS = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    fontFamily: "'Inter', sans-serif",
    ocrLang: 'eng',
    ttsCode: 'en-US',
    confusingLetters: {
      'b': ['d', 'p', 'q'],
      'd': ['b', 'p', 'q'],
      'p': ['b', 'd', 'q'],
      'q': ['b', 'd', 'p'],
      'm': ['n', 'w'],
      'n': ['m', 'u'],
      'u': ['n', 'v']
    },
    colorCodingRules: {
      vowels: ['a', 'e', 'i', 'o', 'u'],
      consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z']
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    ocrLang: 'hin',
    ttsCode: 'hi-IN',
    confusingLetters: {
      'क': ['ख'],
      'ख': ['क'],
      'ग': ['घ'],
      'घ': ['ग'],
      'च': ['छ'],
      'छ': ['च'],
      'त': ['थ'],
      'थ': ['त'],
      'द': ['ध'],
      'ध': ['द'],
      'प': ['फ'],
      'फ': ['प'],
      'ब': ['भ'],
      'भ': ['ब']
    },
    colorCodingRules: {
      vowels: ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
      consonants: ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह']
    }
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    direction: 'ltr',
    fontFamily: "'Noto Sans Kannada', sans-serif",
    ocrLang: 'kan',
    ttsCode: 'kn-IN',
    confusingLetters: {
      'ಕ': ['ಖ'],
      'ಖ': ['ಕ'],
      'ಗ': ['ಘ'],
      'ಘ': ['ಗ'],
      'ಚ': ['ಛ'],
      'ಛ': ['ಚ'],
      'ತ': ['ಥ'],
      'ಥ': ['ತ'],
      'ದ': ['ಧ'],
      'ಧ': ['ದ'],
      'ಪ': ['ಫ'],
      'ಫ': ['ಪ'],
      'ಬ': ['ಭ'],
      'ಭ': ['ಬ']
    },
    colorCodingRules: {
      vowels: ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ೠ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ'],
      consonants: ['ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ', 'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ']
    }
  }
};

// Get language configuration by code
export const getLanguageConfig = (languageCode) => {
  return LANGUAGE_CONFIGS[languageCode] || LANGUAGE_CONFIGS[DEFAULT_LANGUAGE];
};

// Get confusing letters for a specific language
export const getConfusingLetters = (languageCode) => {
  return CONFUSING_LETTERS[languageCode] || CONFUSING_LETTERS[DEFAULT_LANGUAGE];
};

// Helper function to check if a language is supported
export const isLanguageSupported = (languageCode) => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
};

// Get all language codes
export const getLanguageCodes = () => {
  return SUPPORTED_LANGUAGES.map(lang => lang.code);
};