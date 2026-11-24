import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
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
      const res = await api.post('/api/login', { email, password });
      loginSuccess(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-card" style={{ maxWidth: '460px', margin: '2rem auto' }}>
        <div className="rb-eyebrow">Welcome Back</div>
        <h1 className="rb-title" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Log In to RannaBhai</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Access your liked recipes, submitted reports, and kitchen dashboard.
        </p>

        {error && <div className="rb-alert rb-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="rb-field">
            <label className="rb-label">Email</label>
            <input type="email" className="rb-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="rb-field">
            <label className="rb-label">Password</label>
            <input type="password" className="rb-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="rb-btn rb-btn-primary" style={{ width: '100%' }} disabled={loading}>
            <LogIn size={16} /> {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--muted)', textAlign: 'center' }}>
          New here?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
