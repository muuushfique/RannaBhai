import React, { useEffect, useState } from 'react';
import { Calendar, ShoppingBasket, RefreshCw, Copy, Check, CheckSquare, Square } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../services/api';

function buildGroceryList(plan) {
  const items = new Set();
  ['breakfast', 'lunch', 'dinner'].forEach((slot) => {
    const meal = plan[slot];
    if (!meal) return;
    const raw = `${meal.name} ${meal.description || ''}`;
    // Extract meaningful food phrases from meal name/description
    raw
      .split(/[,;&]|\band\b|\bwith\b/i)
      .map((s) => s.replace(/[.()]/g, '').trim())
      .filter((s) => s.length > 2 && s.length < 48)
      .forEach((s) => items.add(s));
  });
  return Array.from(items).slice(0, 12);
}

export default function MealPlanning() {
  const [meals, setMeals] = useState([]);
  const [targetCalories, setTargetCalories] = useState(1800);
  const [plan, setPlan] = useState(null);
  const [groceries, setGroceries] = useState([]);
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/meals')
      .then((res) => setMeals(res.data || []))
      .catch(() => setError('Could not load meals from the database.'))
      .finally(() => setLoading(false));
  }, []);

  const pickClosest = (list, target, randomize = false) => {
    if (!list.length) return null;
    if (randomize) {
      return list[Math.floor(Math.random() * list.length)];
    }
    return list.reduce((best, curr) =>
      Math.abs((curr.calories || 0) - target) < Math.abs((best.calories || 0) - target) ? curr : best
    );
  };

  const generatePlan = (randomize = false) => {
    const cal = Math.max(800, Number(targetCalories) || 1800);
    const breakfasts = meals.filter((m) => m.category === 'Breakfast');
    const lunches = meals.filter((m) => m.category === 'Lunch');
    const dinners = meals.filter((m) => m.category === 'Dinner');

    const breakfast = pickClosest(breakfasts, cal * 0.28, randomize);
    const lunch = pickClosest(lunches, cal * 0.4, randomize);
    const dinner = pickClosest(dinners, cal * 0.32, randomize);

    const nextPlan = { breakfast, lunch, dinner };
    setPlan(nextPlan);
    setGroceries(buildGroceryList(nextPlan));
    setChecked({});
  };

  const totalCalories = plan
    ? (plan.breakfast?.calories || 0) + (plan.lunch?.calories || 0) + (plan.dinner?.calories || 0)
    : 0;

  const copyGroceries = () => {
    navigator.clipboard?.writeText(groceries.map((g) => `- ${g}`).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Smart Kitchen Tool</div>
          <h1 className="rb-title">Meal Planner & Grocery List</h1>
          <p className="rb-subtitle">
            Set your daily calorie goal to generate a balanced Breakfast, Lunch, and Dinner plan along with an instant shopping checklist.
          </p>
        </div>
      </div>

      {error && <div className="rb-alert rb-alert-error">{error}</div>}

      <div className="rb-card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="rb-field" style={{ flex: 1, minWidth: '220px', marginBottom: 0 }}>
            <label className="rb-label">Daily Calorie Target (kcal)</label>
            <input
              type="number"
              min="800"
              max="4500"
              step="50"
              className="rb-input"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="rb-btn rb-btn-primary"
            disabled={loading || meals.length === 0}
            onClick={() => generatePlan(false)}
          >
            <Calendar size={16} /> Generate Optimal Plan
          </button>
          <button
            type="button"
            className="rb-btn rb-btn-secondary"
            disabled={loading || meals.length === 0}
            onClick={() => generatePlan(true)}
          >
            <RefreshCw size={15} /> Shuffle Meals
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading meal options...</div>
      ) : !plan ? (
        <div className="rb-empty">
          Choose your calorie target above and click <strong>Generate Optimal Plan</strong> to build today’s menu and grocery checklist.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Today’s Recommended Plan</h2>
            <span className="rb-badge rb-badge-sage" style={{ fontSize: '0.86rem', padding: '0.4rem 0.9rem' }}>
              Total: {totalCalories} kcal (Target: {targetCalories} kcal)
            </span>
          </div>

          <div className="rb-grid-3" style={{ marginBottom: '2rem' }}>
            {[
              { key: 'breakfast', label: 'Breakfast' },
              { key: 'lunch', label: 'Lunch' },
              { key: 'dinner', label: 'Dinner' },
            ].map(({ key, label }) => {
              const meal = plan[key];
              return (
                <article key={key} className="rb-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="rb-badge rb-badge-accent">{label}</span>
                    {meal && <span className="rb-badge">{meal.calories} kcal</span>}
                  </div>
                  {meal ? (
                    <>
                      <img
                        src={meal.image || getRecipeFallbackImage(meal.name)}
                        alt={meal.name}
                        onError={(e) => {
                          e.currentTarget.src = getRecipeFallbackImage(meal.name);
                        }}
                        className="rb-recipe-img"
                      />
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{meal.name}</h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>{meal.description}</p>
                    </>
                  ) : (
                    <p style={{ color: 'var(--muted)' }}>No {label.toLowerCase()} meals configured yet.</p>
                  )}
                </article>
              );
            })}
          </div>

          <section className="rb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBasket size={20} color="var(--accent)" />
                <h2 style={{ fontSize: '1.4rem' }}>Auto-Generated Grocery Checklist</h2>
              </div>
              <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={copyGroceries}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy List'}
              </button>
            </div>

            <div className="rb-grid-3">
              {groceries.map((item, idx) => {
                const isDone = Boolean(checked[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChecked((c) => ({ ...c, [idx]: !c[idx] }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isDone ? 'var(--sage-soft)' : 'var(--surface-soft)',
                      textAlign: 'left',
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--sage)' : 'var(--ink)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {isDone ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
