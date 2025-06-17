import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const UpdateLinkedIn = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!linkedinUrl.trim()) return;

    setLoading(true);
    try {
      const res = await api.put('/api/user/linkedin', { linkedinUrl });
      toast.success('LinkedIn URL updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Update LinkedIn URL</h2>
      <form onSubmit={handleUpdate} style={{ maxWidth: '500px' }}>
        <label>New LinkedIn URL:</label>
        <input
          type="url"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default UpdateLinkedIn;