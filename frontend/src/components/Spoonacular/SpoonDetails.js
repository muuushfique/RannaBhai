import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage, stripHtml } from '../../services/api';

export default function SpoonDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/api/spoonacular/recipe/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Could not load recipe details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="rb-page"><div className="rb-empty">Loading recipe details...</div></div>;
  if (error || !recipe) {
    return (
      <div className="rb-page">
        <div className="rb-alert rb-alert-error">{error || 'Recipe not found.'}</div>
        <Link to="/spoonacular" className="rb-btn rb-btn-secondary">
          <ArrowLeft size={15} /> Back to Pantry Match
        </Link>
      </div>
    );
  }

  const cleanSteps = stripHtml(recipe.instructions || '')
    .split(/(?<=\.)\s+/)
    .filter(Boolean);

  return (
    <div className="rb-page">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/spoonacular" className="rb-btn rb-btn-secondary rb-btn-sm">
          <ArrowLeft size={14} /> Back to Pantry Match
        </Link>
      </div>

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
          <span className="rb-badge rb-badge-sage" style={{ marginBottom: '0.75rem' }}>
            {recipe.source || 'RannaBhai Kitchen'}
          </span>
          <h1 className="rb-title" style={{ marginBottom: '0.65rem' }}>{recipe.title}</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>
            Ready in ~{recipe.readyInMinutes || 30} mins · Serves {recipe.servings || 2}
          </p>
          <button type="button" className="rb-btn rb-btn-primary" onClick={() => exportRecipeToPDF(recipe)}>
            <Download size={15} /> Export PDF Card
          </button>
        </div>
      </div>

      <div className="rb-grid-2">
        <div className="rb-card">
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Ingredients</h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(recipe.extendedIngredients || []).map((ing, i) => (
              <li key={`${ing.id || i}-${i}`}>{ing.original}</li>
            ))}
          </ul>
        </div>
        <div className="rb-card">
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Instructions</h2>
          {cleanSteps.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>Follow standard preparation for the listed ingredients.</p>
          ) : (
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cleanSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
