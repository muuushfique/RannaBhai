import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';

export default function BMI() {
  const [unit, setUnit] = useState('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = (e) => {
    e.preventDefault();
    setError('');
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) {
      setError('Please enter valid positive numbers for both weight and height.');
      return;
    }

    let bmi = 0;
    let heightM = 0;
    if (unit === 'metric') {
      heightM = h / 100;
      bmi = w / (heightM * heightM);
    } else {
      heightM = h * 0.0254;
      bmi = (w / (h * h)) * 703;
    }

    const rounded = Number(bmi.toFixed(1));
    let category = 'Healthy Weight';
    let badge = 'rb-badge-sage';
    let tip = 'Great balance! Maintain steady energy with wholesome meals from the Meal Planner.';
    let suggestedCalories = 2000;

    if (rounded < 18.5) {
      category = 'Underweight';
      badge = 'rb-badge-gold';
      tip = 'Consider nutrient-dense, protein-rich recipes to reach a healthy weight range.';
      suggestedCalories = 2400;
    } else if (rounded >= 25 && rounded < 30) {
      category = 'Overweight';
      badge = 'rb-badge-accent';
      tip = 'Focus on high-fiber, balanced meals and modest calorie targets.';
      suggestedCalories = 1700;
    } else if (rounded >= 30) {
      category = 'Obese';
      badge = 'rb-badge-accent';
      tip = 'Prioritize whole foods, portion clarity, and check our Health Recommendations guide.';
      suggestedCalories = 1550;
    }

    const minHealthyKg = (18.5 * heightM * heightM).toFixed(1);
    const maxHealthyKg = (24.9 * heightM * heightM).toFixed(1);

    setResult({ bmi: rounded, category, badge, tip, suggestedCalories, minHealthyKg, maxHealthyKg });
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Wellness Calculator</div>
          <h1 className="rb-title">BMI & Calorie Guide</h1>
          <p className="rb-subtitle">
            Calculate your Body Mass Index in metric or imperial units with tailored daily calorie suggestions.
          </p>
        </div>
      </div>

      <div className="rb-grid-2">
        <form className="rb-card" onSubmit={calculate}>
          <div className="rb-tabs">
            <button type="button" className={`rb-tab ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>
              Metric (kg / cm)
            </button>
            <button type="button" className={`rb-tab ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>
              Imperial (lbs / in)
            </button>
          </div>

          {error && <div className="rb-alert rb-alert-error">{error}</div>}

          <div className="rb-field">
            <label className="rb-label">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input
              type="number"
              step="0.1"
              className="rb-input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
              required
            />
          </div>

          <div className="rb-field">
            <label className="rb-label">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input
              type="number"
              step="0.1"
              className="rb-input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
              required
            />
          </div>

          <button type="submit" className="rb-btn rb-btn-primary">
            <Calculator size={16} /> Calculate BMI
          </button>
        </form>

        <div className="rb-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!result ? (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              Enter your measurements on the left to see your BMI breakdown, healthy weight range, and suggested meal plan calories.
            </div>
          ) : (
            <div>
              <span className={`rb-badge ${result.badge}`} style={{ marginBottom: '0.75rem' }}>
                {result.category}
              </span>
              <div className="serif" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1 }}>
                {result.bmi}
              </div>
              <p style={{ color: 'var(--muted)', marginBlock: '0.9rem 1.25rem' }}>{result.tip}</p>

              <div className="rb-grid-2" style={{ marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>HEALTHY WEIGHT RANGE</div>
                  <strong>{result.minHealthyKg} – {result.maxHealthyKg} kg</strong>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>SUGGESTED TARGET</div>
                  <strong>~{result.suggestedCalories} kcal / day</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link to="/meal-planning" className="rb-btn rb-btn-primary rb-btn-sm">
                  Open Meal Planner <ArrowRight size={14} />
                </Link>
                <Link to="/healthrecommendations" className="rb-btn rb-btn-secondary rb-btn-sm">
                  Health Practices
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
