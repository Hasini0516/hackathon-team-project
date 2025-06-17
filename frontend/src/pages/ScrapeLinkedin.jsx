import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ScrapeLinkedIn = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/api/scrape', {
        linkedinUrl: 'https://linkedin.com/in/test' // Replace dynamically if needed
      });

      setResult(res.data.taskId || 'Scrape started');
      toast.success('Scrape triggered successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to trigger scraper. Please check your LinkedIn URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: '#2c3e50'
      }}>
        Scrape LinkedIn Profile
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleScrape}
          disabled={loading}
          className="styled-button"
        >
          {loading ? 'Scraping...' : 'Start Scraping'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <strong>Result:</strong>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ScrapeLinkedIn;