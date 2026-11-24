import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ThumbsUp, ThumbsDown, Award } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../services/api';

export default function TrendingRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrending = () => {
    api
      .get('/api/trending-recipes')
      .then((res) => setRecipes(res.data || []))
      .catch(() => setError('Could not load trending recipes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrending();
  }, []);

  const castVote = async (recipeId, type) => {
    try {
      const res = await api.put(`/api/recipe/vote/${recipeId}`, { type });
      setRecipes((prev) =>
        prev
          .map((r) => (r._id === recipeId ? res.data : r))
          .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      );
    } catch {
      // ignore
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Community Leaderboard</div>
          <h1 className="rb-title">Trending Recipes</h1>
          <p className="rb-subtitle">
            Top-rated recipes ranked by community votes. Upvote your favorites to move them up the chart.
          </p>
        </div>
      </div>

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      {loading ? (
        <div className="rb-empty">Loading trending dishes...</div>
      ) : (
        <div className="rb-grid-3">
          {recipes.map((r, idx) => (
            <article key={r._id} className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className={`rb-badge ${idx === 0 ? 'rb-badge-gold' : 'rb-badge-accent'}`}>
                  {idx === 0 ? <Award size={13} /> : <Flame size={13} />} #{idx + 1} Trending
                </span>
                <span className="rb-badge">{r.cuisine}</span>
              </div>

              <Link to={`/RecipeDetails/${r._id}`}>
                <img
                  src={r.image_link || getRecipeFallbackImage(r.recipe_name)}
                  alt={r.recipe_name}
                  onError={(e) => {
                    e.currentTarget.src = getRecipeFallbackImage(r.recipe_name);
                  }}
                  className="rb-recipe-img"
                />
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{r.recipe_name}</h2>
              </Link>

              <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginBottom: '1rem', flex: 1 }}>
                {r.calories || 350} kcal · {r.diet_type || 'Regular'}
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="rb-btn rb-btn-primary rb-btn-sm" onClick={() => castVote(r._id, 'like')}>
                  <ThumbsUp size={13} /> {r.like_count || 0}
                </button>
                <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={() => castVote(r._id, 'dislike')}>
                  <ThumbsDown size={13} /> {r.dislike_count || 0}
                </button>
                <Link to={`/RecipeDetails/${r._id}`} className="rb-btn rb-btn-secondary rb-btn-sm" style={{ marginLeft: 'auto' }}>
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
