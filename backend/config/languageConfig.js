// backend/config/languageConfig.js

const LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    ocrLang: "eng",      // Tesseract language code
    nativeName: "English"
  },
  hi: {
    code: "hi",
    name: "Hindi",
    ocrLang: "hin",      // Tesseract language code for Hindi
    nativeName: "हिंदी"
  },
  kn: {
    code: "kn",
    name: "Kannada",
    ocrLang: "kan",      // Tesseract language code for Kannada
    nativeName: "ಕನ್ನಡ"
  }
};

const DEFAULT_LANGUAGE = "en";

function getLanguageConfig(languageCode) {
  return LANGUAGES[languageCode] || LANGUAGES[DEFAULT_LANGUAGE];
}

function isValidLanguage(languageCode) {
  return languageCode in LANGUAGES;
}

module.exports = {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageConfig,
  isValidLanguage,
};