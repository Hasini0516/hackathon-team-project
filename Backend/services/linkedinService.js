const axios = require('axios');

const LINKEDIN_API_BASE_URL = 'https://api.linkedin.com/v2';

async function fetchLinkedInProfile(accessToken) {
  try {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    console.log(`linkedinService.js: Received accessToken: ${accessToken ? accessToken.substring(0, 10) + '...' : '[empty]'}`);
    const authHeader = `Bearer ${accessToken}`;
    console.log(`linkedinService.js: Authorization header constructed: ${authHeader ? authHeader.substring(0, 20) + '...' : '[empty]'}`);

    // Try to get user info from the unversioned endpoint
    console.log('Attempting to fetch user info from:', `${LINKEDIN_API_BASE_URL}/userinfo`);
    const response = await axios.get(`${LINKEDIN_API_BASE_URL}/userinfo`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        'x-li-format': 'json'
      },
      timeout: 15000
    });

    console.log('LinkedIn API Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 401) {
      throw new Error('LinkedIn access token has expired. Please re-authenticate.');
    }
    throw error;
  }
}

module.exports = {
  fetchLinkedInProfile
}; 