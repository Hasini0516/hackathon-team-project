const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: { type: Array, default: [] },
  aiResponses: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
