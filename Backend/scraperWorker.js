const { scrapeAndSaveProfile } = require('./scraper');
const { getScrapeJobStatus, updateScrapeJobStatus } = require('./jobQueue');

async function processScrapeJob(jobId) {
    const job = getScrapeJobStatus(jobId);
    if (!job) {
        console.error(`[SCRAPER] Job ${jobId} not found`);
        return;
    }

    try {
        console.log(`[SCRAPER] Starting job ${jobId} for userId=${job.userId}`);
        updateScrapeJobStatus(jobId, 'processing');
        
        const result = await scrapeAndSaveProfile(job.userId, job.linkedinUrl);
        console.log(`[SCRAPER] Job ${jobId} completed successfully`);
        updateScrapeJobStatus(jobId, 'completed', result);
    } catch (error) {
        console.error(`[SCRAPER] Job ${jobId} failed:`, error);
        updateScrapeJobStatus(jobId, 'failed', null, error.message);
    }
}

module.exports = {
    processScrapeJob
}; 