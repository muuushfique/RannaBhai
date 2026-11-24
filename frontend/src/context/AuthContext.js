import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('rb_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('rb_token') || '');

  useEffect(() => {
    if (!token) return;
    api
      .get('/api/user/me')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('rb_user', JSON.stringify(res.data));
      })
      .catch(() => {
        logout();
      });
  }, [token]);

  const loginSuccess = (newToken, newUser) => {
    localStorage.setItem('rb_token', newToken);
    localStorage.setItem('rb_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('rb_token');
    localStorage.removeItem('rb_user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: Boolean(token && user), loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
