import React, { useEffect, useState } from 'react';
import { Search, HeartPulse } from 'lucide-react';
import api from '../services/api';

export default function HealthRecommendations() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (item) =>
      String(item.disease || '').toLowerCase().includes(query.toLowerCase()) ||
      String(item.health_practice || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Wellness Library</div>
          <h1 className="rb-title">Health Recommendations</h1>
          <p className="rb-subtitle">
            Browse {items.length || 59} dietary and lifestyle practices tailored to common health conditions.
          </p>
        </div>
        <div style={{ position: 'relative', minWidth: '250px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            className="rb-input"
            style={{ paddingLeft: '2.2rem' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by condition or tip..."
          />
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading health practices...</div>
      ) : filtered.length === 0 ? (
        <div className="rb-empty">No matching health recommendations found.</div>
      ) : (
        <div className="rb-grid-2">
          {filtered.map((item) => (
            <article key={item._id} className="rb-card rb-card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <HeartPulse size={17} color="var(--sage)" />
                <h2 style={{ fontSize: '1.2rem' }}>{item.disease}</h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>{item.health_practice}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
