import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/signup', { username, email, password });
      loginSuccess(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-card" style={{ maxWidth: '460px', margin: '2rem auto' }}>
        <div className="rb-eyebrow">Join the Kitchen</div>
        <h1 className="rb-title" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Create Account</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Save your favorite recipes, track reports, and share dishes with the community.
        </p>

        {error && <div className="rb-alert rb-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="rb-field">
            <label className="rb-label">Username</label>
            <input className="rb-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="rb-field">
            <label className="rb-label">Email</label>
            <input type="email" className="rb-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="rb-field">
            <label className="rb-label">Password</label>
            <input type="password" minLength={6} className="rb-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="rb-btn rb-btn-primary" style={{ width: '100%' }} disabled={loading}>
            <UserPlus size={16} /> {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--muted)', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
