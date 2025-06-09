const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: [{
    type: String,
    required: true
  }],
  aiResponses: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update the updatedAt timestamp before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
