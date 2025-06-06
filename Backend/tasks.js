const { scrapeQueue, adviceQueue } = require('./queue');
const User = require('./models/User');
const LinkedInProfile = require('./models/LinkedinProfile');
const Conversation = require('./models/Conversation');
const LinkedInScraper = require('./scraper/LinkedInScraper');

// 1. Scrape Task Processor
scrapeQueue.process(async (job) => {
  const { userId } = job.data;

  const user = await User.findById(userId);
  if (!user || !user.linkedinUrl) {
    throw new Error('User or LinkedIn URL not found');
  }

  const scraper = new LinkedInScraper();
  const data = await scraper.scrapeProfile(user.linkedinUrl);

  const profile = new LinkedInProfile({
    userId: user._id,
    rawData: data,
    experience: data.experience,
    education: data.education,
    skills: data.skills,
    aboutSection: data.about,
    scrapedAt: new Date(),
    isStale: false
  });

  await profile.save();
  return { profileId: profile._id };
});

// 2. AI Advice Task Processor (PLACEHOLDER)
adviceQueue.process(async (job) => {
  const { userId, question } = job.data;

  // Get latest profile for this user
  const profile = await LinkedInProfile.findOne({ userId }).sort({ scrapedAt: -1 });
  if (!profile) throw new Error('No LinkedIn profile data found');

  // AI stub
  const adviceText = '[AI engine not implemented]';

  const conv = new Conversation({
    userId,
    history: [{ speaker: 'user', text: question }],
    aiResponses: [{ text: adviceText }]
  });

  await conv.save();

  return {
    conversationId: conv._id,
    advice: adviceText
  };
});
