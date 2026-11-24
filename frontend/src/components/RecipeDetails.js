import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  ThumbsUp,
  Star,
  CheckSquare,
  Square,
  Send,
  Bookmark,
  ShoppingBasket,
  Share2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  ChefHat,
  Minus,
  Plus,
} from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage, parseProcedure } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useKitchen } from '../context/KitchenContext';

function scaleIngredientLine(line, factor) {
  if (!factor || Math.abs(factor - 1) < 0.01) return line;
  return String(line).replace(/(\d+(\.\d+)?)/g, (match) => {
    const val = parseFloat(match) * factor;
    return Number.isInteger(val) ? String(val) : val.toFixed(1).replace(/\.0$/, '');
  });
}

function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.14 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 0.5);
    });
  } catch {
    // ignore audio block
  }
}

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark, addToShoppingList, notify } = useKitchen();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});
  const [servings, setServings] = useState(2);

  // Interactive Cook Mode & Kitchen Timer
  const [cookMode, setCookMode] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [timerSec, setTimerSec] = useState(600); // 10m default
  const [timerRunning, setTimerRunning] = useState(false);

  const [reviewerName, setReviewerName] = useState(user?.username || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/recipe/${id}`)
      .then((res) => {
        setRecipe(res.data);
        setServings(res.data?.no_of_servings || 2);
      })
      .catch(() => setError('Recipe could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSec((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          playTimerChime();
          notify('Kitchen timer finished!', 'info');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, notify]);

  const handleLike = async () => {
    if (!recipe) return;
    try {
      const res = await api.post(`/recipes/${recipe._id}/like`, { delta: 1 });
      setRecipe((prev) => ({ ...prev, like_count: res.data.like_count }));
      notify(`Liked ${recipe.recipe_name}!`, 'success');
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    notify('Recipe link copied to clipboard!', 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/recipe/${recipe._id}/reviews`, {
        reviewer_name: reviewerName.trim() || user?.username || 'Home Chef',
        rating: Number(rating),
        comment: comment.trim(),
      });
      setRecipe(res.data);
      setComment('');
      notify('Tasting review published!', 'success');
    } catch {
      notify('Could not submit review right now.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="rb-page">
        <div className="rb-skeleton" style={{ height: 320, marginBottom: '1.5rem' }} />
        <div className="rb-grid-2">
          <div className="rb-skeleton" />
          <div className="rb-skeleton" />
        </div>
      </div>
    );
  }
  if (error || !recipe) {
    return (
      <div className="rb-page">
        <div className="rb-alert rb-alert-error">{error || 'Recipe not found.'}</div>
        <Link to="/recipe" className="rb-btn rb-btn-secondary">
          <ArrowLeft size={15} /> Back to All Recipes
        </Link>
      </div>
    );
  }

  const { steps, attribution } = parseProcedure(recipe.recipe_procedure);
  const baseServings = recipe.no_of_servings || 2;
  const scaleFactor = servings / baseServings;
  const scaledIngredients = (recipe.ingredient_list || []).map((item) =>
    scaleIngredientLine(item, scaleFactor)
  );
  const saved = isBookmarked(recipe._id);
  const reviews = recipe.review_list || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const mins = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const secs = String(timerSec % 60).padStart(2, '0');

  return (
    <div className="rb-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/recipe" className="rb-btn rb-btn-secondary rb-btn-sm">
          <ArrowLeft size={14} /> All Recipes
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`rb-btn rb-btn-sm ${saved ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
            onClick={() => toggleBookmark(recipe)}
          >
            <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved in Cookbook' : 'Save to Cookbook'}
          </button>
          <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={handleShare}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rb-card" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        <img
          src={recipe.image_link || getRecipeFallbackImage(recipe.recipe_name)}
          alt={recipe.recipe_name}
          onError={(e) => {
            e.currentTarget.src = getRecipeFallbackImage(recipe.recipe_name);
          }}
          style={{ width: '100%', height: '310px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />

        <div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <span className="rb-badge">{recipe.cuisine}</span>
            <span className="rb-badge rb-badge-sage">{recipe.diet_type}</span>
            <span className="rb-badge rb-badge-accent">{Math.round((recipe.calories || 350) * scaleFactor)} kcal</span>
            <span className="rb-badge rb-badge-gold">
              <Star size={12} fill="currentColor" /> {avgRating} ({reviews.length})
            </span>
          </div>

          <h1 className="rb-title" style={{ marginBottom: '0.65rem' }}>{recipe.recipe_name}</h1>

          {/* Interactive Serving Scaler */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Adjust Servings:</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-soft)', padding: '0.25rem 0.6rem', borderRadius: '9999px' }}>
              <button
                type="button"
                className="rb-btn rb-btn-secondary rb-btn-sm"
                style={{ padding: '0.25rem 0.5rem' }}
                onClick={() => setServings((s) => Math.max(1, s - 1))}
              >
                <Minus size={13} />
              </button>
              <strong style={{ minWidth: '64px', textAlign: 'center', fontSize: '0.9rem' }}>
                {servings} {servings === 1 ? 'serving' : 'servings'}
              </strong>
              <button
                type="button"
                className="rb-btn rb-btn-primary rb-btn-sm"
                style={{ padding: '0.25rem 0.5rem' }}
                onClick={() => setServings((s) => Math.min(24, s + 1))}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button type="button" className="rb-btn rb-btn-primary" onClick={handleLike}>
              <ThumbsUp size={15} /> Like ({recipe.like_count || 0})
            </button>
            <button
              type="button"
              className="rb-btn rb-btn-sage"
              onClick={() => addToShoppingList(scaledIngredients, recipe.recipe_name)}
            >
              <ShoppingBasket size={15} /> Add Ingredients to Cart
            </button>
            <button type="button" className="rb-btn rb-btn-secondary" onClick={() => exportRecipeToPDF(recipe)}>
              <Download size={15} /> PDF Card
            </button>
          </div>
        </div>
      </div>

      {/* Built-in Kitchen Timer & Step-by-Step Cook Mode Bar */}
      <div className="rb-card" style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--surface-soft)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span className="rb-badge rb-badge-accent">
            <Timer size={14} /> Kitchen Timer
          </span>
          <span className="serif" style={{ fontSize: '1.65rem', fontWeight: 700, minWidth: '76px' }}>
            {mins}:{secs}
          </span>
          <button
            type="button"
            className="rb-btn rb-btn-primary rb-btn-sm"
            onClick={() => setTimerRunning((r) => !r)}
          >
            {timerRunning ? <Pause size={13} /> : <Play size={13} />}
            {timerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            className="rb-btn rb-btn-secondary rb-btn-sm"
            onClick={() => {
              setTimerRunning(false);
              setTimerSec(600);
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {[5, 10, 15, 30].map((m) => (
              <button
                key={m}
                type="button"
                className="rb-tab"
                style={{ padding: '0.28rem 0.65rem', fontSize: '0.76rem' }}
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSec(m * 60);
                }}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {steps.length > 0 && (
          <button
            type="button"
            className={`rb-btn rb-btn-sm ${cookMode ? 'rb-btn-primary' : 'rb-btn-secondary'}`}
            onClick={() => {
              setCookMode((c) => !c);
              setActiveStepIdx(0);
            }}
          >
            <ChefHat size={15} /> {cookMode ? 'Exit Cook Mode' : 'Step-by-Step Cook Mode'}
          </button>
        )}
      </div>

      {/* Interactive Step-by-Step Cook Mode Spotlight */}
      {cookMode && steps.length > 0 && (
        <div className="rb-card" style={{ marginBottom: '1.75rem', border: '2px solid var(--accent)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span className="rb-badge rb-badge-accent">
              Step {activeStepIdx + 1} of {steps.length}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
              {Math.round(((activeStepIdx + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <p className="serif" style={{ fontSize: '1.5rem', lineHeight: 1.45, marginBottom: '1.5rem' }}>
            {steps[activeStepIdx]}
          </p>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="rb-btn rb-btn-secondary rb-btn-sm"
              disabled={activeStepIdx === 0}
              onClick={() => setActiveStepIdx((i) => Math.max(0, i - 1))}
            >
              ← Previous Step
            </button>
            <button
              type="button"
              className="rb-btn rb-btn-primary rb-btn-sm"
              disabled={activeStepIdx >= steps.length - 1}
              onClick={() => setActiveStepIdx((i) => Math.min(steps.length - 1, i + 1))}
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

      <div className="rb-grid-2" style={{ marginBottom: '2rem' }}>
        <div className="rb-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem' }}>Ingredients Checklist</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {Object.values(checked).filter(Boolean).length}/{scaledIngredients.length} checked
            </span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {scaledIngredients.map((item, idx) => {
              const isDone = Boolean(checked[idx]);
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setChecked((c) => ({ ...c, [idx]: !c[idx] }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      textAlign: 'left',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--muted)' : 'var(--ink)',
                      fontSize: '0.94rem',
                    }}
                  >
                    {isDone ? <CheckSquare size={17} color="var(--sage)" /> : <Square size={17} color="var(--muted)" />}
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rb-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Preparation Steps</h2>
          {attribution && (
            <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '1rem' }}>
              Source: {attribution}
            </p>
          )}
          {steps.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No preparation steps listed for this recipe yet.</p>
          ) : (
            <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {steps.map((step, idx) => (
                <li key={idx} style={{ fontSize: '0.94rem', color: 'var(--ink)' }}>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="rb-card">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Community Reviews ({reviews.length})
        </h2>

        <form onSubmit={handleReviewSubmit} style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="rb-grid-2">
            <div className="rb-field">
              <label className="rb-label">Your Name</label>
              <input
                className="rb-input"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Home Chef"
              />
            </div>
            <div className="rb-field">
              <label className="rb-label">Rating</label>
              <select className="rb-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="rb-field">
            <label className="rb-label">Tasting Notes</label>
            <textarea
              className="rb-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How did this dish turn out?"
              required
            />
          </div>
          <button type="submit" className="rb-btn rb-btn-primary">
            <Send size={15} /> Post Review
          </button>
        </form>

        {reviews.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No reviews yet — be the first to taste and review!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {reviews.map((rev, i) => (
              <div key={rev._id || i} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong>{rev.reviewer_name || 'Home Chef'}</strong>
                  <span style={{ color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 700, fontSize: '0.86rem' }}>
                    <Star size={14} fill="currentColor" /> {rev.rating || 5}/5
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--ink)' }}>{rev.comment || rev}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
