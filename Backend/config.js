require('dotenv').config();
const mongoose = require('mongoose');

module.exports = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
  linkedinDelay: parseInt(process.env.LINKEDIN_SCRAPER_DELAY) || 2000,
  maxProfilesPerHour: parseInt(process.env.MAX_PROFILES_PER_HOUR) || 50,
  // Mongoose connect function
  connectToDB: async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
};
