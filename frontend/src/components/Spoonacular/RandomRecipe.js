import React, { useEffect, useState } from 'react';
import { Shuffle, Download } from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage, stripHtml } from '../../services/api';

export default function RandomRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRandom = () => {
    setLoading(true);
    setError('');
    api
      .get('/api/spoonacular/random')
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Could not fetch a random recipe right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRandom();
  }, []);

  const steps = stripHtml(recipe?.instructions || '')
    .split(/(?<=\.)\s+/)
    .filter(Boolean);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Culinary Roulette</div>
          <h1 className="rb-title">Surprise Me</h1>
          <p className="rb-subtitle">Roll a spontaneous recipe whenever you need dinner inspiration.</p>
        </div>
        <button type="button" className="rb-btn rb-btn-primary" onClick={loadRandom} disabled={loading}>
          <Shuffle size={15} /> {loading ? 'Rolling...' : 'Another Surprise'}
        </button>
      </div>

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      {loading ? (
        <div className="rb-empty">Picking a delicious surprise...</div>
      ) : recipe ? (
        <>
          <div className="rb-card" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <img
              src={recipe.image || getRecipeFallbackImage(recipe.title)}
              alt={recipe.title}
              onError={(e) => {
                e.currentTarget.src = getRecipeFallbackImage(recipe.title);
              }}
              style={{ width: '100%', height: '290px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div>
              <span className="rb-badge rb-badge-gold" style={{ marginBottom: '0.75rem' }}>
                {recipe.source || 'RannaBhai Kitchen'}
              </span>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{recipe.title}</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>
                Ready in ~{recipe.readyInMinutes || 30} mins · Serves {recipe.servings || 2}
              </p>
              <button type="button" className="rb-btn rb-btn-secondary" onClick={() => exportRecipeToPDF(recipe)}>
                <Download size={15} /> Export PDF Card
              </button>
            </div>
          </div>

          <div className="rb-grid-2">
            <div className="rb-card">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.85rem' }}>Ingredients</h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {(recipe.extendedIngredients || []).map((ing, i) => (
                  <li key={`${ing.id || i}-${i}`}>{ing.original}</li>
                ))}
              </ul>
            </div>
            <div className="rb-card">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.85rem' }}>Instructions</h3>
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
