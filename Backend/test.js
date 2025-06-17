const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUxMTAxZmEzMzBhOTg4MWM0ODQ3OGYiLCJpYXQiOjE3NTAxNDQ3MzB9.ZCTYuJ96SLilJLQHUDGWOBtbj-tKHyPZyT9dn-pBrQ0';

async function testEndpoints() {
    console.log('Testing Backend Endpoints...');
    console.log('===========================');

    try {
        // Test Morning Briefing
        console.log('\nTesting Morning Briefing...');
        const morningResponse = await axios.get(`${BASE_URL}/api/morning-briefing`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Morning Briefing Response:', JSON.stringify(morningResponse.data, null, 2));

        // Test Career Pathways
        console.log('\nTesting Career Pathways...');
        const pathwaysResponse = await axios.get(`${BASE_URL}/api/career-pathways`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Career Pathways Response:', JSON.stringify(pathwaysResponse.data, null, 2));

        // Test Job Listings
        console.log('\nTesting Job Listings...');
        const jobsResponse = await axios.get(`${BASE_URL}/api/job-listings?title=Software%20Engineer&location=New%20York`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Job Listings Response:', JSON.stringify(jobsResponse.data, null, 2));

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Error during testing:', error.response?.data || error.message);
    }
}

testEndpoints(); 