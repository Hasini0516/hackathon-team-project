import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    linkedinUrl: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      linkedinUrl: formData.linkedinUrl
    };

    console.log('Register payload:', payload); // Debug: check in browser console

    try {
      const res = await api.post('/api/register', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      const token = res.data.token || res.data.access_token;
      if (token) {
        login(token);
        toast.success('Registered successfully!');
        navigate('/dashboard');
      } else {
        toast.error('No token received. Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed.'
      );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>LinkedIn URL</label>
        <input
          type="url"
          name="linkedinUrl"
          value={formData.linkedinUrl}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ marginTop: '1rem' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;