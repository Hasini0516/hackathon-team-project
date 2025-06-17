import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (!title || !location) {
      toast.error('Please enter both title and location');
      return;
    }

    setLoading(true);
    try {
      const url = `/api/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`;
      const res = await api.get(url);
      setJobs(res.data.jobs || []);
      toast.success('Jobs fetched successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Find Jobs</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="styled-input"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="styled-input"
        />
        <button onClick={fetchJobs} className="styled-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {jobs.length > 0 && (
        <ul style={{ marginTop: '2rem', paddingLeft: '1rem' }}>
          {jobs.map((job, index) => (
            <li
              key={index}
              style={{
                marginBottom: '1rem',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <h4>
                {job.title} at {job.employer}
              </h4>
              <p>📍 {job.location}</p>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                🔗 Apply Here
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
