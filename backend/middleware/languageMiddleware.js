const {
  isValidLanguage,
  DEFAULT_LANGUAGE
} = require('../config/languageConfig');

/**
 * Global Language Middleware
 * Safely extracts language from request without crashing
 */
module.exports = function languageMiddleware(req, res, next) {
  try {
    let language = DEFAULT_LANGUAGE;

    // 1️⃣ Custom header (explicit override)
    if (req.headers && req.headers['x-language']) {
      language = req.headers['x-language'];
      console.log(`🌍 Language from x-language header: ${language}`);
    }

    // 2️⃣ Request body (ONLY if body exists)
    else if (req.body && req.body.language) {
      language = req.body.language;
      console.log(`🌍 Language from body: ${language}`);
    }

    // 3️⃣ Query parameter
    else if (req.query && req.query.language) {
      language = req.query.language;
      console.log(`🌍 Language from query: ${language}`);
    }

    // 4️⃣ Accept-Language header (browser fallback)
    else if (req.headers && req.headers['accept-language']) {
      language = req.headers['accept-language']
        .split(',')[0]
        .substring(0, 2);
      console.log(`🌍 Language from accept-language header: ${language}`);
    }

    // 5️⃣ Validate language
    if (!isValidLanguage(language)) {
      console.warn(`⚠️ Invalid language "${language}", falling back to default`);
      language = DEFAULT_LANGUAGE;
    }

    // 6️⃣ Attach safely to request
    req.language = language;

    next();
  } catch (error) {
    // NEVER crash the server
    console.error('❌ Language middleware error:', error.message);

    req.language = DEFAULT_LANGUAGE;
    next();
  }
};
