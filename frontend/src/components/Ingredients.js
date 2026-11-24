import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft, Plus, Minus, Search } from 'lucide-react';
import api, { normalizeNutrition } from '../services/api';

export default function Ingredients() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [calcMode, setCalcMode] = useState(false);
  const [basket, setBasket] = useState({});

  useEffect(() => {
    api
      .get('/Ingredients')
      .then((res) => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const catOk = category === 'all' || String(item.category || '').toLowerCase() === category;
    const qOk = !query.trim() || String(item.ingredient || '').toLowerCase().includes(query.toLowerCase());
    return catOk && qOk;
  });

  const adjustQty = (id, delta) => {
    setBasket((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const totals = Object.entries(basket).reduce(
    (acc, [id, qty]) => {
      const found = items.find((i) => String(i.id) === String(id) || String(i._id) === String(id));
      if (!found?.nutrition) return acc;
      const n = normalizeNutrition(found.nutrition);
      acc.calories += n.calories * qty;
      acc.protein += n.protein * qty;
      acc.carbs += n.carbs * qty;
      acc.fat += n.fat * qty;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Nutrition Lab</div>
          <h1 className="rb-title">{calcMode ? 'Meal Nutrition Calculator' : 'Ingredients Directory'}</h1>
          <p className="rb-subtitle">
            {calcMode
              ? 'Add ingredient servings to calculate total calories, protein, carbs, and fats.'
              : 'Explore macro breakdowns for 37+ ingredients and see recipes that use each one.'}
          </p>
        </div>
        <button
          type="button"
          className={`rb-btn ${calcMode ? 'rb-btn-secondary' : 'rb-btn-primary'}`}
          onClick={() => setCalcMode((c) => !c)}
        >
          {calcMode ? (
            <>
              <ArrowLeft size={15} /> Back to Directory
            </>
          ) : (
            <>
              <Calculator size={15} /> Open Nutrition Calculator
            </>
          )}
        </button>
      </div>

      {calcMode && (
        <div className="rb-card" style={{ marginBottom: '1.5rem', background: 'var(--sidebar)', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#fff' }}>Selected Basket Totals</h2>
            {Object.keys(basket).length > 0 && (
              <button
                type="button"
                className="rb-btn rb-btn-secondary rb-btn-sm"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => setBasket({})}
              >
                Clear Basket
              </button>
            )}
          </div>
          <div className="rb-grid-4">
            <div>
              <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>CALORIES</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#f3b778' }}>{totals.calories.toFixed(0)} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>PROTEIN</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{totals.protein.toFixed(1)} g</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>CARBS</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{totals.carbs.toFixed(1)} g</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', opacity: 0.7 }}>FAT</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700 }}>{totals.fat.toFixed(1)} g</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="rb-tabs" style={{ marginBottom: 0 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'veg', label: 'Veg' },
            { id: 'non-veg', label: 'Non-Veg' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`rb-tab ${category === tab.id ? 'active' : ''}`}
              onClick={() => setCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px', flex: '0 1 320px' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            className="rb-input"
            style={{ paddingLeft: '2.2rem' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter ingredients..."
          />
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading ingredients...</div>
      ) : (
        <div className="rb-grid-3">
          {filtered.map((item) => {
            const qty = basket[item.id] || 0;
            return (
              <div key={item._id} className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`rb-badge ${String(item.category).toLowerCase() === 'veg' ? 'rb-badge-sage' : 'rb-badge-accent'}`}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent)' }}>
                    {item.nutrition?.calories ?? 0} kcal
                  </span>
                </div>

                <Link to={`/ingredient/${item.id}`}>
                  <h3 style={{ fontSize: '1.18rem' }}>{item.ingredient}</h3>
                </Link>

                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {(() => {
                    const n = normalizeNutrition(item.nutrition);
                    return `Protein ${n.protein}g · Carbs ${n.carbs}g · Fat ${n.fat}g`;
                  })()}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {calcMode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={() => adjustQty(item.id, -1)}>
                        <Minus size={13} />
                      </button>
                      <strong>{qty}x</strong>
                      <button type="button" className="rb-btn rb-btn-primary rb-btn-sm" onClick={() => adjustQty(item.id, 1)}>
                        <Plus size={13} />
                      </button>
                    </div>
                  ) : (
                    <Link to={`/ingredient/${item.id}`} className="rb-btn rb-btn-secondary rb-btn-sm">
                      Nutrition & Recipes →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
