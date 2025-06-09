const axios = require('axios');

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

module.exports = {
    getLinkedInClient
}; 