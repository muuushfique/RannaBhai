import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api, { getRecipeFallbackImage, normalizeNutrition } from '../services/api';

export default function IngredientDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/Ingredients/${id}`),
      api.get(`/Ingredients/${id}/recipes`).catch(() => ({ data: [] })),
    ])
      .then(([ingRes, recRes]) => {
        setItem(ingRes.data);
        setRecipes(recRes.data || []);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="rb-page"><div className="rb-empty">Loading ingredient...</div></div>;
  if (!item) {
    return (
      <div className="rb-page">
        <div className="rb-alert rb-alert-error">Ingredient not found.</div>
        <Link to="/ingredients" className="rb-btn rb-btn-secondary">
          <ArrowLeft size={15} /> Back to Ingredients
        </Link>
      </div>
    );
  }

  const n = normalizeNutrition(item.nutrition);
  const stats = [
    { label: 'Calories', val: `${n.calories} kcal` },
    { label: 'Protein', val: `${n.protein} g` },
    { label: 'Carbs', val: `${n.carbs} g` },
    { label: 'Fat', val: `${n.fat} g` },
    { label: 'Fiber', val: `${n.fiber} g` },
    { label: 'Calcium', val: `${n.calcium} mg` },
    { label: 'Minerals', val: `${n.minerals} mg` },
  ];

  return (
    <div className="rb-page">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/ingredients" className="rb-btn rb-btn-secondary rb-btn-sm">
          <ArrowLeft size={14} /> Ingredients Directory
        </Link>
      </div>

      <div className="rb-card" style={{ marginBottom: '2rem' }}>
        <span className="rb-badge rb-badge-sage" style={{ marginBottom: '0.6rem' }}>{item.category}</span>
        <h1 className="rb-title" style={{ marginBottom: '1.25rem' }}>{item.ingredient}</h1>
        <div className="rb-grid-4">
          {stats.map((s) => (
            <div key={s.label} style={{ padding: '0.9rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.2rem' }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Recipes Using {item.ingredient} ({recipes.length})
      </h2>
      {recipes.length === 0 ? (
        <div className="rb-empty">No recipes in our catalog currently list {item.ingredient}.</div>
      ) : (
        <div className="rb-grid-3">
          {recipes.map((r) => (
            <Link key={r._id} to={`/RecipeDetails/${r._id}`} className="rb-card rb-card-hover">
              <img
                src={r.image_link || getRecipeFallbackImage(r.recipe_name)}
                alt={r.recipe_name}
                onError={(e) => {
                  e.currentTarget.src = getRecipeFallbackImage(r.recipe_name);
                }}
                className="rb-recipe-img"
              />
              <h3 style={{ fontSize: '1.15rem' }}>{r.recipe_name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
