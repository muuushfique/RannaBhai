import React, { useEffect, useState } from 'react';
import { Calendar, ShoppingBasket, RefreshCw, Copy, Check, CheckSquare, Square } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../services/api';
import { useKitchen } from '../context/KitchenContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function buildGroceryList(plan) {
  const items = new Set();
  ['breakfast', 'lunch', 'dinner'].forEach((slot) => {
    const meal = plan[slot];
    if (!meal) return;
    const raw = `${meal.name} ${meal.description || ''}`;
    raw
      .split(/[,;&]|\band\b|\bwith\b/i)
      .map((s) => s.replace(/[.()]/g, '').trim())
      .filter((s) => s.length > 2 && s.length < 48)
      .forEach((s) => items.add(s));
  });
  return Array.from(items).slice(0, 14);
}

export default function MealPlanning() {
  const [meals, setMeals] = useState([]);
  const [mode, setMode] = useState('daily'); // 'daily' | 'weekly'
  const [targetCalories, setTargetCalories] = useState(1800);
  const [plan, setPlan] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToShoppingList, setDrawerOpen } = useKitchen();

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

    if (mode === 'weekly') {
      const week = DAYS.map((day, idx) => ({
        day,
        breakfast: breakfasts[(idx + (randomize ? Math.floor(Math.random() * 5) : 0)) % Math.max(1, breakfasts.length)],
        lunch: lunches[(idx + (randomize ? Math.floor(Math.random() * 5) : 0)) % Math.max(1, lunches.length)],
        dinner: dinners[(idx + (randomize ? Math.floor(Math.random() * 5) : 0)) % Math.max(1, dinners.length)],
      }));
      setWeeklyPlan(week);
      const allGroc = new Set();
      week.forEach((d) => buildGroceryList(d).forEach((g) => allGroc.add(g)));
      setGroceries(Array.from(allGroc).slice(0, 18));
      setChecked({});
      return;
    }

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
            Generate a daily calorie-matched menu or a full 7-day weekly schedule with one-click export to your persistent Grocery Cart.
          </p>
        </div>
        <div className="rb-tabs" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`rb-tab ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => setMode('daily')}
          >
            Daily Plan
          </button>
          <button
            type="button"
            className={`rb-tab ${mode === 'weekly' ? 'active' : ''}`}
            onClick={() => setMode('weekly')}
          >
            7-Day Weekly Schedule
          </button>
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
            <Calendar size={16} /> Generate {mode === 'weekly' ? '7-Day Schedule' : 'Optimal Plan'}
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
        <div className="rb-grid-3">
          <div className="rb-skeleton" />
          <div className="rb-skeleton" />
          <div className="rb-skeleton" />
        </div>
      ) : mode === 'daily' && !plan ? (
        <div className="rb-empty">
          Choose your calorie target above and click <strong>Generate Optimal Plan</strong> to build today’s menu and grocery checklist.
        </div>
      ) : mode === 'weekly' && weeklyPlan.length === 0 ? (
        <div className="rb-empty">
          Click <strong>Generate 7-Day Schedule</strong> above to plan Monday through Sunday in one click.
        </div>
      ) : (
        <>
          {mode === 'daily' && plan && (
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
            </>
          )}

          {mode === 'weekly' && weeklyPlan.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
              {weeklyPlan.map((d) => {
                const dayCal =
                  (d.breakfast?.calories || 0) + (d.lunch?.calories || 0) + (d.dinner?.calories || 0);
                return (
                  <div key={d.day} className="rb-card" style={{ padding: '1.15rem 1.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <strong className="serif" style={{ fontSize: '1.2rem' }}>{d.day}</strong>
                      <span className="rb-badge rb-badge-sage">{dayCal} kcal</span>
                    </div>
                    <div className="rb-grid-3">
                      {['breakfast', 'lunch', 'dinner'].map((slot) => (
                        <div key={slot} style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)' }}>
                            {slot} ({d[slot]?.calories || 0} kcal)
                          </div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.2rem' }}>
                            {d[slot]?.name || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <section className="rb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBasket size={20} color="var(--accent)" />
                <h2 style={{ fontSize: '1.4rem' }}>Auto-Generated Grocery Checklist</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="rb-btn rb-btn-sage rb-btn-sm"
                  onClick={() => {
                    addToShoppingList(groceries, mode === 'weekly' ? '7-Day Meal Plan' : 'Daily Meal Plan');
                    setDrawerOpen(true);
                  }}
                >
                  <ShoppingBasket size={14} /> Send All to Grocery Cart
                </button>
                <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={copyGroceries}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy List'}
                </button>
              </div>
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
