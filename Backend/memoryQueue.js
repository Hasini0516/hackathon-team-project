// memoryQueue.js
const LinkedInProfile = require('./models/LinkedinProfile');
const User = require('./models/User')
const LinkedInScraper = require('./scraper');

let nextJobId = 1;
const jobStore = {
  // jobId: { status: 'pending' | 'success' | 'failure', result?: any, error?: string }
};

const scrapeQueue = []; // array of { jobId, userId }

//
// Worker loop: keep pulling from scrapeQueue[]
//
async function scrapeWorker() {
  while (true) {
    if (scrapeQueue.length > 0) {
      const { jobId, userId } = scrapeQueue.shift();
      try {
        // Fetch user + URL
        const user = await User.findById(userId);
        if (!user || !user.linkedinUrl) {
          jobStore[jobId] = { status: 'failure', error: 'User or LinkedIn URL not found' };
          continue;
        }

        // Run the scraper
        const scraper = new LinkedInScraper();
        const data = await scraper.scrapeProfile(user.linkedinUrl);

        // Save to DB
        const profile = await LinkedInProfile.create({
          userId: user.id,
          rawData: data,
          experience: data.experience,
          education: data.education,
          skills: data.skills,
          aboutSection: data.about,
          scrapedAt: new Date(),
          isStale: false
        });

        jobStore[jobId] = { status: 'success', result: { profileId: profile.id } };
      } catch (err) {
        console.log(err);
        jobStore[jobId] = { status: 'failure', error: err.message };
      }
    }

    // Small delay to avoid a 100% CPU busy‐loop
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Start the worker (immediately)
scrapeWorker().catch(err => {
  console.error('Scrape worker crashed:', err);
});

//
// Add a new job to the queue. Returns a jobId string.
// jobStore[jobId] will be set to { status: 'pending' } immediately.
// scrapeWorker() picks it up and eventually changes status → success|failure.
//
function addScrapeJob(userId) {
  const jobId = String(nextJobId++);
  jobStore[jobId] = { status: 'pending' };
  scrapeQueue.push({ jobId, userId });
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
