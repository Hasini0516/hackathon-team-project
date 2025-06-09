const puppeteer = require('puppeteer');
const config = require('./config');
const LinkedInProfile = require('./models/LinkedinProfile');

class LinkedInScraper {
  constructor(delay = config.linkedinDelay) {
    this.delay = delay;
  }

  async scrapeAndSaveProfile(userId) {
    try {
      const data = await this.scrapeProfile();
      console.log('\n=== SCRAPED PROFILE DATA ===');
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
      return profile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  async scrapeProfile() {
    console.log('Starting LinkedIn profile scrape (manual login)...');
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1920,1080'
        ],
        defaultViewport: null,
        ignoreHTTPSErrors: true
      });
      console.log('Browser launched successfully');

      const page = await browser.newPage();
      console.log('New page created');
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      console.log('User agent set');
      
      // 1. Go to LinkedIn login page
      console.log('Navigating to LinkedIn login page for manual login...');
      await page.goto('https://www.linkedin.com/login', { 
        waitUntil: 'networkidle0',
        timeout: 60000 
      });
      console.log('LinkedIn login page loaded');
      console.log('Please log in manually in the browser window...');

      // 2. Wait for user to log in and navigate to a profile page
      console.log('Waiting for you to log in and navigate to a profile page...');
      await page.waitForFunction(
        () => window.location.pathname.startsWith('/in/'),
        { timeout: 300000 } // Wait up to 5 minutes for manual login and navigation
      );
      console.log('Profile page detected. Extracting data...');

      // 3. Wait for profile page to load
      await page.waitForSelector('h1', { timeout: 60000 });
      console.log('Profile page loaded successfully');

      // 4. Scrape profile data from the current page
      const profileData = await page.evaluate(() => {
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.innerText.trim() : null;
        };
        const name = getText('h1');
        const about = getText('div.inline-show-more-text, div.text-body-medium');
        const experience = [];
        document.querySelectorAll('section.experience-section li, section[id*="experience"] li').forEach((item) => {
          const role = item.querySelector('h3, span.mr1.t-bold span')?.innerText.trim();
          const company = item.querySelector('p, span.t-14.t-normal span')?.innerText.trim();
          if (role || company) experience.push({ role, company });
        });
        const education = [];
        document.querySelectorAll('section.education-section li, section[id*="education"] li').forEach((item) => {
          const school = item.querySelector('h3, span.mr1.t-bold span')?.innerText.trim();
          const degree = item.querySelector('p, span.t-14.t-normal span')?.innerText.trim();
          if (school || degree) education.push({ school, degree });
        });
        const skills = [];
        document.querySelectorAll('section.skills-section span, section[id*="skills"] span').forEach((el) => {
          const skill = el.innerText.trim();
          if (skill) skills.push(skill);
        });
        return { name, about, experience, education, skills };
      });
      console.log('Profile data extracted successfully');
      return profileData;
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    } finally {
      if (browser) {
        console.log('Closing browser...');
        await browser.close();
        console.log('Browser closed');
      }
    }
  }
}

module.exports = LinkedInScraper; 