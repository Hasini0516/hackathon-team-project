// memoryQueue.js
const LinkedInProfile = require('./models/LinkedinProfile');
const User = require('./models/User')
const LinkedInScraper = require('./scraper');
const mongoose = require('mongoose');

let nextJobId = 1;
const jobStore = {
  // jobId: { status: 'pending' | 'success' | 'failure', result?: any, error?: string }
};

const scrapeQueue = []; // array of { jobId, userId, linkedinUrl }

//
// Worker loop: keep pulling from scrapeQueue[]
//
async function scrapeWorker() {
  console.log('[WORKER] Starting scrape worker...');
  while (true) {
    if (scrapeQueue.length > 0) {
      const { jobId, userId, linkedinUrl } = scrapeQueue.shift();
      console.log(`[WORKER] Processing job ${jobId} for userId=${userId}, url=${linkedinUrl}`);
      
      try {
        // Convert userId to ObjectId
        let userObjectId;
        try {
          userObjectId = new mongoose.Types.ObjectId(userId);
          console.log(`[WORKER] Converted userId to ObjectId: ${userObjectId}`);
        } catch (err) {
          console.error(`[WORKER] Failed to convert userId to ObjectId: ${err.message}`);
          jobStore[jobId] = { status: 'failure', error: 'Invalid user ID format' };
          continue;
        }

        // Fetch user
        console.log(`[WORKER] Fetching user with ID: ${userObjectId}`);
        const user = await User.findById(userObjectId);
        console.log(`[WORKER] User lookup result:`, user ? `Found user ${user.email}` : 'User not found');
        
        if (!user) {
          console.log(`[WORKER] User not found for userId=${userObjectId}`);
          jobStore[jobId] = { status: 'failure', error: 'User not found' };
          continue;
        }
        console.log(`[WORKER] User found: ${user.email}`);

        // Validate LinkedIn URL
        if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
          console.log(`[WORKER] Invalid LinkedIn URL: ${linkedinUrl}`);
          jobStore[jobId] = { status: 'failure', error: 'Invalid LinkedIn URL' };
          continue;
        }

        // Run the scraper
        console.log(`[WORKER] Starting scraper for job ${jobId}`);
        const scraper = new LinkedInScraper();
        try {
          const data = await scraper.scrapeProfile(linkedinUrl);
          console.log(`[WORKER] Scraping completed for job ${jobId}`);

          // Save to DB
          console.log(`[WORKER] Saving profile data for job ${jobId}`);
          const profile = await LinkedInProfile.create({
            userId: userObjectId,
            rawData: data,
            experience: data.experience,
            education: data.education,
            skills: data.skills,
            aboutSection: data.about,
            scrapedAt: new Date(),
            isStale: false
          });

          console.log(`[WORKER] Profile saved successfully for job ${jobId}`);
          jobStore[jobId] = { status: 'success', result: { profileId: profile.id } };
        } catch (scrapeError) {
          console.error(`[WORKER] Scraping error for job ${jobId}:`, scrapeError);
          jobStore[jobId] = { status: 'failure', error: `Scraping failed: ${scrapeError.message}` };
        }
      } catch (err) {
        console.error(`[WORKER] Error processing job ${jobId}:`, err);
        jobStore[jobId] = { status: 'failure', error: err.message };
      }
    }

    // Small delay to avoid a 100% CPU busy‐loop
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Start the worker (immediately) - Temporarily commented out for debugging
// scrapeWorker().catch(err => {
//   console.error('[WORKER] Scrape worker crashed:', err);
// });

//
// Add a new job to the queue. Returns a jobId string.
// jobStore[jobId] will be set to { status: 'pending' } immediately.
// scrapeWorker() picks it up and eventually changes status → success|failure.
//
function addScrapeJob(userId, linkedinUrl) {
  const jobId = String(nextJobId++);
  console.log(`[QUEUE] Adding job ${jobId} for userId=${userId}, url=${linkedinUrl}`);
  jobStore[jobId] = { status: 'pending' };
  scrapeQueue.push({ jobId, userId, linkedinUrl });
  return jobId;
}

//
// Check job status (or result if finished). If jobId is unknown, return null.
//
function getJobStatus(jobId) {
  return jobStore[jobId] || null;
}

module.exports = {
  addScrapeJob,
  getJobStatus
};
