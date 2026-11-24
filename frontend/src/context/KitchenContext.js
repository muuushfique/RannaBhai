import React, { createContext, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X, ShoppingBasket, Trash2, Copy, Plus } from 'lucide-react';

const KitchenContext = createContext(null);

export function KitchenProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('rb_theme') || 'light');
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rb_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rb_shopping_list') || '[]');
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rb_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('rb_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('rb_shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  const notify = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const isBookmarked = (recipeId) => bookmarks.includes(String(recipeId));

  const toggleBookmark = (recipe) => {
    const id = String(recipe._id || recipe.id);
    const title = recipe.recipe_name || recipe.title || 'Recipe';
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        notify(`Removed "${title}" from Saved Cookbook`, 'info');
        return prev.filter((x) => x !== id);
      }
      notify(`Saved "${title}" to your Cookbook!`, 'success');
      return [...prev, id];
    });
  };

  const addToShoppingList = (items = [], sourceLabel = '') => {
    const clean = (Array.isArray(items) ? items : [items])
      .map((s) => String(s).trim())
      .filter(Boolean);
    if (!clean.length) return;

    setShoppingList((prev) => {
      const existingTexts = new Set(prev.map((p) => p.text.toLowerCase()));
      const additions = clean
        .filter((text) => !existingTexts.has(text.toLowerCase()))
        .map((text, idx) => ({
          id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          text,
          done: false,
          source: sourceLabel,
        }));
      return [...prev, ...additions];
    });
    notify(`Added ${clean.length} item${clean.length > 1 ? 's' : ''} to your Grocery Cart`, 'success');
  };

  const toggleShoppingItem = (id) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const removeShoppingItem = (id) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompletedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.done));
    notify('Cleared checked items', 'info');
  };

  const clearAllShopping = () => {
    setShoppingList([]);
    notify('Emptied grocery cart', 'info');
  };

  const copyShoppingList = () => {
    const text = shoppingList.map((i) => `${i.done ? '[x]' : '[ ]'} ${i.text}`).join('\n');
    navigator.clipboard?.writeText(text);
    notify('Copied grocery list to clipboard!', 'success');
  };

  return (
    <KitchenContext.Provider
      value={{
        theme,
        toggleTheme,
        bookmarks,
        isBookmarked,
        toggleBookmark,
        shoppingList,
        addToShoppingList,
        toggleShoppingItem,
        removeShoppingItem,
        clearCompletedShopping,
        clearAllShopping,
        drawerOpen,
        setDrawerOpen,
        notify,
      }}
    >
      {children}

      {/* Floating Animated Toast Stack */}
      <div className="rb-toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`rb-toast rb-toast-${t.type}`}>
            {t.type === 'error' ? (
              <AlertCircle size={17} />
            ) : t.type === 'info' ? (
              <Sparkles size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Global Slide-Over Grocery Cart Drawer */}
      {drawerOpen && (
        <>
          <div className="rb-overlay-backdrop" onClick={() => setDrawerOpen(false)} />
          <aside className="rb-drawer" aria-label="Persistent Grocery Cart">
            <div className="rb-drawer-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <ShoppingBasket size={20} color="var(--accent)" />
                <h2 className="serif" style={{ fontSize: '1.35rem' }}>
                  My Grocery Cart ({shoppingList.length})
                </h2>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close grocery cart">
                <X size={20} />
              </button>
            </div>

            <form
              className="rb-drawer-add"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newItemText.trim()) return;
                addToShoppingList([newItemText.trim()], 'Custom');
                setNewItemText('');
              }}
            >
              <input
                className="rb-input"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add custom grocery item (e.g., 1L Milk)..."
              />
              <button type="submit" className="rb-btn rb-btn-primary rb-btn-sm">
                <Plus size={15} /> Add
              </button>
            </form>

            <div className="rb-drawer-body">
              {shoppingList.length === 0 ? (
                <div className="rb-empty" style={{ marginTop: '1rem' }}>
                  Your grocery cart is empty. Add ingredients from any recipe or the Meal Planner!
                </div>
              ) : (
                shoppingList.map((item) => (
                  <div key={item.id} className={`rb-cart-row ${item.done ? 'done' : ''}`}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleShoppingItem(item.id)}
                        style={{ accentColor: 'var(--sage)', width: 16, height: 16 }}
                      />
                      <div>
                        <div style={{ textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</div>
                        {item.source && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>From: {item.source}</div>
                        )}
                      </div>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeShoppingItem(item.id)}
                      style={{ color: 'var(--muted)', padding: '0.25rem' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {shoppingList.length > 0 && (
              <div className="rb-drawer-foot">
                <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={copyShoppingList}>
                  <Copy size={14} /> Copy
                </button>
                <button type="button" className="rb-btn rb-btn-secondary rb-btn-sm" onClick={clearCompletedShopping}>
                  Clear Checked
                </button>
                <button type="button" className="rb-btn rb-btn-danger rb-btn-sm" onClick={clearAllShopping}>
                  <Trash2 size={14} /> Empty
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  return useContext(KitchenContext);
}
