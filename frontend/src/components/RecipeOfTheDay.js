import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Download, ArrowRight } from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage } from '../services/api';

export default function RecipeOfTheDay() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/recipe-of-the-day')
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Could not load today’s featured recipe.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Daily Spotlight</div>
          <h1 className="rb-title">Recipe of the Day</h1>
          <p className="rb-subtitle">A fresh chef-picked highlight automatically rotated every day.</p>
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Preparing today’s spotlight...</div>
      ) : error || !recipe ? (
        <div className="rb-alert rb-alert-error">{error || 'No recipe available.'}</div>
      ) : (
        <div className="rb-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <img
            src={recipe.image_link || getRecipeFallbackImage(recipe.recipe_name)}
            alt={recipe.recipe_name}
            onError={(e) => {
              e.currentTarget.src = getRecipeFallbackImage(recipe.recipe_name);
            }}
            style={{ width: '100%', height: '330px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <span className="rb-badge rb-badge-gold" style={{ marginBottom: '0.8rem' }}>
              <Sparkles size={13} /> Today’s Pick
            </span>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '0.7rem' }}>{recipe.recipe_name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
              <span className="rb-badge">{recipe.cuisine}</span>
              <span className="rb-badge rb-badge-sage">{recipe.diet_type}</span>
              <span className="rb-badge rb-badge-accent">{recipe.calories} kcal</span>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '1.25rem' }}>
              Serves {recipe.no_of_servings || 2} · {(recipe.ingredient_list || []).slice(0, 6).join(', ')}
              {(recipe.ingredient_list || []).length > 6 ? '...' : ''}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to={`/RecipeDetails/${recipe._id}`} className="rb-btn rb-btn-primary">
                Full Recipe & Steps <ArrowRight size={15} />
              </Link>
              <button type="button" className="rb-btn rb-btn-secondary" onClick={() => exportRecipeToPDF(recipe)}>
                <Download size={15} /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
