// services/jobService.js
const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPID_API_KEY;
if (!RAPIDAPI_KEY) {
  console.error('RAPIDAPI_KEY not set');
}

async function getJobs(jobTitle, location) {
    // Return mock job data
    return [
        {
            job_title: "Senior Software Engineer",
            employer_name: "Tech Corp",
            job_city: location,
            job_country: "USA",
            job_apply_link: "https://example.com/job1",
            job_description: "Looking for an experienced software engineer...",
            job_required_skills: ["JavaScript", "Node.js", "React"],
            job_salary: "$120,000 - $150,000"
        },
        {
            job_title: "Full Stack Developer",
            employer_name: "Innovate Inc",
            job_city: location,
            job_country: "USA",
            job_apply_link: "https://example.com/job2",
            job_description: "Join our team as a full stack developer...",
            job_required_skills: ["Python", "Django", "React"],
            job_salary: "$100,000 - $130,000"
        },
        {
            job_title: "Software Developer",
            employer_name: "Startup Co",
            job_city: location,
            job_country: "USA",
            job_apply_link: "https://example.com/job3",
            job_description: "Exciting opportunity for a software developer...",
            job_required_skills: ["Java", "Spring", "AWS"],
            job_salary: "$90,000 - $120,000"
        }
    ];
}

module.exports = { getJobs };
