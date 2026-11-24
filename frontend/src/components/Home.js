import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Download, PlusCircle, Utensils } from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage } from '../services/api';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [voted, setVoted] = useState({});

  useEffect(() => {
    api
      .get('/recipes')
      .then((res) => setRecipes(res.data || []))
      .catch(() => setError('Could not load recipes. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = ['All', ...Array.from(new Set(recipes.map((r) => r.cuisine).filter(Boolean)))];
  const filtered = cuisineFilter === 'All' ? recipes : recipes.filter((r) => r.cuisine === cuisineFilter);

  const handleVote = async (recipe, type) => {
    const prevVote = voted[recipe._id];
    const isUndo = prevVote === type;
    const delta = isUndo ? -1 : 1;

    try {
      const res = await api.post(`/recipes/${recipe._id}/${type}`, { delta });
      setRecipes((list) =>
        list.map((r) =>
          r._id === recipe._id
            ? { ...r, like_count: res.data.like_count, dislike_count: res.data.dislike_count }
            : r
        )
      );
      setVoted((v) => ({ ...v, [recipe._id]: isUndo ? null : type }));
    } catch {
      // ignore transient error
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Recipe Collection</div>
          <h1 className="rb-title">All Recipes</h1>
          <p className="rb-subtitle">
            Browse every dish in the RannaBhai kitchen, save your favorites, or export printable PDF recipe cards.
          </p>
        </div>
        <Link to="/recipe-submit" className="rb-btn rb-btn-primary">
          <PlusCircle size={16} /> Submit a Recipe
        </Link>
      </div>

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      <div className="rb-tabs">
        {cuisines.map((c) => (
          <button
            key={c}
            type="button"
            className={`rb-tab ${cuisineFilter === c ? 'active' : ''}`}
            onClick={() => setCuisineFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rb-empty">Loading recipes...</div>
      ) : filtered.length === 0 ? (
        <div className="rb-empty">
          <Utensils size={28} style={{ margin: '0 auto 0.5rem' }} />
          No recipes found for this filter.
        </div>
      ) : (
        <div className="rb-grid-3">
          {filtered.map((recipe) => (
            <article key={recipe._id} className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to={`/RecipeDetails/${recipe._id}`}>
                <img
                  src={recipe.image_link || getRecipeFallbackImage(recipe.recipe_name)}
                  alt={recipe.recipe_name}
                  onError={(e) => {
                    e.currentTarget.src = getRecipeFallbackImage(recipe.recipe_name);
                  }}
                  className="rb-recipe-img"
                />
              </Link>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <span className="rb-badge">{recipe.cuisine || 'House Special'}</span>
                <span className="rb-badge rb-badge-sage">{recipe.diet_type || 'Regular'}</span>
                <span className="rb-badge rb-badge-accent">{recipe.calories || 350} kcal</span>
              </div>

              <Link to={`/RecipeDetails/${recipe._id}`}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{recipe.recipe_name}</h2>
              </Link>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', flex: 1 }}>
                Serves {recipe.no_of_servings || 2} · {(recipe.ingredient_list || []).length} ingredients · {recipe.general_pricing || '$$'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className={`rb-btn rb-btn-sm ${voted[recipe._id] === 'like' ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
                    onClick={() => handleVote(recipe, 'like')}
                  >
                    <ThumbsUp size={13} /> {recipe.like_count || 0}
                  </button>
                  <button
                    type="button"
                    className={`rb-btn rb-btn-sm ${voted[recipe._id] === 'dislike' ? 'rb-btn-danger' : 'rb-btn-secondary'}`}
                    onClick={() => handleVote(recipe, 'dislike')}
                  >
                    <ThumbsDown size={13} /> {recipe.dislike_count || 0}
                  </button>
                </div>

                <button
                  type="button"
                  className="rb-btn rb-btn-secondary rb-btn-sm"
                  onClick={() => exportRecipeToPDF(recipe)}
                  title="Download printable PDF card"
                >
                  <Download size={13} /> PDF
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
