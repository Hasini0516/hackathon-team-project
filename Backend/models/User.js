const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxlength: 120 },
  linkedinUrl: { type: String, default: null, maxlength: 255 },
  passwordHash: { type: String, required: true, maxlength: 128 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
