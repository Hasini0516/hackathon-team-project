import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to Your Dashboard</h2>
      <h3>Use the navigation bar to access:</h3>
      <ul style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <li>🔍 Career Strategist</li>
        <li>🔗 Update LinkedIn URL</li>
        <li>🕷 Scrape LinkedIn Profile</li>
        <li>💼 Job Listings</li>
        <li>🧠 Career Advice</li>
        <li>☀ Morning Briefing</li>
      </ul>
    </div>
  );
};

export default Dashboard;