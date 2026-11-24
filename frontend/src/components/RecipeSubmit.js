import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const INITIAL = {
  recipe_name: '',
  cuisine: 'Bangladeshi',
  diet_type: 'Regular',
  no_of_servings: '2',
  calories: '400',
  general_pricing: '$$',
  image_link: '',
  ingredient_list: '',
  recipe_procedure: '',
};

export default function RecipeSubmit() {
  const [form, setForm] = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [createdRecipe, setCreatedRecipe] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/submit-recipe', form);
      setCreatedRecipe(res.data.recipe);
      setForm(INITIAL);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit recipe.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Community Kitchen</div>
          <h1 className="rb-title">Submit a Recipe</h1>
          <p className="rb-subtitle">
            Share your signature dish with the RannaBhai community. It will be published immediately to the recipe catalog.
          </p>
        </div>
      </div>

      {createdRecipe && (
        <div className="rb-alert rb-alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle2 size={18} /> <strong>{createdRecipe.recipe_name}</strong> has been published!
          </span>
          <Link to={`/RecipeDetails/${createdRecipe._id}`} className="rb-btn rb-btn-sage rb-btn-sm">
            View Published Recipe →
          </Link>
        </div>
      )}

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      <form className="rb-card" style={{ maxWidth: '820px' }} onSubmit={handleSubmit}>
        <div className="rb-grid-2">
          <div className="rb-field">
            <label className="rb-label">Recipe Name *</label>
            <input className="rb-input" name="recipe_name" value={form.recipe_name} onChange={handleChange} placeholder="e.g., Shorshe Ilish" required />
          </div>
          <div className="rb-field">
            <label className="rb-label">Cuisine</label>
            <input className="rb-input" name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="Bangladeshi, Italian, Indian..." />
          </div>
          <div className="rb-field">
            <label className="rb-label">Diet Type</label>
            <select className="rb-select" name="diet_type" value={form.diet_type} onChange={handleChange}>
              <option value="Regular">Regular</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Keto">Keto</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
          <div className="rb-field">
            <label className="rb-label">General Pricing</label>
            <select className="rb-select" name="general_pricing" value={form.general_pricing} onChange={handleChange}>
              <option value="$">$ (Budget Friendly)</option>
              <option value="$$">$$ (Moderate)</option>
              <option value="$$$">$$$ (Special Occasion)</option>
            </select>
          </div>
          <div className="rb-field">
            <label className="rb-label">Servings</label>
            <input type="number" min="1" className="rb-input" name="no_of_servings" value={form.no_of_servings} onChange={handleChange} />
          </div>
          <div className="rb-field">
            <label className="rb-label">Calories (kcal)</label>
            <input type="number" min="50" className="rb-input" name="calories" value={form.calories} onChange={handleChange} />
          </div>
        </div>

        <div className="rb-field">
          <label className="rb-label">Image URL (optional)</label>
          <input className="rb-input" name="image_link" value={form.image_link} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="rb-field">
          <label className="rb-label">Ingredients (comma or line separated) *</label>
          <textarea
            className="rb-textarea"
            name="ingredient_list"
            value={form.ingredient_list}
            onChange={handleChange}
            placeholder="2 cups Basmati rice, 500g chicken, 2 tbsp mustard oil..."
            required
          />
        </div>

        <div className="rb-field">
          <label className="rb-label">Preparation Steps (one step per line) *</label>
          <textarea
            className="rb-textarea"
            name="recipe_procedure"
            value={form.recipe_procedure}
            onChange={handleChange}
            placeholder={"Wash and soak rice for 30 minutes.\nSauté spices in mustard oil until fragrant.\nSimmer on low heat until tender."}
            required
          />
        </div>

        <button type="submit" className="rb-btn rb-btn-primary" disabled={submitting}>
          <PlusCircle size={16} /> {submitting ? 'Publishing...' : 'Publish Recipe'}
        </button>
      </form>
    </div>
  );
}
