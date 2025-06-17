import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Advice = () => {
  const [question, setQuestion] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAdvice = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question.');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await api.post('/api/advice', { question });
      const { taskId } = res.data;
      setTaskId(taskId);
      toast.success('Advice request sent. Checking for result...');
      pollStatus(taskId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to request advice');
    }
  };

  const pollStatus = async (taskId) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/advice/status/${taskId}`);
        if (res.status === 200 && res.data.result) {
          setResult(res.data.result);
          clearInterval(interval);
          toast.success('Advice received!');
        } else if (res.status === 500) {
          clearInterval(interval);
          toast.error('Error generating advice');
        }
      } catch (err) {
        clearInterval(interval);
        toast.error('Error fetching advice status');
        console.error(err);
      }
    }, 3000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Get Career Advice</h2>

      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          placeholder="Ask your career-related question..."
          className="styled-input"
        />

        <div style={{ textAlign: 'center' }}>
  <button onClick={askAdvice} className="styled-button" disabled={loading}>
    {loading ? 'Requesting...' : 'Ask for Advice'}
  </button>
</div>
      </div>

      {result && (
        <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h4>🧠 Advice Result:</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Advice;
