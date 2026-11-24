import React, { useState } from 'react';
import { Send } from 'lucide-react';
import api from '../services/api';

const SOURCES = ['Google Search', 'Social Media', 'Friend or Family', 'University / Campus', 'GitHub / Portfolio', 'Other'];

export default function Contact() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(SOURCES[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);
    try {
      const res = await api.post('/contact', { email, website, message });
      setStatus({ type: 'success', text: res.data.message || 'Message sent successfully!' });
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Get In Touch</div>
          <h1 className="rb-title">Contact RannaBhai</h1>
          <p className="rb-subtitle">
            Have a feature idea, recipe request, or partnership inquiry? Drop us a note anytime.
          </p>
        </div>
      </div>

      {status && (
        <div className={`rb-alert ${status.type === 'success' ? 'rb-alert-success' : 'rb-alert-error'}`}>
          {status.text}
        </div>
      )}

      <form className="rb-card" style={{ maxWidth: '640px' }} onSubmit={handleSubmit}>
        <div className="rb-field">
          <label className="rb-label">Email Address *</label>
          <input
            type="email"
            className="rb-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="rb-field">
          <label className="rb-label">How Did You Hear About Us?</label>
          <select className="rb-select" value={website} onChange={(e) => setWebsite(e.target.value)}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="rb-field">
          <label className="rb-label">Message *</label>
          <textarea
            className="rb-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            required
          />
        </div>

        <button type="submit" className="rb-btn rb-btn-primary" disabled={sending}>
          <Send size={15} /> {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
