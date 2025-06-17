import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const MorningBriefing = () => {
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBriefing = async () => {
    setLoading(true);
    setBriefing(null);

    try {
      const res = await api.post('/api/morning-briefing');
      setBriefing(res.data);
      toast.success('Morning briefing loaded!');
    } catch (err) {
      console.error('Error fetching briefing:', err);
      toast.error('Failed to load morning briefing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>☀ Morning Career Briefing</h2>

      <div style={{ textAlign: 'center', margin: '2rem' }}>
        <button className="styled-button" onClick={fetchBriefing} disabled={loading}>
          {loading ? 'Fetching...' : 'Get Briefing'}
        </button>
      </div>

      {briefing && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '10px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {briefing.marketUpdate && (
            <div>
              <h4>📈 Market Update</h4>
              <p>{briefing.marketUpdate}</p>
            </div>
          )}
          {briefing.actionItems && briefing.actionItems.length > 0 && (
            <div>
              <h4>🎯 Today's Action Items</h4>
              <ul>
                {briefing.actionItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {briefing.insight && (
            <div>
              <h4>💡 Strategic Insight</h4>
              <p>{briefing.insight}</p>
            </div>
          )}
          {briefing.networkOpportunity && (
            <div>
              <h4>🤝 Networking Opportunity</h4>
              <p>{briefing.networkOpportunity}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MorningBriefing;