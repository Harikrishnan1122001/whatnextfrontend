import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/live', label: 'Live Classes' },
  { to: '/notes', label: 'Notes' },
];

export default function Navbar({ onAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,11,20,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: 72, display: 'flex', alignItems: 'center',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32, width: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font2)', fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💻</div>
          <span style={{ background: 'linear-gradient(135deg,#fff 0%,var(--primary-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduPlatform</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                color: isActive(to) ? 'var(--text)' : 'var(--text2)',
                background: isActive(to) ? 'var(--surface)' : 'transparent',
                fontSize: '0.9rem', fontWeight: 500,
                transition: 'all 0.2s', textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {user ? (
            <div className="user-menu-wrap" ref={menuRef}>
              <button
                className="avatar-btn"
                onClick={() => setMenu(v => !v)}
                style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', color: '#fff' }}
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </button>
              {menu && (
                <div className="user-menu">
                  <div className="user-menu-name">{user.name}</div>
                  <div className="user-menu-email">{user.email}</div>
                  <Link className="user-menu-item" to="/dashboard" onClick={() => setMenu(false)}>📚 My Dashboard</Link>
                  {isAdmin && <Link className="user-menu-item" to="/admin" onClick={() => setMenu(false)}>⚙️ Admin Panel</Link>}
                  <hr className="user-menu-divider" />
                  <div className="user-menu-item" style={{ color: 'var(--accent)' }} onClick={() => { logout(); setMenu(false); }}>🚪 Logout</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={onAuth}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={onAuth}>Sign Up Free</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
