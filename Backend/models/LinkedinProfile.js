const mongoose = require('mongoose');

const linkedInProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rawData: { type: Object, default: null },
  experience: { type: Object, default: null },
  education: { type: Object, default: null },
  skills: { type: Object, default: null },
  aboutSection: { type: String, default: null },
  scrapedAt: { type: Date, default: Date.now },
  isStale: { type: Boolean, default: false }
});

module.exports = mongoose.model('LinkedInProfile', linkedInProfileSchema);
