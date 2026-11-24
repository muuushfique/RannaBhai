import React, { useEffect, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import api from '../services/api';

export default function Glossary() {
  const [terms, setTerms] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/glossary')
      .then((res) => setTerms(res.data || []))
      .catch(() => setTerms([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = terms.filter(
    (t) =>
      String(t.term || '').toLowerCase().includes(query.toLowerCase()) ||
      String(t.definition || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Culinary Dictionary</div>
          <h1 className="rb-title">Cooking Glossary</h1>
          <p className="rb-subtitle">Master essential kitchen techniques, cuts, and culinary terminology.</p>
        </div>
        <div style={{ position: 'relative', minWidth: '250px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            className="rb-input"
            style={{ paddingLeft: '2.2rem' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search culinary terms..."
          />
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading glossary terms...</div>
      ) : filtered.length === 0 ? (
        <div className="rb-empty">No matching terms found.</div>
      ) : (
        <div className="rb-grid-2">
          {filtered.map((item) => (
            <article key={item._id} className="rb-card rb-card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <BookOpen size={16} color="var(--accent)" />
                <h2 style={{ fontSize: '1.22rem' }}>{item.term}</h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--muted)' }}>{item.definition}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
