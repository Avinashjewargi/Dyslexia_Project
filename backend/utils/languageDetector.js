// Simple language detection utility
// This is a basic implementation - you can enhance it later

function detectLanguage(text) {
  // Remove whitespace and get sample
  const sample = text.trim().substring(0, 100);
  
  // Check for Devanagari script (Hindi)
  const devanagariPattern = /[\u0900-\u097F]/;
  if (devanagariPattern.test(sample)) {
    return 'hi';
  }
  
  // Check for Kannada script
  const kannadaPattern = /[\u0C80-\u0CFF]/;
  if (kannadaPattern.test(sample)) {
    return 'kn';
  }
  
  // Default to English
  return 'en';
}

// Detect language with confidence score
function detectLanguageWithConfidence(text) {
  const sample = text.trim().substring(0, 200);
  
  // Count characters from each script
  const devanagariCount = (sample.match(/[\u0900-\u097F]/g) || []).length;
  const kannadaCount = (sample.match(/[\u0C80-\u0CFF]/g) || []).length;
  const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
  
  const total = devanagariCount + kannadaCount + latinCount;
  
  if (total === 0) {
    return { language: 'en', confidence: 0 };
  }
  
  // Calculate confidence
  if (devanagariCount > kannadaCount && devanagariCount > latinCount) {
    return { 
      language: 'hi', 
      confidence: (devanagariCount / total).toFixed(2) 
    };
  }
  
  if (kannadaCount > devanagariCount && kannadaCount > latinCount) {
    return { 
      language: 'kn', 
      confidence: (kannadaCount / total).toFixed(2) 
    };
  }
  
  return { 
    language: 'en', 
    confidence: (latinCount / total).toFixed(2) 
  };
}

module.exports = {
  detectLanguage,
  detectLanguageWithConfidence
};