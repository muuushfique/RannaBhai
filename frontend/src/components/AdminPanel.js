import React, { useEffect, useState } from 'react';
import { Trash2, Plus, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function AdminPanel() {
  const [tab, setTab] = useState('recipes');
  const [recipes, setRecipes] = useState([]);
  const [reports, setReports] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [meals, setMeals] = useState([]);
  const [notice, setNotice] = useState('');

  // FAQ form
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  // Meal form
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    calories: '450',
    image: '',
    category: 'Breakfast',
  });

  const loadAll = () => {
    api.get('/api/admin/recipes').then((r) => setRecipes(r.data || [])).catch(() => {});
    api.get('/api/admin/reports').then((r) => setReports(r.data || [])).catch(() => {});
    api.get('/faqs').then((r) => setFaqs(r.data || [])).catch(() => {});
    api.get('/meals').then((r) => setMeals(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  const deleteRecipe = async (id) => {
    await api.delete(`/api/admin/recipe/${id}`);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
    flash('Recipe deleted.');
  };

  const addFaq = async (e) => {
    e.preventDefault();
    const res = await api.post('/add-new-faq', { question: faqQ, answer: faqA });
    setFaqs((prev) => [res.data, ...prev]);
    setFaqQ('');
    setFaqA('');
    flash('FAQ added.');
  };

  const deleteFaq = async (id) => {
    await api.delete(`/delete-faq/${id}`);
    setFaqs((prev) => prev.filter((f) => f._id !== id));
    flash('FAQ removed.');
  };

  const addMeal = async (e) => {
    e.preventDefault();
    const res = await api.post('/add-new-meal', mealForm);
    setMeals((prev) => [...prev, res.data]);
    setMealForm({ name: '', description: '', calories: '450', image: '', category: 'Breakfast' });
    flash('Meal added.');
  };

  const deleteMeal = async (id) => {
    await api.delete(`/delete-meal/${id}`);
    setMeals((prev) => prev.filter((m) => m._id !== id));
    flash('Meal removed.');
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Unified Moderation</div>
          <h1 className="rb-title">Admin Studio</h1>
          <p className="rb-subtitle">
            Manage recipes, review user reports, maintain FAQs, and curate Meal Planner dishes from one place.
          </p>
        </div>
        <span className="rb-badge rb-badge-sage">
          <ShieldCheck size={14} /> Connected to MongoDB
        </span>
      </div>

      {notice && <div className="rb-alert rb-alert-success">{notice}</div>}

      <div className="rb-tabs">
        {[
          { id: 'recipes', label: `Recipes (${recipes.length})` },
          { id: 'reports', label: `Reports (${reports.length})` },
          { id: 'faqs', label: `FAQs (${faqs.length})` },
          { id: 'meals', label: `Meals (${meals.length})` },
        ].map((t) => (
          <button key={t.id} type="button" className={`rb-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'recipes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recipes.map((r) => (
            <div key={r._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <div>
                <strong>{r.recipe_name}</strong>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {r.cuisine} · {r.diet_type} · {r.calories} kcal · {r.like_count || 0} likes
                </div>
              </div>
              <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteRecipe(r._id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        reports.length === 0 ? (
          <div className="rb-empty">No open recipe reports — everything looks clean!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reports.map((rep) => (
              <div key={rep._id} className="rb-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong>{rep.recipeName}</strong>
                  <span className="rb-badge">Reporter: {rep.reporter}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{rep.reason}</p>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'faqs' && (
        <div className="rb-grid-2">
          <form className="rb-card" onSubmit={addFaq}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Add New FAQ</h2>
            <div className="rb-field">
              <label className="rb-label">Question</label>
              <input className="rb-input" value={faqQ} onChange={(e) => setFaqQ(e.target.value)} required />
            </div>
            <div className="rb-field">
              <label className="rb-label">Answer</label>
              <textarea className="rb-textarea" value={faqA} onChange={(e) => setFaqA(e.target.value)} required />
            </div>
            <button type="submit" className="rb-btn rb-btn-primary">
              <Plus size={15} /> Add FAQ
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f) => (
              <div key={f._id} className="rb-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <strong>{f.question}</strong>
                  <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteFaq(f._id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)' }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'meals' && (
        <div className="rb-grid-2">
          <form className="rb-card" onSubmit={addMeal}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Add Planner Meal</h2>
            <div className="rb-field">
              <label className="rb-label">Meal Name</label>
              <input
                className="rb-input"
                value={mealForm.name}
                onChange={(e) => setMealForm((m) => ({ ...m, name: e.target.value }))}
                required
              />
            </div>
            <div className="rb-grid-2">
              <div className="rb-field">
                <label className="rb-label">Category</label>
                <select
                  className="rb-select"
                  value={mealForm.category}
                  onChange={(e) => setMealForm((m) => ({ ...m, category: e.target.value }))}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div className="rb-field">
                <label className="rb-label">Calories</label>
                <input
                  type="number"
                  className="rb-input"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm((m) => ({ ...m, calories: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="rb-field">
              <label className="rb-label">Description</label>
              <textarea
                className="rb-textarea"
                value={mealForm.description}
                onChange={(e) => setMealForm((m) => ({ ...m, description: e.target.value }))}
                required
              />
            </div>
            <div className="rb-field">
              <label className="rb-label">Image URL (optional)</label>
              <input
                className="rb-input"
                value={mealForm.image}
                onChange={(e) => setMealForm((m) => ({ ...m, image: e.target.value }))}
              />
            </div>
            <button type="submit" className="rb-btn rb-btn-primary">
              <Plus size={15} /> Add Meal
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {meals.map((m) => (
              <div key={m._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                <div>
                  <span className="rb-badge rb-badge-accent" style={{ marginBottom: '0.25rem' }}>{m.category}</span>
                  <div><strong>{m.name}</strong> · {m.calories} kcal</div>
                </div>
                <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteMeal(m._id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
