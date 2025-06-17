// services/jobService.js
const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPID_API_KEY;
if (!RAPIDAPI_KEY) {
  console.error('RAPIDAPI_KEY not set');
}

async function getJobs(jobTitle, location) {
    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: `${jobTitle} in ${location}`,
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const jobs = response.data.data || [];

        // Transform the response to match our expected format
        return jobs.map(job => ({
            job_title: job.job_title,
            employer_name: job.employer_name,
            job_city: job.job_city,
            job_country: job.job_country,
            job_apply_link: job.job_apply_link,
            job_description: job.job_description,
            job_required_skills: job.job_required_skills || [],
            job_salary: job.job_salary || 'Not specified'
        }));
    } catch (error) {
        console.error('Error fetching jobs:', error.message);
        throw new Error('Failed to fetch job listings');
    }
}

module.exports = { getJobs };
