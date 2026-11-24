import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Download,
  PlusCircle,
  Utensils,
  Bookmark,
  ShoppingBasket,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage } from '../services/api';
import { useKitchen } from '../context/KitchenContext';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cuisineFilter, setCuisineFilter] = useState('All');
  const [dietFilter, setDietFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchText, setSearchText] = useState('');
  const [savedOnly, setSavedOnly] = useState(searchParams.get('saved') === '1');
  const [viewMode, setViewMode] = useState('grid');
  const [voted, setVoted] = useState({});

  const { isBookmarked, toggleBookmark, addToShoppingList } = useKitchen();

  useEffect(() => {
    setSavedOnly(searchParams.get('saved') === '1');
  }, [searchParams]);

  useEffect(() => {
    api
      .get('/recipes')
      .then((res) => setRecipes(res.data || []))
      .catch(() => setError('Could not load recipes. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = ['All', ...Array.from(new Set(recipes.map((r) => r.cuisine).filter(Boolean)))];

  const filtered = recipes
    .filter((r) => {
      if (savedOnly && !isBookmarked(r._id)) return false;
      if (cuisineFilter !== 'All' && r.cuisine !== cuisineFilter) return false;
      if (dietFilter === 'Veg' && !/^veg/i.test(r.diet_type || '')) return false;
      if (dietFilter === 'Non-Veg' && /^veg/i.test(r.diet_type || '')) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const nameMatch = (r.recipe_name || '').toLowerCase().includes(q);
        const ingMatch = (r.ingredient_list || []).some((i) => i.toLowerCase().includes(q));
        if (!nameMatch && !ingMatch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.like_count || 0) - (a.like_count || 0);
      if (sortBy === 'cal-asc') return (a.calories || 0) - (b.calories || 0);
      if (sortBy === 'cal-desc') return (b.calories || 0) - (a.calories || 0);
      if (sortBy === 'az') return (a.recipe_name || '').localeCompare(b.recipe_name || '');
      return 0;
    });

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
          <h1 className="rb-title">{savedOnly ? 'My Saved Cookbook' : 'All Recipes'}</h1>
          <p className="rb-subtitle">
            Filter by cuisine or diet, sort by popularity or calories, bookmark dishes, or push ingredients straight to your Grocery Cart.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`rb-btn ${savedOnly ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
            onClick={() => {
              const next = !savedOnly;
              setSavedOnly(next);
              setSearchParams(next ? { saved: '1' } : {});
            }}
          >
            <Bookmark size={15} /> {savedOnly ? 'Showing Saved Only' : 'Saved Cookbook'}
          </button>
          <Link to="/recipe-submit" className="rb-btn rb-btn-primary">
            <PlusCircle size={16} /> Submit a Recipe
          </Link>
        </div>
      </div>

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      {/* Controls Bar */}
      <div className="rb-card" style={{ marginBottom: '1.5rem', padding: '1.15rem 1.35rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
            <input
              className="rb-input"
              style={{ paddingLeft: '2.2rem' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter by dish name or ingredient..."
            />
          </div>

          <select
            className="rb-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value)}
            aria-label="Filter by diet"
          >
            <option value="All">All Diets</option>
            <option value="Veg">Vegetarian Only</option>
            <option value="Non-Veg">Non-Veg Only</option>
          </select>

          <select
            className="rb-select"
            style={{ width: 'auto', minWidth: '185px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort recipes"
          >
            <option value="popular">Sort: Most Popular</option>
            <option value="cal-asc">Sort: Lowest Calories</option>
            <option value="cal-desc">Sort: Highest Calories</option>
            <option value="az">Sort: A – Z</option>
          </select>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className={`rb-btn rb-btn-sm ${viewMode === 'grid' ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              className={`rb-btn rb-btn-sm ${viewMode === 'list' ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
              onClick={() => setViewMode('list')}
              title="Compact List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="rb-tabs" style={{ marginBottom: 0 }}>
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
      </div>

      {loading ? (
        <div className="rb-grid-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rb-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rb-empty">
          <Utensils size={28} style={{ margin: '0 auto 0.5rem' }} />
          No recipes matched your current filters.
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'rb-grid-3' : ''} style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : undefined}>
          {filtered.map((recipe) => {
            const saved = isBookmarked(recipe._id);
            return (
              <article
                key={recipe._id}
                className="rb-card rb-card-hover"
                style={
                  viewMode === 'list'
                    ? { display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.35rem', alignItems: 'center' }
                    : { display: 'flex', flexDirection: 'column' }
                }
              >
                <div className="rb-media-wrap" style={viewMode === 'list' ? { marginBottom: 0 } : undefined}>
                  <Link to={`/RecipeDetails/${recipe._id}`}>
                    <img
                      src={recipe.image_link || getRecipeFallbackImage(recipe.recipe_name)}
                      alt={recipe.recipe_name}
                      onError={(e) => {
                        e.currentTarget.src = getRecipeFallbackImage(recipe.recipe_name);
                      }}
                      className="rb-recipe-img"
                      style={viewMode === 'list' ? { height: '140px' } : undefined}
                    />
                  </Link>
                  <button
                    type="button"
                    className={`rb-bookmark-fab ${saved ? 'saved' : ''}`}
                    onClick={() => toggleBookmark(recipe)}
                    title={saved ? 'Remove from Saved Cookbook' : 'Save to Cookbook'}
                  >
                    <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                    <span className="rb-badge">{recipe.cuisine || 'House Special'}</span>
                    <span className="rb-badge rb-badge-sage">{recipe.diet_type || 'Regular'}</span>
                    <span className="rb-badge rb-badge-accent">{recipe.calories || 350} kcal</span>
                  </div>

                  <Link to={`/RecipeDetails/${recipe._id}`}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{recipe.recipe_name}</h2>
                  </Link>
                  <p style={{ fontSize: '0.84rem', color: 'var(--muted)', marginBottom: '1rem', flex: 1 }}>
                    Serves {recipe.no_of_servings || 2} · {(recipe.ingredient_list || []).length} ingredients · {recipe.general_pricing || '$$'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
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

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        className="rb-btn rb-btn-secondary rb-btn-sm"
                        onClick={() => addToShoppingList(recipe.ingredient_list || [], recipe.recipe_name)}
                        title="Add ingredients to Grocery Cart"
                      >
                        <ShoppingBasket size={13} /> Cart
                      </button>
                      <button
                        type="button"
                        className="rb-btn rb-btn-secondary rb-btn-sm"
                        onClick={() => exportRecipeToPDF(recipe)}
                        title="Download printable PDF card"
                      >
                        <Download size={13} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
