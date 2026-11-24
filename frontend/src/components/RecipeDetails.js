import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ThumbsUp, Star, CheckSquare, Square, Send } from 'lucide-react';
import api, { exportRecipeToPDF, getRecipeFallbackImage, parseProcedure } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});

  const [reviewerName, setReviewerName] = useState(user?.username || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/recipe/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError('Recipe could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!recipe) return;
    try {
      const res = await api.post(`/recipes/${recipe._id}/like`, { delta: 1 });
      setRecipe((prev) => ({ ...prev, like_count: res.data.like_count }));
    } catch {
      // ignore
    }
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
      setReviewMsg('Review added — thank you for sharing your tasting notes!');
    } catch {
      setReviewMsg('Could not submit review right now.');
    }
  };

  if (loading) return <div className="rb-page"><div className="rb-empty">Loading recipe details...</div></div>;
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

  return (
    <div className="rb-page">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/recipe" className="rb-btn rb-btn-secondary rb-btn-sm">
          <ArrowLeft size={14} /> All Recipes
        </Link>
      </div>

      <div className="rb-card" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        <img
          src={recipe.image_link || getRecipeFallbackImage(recipe.recipe_name)}
          alt={recipe.recipe_name}
          onError={(e) => {
            e.currentTarget.src = getRecipeFallbackImage(recipe.recipe_name);
          }}
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
        />

        <div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
            <span className="rb-badge">{recipe.cuisine}</span>
            <span className="rb-badge rb-badge-sage">{recipe.diet_type}</span>
            <span className="rb-badge rb-badge-accent">{recipe.calories} kcal</span>
            <span className="rb-badge rb-badge-gold">Pricing: {recipe.general_pricing || '$$'}</span>
          </div>
          <h1 className="rb-title" style={{ marginBottom: '0.65rem' }}>{recipe.recipe_name}</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Serves <strong>{recipe.no_of_servings || 2}</strong> · {(recipe.ingredient_list || []).length} ingredients · {steps.length} steps
          </p>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button type="button" className="rb-btn rb-btn-primary" onClick={handleLike}>
              <ThumbsUp size={15} /> Like ({recipe.like_count || 0})
            </button>
            <button type="button" className="rb-btn rb-btn-secondary" onClick={() => exportRecipeToPDF(recipe)}>
              <Download size={15} /> Download PDF Card
            </button>
          </div>
        </div>
      </div>

      <div className="rb-grid-2" style={{ marginBottom: '2rem' }}>
        <div className="rb-card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Ingredients Checklist</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(recipe.ingredient_list || []).map((item, idx) => {
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

      <section className="rb-card">
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Community Reviews ({(recipe.review_list || []).length})
        </h2>

        {reviewMsg && <div className="rb-alert rb-alert-success">{reviewMsg}</div>}

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

        {(recipe.review_list || []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No reviews yet — be the first to taste and review!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recipe.review_list.map((rev, i) => (
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
