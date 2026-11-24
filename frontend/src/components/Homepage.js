import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Calendar,
  Apple,
  MapPin,
  Gamepad2,
  HeartPulse,
  Flame,
  ArrowRight,
  ChefHat,
} from 'lucide-react';
import api, { getRecipeFallbackImage } from '../services/api';

const QUICK_CARDS = [
  {
    to: '/meal-planning',
    icon: Calendar,
    badge: 'Planner + Grocery',
    title: 'Smart Meal Planner',
    desc: 'Generate balanced daily meals by calorie target with an automatic checkable grocery list.',
  },
  {
    to: '/spoonacular',
    icon: ChefHat,
    badge: 'Pantry Match',
    title: 'Cook With What You Have',
    desc: 'Type the ingredients in your fridge and discover recipes you can cook right now.',
  },
  {
    to: '/ingredients',
    icon: Apple,
    badge: 'Nutrition Lab',
    title: 'Ingredients & Calories',
    desc: 'Explore 37+ ingredients with full macro breakdowns and build custom meal nutrition totals.',
  },
  {
    to: '/trivia',
    icon: Gamepad2,
    badge: 'Interactive Game',
    title: 'Food Trivia Challenge',
    desc: 'Test your culinary knowledge across global spices, techniques, and nutrition facts.',
  },
  {
    to: '/near-me',
    icon: MapPin,
    badge: 'Interactive Map',
    title: 'Grocery Stores Near Me',
    desc: 'Locate nearby grocery markets on a live map with real distance calculation.',
  },
  {
    to: '/healthrecommendations',
    icon: HeartPulse,
    badge: 'Wellness Guide',
    title: 'Health Recommendations',
    desc: 'Search 59+ condition-focused dietary practices curated for everyday wellbeing.',
  },
];

export default function Homepage() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/recipe-of-the-day').then((r) => setFeatured(r.data)).catch(() => {});
    api.get('/api/trending-recipes').then((r) => setTrending(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      navigate('/search');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="rb-page">
      <section className="rb-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#f3b778', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <Sparkles size={15} /> Welcome to RannaBhai Kitchen
        </div>
        <h1>
          Cook with joy.
          <br />
          Plan every meal effortlessly.
        </h1>
        <p>
          Discover handcrafted recipes, generate calorie-smart meal plans with automatic grocery lists,
          calculate nutrition, locate nearby markets, and challenge yourself with food trivia.
        </p>

        <form
          onSubmit={handleHeroSearch}
          style={{ display: 'flex', gap: '0.65rem', marginTop: '1.75rem', maxWidth: '560px', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            className="rb-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes by name (e.g., Biryani, Pasta, Curry)..."
            style={{ flex: 1, minWidth: '220px', borderRadius: '9999px', paddingInline: '1.2rem' }}
          />
          <button type="submit" className="rb-btn rb-btn-primary">
            <Search size={16} /> Search Recipes
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <Link to="/recipe" className="rb-btn rb-btn-secondary rb-btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.24)' }}>
            Browse All Recipes <ArrowRight size={14} />
          </Link>
          <Link to="/recipe-submit" className="rb-btn rb-btn-secondary rb-btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.24)' }}>
            Share Your Recipe
          </Link>
        </div>
      </section>

      {featured && (
        <section className="rb-card" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
          <img
            src={featured.image_link || getRecipeFallbackImage(featured.recipe_name)}
            alt={featured.recipe_name}
            onError={(e) => {
              e.currentTarget.src = getRecipeFallbackImage(featured.recipe_name);
            }}
            style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <span className="rb-badge rb-badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={13} /> Recipe of the Day
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{featured.recipe_name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="rb-badge">{featured.cuisine}</span>
              <span className="rb-badge rb-badge-sage">{featured.diet_type}</span>
              <span className="rb-badge rb-badge-accent">{featured.calories} kcal</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', marginBottom: '1.25rem' }}>
              Serves {featured.no_of_servings || 2} · {(featured.ingredient_list || []).length} ingredients · Estimated cost {featured.general_pricing || '$$'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to={`/RecipeDetails/${featured._id}`} className="rb-btn rb-btn-primary">
                Cook This Recipe <ArrowRight size={15} />
              </Link>
              <Link to="/recipe-of-the-day" className="rb-btn rb-btn-secondary">
                Full Spotlight
              </Link>
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="rb-page-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <div className="rb-eyebrow">Everything In One Kitchen</div>
            <h2 className="rb-title" style={{ fontSize: '1.85rem' }}>Explore RannaBhai Tools</h2>
          </div>
        </div>

        <div className="rb-grid-3">
          {QUICK_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.to} to={card.to} className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} />
                  </span>
                  <span className="rb-badge">{card.badge}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', flex: 1 }}>{card.desc}</p>
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  Open <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {trending.length > 0 && (
        <section>
          <div className="rb-page-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <div className="rb-eyebrow">Community Favorites</div>
              <h2 className="rb-title" style={{ fontSize: '1.85rem' }}>Trending Right Now</h2>
            </div>
            <Link to="/trending-recipe" className="rb-btn rb-btn-secondary rb-btn-sm">
              <Flame size={15} /> View Leaderboard
            </Link>
          </div>
          <div className="rb-grid-3">
            {trending.map((r) => (
              <Link key={r._id} to={`/RecipeDetails/${r._id}`} className="rb-card rb-card-hover">
                <img
                  src={r.image_link || getRecipeFallbackImage(r.recipe_name)}
                  alt={r.recipe_name}
                  onError={(e) => {
                    e.currentTarget.src = getRecipeFallbackImage(r.recipe_name);
                  }}
                  className="rb-recipe-img"
                />
                <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="rb-badge rb-badge-accent">{r.like_count || 0} Likes</span>
                  <span className="rb-badge">{r.cuisine}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem' }}>{r.recipe_name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
