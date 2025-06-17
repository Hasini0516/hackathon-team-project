import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const CareerStrategist = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/api/career-strategist', {
        message,
        conversationHistory: [],
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Career Strategist</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <label>Describe your career question or situation:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Get Strategy'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Agent Response:</h3>
          <pre>{response.agentResponse}</pre>

          {response.roadmap && typeof response.roadmap === 'object' && (
  <>
    <h3>Roadmap:</h3>
    <ul>
      {Object.entries(response.roadmap).map(([month, content], index) => (
        <li key={index}>
          <strong>{month}:</strong>
          <ul>
            {Object.entries(content).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(value) ? value.join(', ') : value}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </>
)}

          {response.suggestedPosts && response.suggestedPosts.length > 0 && (
            <>
              <h3>Suggested LinkedIn Posts:</h3>
              <ul>
                {response.suggestedPosts.map((post, i) => (
                  <li key={i}><pre>{post}</pre></li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerStrategist;