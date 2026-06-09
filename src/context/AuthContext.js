import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(d => {
          if (d.success) setUser(d.data || d.user);
          else logout();
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]); // eslint-disable-line

  const login = async (email, password) => {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json();
    if (d.success) {
      setToken(d.token);
      localStorage.setItem('token', d.token);
      setUser(d.user || d.data);
    }
    return d;
  };

  const register = async (name, email, password) => {
    const r = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const d = await r.json();
    if (d.success) {
      setToken(d.token);
      localStorage.setItem('token', d.token);
      setUser(d.user || d.data);
    }
    return d;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const authFetch = useCallback(
    async (url, opts = {}) => {
      const isFormData = opts.body instanceof FormData;
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(opts.headers || {}),
      };
      const r = await fetch(`${API_BASE}${url}`, { ...opts, headers });
      return r.json();
    },
    [token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        authFetch,
        isAdmin: user?.role === 'admin',
        API_BASE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
