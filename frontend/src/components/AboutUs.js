import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AboutUs() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/about-us')
      .then((res) => setContent(res.data))
      .catch(() =>
        setContent({
          title: 'About RannaBhai',
          description:
            'RannaBhai is your all-in-one culinary studio — built to make home cooking joyful, healthy, and effortless with curated recipes, calorie-smart meal plans, nutrition tools, and local market discovery.',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Our Story</div>
          <h1 className="rb-title">{content?.title || 'About RannaBhai'}</h1>
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading our story...</div>
      ) : (
        <div className="rb-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {content?.description}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/recipe" className="rb-btn rb-btn-primary">Explore Recipes</Link>
              <Link to="/contact-us" className="rb-btn rb-btn-secondary">Contact Us</Link>
            </div>
          </div>
          {content?.imageUrl ? (
            <img
              src={content.imageUrl}
              alt="About RannaBhai"
              style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', background: 'var(--surface-soft)', borderRadius: 'var(--radius-sm)' }}>
              <img src="/RannaBhai.png" alt="RannaBhai" style={{ maxHeight: '180px' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
