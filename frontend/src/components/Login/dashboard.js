import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flag, LogIn } from 'lucide-react';
import api, { getRecipeFallbackImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user, isLoggedIn } = useAuth();
  const [liked, setLiked] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    Promise.all([
      api.get('/api/user/liked-recipes').catch(() => ({ data: [] })),
      api.get('/api/user/reported-issues').catch(() => ({ data: [] })),
    ])
      .then(([likedRes, repRes]) => {
        setLiked(likedRes.data || []);
        setReports(repRes.data || []);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="rb-page">
        <div className="rb-card" style={{ maxWidth: '520px', margin: '2rem auto', textAlign: 'center', padding: '2.5rem' }}>
          <h1 className="rb-title" style={{ fontSize: '1.9rem', marginBottom: '0.5rem' }}>Your Kitchen Dashboard</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
            Log in to see your liked recipes and track any recipe issues you’ve reported.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="rb-btn rb-btn-primary">
              <LogIn size={15} /> Log In
            </Link>
            <Link to="/signup" className="rb-btn rb-btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Personal Kitchen</div>
          <h1 className="rb-title">Welcome, {user.username}</h1>
          <p className="rb-subtitle">{user.email}</p>
        </div>
      </div>

      {loading ? (
        <div className="rb-empty">Loading your activity...</div>
      ) : (
        <div className="rb-grid-2">
          <section className="rb-card">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={18} color="var(--accent)" /> Liked Recipes ({liked.length})
            </h2>
            {liked.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>
                You haven’t liked any recipes yet. Visit <Link to="/recipe" style={{ color: 'var(--accent)', fontWeight: 600 }}>All Recipes</Link> to save your favorites!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {liked.map((r) => (
                  <Link
                    key={r._id}
                    to={`/RecipeDetails/${r._id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}
                  >
                    <img
                      src={r.image_link || getRecipeFallbackImage(r.recipe_name)}
                      alt={r.recipe_name}
                      style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <div>
                      <strong>{r.recipe_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{r.cuisine} · {r.calories} kcal</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rb-card">
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flag size={18} color="var(--gold)" /> Reported Issues ({reports.length})
            </h2>
            {reports.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No recipe issues reported by your account.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reports.map((rep) => (
                  <div key={rep._id} style={{ padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-soft)' }}>
                    <strong>{rep.recipeName}</strong>
                    <p style={{ fontSize: '0.86rem', color: 'var(--muted)', marginTop: '0.2rem' }}>{rep.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
