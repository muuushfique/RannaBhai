import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Search } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../../services/api';

const QUICK_CHIPS = ['chicken, garlic, rice', 'tomato, onion, egg', 'potato, oil, spices', 'pasta, cheese'];

export default function Spoonacular() {
  const [ingredients, setIngredients] = useState('');
  const [results, setResults] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runMatch = async (queryText) => {
    const q = queryText.trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/api/spoonacular/search', { params: { ingredients: q } });
      setResults(res.data?.results || []);
      setSource(res.data?.source || 'RannaBhai Kitchen');
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Zero-Waste Cooking</div>
          <h1 className="rb-title">Pantry Ingredient Match</h1>
          <p className="rb-subtitle">
            List what you have in your fridge or pantry (comma-separated) and we’ll find dishes you can cook right now.
          </p>
        </div>
        {source && <span className="rb-badge rb-badge-sage">Source: {source}</span>}
      </div>

      <div className="rb-card" style={{ marginBottom: '1.75rem' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runMatch(ingredients);
          }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}
        >
          <input
            className="rb-input"
            style={{ flex: 1, minWidth: '240px' }}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, garlic, rice, onion"
          />
          <button type="submit" className="rb-btn rb-btn-primary">
            <Search size={16} /> Match Recipes
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Try:</span>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="rb-tab"
              style={{ padding: '0.32rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => {
                setIngredients(chip);
                runMatch(chip);
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Matching your pantry ingredients...</div>
      ) : searched && results.length === 0 ? (
        <div className="rb-empty">No recipes matched those ingredients. Try broader staples like chicken, rice, or tomato.</div>
      ) : !searched ? (
        <div className="rb-empty">
          <ChefHat size={30} style={{ margin: '0 auto 0.5rem', color: 'var(--accent)' }} />
          Enter ingredients above or click one of the quick pantry presets to discover dishes.
        </div>
      ) : (
        <div className="rb-grid-3">
          {results.map((r) => (
            <Link key={r.id} to={`/spoon-details/${r.id}`} className="rb-card rb-card-hover">
              <img
                src={r.image || getRecipeFallbackImage(r.title)}
                alt={r.title}
                onError={(e) => {
                  e.currentTarget.src = getRecipeFallbackImage(r.title);
                }}
                className="rb-recipe-img"
              />
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {r.usedIngredientCount != null && (
                  <span className="rb-badge rb-badge-sage">{r.usedIngredientCount} matched</span>
                )}
                {r.missedIngredientCount != null && (
                  <span className="rb-badge">{r.missedIngredientCount} missing</span>
                )}
              </div>
              <h3 style={{ fontSize: '1.16rem' }}>{r.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
