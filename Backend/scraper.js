const puppeteer = require('puppeteer');
const config = require('./config');
const LinkedInProfile = require('./models/LinkedinProfile');

class LinkedInScraper {
  constructor(delay = config.linkedinDelay) {
    this.delay = delay;
    // No longer throwing error for missing LinkedIn credentials as we are using sample data
  }

  async scrapeAndSaveProfile(userId, linkedinUrl) {
    console.log(`[SCRAPER] Starting scrape for userId=${userId}, url=${linkedinUrl}`);
    try {
      const data = await this.scrapeProfile(linkedinUrl);
      console.log('\n=== SCRAPED PROFILE DATA (Sample) ===');
      console.log('Name:', data.name);
      console.log('About:', data.about);
      console.log('\nExperience:', JSON.stringify(data.experience, null, 2));
      console.log('\nEducation:', JSON.stringify(data.education, null, 2));
      console.log('\nSkills:', JSON.stringify(data.skills, null, 2));
      console.log('===========================\n');

      const profile = new LinkedInProfile({
        userId,
        rawData: data,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        aboutSection: data.about,
        scrapedAt: new Date(),
        isStale: false
      });

      await profile.save();
      console.log(`[SCRAPER] Sample Profile saved successfully for userId=${userId}`);
      return profile;
    } catch (error) {
      console.error(`[SCRAPER] Error saving profile for userId=${userId}:`, error);
      throw error;
    }
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async retry(fn, retries = 3, delay = 5000) {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      console.log(`[SCRAPER] Retrying... ${retries} attempts left. Error:`, error.message);
      await this.wait(delay);
      return this.retry(fn, retries - 1, delay);
    }
  }

  async scrapeProfile(profileUrl) {
    console.log('[SCRAPER] Returning sample LinkedIn profile data...');
    // Return sample data instead of actually scraping
    return {
      name: "Sample User",
      about: "Experienced software engineer with a focus on web development and AI. Passionate about building innovative solutions.",
      experience: [
        {
          role: "Software Engineer",
          company: "SampleTech Solutions",
          duration: "Jan 2022 - Present"
        },
        {
          role: "Junior Developer",
          company: "Innovate Corp",
          duration: "Aug 2020 - Dec 2021"
        }
      ],
      education: [
        {
          school: "University of Sample",
          degree: "B.S. in Computer Science",
          duration: "2016 - 2020"
        }
      ],
      skills: ["JavaScript", "Node.js", "React", "MongoDB", "Python", "Machine Learning"]
    };
  }
}

module.exports = LinkedInScraper; 