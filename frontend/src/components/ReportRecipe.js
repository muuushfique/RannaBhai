import React, { useEffect, useState } from 'react';
import { Flag } from 'lucide-react';
import api from '../services/api';

export default function ReportRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/recipes')
      .then((res) => {
        const list = res.data || [];
        setRecipes(list);
        if (list.length > 0) setSelectedId(list[0]._id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !reason.trim()) return;
    setSubmitting(true);
    setStatus(null);
    try {
      await api.post(`/api/recipe/report/${selectedId}`, { reason: reason.trim() });
      setStatus({ type: 'success', text: 'Report submitted. Our moderators will review it promptly.' });
      setReason('');
    } catch {
      setStatus({ type: 'error', text: 'Could not submit report right now.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Quality Moderation</div>
          <h1 className="rb-title">Report a Recipe Issue</h1>
          <p className="rb-subtitle">
            Spotted inaccurate measurements, missing steps, or inappropriate content? Let our kitchen admins know.
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
          <label className="rb-label">Select Recipe</label>
          <select className="rb-select" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
            {recipes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.recipe_name} ({r.cuisine})
              </option>
            ))}
          </select>
        </div>

        <div className="rb-field">
          <label className="rb-label">What needs attention?</label>
          <textarea
            className="rb-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the issue clearly..."
            required
          />
        </div>

        <button type="submit" className="rb-btn rb-btn-primary" disabled={submitting}>
          <Flag size={15} /> {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
