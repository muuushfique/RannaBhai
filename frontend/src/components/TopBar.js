import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBasket, Bookmark, Sun, Moon, PlusCircle } from 'lucide-react';
import { useKitchen } from '../context/KitchenContext';

export default function TopBar() {
  const [quickQ, setQuickQ] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme, bookmarks, shoppingList, setDrawerOpen } = useKitchen();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!quickQ.trim()) return;
    navigate(`/search?q=${encodeURIComponent(quickQ.trim())}`);
    setQuickQ('');
  };

  return (
    <header className="rb-topbar">
      <form
        onSubmit={handleQuickSearch}
        style={{ position: 'relative', flex: '0 1 360px', minWidth: '180px' }}
      >
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
          }}
        />
        <input
          type="text"
          className="rb-input"
          value={quickQ}
          onChange={(e) => setQuickQ(e.target.value)}
          placeholder="Quick search recipes or ingredients..."
          style={{ paddingLeft: '2.2rem', paddingBlock: '0.46rem', borderRadius: '9999px', fontSize: '0.85rem' }}
        />
      </form>

      <div className="rb-topbar-actions">
        <Link
          to="/recipe?saved=1"
          className="rb-btn rb-btn-secondary rb-btn-sm"
          title="View your saved cookbook recipes"
        >
          <Bookmark size={14} color="var(--accent)" />
          <span>Saved ({bookmarks.length})</span>
        </Link>

        <button
          type="button"
          className="rb-btn rb-btn-secondary rb-btn-sm"
          onClick={() => setDrawerOpen(true)}
          title="Open persistent grocery cart"
        >
          <ShoppingBasket size={14} color="var(--sage)" />
          <span>Grocery Cart ({shoppingList.length})</span>
        </button>

        <Link to="/recipe-submit" className="rb-btn rb-btn-primary rb-btn-sm">
          <PlusCircle size={14} />
          <span>Submit Dish</span>
        </Link>

        <button
          type="button"
          className="rb-btn rb-btn-secondary rb-btn-sm"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Parchment Light Mode' : 'Switch to Midnight Espresso Dark Mode'}
          aria-label="Toggle color theme"
          style={{ paddingInline: '0.6rem' }}
        >
          {theme === 'dark' ? <Sun size={15} color="var(--gold)" /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
