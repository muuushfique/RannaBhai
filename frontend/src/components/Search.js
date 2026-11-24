import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../services/api';

const MODES = [
  { id: 'name', label: 'Recipe Name', endpoint: '/search-recipe-name', placeholder: 'e.g., Chicken, Biryani, Pasta...' },
  { id: 'ingredient', label: 'Ingredient', endpoint: '/search-ingredient', placeholder: 'e.g., Garlic, Rice, Tomato...' },
  { id: 'cuisine', label: 'Cuisine', endpoint: '/search-cuisine', placeholder: 'e.g., Bangladeshi, Italian, Indian...' },
  { id: 'diet', label: 'Diet Type', endpoint: '/search-diet-type', placeholder: 'e.g., Vegetarian, Keto, Non-Veg...' },
  { id: 'calories', label: 'Max Calories', endpoint: '/search-calories', placeholder: 'e.g., 500 (returns recipes <= 500 kcal)' },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [mode, setMode] = useState('name');
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];

  const runSearch = async (qStr, selectedMode = activeMode) => {
    if (!qStr.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`${selectedMode.endpoint}?q=${encodeURIComponent(qStr.trim())}`);
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      runSearch(initialQ, MODES[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ]);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Smart Discovery</div>
          <h1 className="rb-title">Search Recipes</h1>
          <p className="rb-subtitle">
            Find dishes by partial name, key ingredient, regional cuisine, diet type, or maximum calorie budget.
          </p>
        </div>
      </div>

      <div className="rb-card" style={{ marginBottom: '1.75rem' }}>
        <div className="rb-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`rb-tab ${mode === m.id ? 'active' : ''}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(query);
          }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <input
            type={mode === 'calories' ? 'number' : 'text'}
            className="rb-input"
            style={{ flex: 1, minWidth: '220px' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeMode.placeholder}
          />
          <button type="submit" className="rb-btn rb-btn-primary">
            <SearchIcon size={16} /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="rb-empty">Searching the kitchen...</div>
      ) : searched && results.length === 0 ? (
        <div className="rb-empty">No recipes matched “{query}”. Try a broader keyword or switch search tabs.</div>
      ) : (
        <div className="rb-grid-3">
          {results.map((r) => (
            <Link key={r._id} to={`/RecipeDetails/${r._id}`} className="rb-card rb-card-hover">
              <img
                src={r.image_link || getRecipeFallbackImage(r.recipe_name)}
                alt={r.recipe_name}
                onError={(e) => {
                  e.currentTarget.src = getRecipeFallbackImage(r.recipe_name);
                }}
                className="rb-recipe-img"
              />
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className="rb-badge">{r.cuisine}</span>
                <span className="rb-badge rb-badge-accent">{r.calories} kcal</span>
              </div>
              <h3 style={{ fontSize: '1.18rem' }}>{r.recipe_name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
