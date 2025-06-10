const axios = require('axios');
const { handleFeatureRequest } = require('./services/chatbotService');
const { fetchLinkedInProfile } = require('./services/linkedinService');

const LINKEDIN_API_BASE_URL = 'https://api.linkedin.com/v2';
const LINKEDIN_ACCESS_TOKEN = 'AQUaCoEk39TraBkX2zCBRe_6gseP_6a32B6byLq37G-zaakrLSeeWHgVjrXFyKysJfgklPKM1UrtjGaUlcsxpBqckNCINltC-PW_k4YgfumtuZ9qDAFZrmMM-mA1I0zIhUcAaNV7BgDzcBIVe-vlO_MjDfxavcdKaBQ-Ml72tbbMaZy3pWM4WjPRzzz0IMWFtKIbIF5psJrZs17PkJyDOHtZXZifPShAnFslDZ-i2fpoWcE72kBhk4PvjbEHWVbvWAlP8vN8ACzxnaOLbbZ1A0-V1FyGYQti1-HFPjlIyskDm6cPl_tSJr-slmEpRG_1XkelM98SLT51tpjfP4th6jY7io4eg'; // Provided access token

const getLinkedInClient = () => {
    return axios.create({
        baseURL: LINKEDIN_API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'x-li-format': 'json'
        }
    });
};

// Chatbot endpoint handler
const handleChatRequest = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await handleFeatureRequest(message);
        res.json(response);
    } catch (error) {
        console.error('Error handling chat request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// LinkedIn profile endpoint handler
const handleLinkedInProfileRequest = async (req, res) => {
    try {
        const { accessToken } = req.body;
        console.log(`api.js: Received accessToken for LinkedIn profile request: ${accessToken ? accessToken.substring(0, 10) + '...' : '[empty]'}`);

        if (!accessToken) {
            return res.status(400).json({ error: 'Access token is required' });
        }
        const profileData = await fetchLinkedInProfile(accessToken);
        res.json(profileData);
    } catch (error) {
        console.error('Error fetching LinkedIn profile:', error);
        res.status(500).json({ error: 'Failed to fetch LinkedIn profile' });
    }
};

module.exports = {
    getLinkedInClient,
    handleChatRequest,
    handleLinkedInProfileRequest
}; 