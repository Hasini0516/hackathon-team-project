const puppeteer = require('puppeteer');
const config = require('./config');
const LinkedInProfile = require('./models/LinkedinProfile'); // Mongoose model

class LinkedInScraper {
  constructor(delay = config.linkedinDelay) {
    this.delay = delay;
  }

  async scrapeAndSaveProfile(url, userId) {
    const data = await this.scrapeProfile(url);
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
  }

  async scrapeProfile(url) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, this.delay));

    const profileData = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : null;
      };

      const name = getText('li.inline.t-24.t-black.t-normal.break-words');
      const about = getText('section.pv-about-section div.inline-show-more-text');

      const experience = [];
      document.querySelectorAll('ul.pv-profile-section__section-info li')
        .forEach((item) => {
          const role = item.querySelector('h3')?.innerText.trim() || null;
          const company = item.querySelector('p.pv-entity__secondary-title')?.innerText.trim() || null;
          if (role || company) experience.push({ role, company });
        });

      const education = [];
      document.querySelectorAll('ul.pv-education-section li')
        .forEach((item) => {
          const school = item.querySelector('h3.pv-entity__school-name')?.innerText.trim() || null;
          const degree = item
            .querySelector('p.pv-entity__degree-name span:nth-child(2)')?.innerText.trim() || null;
          if (school || degree) education.push({ school, degree });
        });

      const skills = [];
      document.querySelectorAll('span.pv-skill-category-entity__name-text')
        .forEach((el) => {
          if (el.innerText.trim()) skills.push(el.innerText.trim());
        });

      return { name, about, experience, education, skills };
    });

    await browser.close();
    return profileData;
  }
}

module.exports = LinkedInScraper;
