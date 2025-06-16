const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  headline: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    default: []
  },
  careerGoals: {
    type: [String],
    default: []
  },
  preferredRoles: {
    type: [String],
    default: []
  },
  preferredJobLocations: {
    type: [String],
    default: []
  }
}, {
  timestamps: true 
});



module.exports = mongoose.model('User', userSchema);
