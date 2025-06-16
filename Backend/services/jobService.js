// services/jobService.js
const axios = require('axios');
require('dotenv').config();

const RAPIDAPI_KEY = process.env.RAPID_API_KEY;
if (!RAPIDAPI_KEY) {
  console.error('RAPIDAPI_KEY not set');
}

async function getJobs(jobTitle, location) {
      console.log(RAPIDAPI_KEY);
  const url = 'https://jsearch.p.rapidapi.com/search';
  const querystring = {
    query: `${jobTitle} in ${location}`,
    page: '1',
    num_pages: '1'
  };
  try {
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      params: querystring,
      timeout: 10000,
    });
    if (response.status === 200) {
      // return raw data array
      return response.data.data || [];
    } else {
      throw new Error(`RapidAPI responded ${response.status}`);
    }
  } catch (err) {
    console.error('Error fetching jobs:', err.response?.data || err.message);
    throw new Error('Job search failed');
  }
}

module.exports = { getJobs };
