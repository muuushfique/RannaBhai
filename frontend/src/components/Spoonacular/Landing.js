import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Shuffle, ArrowRight } from 'lucide-react';

export default function SpoonacularLanding() {
  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Smart Discovery</div>
          <h1 className="rb-title">Pantry & Random Explorer</h1>
          <p className="rb-subtitle">
            Match recipes to the exact ingredients in your kitchen or roll the dice for spontaneous culinary inspiration.
          </p>
        </div>
      </div>

      <div className="rb-grid-2">
        <Link to="/spoonacular" className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <ChefHat size={32} color="var(--accent)" />
          <h2 style={{ fontSize: '1.5rem' }}>Pantry Ingredient Match</h2>
          <p style={{ color: 'var(--muted)' }}>
            Enter comma-separated ingredients you already have on hand and get instant recipe suggestions.
          </p>
          <span style={{ color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            Open Pantry Match <ArrowRight size={15} />
          </span>
        </Link>

        <Link to="/random-recipe" className="rb-card rb-card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Shuffle size={32} color="var(--sage)" />
          <h2 style={{ fontSize: '1.5rem' }}>Surprise Me (Random Dish)</h2>
          <p style={{ color: 'var(--muted)' }}>
            Can’t decide what to cook tonight? Pull a curated random recipe with full ingredients and steps.
          </p>
          <span style={{ color: 'var(--sage)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            Generate Random Recipe <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </div>
  );
}
