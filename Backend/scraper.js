const puppeteer = require('puppeteer');
const config = require('./config');
const LinkedInProfile = require('./models/LinkedinProfile');

class LinkedInScraper {
  constructor(delay = config.linkedinDelay) {
    this.delay = delay;
    if (!config.linkedinEmail || !config.linkedinPassword) {
      throw new Error('LinkedIn credentials not configured. Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD in .env');
    }
  }

  async scrapeAndSaveProfile(userId, linkedinUrl) {
    console.log(`[SCRAPER] Starting scrape for userId=${userId}, url=${linkedinUrl}`);
    try {
      const data = await this.scrapeProfile(linkedinUrl);
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
      console.log(`[SCRAPER] Profile saved successfully for userId=${userId}`);
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
    console.log('[SCRAPER] Starting LinkedIn profile scrape...');
    let browser;
    try {
      if (!profileUrl || !profileUrl.includes('linkedin.com/in/')) {
        throw new Error('Invalid LinkedIn profile URL');
      }

      console.log('[SCRAPER] Launching browser...');
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        defaultViewport: null,
        ignoreHTTPSErrors: true
      });
      console.log('[SCRAPER] Browser launched successfully');

      const page = await browser.newPage();
      console.log('[SCRAPER] New page created');
      
      // Set a realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      console.log('[SCRAPER] User agent set');

      // Enable request interception
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      // Add console logging from the page
      page.on('console', msg => console.log('[BROWSER]', msg.text()));
      
      // 1. Go to LinkedIn login page
      console.log('[SCRAPER] Navigating to LinkedIn login page...');
      await this.retry(async () => {
        await page.goto('https://www.linkedin.com/login', { 
          waitUntil: 'networkidle0',
          timeout: 60000 
        });
      });
      console.log('[SCRAPER] LinkedIn login page loaded');

      // 2. Login automatically
      console.log('[SCRAPER] Logging in...');
      await this.wait(2000); // Wait before typing
      
      // Type email
      await page.waitForSelector('#username', { visible: true });
      await page.type('#username', config.linkedinEmail, { delay: 100 });
      await this.wait(1000);
      
      // Type password
      await page.waitForSelector('#password', { visible: true });
      await page.type('#password', config.linkedinPassword, { delay: 100 });
      await this.wait(1000);
      
      // Click login button
      await page.waitForSelector('button[type="submit"]', { visible: true });
      await page.click('button[type="submit"]');
      
      // Wait for navigation and check for login success
      await this.retry(async () => {
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
        const currentUrl = page.url();
        console.log('[SCRAPER] Current URL after login:', currentUrl);
        
        // Check for common error messages
        const errorText = await page.evaluate(() => {
          const errorElement = document.querySelector('.alert-content');
          return errorElement ? errorElement.innerText : null;
        });
        
        if (errorText) {
          throw new Error(`Login failed: ${errorText}`);
        }
        
        if (currentUrl.includes('login')) {
          throw new Error('Login failed - still on login page');
        }
      });
      console.log('[SCRAPER] Login successful');

      // 3. Navigate to profile page
      console.log('[SCRAPER] Navigating to profile page:', profileUrl);
      await this.retry(async () => {
        await page.goto(profileUrl, { waitUntil: 'networkidle0', timeout: 60000 });
      });
      console.log('[SCRAPER] Profile page loaded');

      // Check if profile exists
      const profileExists = await page.evaluate(() => {
        return !document.querySelector('.error-container');
      });

      if (!profileExists) {
        throw new Error('Profile not found or not accessible');
      }

      // 4. Wait for profile content to load
      await this.retry(async () => {
        await page.waitForSelector('h1', { timeout: 60000 });
      });
      console.log('[SCRAPER] Profile content loaded');

      // 5. Scrape profile data
      console.log('[SCRAPER] Extracting profile data...');
      const profileData = await page.evaluate(() => {
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.innerText.trim() : null;
        };

        const name = getText('h1');
        if (!name) {
          throw new Error('Could not find profile name');
        }

        const about = getText('div.inline-show-more-text, div.text-body-medium');
        
        const experience = [];
        document.querySelectorAll('section.experience-section li, section[id*="experience"] li').forEach((item) => {
          const role = item.querySelector('h3, span.mr1.t-bold span')?.innerText.trim();
          const company = item.querySelector('p, span.t-14.t-normal span')?.innerText.trim();
          const duration = item.querySelector('span.t-14.t-normal.t-black--light span')?.innerText.trim();
          if (role || company) experience.push({ role, company, duration });
        });

        const education = [];
        document.querySelectorAll('section.education-section li, section[id*="education"] li').forEach((item) => {
          const school = item.querySelector('h3, span.mr1.t-bold span')?.innerText.trim();
          const degree = item.querySelector('p, span.t-14.t-normal span')?.innerText.trim();
          const duration = item.querySelector('span.t-14.t-normal.t-black--light span')?.innerText.trim();
          if (school || degree) education.push({ school, degree, duration });
        });

        const skills = [];
        document.querySelectorAll('section.skills-section span, section[id*="skills"] span').forEach((el) => {
          const skill = el.innerText.trim();
          if (skill) skills.push(skill);
        });

        return { name, about, experience, education, skills };
      });

      if (!profileData.name) {
        throw new Error('Failed to extract profile data');
      }

      console.log('[SCRAPER] Profile data extracted successfully');
      return profileData;
    } catch (error) {
      console.error('[SCRAPER] Error during scraping:', error);
      throw error;
    } finally {
      if (browser) {
        console.log('[SCRAPER] Closing browser...');
        await browser.close();
        console.log('[SCRAPER] Browser closed');
      }
    }
  }
}

module.exports = LinkedInScraper; 