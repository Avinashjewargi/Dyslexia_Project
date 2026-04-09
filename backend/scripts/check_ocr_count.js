const mongoose = require('mongoose');
const OCRUpload = require('../models/OCRUpload');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dyslexia_learning';

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const count = await OCRUpload.countDocuments();
    console.log('OCRUpload docs =', count);
    const docs = await OCRUpload.find().sort({ createdAt: -1 }).limit(5);
    console.log('sample docs:', docs);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
