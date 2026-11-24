import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Utensils,
  Flame,
  Sparkles,
  Search,
  Shuffle,
  Calendar,
  Apple,
  Calculator,
  Gamepad2,
  MapPin,
  HeartPulse,
  BookOpen,
  PlusCircle,
  Flag,
  LayoutDashboard,
  ShieldCheck,
  Info,
  HelpCircle,
  Mail,
  LogIn,
  LogOut,
  Menu,
  X,
  ChefHat,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    title: 'Discover',
    items: [
      { to: '/', label: 'Home', icon: Home, end: true },
      { to: '/recipe', label: 'All Recipes', icon: Utensils },
      { to: '/recipe-of-the-day', label: 'Recipe of the Day', icon: Sparkles },
      { to: '/trending-recipe', label: 'Trending', icon: Flame },
      { to: '/search', label: 'Smart Search', icon: Search },
      { to: '/spoonacular', label: 'Pantry Match', icon: ChefHat },
      { to: '/random-recipe', label: 'Surprise Me', icon: Shuffle },
    ],
  },
  {
    title: 'Kitchen Tools',
    items: [
      { to: '/meal-planning', label: 'Meal Planner & Grocery', icon: Calendar },
      { to: '/ingredients', label: 'Ingredients & Nutrition', icon: Apple },
      { to: '/bmi', label: 'BMI Calculator', icon: Calculator },
      { to: '/trivia', label: 'Food Trivia Game', icon: Gamepad2 },
      { to: '/near-me', label: 'Stores Near Me', icon: MapPin },
    ],
  },
  {
    title: 'Knowledge & Community',
    items: [
      { to: '/healthrecommendations', label: 'Health Practices', icon: HeartPulse },
      { to: '/glossary', label: 'Cooking Glossary', icon: BookOpen },
      { to: '/recipe-submit', label: 'Submit Recipe', icon: PlusCircle },
      { to: '/report', label: 'Report Issue', icon: Flag },
    ],
  },
  {
    title: 'Manage & Info',
    items: [
      { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      { to: '/admin-panel', label: 'Admin Studio', icon: ShieldCheck },
      { to: '/about-us', label: 'About Us', icon: Info },
      { to: '/faq', label: 'FAQ', icon: HelpCircle },
      { to: '/contact-us', label: 'Contact', icon: Mail },
    ],
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="rb-mobile-bar">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img
            src="/RannaBhai.png"
            alt="RannaBhai"
            style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', padding: 2 }}
          />
          <span className="serif" style={{ fontWeight: 700, fontSize: '1.15rem' }}>
            RannaBhai
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          style={{ color: '#fff', padding: '0.35rem' }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && <div className="rb-overlay-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`rb-sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <Link to="/" className="rb-brand" onClick={() => setOpen(false)}>
          <img src="/RannaBhai.png" alt="RannaBhai logo" />
          <div>
            <div className="rb-brand-title">RannaBhai</div>
            <div className="rb-brand-sub">Culinary Studio</div>
          </div>
        </Link>

        <nav className="rb-nav-scroll">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="rb-nav-group-title">{group.title}</div>
              <div className="rb-nav-list">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => `rb-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="rb-sidebar-footer">
          {isLoggedIn ? (
            <>
              <div style={{ fontSize: '0.82rem', color: 'rgba(243,236,228,0.85)', paddingInline: '0.25rem' }}>
                Signed in as <strong>{user.username}</strong>
              </div>
              <button
                type="button"
                className="rb-btn rb-btn-secondary rb-btn-sm"
                style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}
                onClick={handleLogout}
              >
                <LogOut size={15} /> Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rb-btn rb-btn-primary rb-btn-sm"
                style={{ flex: 1 }}
              >
                <LogIn size={14} /> Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="rb-btn rb-btn-secondary rb-btn-sm"
                style={{ flex: 1, background: 'rgba(255,255,255,0.08)', color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
