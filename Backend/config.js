require('dotenv').config();
const mongoose = require('mongoose');

module.exports = {
  port: process.env.PORT || 8080,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/linkedin-career-agent',
  jwtSecret: process.env.JWT_SECRET || 'linkedin_career_agent_2024_secure_jwt_secret_key_do_not_share',
  
  // LinkedIn API Credentials
  linkedinApiClientId: process.env.LINKEDIN_API_CLIENT_ID,
  linkedinApiPassword: process.env.LINKEDIN_API_PASSWORD,
  
  // LinkedIn Login Credentials (for web scraping)
  linkedinEmail: process.env.LINKEDIN_EMAIL,
  linkedinPassword: process.env.LINKEDIN_PASSWORD,
  
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
