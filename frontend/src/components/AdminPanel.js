import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Plus,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Search,
  BarChart3,
  Users,
  Mail,
  X,
} from 'lucide-react';
import api, { parseProcedure } from '../services/api';
import { useKitchen } from '../context/KitchenContext';

export default function AdminPanel() {
  const { notify } = useKitchen();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [reports, setReports] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [meals, setMeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState('');

  // Edit Recipe Modal
  const [editingRecipe, setEditingRecipe] = useState(null);

  // FAQ Add & Edit
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);

  // Meal Add & Edit
  const [mealForm, setMealForm] = useState({
    name: '',
    description: '',
    calories: '450',
    image: '',
    category: 'Breakfast',
  });
  const [editingMeal, setEditingMeal] = useState(null);

  const loadAll = () => {
    api.get('/api/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    api.get('/api/admin/recipes').then((r) => setRecipes(r.data || [])).catch(() => {});
    api.get('/api/admin/reports').then((r) => setReports(r.data || [])).catch(() => {});
    api.get('/faqs').then((r) => setFaqs(r.data || [])).catch(() => {});
    api.get('/meals').then((r) => setMeals(r.data || [])).catch(() => {});
    api.get('/api/admin/contacts').then((r) => setContacts(r.data || [])).catch(() => {});
    api.get('/api/admin/users').then((r) => setUsers(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Recipe Actions
  const openEditRecipe = (r) => {
    const parsed = parseProcedure(r.recipe_procedure);
    setEditingRecipe({
      _id: r._id,
      recipe_name: r.recipe_name || '',
      cuisine: r.cuisine || 'Bangladeshi',
      diet_type: r.diet_type || 'Regular',
      no_of_servings: r.no_of_servings || 2,
      calories: r.calories || 350,
      general_pricing: r.general_pricing || '$$',
      image_link: r.image_link || '',
      ingredient_list: (r.ingredient_list || []).join('\n'),
      recipe_procedure: parsed.steps.join('\n'),
    });
  };

  const saveEditRecipe = async (e) => {
    e.preventDefault();
    if (!editingRecipe) return;
    try {
      const res = await api.put(`/api/admin/recipe/${editingRecipe._id}`, editingRecipe);
      setRecipes((prev) => prev.map((r) => (r._id === editingRecipe._id ? res.data.recipe : r)));
      setEditingRecipe(null);
      notify('Recipe updated successfully!', 'success');
    } catch {
      notify('Failed to update recipe.', 'error');
    }
  };

  const deleteRecipe = async (id) => {
    await api.delete(`/api/admin/recipe/${id}`);
    setRecipes((prev) => prev.filter((r) => r._id !== id));
    notify('Recipe deleted.', 'info');
  };

  // Report Actions
  const dismissReport = async (rep) => {
    await api.delete(`/api/admin/report/${rep.recipeId}/${rep._id}`);
    setReports((prev) => prev.filter((r) => r._id !== rep._id));
    notify('Report resolved and cleared.', 'success');
  };

  // FAQ Actions
  const addFaq = async (e) => {
    e.preventDefault();
    const res = await api.post('/add-new-faq', { question: faqQ, answer: faqA });
    setFaqs((prev) => [res.data, ...prev]);
    setFaqQ('');
    setFaqA('');
    notify('FAQ published!', 'success');
  };

  const saveEditFaq = async (e) => {
    e.preventDefault();
    if (!editingFaq) return;
    const res = await api.put(`/update-faq/${editingFaq._id}`, {
      question: editingFaq.question,
      answer: editingFaq.answer,
    });
    setFaqs((prev) => prev.map((f) => (f._id === editingFaq._id ? res.data : f)));
    setEditingFaq(null);
    notify('FAQ updated!', 'success');
  };

  const deleteFaq = async (id) => {
    await api.delete(`/delete-faq/${id}`);
    setFaqs((prev) => prev.filter((f) => f._id !== id));
    notify('FAQ deleted.', 'info');
  };

  // Meal Actions
  const addMeal = async (e) => {
    e.preventDefault();
    const res = await api.post('/add-new-meal', mealForm);
    setMeals((prev) => [...prev, res.data]);
    setMealForm({ name: '', description: '', calories: '450', image: '', category: 'Breakfast' });
    notify('Meal added to Planner!', 'success');
  };

  const saveEditMeal = async (e) => {
    e.preventDefault();
    if (!editingMeal) return;
    const res = await api.put(`/update-meal/${editingMeal._id}`, editingMeal);
    setMeals((prev) => prev.map((m) => (m._id === editingMeal._id ? res.data : m)));
    setEditingMeal(null);
    notify('Meal updated!', 'success');
  };

  const deleteMeal = async (id) => {
    await api.delete(`/delete-meal/${id}`);
    setMeals((prev) => prev.filter((m) => m._id !== id));
    notify('Meal removed.', 'info');
  };

  // Contact & User Actions
  const deleteContact = async (id) => {
    await api.delete(`/api/admin/contact/${id}`);
    setContacts((prev) => prev.filter((c) => c._id !== id));
    notify('Inquiry removed.', 'info');
  };

  const toggleUserRole = async (u) => {
    const res = await api.put(`/api/admin/user/${u._id}/role`, { isAdmin: !u.isAdmin });
    setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, isAdmin: res.data.isAdmin } : x)));
    notify(`Updated ${u.username} role to ${res.data.isAdmin ? 'Admin' : 'Member'}`, 'success');
  };

  const filteredRecipes = recipes.filter(
    (r) =>
      !recipeSearch.trim() ||
      (r.recipe_name || '').toLowerCase().includes(recipeSearch.toLowerCase()) ||
      (r.cuisine || '').toLowerCase().includes(recipeSearch.toLowerCase())
  );

  const topRecipes = [...recipes]
    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
    .slice(0, 6);
  const maxLikes = Math.max(1, topRecipes[0]?.like_count || 1);

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Standard Control Center</div>
          <h1 className="rb-title">Admin Studio</h1>
          <p className="rb-subtitle">
            Analytics overview, full recipe editing, report resolution, FAQ & Meal CRUD, contact inbox, and user role management.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Link to="/recipe-submit" className="rb-btn rb-btn-primary rb-btn-sm">
            <Plus size={14} /> New Recipe
          </Link>
          <span className="rb-badge rb-badge-sage">
            <ShieldCheck size={14} /> Live MongoDB
          </span>
        </div>
      </div>

      <div className="rb-tabs">
        {[
          { id: 'overview', label: 'Overview & Analytics' },
          { id: 'recipes', label: `Recipes (${recipes.length})` },
          { id: 'reports', label: `Moderation (${reports.length})` },
          { id: 'faqs', label: `FAQs (${faqs.length})` },
          { id: 'meals', label: `Meals (${meals.length})` },
          { id: 'inbox', label: `Inbox & Users (${contacts.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rb-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {tab === 'overview' && (
        <>
          <div className="rb-grid-4" style={{ marginBottom: '1.75rem' }}>
            {[
              { label: 'Published Recipes', value: stats?.totalRecipes ?? recipes.length, badge: 'Catalog' },
              { label: 'Community Likes', value: stats?.totalLikes ?? 0, badge: 'Engagement' },
              { label: 'Open Reports', value: reports.length, badge: 'Moderation' },
              { label: 'Planner Meals & FAQs', value: `${meals.length} / ${faqs.length}`, badge: 'Content' },
            ].map((kpi) => (
              <div key={kpi.label} className="rb-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{kpi.label}</span>
                  <span className="rb-badge rb-badge-accent">{kpi.badge}</span>
                </div>
                <div className="serif" style={{ fontSize: '2.2rem', fontWeight: 700 }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          <div className="rb-grid-2">
            <div className="rb-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                <BarChart3 size={18} color="var(--accent)" />
                <h2 style={{ fontSize: '1.35rem' }}>Top Performing Recipes by Likes</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {topRecipes.map((r) => {
                  const pct = Math.max(8, Math.round(((r.like_count || 0) / maxLikes) * 100));
                  return (
                    <div key={r._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.25rem' }}>
                        <strong>{r.recipe_name}</strong>
                        <span style={{ color: 'var(--muted)' }}>{r.like_count || 0} likes · {r.cuisine}</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-soft)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rb-card">
              <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Quick Admin Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button type="button" className="rb-btn rb-btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => setTab('recipes')}>
                  <span>Edit or Curate Recipe Catalog</span>
                  <span>{recipes.length} items →</span>
                </button>
                <button type="button" className="rb-btn rb-btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => setTab('reports')}>
                  <span>Review Flagged Recipe Reports</span>
                  <span>{reports.length} open →</span>
                </button>
                <button type="button" className="rb-btn rb-btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => setTab('meals')}>
                  <span>Manage Meal Planner Dishes</span>
                  <span>{meals.length} meals →</span>
                </button>
                <button type="button" className="rb-btn rb-btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => setTab('inbox')}>
                  <span>Check Contact Inbox & Users</span>
                  <span>{contacts.length} messages →</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: RECIPES MANAGER (SEARCH + EDIT MODAL + DELETE) */}
      {tab === 'recipes' && (
        <>
          <div className="rb-card" style={{ marginBottom: '1.25rem', padding: '0.9rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                className="rb-input"
                style={{ paddingLeft: '2.2rem' }}
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search recipes by title or cuisine..."
              />
            </div>
            <Link to="/recipe-submit" className="rb-btn rb-btn-primary rb-btn-sm">
              <Plus size={14} /> Add Recipe
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredRecipes.map((r) => (
              <div key={r._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <Link to={`/RecipeDetails/${r._id}`} style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {r.recipe_name}
                  </Link>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                    {r.cuisine} · {r.diet_type} · {r.calories} kcal · Serves {r.no_of_servings || 2} · {r.like_count || 0} likes
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={() => openEditRecipe(r)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteRecipe(r._id)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TAB 3: REPORTS & MODERATION */}
      {tab === 'reports' && (
        reports.length === 0 ? (
          <div className="rb-empty">No open recipe reports — everything looks clean!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reports.map((rep) => (
              <div key={rep._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.35rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Link to={`/RecipeDetails/${rep.recipeId}`} style={{ fontWeight: 700 }}>
                      {rep.recipeName}
                    </Link>
                    <span className="rb-badge">Reporter: {rep.reporter}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{rep.reason}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="rb-btn rb-btn-sage rb-btn-sm" onClick={() => dismissReport(rep)}>
                    <CheckCircle2 size={14} /> Resolve & Dismiss
                  </button>
                  <Link to={`/RecipeDetails/${rep.recipeId}`} className="rb-btn rb-btn-secondary rb-btn-sm">
                    Inspect Dish
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 4: FAQs (ADD + INLINE EDIT + DELETE) */}
      {tab === 'faqs' && (
        <div className="rb-grid-2">
          <form className="rb-card" onSubmit={editingFaq ? saveEditFaq : addFaq}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>
            <div className="rb-field">
              <label className="rb-label">Question</label>
              <input
                className="rb-input"
                value={editingFaq ? editingFaq.question : faqQ}
                onChange={(e) =>
                  editingFaq
                    ? setEditingFaq((f) => ({ ...f, question: e.target.value }))
                    : setFaqQ(e.target.value)
                }
                required
              />
            </div>
            <div className="rb-field">
              <label className="rb-label">Answer</label>
              <textarea
                className="rb-textarea"
                value={editingFaq ? editingFaq.answer : faqA}
                onChange={(e) =>
                  editingFaq
                    ? setEditingFaq((f) => ({ ...f, answer: e.target.value }))
                    : setFaqA(e.target.value)
                }
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="rb-btn rb-btn-primary">
                <Plus size={15} /> {editingFaq ? 'Save Changes' : 'Add FAQ'}
              </button>
              {editingFaq && (
                <button type="button" className="rb-btn rb-btn-secondary" onClick={() => setEditingFaq(null)}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f) => (
              <div key={f._id} className="rb-card" style={{ padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <strong>{f.question}</strong>
                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                    <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={() => setEditingFaq(f)}>
                      <Edit3 size={13} />
                    </button>
                    <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteFaq(f._id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--muted)' }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEALS (ADD + INLINE EDIT + DELETE) */}
      {tab === 'meals' && (
        <div className="rb-grid-2">
          <form className="rb-card" onSubmit={editingMeal ? saveEditMeal : addMeal}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
              {editingMeal ? 'Edit Planner Meal' : 'Add Planner Meal'}
            </h2>
            <div className="rb-field">
              <label className="rb-label">Meal Name</label>
              <input
                className="rb-input"
                value={editingMeal ? editingMeal.name : mealForm.name}
                onChange={(e) =>
                  editingMeal
                    ? setEditingMeal((m) => ({ ...m, name: e.target.value }))
                    : setMealForm((m) => ({ ...m, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="rb-grid-2">
              <div className="rb-field">
                <label className="rb-label">Category</label>
                <select
                  className="rb-select"
                  value={editingMeal ? editingMeal.category : mealForm.category}
                  onChange={(e) =>
                    editingMeal
                      ? setEditingMeal((m) => ({ ...m, category: e.target.value }))
                      : setMealForm((m) => ({ ...m, category: e.target.value }))
                  }
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
                  value={editingMeal ? editingMeal.calories : mealForm.calories}
                  onChange={(e) =>
                    editingMeal
                      ? setEditingMeal((m) => ({ ...m, calories: e.target.value }))
                      : setMealForm((m) => ({ ...m, calories: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="rb-field">
              <label className="rb-label">Description</label>
              <textarea
                className="rb-textarea"
                value={editingMeal ? editingMeal.description : mealForm.description}
                onChange={(e) =>
                  editingMeal
                    ? setEditingMeal((m) => ({ ...m, description: e.target.value }))
                    : setMealForm((m) => ({ ...m, description: e.target.value }))
                }
                required
              />
            </div>
            <div className="rb-field">
              <label className="rb-label">Image URL (optional)</label>
              <input
                className="rb-input"
                value={editingMeal ? editingMeal.image : mealForm.image}
                onChange={(e) =>
                  editingMeal
                    ? setEditingMeal((m) => ({ ...m, image: e.target.value }))
                    : setMealForm((m) => ({ ...m, image: e.target.value }))
                }
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="rb-btn rb-btn-primary">
                <Plus size={15} /> {editingMeal ? 'Update Meal' : 'Add Meal'}
              </button>
              {editingMeal && (
                <button type="button" className="rb-btn rb-btn-secondary" onClick={() => setEditingMeal(null)}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {meals.map((m) => (
              <div key={m._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                <div>
                  <span className="rb-badge rb-badge-accent" style={{ marginBottom: '0.25rem' }}>{m.category}</span>
                  <div><strong>{m.name}</strong> · {m.calories} kcal</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={() => setEditingMeal(m)}>
                    <Edit3 size={13} />
                  </button>
                  <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteMeal(m._id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT INBOX & USERS */}
      {tab === 'inbox' && (
        <div className="rb-grid-2">
          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} color="var(--accent)" /> Contact Inbox ({contacts.length})
            </h2>
            {contacts.length === 0 ? (
              <div className="rb-empty">No contact inquiries in inbox.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contacts.map((c) => (
                  <div key={c._id} className="rb-card" style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <strong>{c.email}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="rb-badge">{c.website || 'Direct'}</span>
                        <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={() => deleteContact(c._id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--sage)" /> Registered Users ({users.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.map((u) => (
                <div key={u._id} className="rb-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
                  <div>
                    <strong>{u.username}</strong>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{u.email}</div>
                  </div>
                  <button
                    type="button"
                    className={`rb-btn rb-btn-sm ${u.isAdmin ? 'rb-btn-sage' : 'rb-btn-secondary'}`}
                    onClick={() => toggleUserRole(u)}
                  >
                    {u.isAdmin ? 'Admin ✓' : 'Make Admin'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDIT RECIPE MODAL */}
      {editingRecipe && (
        <div className="rb-modal-wrap" role="dialog" aria-modal="true" aria-label="Edit Recipe">
          <form className="rb-modal" onSubmit={saveEditRecipe}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.45rem' }}>Edit Recipe</h2>
              <button type="button" onClick={() => setEditingRecipe(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="rb-grid-2">
              <div className="rb-field">
                <label className="rb-label">Recipe Name</label>
                <input
                  className="rb-input"
                  value={editingRecipe.recipe_name}
                  onChange={(e) => setEditingRecipe((r) => ({ ...r, recipe_name: e.target.value }))}
                  required
                />
              </div>
              <div className="rb-field">
                <label className="rb-label">Cuisine</label>
                <input
                  className="rb-input"
                  value={editingRecipe.cuisine}
                  onChange={(e) => setEditingRecipe((r) => ({ ...r, cuisine: e.target.value }))}
                />
              </div>
              <div className="rb-field">
                <label className="rb-label">Diet Type</label>
                <input
                  className="rb-input"
                  value={editingRecipe.diet_type}
                  onChange={(e) => setEditingRecipe((r) => ({ ...r, diet_type: e.target.value }))}
                />
              </div>
              <div className="rb-field">
                <label className="rb-label">Calories (kcal)</label>
                <input
                  type="number"
                  className="rb-input"
                  value={editingRecipe.calories}
                  onChange={(e) => setEditingRecipe((r) => ({ ...r, calories: e.target.value }))}
                />
              </div>
            </div>

            <div className="rb-field">
              <label className="rb-label">Image URL</label>
              <input
                className="rb-input"
                value={editingRecipe.image_link}
                onChange={(e) => setEditingRecipe((r) => ({ ...r, image_link: e.target.value }))}
              />
            </div>

            <div className="rb-field">
              <label className="rb-label">Ingredients (one per line)</label>
              <textarea
                className="rb-textarea"
                value={editingRecipe.ingredient_list}
                onChange={(e) => setEditingRecipe((r) => ({ ...r, ingredient_list: e.target.value }))}
              />
            </div>

            <div className="rb-field">
              <label className="rb-label">Preparation Steps (one per line)</label>
              <textarea
                className="rb-textarea"
                value={editingRecipe.recipe_procedure}
                onChange={(e) => setEditingRecipe((r) => ({ ...r, recipe_procedure: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button type="button" className="rb-btn rb-btn-secondary" onClick={() => setEditingRecipe(null)}>
                Cancel
              </button>
              <button type="submit" className="rb-btn rb-btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
