// adviceQueue.js

let nextJobId = 1;
const adviceQueue = [];
const jobStore = {};

function addJob({ userId, question }) {
  const jobId = String(nextJobId++);
  jobStore[jobId] = { status: 'pending' };
  adviceQueue.push({ jobId, userId, question });
  return { id: jobId };
}

function getJobStatus(jobId) {
  return jobStore[jobId] || null;
}

async function adviceWorker() {
  while (true) {
    if (adviceQueue.length > 0) {
      const { jobId, question, userId } = adviceQueue.shift();
      try {
        // Fake processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generate dummy advice
        const result = `Advice for "${question}": Keep learning and building.`;

        jobStore[jobId] = {
          status: 'success',
          result
        };
      } catch (err) {
        jobStore[jobId] = {
          status: 'failure',
          error: err.message
        };
      }
    }

    // avoid busy loop
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// start background worker
adviceWorker().catch(err => console.error("Advice worker crashed:", err));

module.exports = {
  add: addJob,
  getStatus: getJobStatus
};
