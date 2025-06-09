const scrapeJobs = new Map();

function addScrapeJob(userId, linkedinUrl) {
    const jobId = Date.now().toString();
    scrapeJobs.set(jobId, {
        userId,
        linkedinUrl,
        status: 'pending',
        result: null,
        error: null
    });
    return jobId;
}

function getScrapeJobStatus(jobId) {
    return scrapeJobs.get(jobId);
}

function updateScrapeJobStatus(jobId, status, result = null, error = null) {
    const job = scrapeJobs.get(jobId);
    if (job) {
        job.status = status;
        job.result = result;
        job.error = error;
    }
}

module.exports = {
    addScrapeJob,
    getScrapeJobStatus,
    updateScrapeJobStatus
}; 