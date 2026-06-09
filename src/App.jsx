import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const API_BASE = "http://localhost:5000/api";

// ─────────────────────────────────────────────
// AUTH CONTEXT
// ─────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.success) setUser(d.data || d.user); else logout(); })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const r = await fetch(`${API_BASE}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const d = await r.json();
    if (d.success) { setToken(d.token); localStorage.setItem("token", d.token); setUser(d.user || d.data); }
    return d;
  };

  const register = async (name, email, password) => {
    const r = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const d = await r.json();
    if (d.success) { setToken(d.token); localStorage.setItem("token", d.token); setUser(d.user || d.data); }
    return d;
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem("token"); };

  const authFetch = useCallback((url, opts = {}) => {
    return fetch(`${API_BASE}${url}`, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) }
    }).then(r => r.json());
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0b14;
    --bg2: #11132a;
    --bg3: #181b35;
    --surface: #1e2245;
    --surface2: #252a52;
    --primary: #6c63ff;
    --primary-light: #8b85ff;
    --primary-glow: rgba(108,99,255,0.25);
    --accent: #ff6b6b;
    --accent2: #ffd93d;
    --green: #6bcb77;
    --cyan: #4ecdc4;
    --text: #f0f2ff;
    --text2: #9ba3c8;
    --text3: #6b7280;
    --border: rgba(108,99,255,0.2);
    --radius: 14px;
    --radius-sm: 8px;
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
    --font: 'Plus Jakarta Sans', sans-serif;
    --font2: 'Space Grotesk', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: var(--font); border: none; outline: none; }
  input, textarea, select { font-family: var(--font); }
  img { max-width: 100%; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }

  /* Layout */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .page { min-height: 100vh; padding-top: 72px; }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,11,20,0.92); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    height: 72px; display: flex; align-items: center;
  }
  .navbar .inner { display: flex; align-items: center; gap: 32px; width: 100%; }
  .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font2); font-size: 1.4rem; font-weight: 700; }
  .logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .logo-text { background: linear-gradient(135deg, #fff 0%, var(--primary-light) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links { display: flex; gap: 4px; flex: 1; }
  .nav-link { padding: 8px 16px; border-radius: var(--radius-sm); color: var(--text2); font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
  .nav-link:hover, .nav-link.active { background: var(--surface); color: var(--text); }
  .nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .avatar-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; cursor: pointer; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600; transition: all 0.2s; }
  .btn-primary { background: var(--primary); color: #fff; }
  .btn-primary:hover { background: var(--primary-light); transform: translateY(-1px); box-shadow: 0 4px 20px var(--primary-glow); }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .btn-sm { padding: 7px 14px; font-size: 0.82rem; }
  .btn-lg { padding: 14px 32px; font-size: 1rem; border-radius: var(--radius); }
  .btn-accent { background: var(--accent); color: #fff; }
  .btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-green { background: var(--green); color: #0a0b14; }
  .btn-danger { background: #ef4444; color: #fff; }

  /* Cards */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: all 0.25s; }
  .card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: var(--shadow), 0 0 0 1px var(--primary-glow); }
  .card-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text3); }
  .card-body { padding: 16px; }
  .card-title { font-size: 1rem; font-weight: 700; margin-bottom: 6px; line-height: 1.4; }
  .card-desc { font-size: 0.83rem; color: var(--text2); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .badge-primary { background: rgba(108,99,255,0.2); color: var(--primary-light); }
  .badge-accent { background: rgba(255,107,107,0.2); color: #ff8a8a; }
  .badge-green { background: rgba(107,203,119,0.2); color: var(--green); }
  .badge-yellow { background: rgba(255,217,61,0.2); color: var(--accent2); }
  .badge-cyan { background: rgba(78,205,196,0.2); color: var(--cyan); }
  .price { font-size: 1.15rem; font-weight: 800; color: var(--primary-light); }
  .price-free { color: var(--green); }
  .price-old { font-size: 0.82rem; color: var(--text3); text-decoration: line-through; margin-left: 4px; }

  /* Grid */
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }

  /* Hero */
  .hero { padding: 80px 0 60px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%); pointer-events: none; }
  .hero::after { content: ''; position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%); pointer-events: none; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 6px 16px; font-size: 0.82rem; color: var(--text2); margin-bottom: 28px; }
  .hero-title { font-family: var(--font2); font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 700; line-height: 1.15; margin-bottom: 20px; }
  .hero-title .hl { color: var(--primary-light); }
  .hero-sub { font-size: 1.1rem; color: var(--text2); max-width: 560px; line-height: 1.7; margin-bottom: 36px; }
  .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .hero-stats { display: flex; gap: 40px; margin-top: 56px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; }
  .stat-num { font-family: var(--font2); font-size: 2rem; font-weight: 700; color: var(--text); }
  .stat-label { font-size: 0.82rem; color: var(--text2); margin-top: 2px; }

  /* Section */
  .section { padding: 56px 0; }
  .section-header { margin-bottom: 36px; }
  .section-eyebrow { font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary-light); margin-bottom: 10px; }
  .section-title { font-family: var(--font2); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; }
  .section-sub { color: var(--text2); margin-top: 10px; font-size: 0.95rem; max-width: 600px; line-height: 1.6; }

  /* Form */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 0.83rem; font-weight: 600; color: var(--text2); margin-bottom: 7px; }
  .form-input { width: 100%; padding: 11px 14px; background: var(--bg3); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 0.9rem; transition: border-color 0.2s; }
  .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
  .form-input::placeholder { color: var(--text3); }
  .form-error { font-size: 0.78rem; color: #ff6b6b; margin-top: 5px; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 36px; max-width: 440px; width: 100%; position: relative; box-shadow: var(--shadow); }
  .modal-close { position: absolute; top: 16px; right: 16px; background: var(--surface); border: none; color: var(--text2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; }
  .modal-close:hover { color: var(--text); }
  .modal-title { font-family: var(--font2); font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; }
  .modal-sub { color: var(--text2); font-size: 0.88rem; margin-bottom: 28px; }

  /* Toast */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
  .toast { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 18px; font-size: 0.88rem; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease; min-width: 260px; }
  .toast.success { border-color: var(--green); }
  .toast.error { border-color: var(--accent); }
  @keyframes slideIn { from { opacity:0; transform: translateX(30px); } to { opacity:1; transform: translateX(0); } }

  /* Loading */
  .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 60px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Tabs */
  .tabs { display: flex; gap: 4px; background: var(--surface); border-radius: var(--radius-sm); padding: 4px; margin-bottom: 28px; }
  .tab { flex: 1; padding: 9px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; color: var(--text2); background: transparent; border: none; cursor: pointer; transition: all 0.2s; text-align: center; }
  .tab.active { background: var(--primary); color: #fff; }

  /* Tags */
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { padding: 4px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; font-size: 0.78rem; color: var(--text2); cursor: pointer; transition: all 0.2s; }
  .tag:hover, .tag.active { border-color: var(--primary); color: var(--primary-light); background: rgba(108,99,255,0.1); }

  /* Detail page */
  .detail-header { background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%); border-bottom: 1px solid var(--border); padding: 48px 0; }
  .detail-breadcrumb { font-size: 0.82rem; color: var(--text3); margin-bottom: 16px; cursor: pointer; }
  .detail-breadcrumb span { color: var(--text2); }
  .detail-title { font-family: var(--font2); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; }
  .detail-meta-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; color: var(--text2); font-size: 0.85rem; margin-bottom: 20px; }
  .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; padding: 40px 0; align-items: start; }
  .detail-sidebar { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; position: sticky; top: 90px; }
  .sidebar-price { font-family: var(--font2); font-size: 2rem; font-weight: 800; color: var(--primary-light); margin-bottom: 4px; }
  .sidebar-price-old { font-size: 0.9rem; color: var(--text3); text-decoration: line-through; margin-bottom: 16px; }
  .sidebar-btn { width: 100%; margin-bottom: 10px; justify-content: center; }
  .sidebar-features { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
  .sidebar-feature { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text2); }
  .sidebar-feature .icon { font-size: 1rem; }

  /* Video list */
  .video-list { display: flex; flex-direction: column; gap: 6px; }
  .video-item { display: flex; align-items: center; gap: 14px; padding: 12px 14px; background: var(--surface); border: 1px solid transparent; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
  .video-item:hover { border-color: var(--border); background: var(--surface2); }
  .video-item.locked { opacity: 0.6; cursor: not-allowed; }
  .video-num { width: 28px; height: 28px; background: var(--bg3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--text2); flex-shrink: 0; }
  .video-info { flex: 1; min-width: 0; }
  .video-title-text { font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .video-dur { font-size: 0.75rem; color: var(--text3); margin-top: 2px; }

  /* Admin */
  .admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 0; min-height: calc(100vh - 72px); }
  .admin-sidebar { background: var(--bg2); border-right: 1px solid var(--border); padding: 24px 0; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: var(--text2); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border-left: 3px solid transparent; }
  .admin-nav-item:hover { color: var(--text); background: var(--surface); }
  .admin-nav-item.active { color: var(--primary-light); border-left-color: var(--primary); background: rgba(108,99,255,0.08); }
  .admin-nav-icon { font-size: 1.1rem; }
  .admin-content { padding: 32px; background: var(--bg); }
  .admin-header { margin-bottom: 28px; }
  .admin-title { font-family: var(--font2); font-size: 1.6rem; font-weight: 700; margin-bottom: 4px; }
  .admin-sub { color: var(--text2); font-size: 0.88rem; }

  /* Stats cards */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .stat-card-icon { font-size: 1.8rem; margin-bottom: 12px; }
  .stat-card-num { font-family: var(--font2); font-size: 1.8rem; font-weight: 700; }
  .stat-card-label { font-size: 0.8rem; color: var(--text2); margin-top: 2px; }

  /* Table */
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--bg3); padding: 12px 16px; text-align: left; font-size: 0.78rem; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
  td { padding: 13px 16px; font-size: 0.87rem; border-bottom: 1px solid rgba(108,99,255,0.08); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(108,99,255,0.04); }

  /* Misc */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-state .icon { font-size: 4rem; margin-bottom: 16px; }
  .empty-state p { font-size: 0.9rem; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
  .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; margin-bottom: 28px; }
  .search-bar input { flex: 1; background: none; border: none; color: var(--text); font-size: 0.9rem; outline: none; }
  .search-bar input::placeholder { color: var(--text3); }
  .search-icon { color: var(--text3); font-size: 1rem; }
  .progress-bar-wrap { width: 100%; background: var(--bg3); border-radius: 4px; height: 6px; overflow: hidden; }
  .progress-bar { height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.4s; }

  /* Responsive */
  @media (max-width: 900px) {
    .detail-layout { grid-template-columns: 1fr; }
    .admin-layout { grid-template-columns: 1fr; }
    .admin-sidebar { display: none; }
    .nav-links { display: none; }
    .hero-stats { gap: 24px; }
    .hero { padding: 48px 0 40px; }
  }
  @media (max-width: 600px) {
    .grid-3, .grid-2 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .modal { padding: 24px; }
  }

  /* COURSE mascot strip */
  .mascot-strip { display: flex; gap: 20px; padding: 20px 0; overflow-x: auto; scrollbar-width: none; }
  .mascot-strip::-webkit-scrollbar { display: none; }
  .mascot-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; min-width: 130px; text-align: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .mascot-card:hover { border-color: var(--primary); transform: translateY(-3px); }
  .mascot-card.active { border-color: var(--primary); background: rgba(108,99,255,0.12); }
  .mascot-emoji { font-size: 2.4rem; margin-bottom: 8px; }
  .mascot-name { font-size: 0.8rem; font-weight: 600; color: var(--text2); }
  .mascot-label { font-size: 0.7rem; color: var(--text3); margin-top: 2px; }

  /* Feature highlights */
  .features-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
  .feature-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 20px; }
  .feature-icon { font-size: 2rem; margin-bottom: 12px; }
  .feature-title { font-weight: 700; margin-bottom: 6px; font-size: 0.95rem; }
  .feature-desc { font-size: 0.82rem; color: var(--text2); line-height: 1.5; }

  /* Live class card */
  .live-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: rgba(255,107,107,0.2); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: #ff8a8a; }
  .live-dot { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Gradient text */
  .grad { background: linear-gradient(135deg, var(--primary-light), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* User menu */
  .user-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 8px; min-width: 200px; box-shadow: var(--shadow); z-index: 150; }
  .user-menu-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px; font-size: 0.87rem; color: var(--text2); cursor: pointer; transition: all 0.2s; }
  .user-menu-item:hover { background: var(--surface); color: var(--text); }
  .user-menu-divider { border: none; border-top: 1px solid var(--border); margin: 6px 0; }
`;

// ─────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────
const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{icons[t.type] || "💬"} {t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => useContext(ToastContext);

// ─────────────────────────────────────────────
// ROUTER (minimal hash-based)
// ─────────────────────────────────────────────
function useRoute() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to) => { window.location.hash = to; };
  return { path, navigate };
}

// ─────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();

  const submit = async () => {
    setErr(""); setLoading(true);
    const res = tab === "login"
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) { toast("Welcome! 🎉", "success"); onClose(); }
    else setErr(res.message || "Something went wrong");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="logo" style={{ marginBottom: 24 }}>
          <div className="logo-icon">💻</div>
          <span className="logo-text">WhatNext</span>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Sign Up</button>
        </div>
        {tab === "register" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Your name" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        {err && <div className="form-error" style={{ marginBottom: 12 }}>⚠️ {err}</div>}
        <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}
          onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Login →" : "Create Account →"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text3)", marginTop: 16 }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
function Navbar({ navigate, path, onAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const [menu, setMenu] = useState(false);
  const links = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "Live Classes", to: "/live" },
    { label: "Notes", to: "/notes" },
  ];
  if (isAdmin) links.push({ label: "Admin", to: "/admin" });

  return (
    <nav className="navbar">
      <div className="container inner">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer", flexShrink: 0 }}>
          <div className="logo-icon">💻</div>
          <span className="logo-text">WhatNext</span>
        </div>
        <div className="nav-links">
          {links.map(l => (
            <span key={l.to} className={`nav-link ${path === l.to ? "active" : ""}`}
              onClick={() => navigate(l.to)} style={{ cursor: "pointer" }}>{l.label}</span>
          ))}
        </div>
        <div className="nav-actions">
          {user ? (
            <div style={{ position: "relative" }}>
              <div className="avatar-btn" onClick={() => setMenu(p => !p)}>
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              {menu && (
                <div className="user-menu">
                  <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{user.email}</div>
                  </div>
                  <div className="user-menu-item" onClick={() => { navigate("/dashboard"); setMenu(false); }}>📚 My Learning</div>
                  {isAdmin && <div className="user-menu-item" onClick={() => { navigate("/admin"); setMenu(false); }}>⚙️ Admin Panel</div>}
                  <hr className="user-menu-divider" />
                  <div className="user-menu-item" style={{ color: "var(--accent)" }} onClick={() => { logout(); setMenu(false); }}>🚪 Logout</div>
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

// ─────────────────────────────────────────────
// ANIMAL CATEGORY STRIP
// ─────────────────────────────────────────────
const COURSE = [
  { emoji: "💻", name: "MERN Stack", label: "Full Stack", level: "advanced" },
  { emoji: "⚛️", name: "React.js", label: "Frontend", level: "intermediate" },
  { emoji: "🟢", name: "Node.js", label: "Backend", level: "intermediate" },
  { emoji: "📱", name: "Flutter", label: "Mobile App", level: "intermediate" },
  { emoji: "🎨", name: "UI/UX Design", label: "Design", level: "beginner" },
  { emoji: "🤖", name: "Artificial Intelligence", label: "AI", level: "advanced" },
  { emoji: "📊", name: "Data Science", label: "Analytics", level: "advanced" },
  { emoji: "☁️", name: "AWS Cloud", label: "Cloud", level: "advanced" },
  { emoji: "🔒", name: "Cyber Security", label: "Security", level: "advanced" },
  { emoji: "📈", name: "Digital Marketing", label: "Marketing", level: "beginner" }
];

function COURSEtrip({ onSelect, selected }) {
  return (
    <div>
      <div className="mascot-strip">
        <div className={`mascot-card ${!selected ? "active" : ""}`} onClick={() => onSelect(null)}>
          <div className="mascot-emoji">🌟</div>
          <div className="mascot-name">All Courses</div>
          <div className="mascot-label">View All</div>
        </div>
        {COURSE.map(a => (
          <div key={a.level + a.name} className={`mascot-card ${selected === a.level ? "active" : ""}`}
            onClick={() => onSelect(a.level)}>
            <div className="mascot-emoji">{a.emoji}</div>
            <div className="mascot-name">{a.name}</div>
            <div className="mascot-label">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────
function CourseCard({ course, onClick }) {
  const price = course.isFree ? 0 : (course.discountPrice ?? course.price);
  const courseEmojis = {
  beginner: "🎨",       // UI/UX Design
  intermediate: "⚛️",  // React.js
  advanced: "💻",      // Full Stack Development
  all: "📚"            // All Courses
};
  return (
    <div className="card" onClick={() => onClick(course._id)} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)" }}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>{courseEmojis[course.level] || "📚"}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>{course.category || "Course"}</div>
            </div>
        }
      </div>
      <div className="card-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span className="badge badge-primary">{course.level || "All"}</span>
          {course.category && <span className="badge badge-cyan">{course.category}</span>}
          {!course.isPublished && <span className="badge badge-yellow">Draft</span>}
        </div>
        <div className="card-title">{course.title}</div>
        <div className="card-desc">{course.description}</div>
        <div className="card-meta">
          <span className={`price ${course.isFree ? "price-free" : ""}`}>
            {course.isFree ? "FREE" : `₹${price}`}
          </span>
          {!course.isFree && course.discountPrice && <span className="price-old">₹{course.price}</span>}
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>
            🎬 {course.videos?.length || 0} videos
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────
function HomePage({ navigate, onAuth }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/courses?limit=6`).then(r => r.json()).then(d => {
      if (d.success) setCourses(d.data || d.courses || []);
      setLoadingCourses(false);
    }).catch(() => setLoadingCourses(false));
    fetch(`${API_BASE}/live-classes?limit=4`).then(r => r.json()).then(d => {
      if (d.success) setLiveClasses(d.data || d.liveClasses || []);
    }).catch(() => {});
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">🎓 India's Most Affordable Learning Platform</div>
          <h1 className="hero-title">
            Learn From <span className="hl">Expert Tutors</span><br />
            Anytime, Anywhere
          </h1>
          <p className="hero-sub">
            Access 500+ courses, live interactive classes, and downloadable study notes—
            all at prices that don't break the bank.
          </p>
          <div className="hero-ctas">
            {user
              ? <button className="btn btn-primary btn-lg" onClick={() => navigate("/courses")}>Browse Courses 🚀</button>
              : <button className="btn btn-primary btn-lg" onClick={onAuth}>Get Started Free →</button>
            }
            <button className="btn btn-outline btn-lg" onClick={() => navigate("/live")}>View Live Classes 📡</button>
          </div>
          <div className="hero-stats">
            {[["50K+", "Active Students"], ["500+", "Expert Courses"], ["1000+", "Live Classes"], ["4.8★", "Average Rating"]].map(([n, l]) => (
              <div key={l} className="stat"><span className="stat-num">{n}</span><span className="stat-label">{l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal mascots */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Choose Your Batch</div>
            <h2 className="section-title">Find Your <span className="grad">Learning Tribe</span></h2>
            <p className="section-sub">Pick a batch that matches your level and learning style</p>
          </div>
          <COURSEtrip onSelect={() => navigate("/courses")} selected={null} />
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Why WhatNext</div>
            <h2 className="section-title">Everything You Need to <span className="grad">Excel</span></h2>
          </div>
          <div className="features-row">
            {[
              ["📡", "Live Classes", "Interact with instructors in real-time. Ask questions, get instant answers."],
              ["🎬", "Video Courses", "Learn at your pace with HD video lectures, available 24/7."],
              ["📄", "Study Notes", "Curated PDF notes and resources to reinforce your learning."],
              ["📊", "Track Progress", "Monitor your video progress and stay on top of your goals."],
              ["💳", "Easy Payments", "Secure Razorpay checkout. Pay once, learn forever."],
              ["🏆", "Certificates", "Earn certificates to showcase your achievements."],
            ].map(([icon, title, desc]) => (
              <div key={title} className="feature-item">
                <div className="feature-icon">{icon}</div>
                <div className="feature-title">{title}</div>
                <div className="feature-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <div className="section-eyebrow">Popular Picks</div>
              <h2 className="section-title">Featured <span className="grad">Courses</span></h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/courses")}>View All →</button>
          </div>
          {loadingCourses
            ? <div className="spinner" />
            : courses.length === 0
              ? <div className="empty-state"><div className="icon">📚</div><p>No courses yet. Check back soon!</p></div>
              : <div className="grid-3">{courses.slice(0, 6).map(c => <CourseCard key={c._id} course={c} onClick={() => navigate(`/courses/${c._id}`)} />)}</div>
          }
        </div>
      </section>

      {/* Live classes teaser */}
      {liveClasses.length > 0 && (
        <section className="section" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div className="section-eyebrow">Coming Up</div>
                <h2 className="section-title">Upcoming <span className="grad">Live Classes</span></h2>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => navigate("/live")}>View All →</button>
            </div>
            <div className="grid-3">
              {liveClasses.slice(0, 3).map(lc => <LiveClassCard key={lc._id} liveClass={lc} onClick={() => navigate(`/live/${lc._id}`)} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="section">
        <div className="container">
          <div style={{ background: "linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, background: "radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>💻</div>
            <h2 style={{ fontFamily: "var(--font2)", fontSize: "1.8rem", fontWeight: 700, marginBottom: 12 }}>Ready to join the pride?</h2>
            <p style={{ color: "var(--text2)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
              Join 50,000+ students mastering their subjects with expert guidance.
            </p>
            <button className="btn btn-primary btn-lg" onClick={user ? () => navigate("/courses") : onAuth}>
              {user ? "Browse Courses 🚀" : "Start Learning Free →"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────
// COURSES PAGE
// ─────────────────────────────────────────────
function CoursesPage({ navigate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState(null);
  const [category, setCategory] = useState("");
  const categories = ["Mathematics", "Science", "English", "Physics", "Chemistry", "Biology", "History", "Computer"];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (level) params.set("level", level);
    if (category) params.set("category", category);
    setLoading(true);
    fetch(`${API_BASE}/courses?${params}`).then(r => r.json()).then(d => {
      if (d.success) setCourses(d.data || d.courses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, level, category]);

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 8 }}>All <span className="grad">Courses</span></h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Explore our library of expert-taught courses</p>
        </div>
      </div>
      <div className="container section">
        {/* Animal filter strip */}
        <COURSEtrip onSelect={setLevel} selected={level} />
        {/* Search & category */}
        <div className="search-bar" style={{ marginTop: 16 }}>
          <span className="search-icon">🔍</span>
          <input placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", color: "var(--text3)", fontSize: "0.9rem" }}>✕</button>}
        </div>
        <div className="tag-row">
          <span className={`tag ${!category ? "active" : ""}`} onClick={() => setCategory("")}>All</span>
          {categories.map(c => (
            <span key={c} className={`tag ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</span>
          ))}
        </div>
        {loading
          ? <div className="spinner" />
          : courses.length === 0
            ? <div className="empty-state"><div className="icon">🔎</div><p>No courses found. Try adjusting filters.</p></div>
            : <div className="grid-3">{courses.map(c => <CourseCard key={c._id} course={c} onClick={() => navigate(`/courses/${c._id}`)} />)}</div>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COURSE DETAIL PAGE
// ─────────────────────────────────────────────
function CourseDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/courses/${id}`, { headers }).then(r => r.json()).then(d => {
      if (d.success) setCourse(d.data || d.course);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, token]);

  const hasPurchased = user?.purchasedCourses?.some(p => p.course?.toString() === id || p.course === id);
  const price = course?.isFree ? 0 : (course?.discountPrice ?? course?.price ?? 0);
  const animalEmoji = { beginner: "🦅", intermediate: "🦊", advanced: "💻", all: "🐬" };

  const handleBuy = async () => {
    if (!user) { onAuth(); return; }
    if (course.isFree || price === 0) {
      toast("Course is free! Enrol via payment flow.", "info"); return;
    }
    setPaying(true);
    try {
      const order = await authFetch("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ itemType: "course", itemId: id })
      });
      if (!order.success) { toast(order.message || "Order failed", "error"); setPaying(false); return; }
      const options = {
        key: order.razorpayKeyId || "",
        amount: order.order?.amount,
        currency: order.order?.currency || "INR",
        name: "WhatNext",
        description: course.title,
        order_id: order.order?.id,
        handler: async (res) => {
          const verify = await authFetch("/payments/verify", {
            method: "POST",
            body: JSON.stringify({ razorpayOrderId: res.razorpay_order_id, razorpayPaymentId: res.razorpay_payment_id, razorpaySignature: res.razorpay_signature, itemType: "course", itemId: id })
          });
          if (verify.success) { toast("Purchase successful! 🎉", "success"); navigate(`/dashboard`); }
          else toast(verify.message || "Verification failed", "error");
        },
        prefill: { name: user.name, email: user.email }
      };
      if (window.Razorpay) { const rz = new window.Razorpay(options); rz.open(); }
      else toast("Payment gateway not loaded", "error");
    } catch { toast("Payment error", "error"); }
    setPaying(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!course) return <div className="page"><div className="container" style={{ padding: "80px 24px", textAlign: "center" }}><h2>Course not found</h2></div></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate("/courses")}>← Back to <span>Courses</span></div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <span className="badge badge-primary">{course.level}</span>
            {course.category && <span className="badge badge-cyan">{course.category}</span>}
            {course.isFree && <span className="badge badge-green">FREE</span>}
          </div>
          <h1 className="detail-title">{course.title}</h1>
          <div className="detail-meta-row">
            <span>{animalEmoji[course.level] || "📚"} {course.level} level</span>
            <span>🎬 {course.videos?.length || 0} videos</span>
            <span>👥 {course.totalStudents || 0} students</span>
            <span>🌐 {course.language || "English"}</span>
          </div>
          <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{course.description}</p>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          {/* Main content */}
          <div>
            {hasPurchased && (
              <div style={{ background: "rgba(107,203,119,0.12)", border: "1px solid var(--green)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10, fontSize: "0.9rem" }}>
                ✅ You have access to this course!
              </div>
            )}

            {course.outcomes?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🎯 What You'll Learn</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {course.outcomes.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: "0.87rem", color: "var(--text2)" }}>
                      <span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {o}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.requirements?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>📋 Requirements</h3>
                {course.requirements.map((r, i) => (
                  <div key={i} style={{ fontSize: "0.87rem", color: "var(--text2)", marginBottom: 6, display: "flex", gap: 8 }}>
                    <span>•</span> {r}
                  </div>
                ))}
              </div>
            )}

            {/* Video list */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🎬 Course Content</h3>
              {(!course.videos || course.videos.length === 0)
                ? <div style={{ color: "var(--text3)", fontSize: "0.87rem" }}>No videos added yet.</div>
                : <div className="video-list">
                    {course.videos.map((v, i) => (
                      <div key={v._id || i} className={`video-item ${!hasPurchased && !v.isPreview ? "locked" : ""}`}>
                        <div className="video-num">{i + 1}</div>
                        <div className="video-info">
                          <div className="video-title-text">{v.title}</div>
                          {v.duration > 0 && <div className="video-dur">{Math.floor(v.duration / 60)}m {v.duration % 60}s</div>}
                        </div>
                        {v.isPreview ? <span className="badge badge-green">Preview</span>
                          : hasPurchased ? <span style={{ color: "var(--text3)", fontSize: "1rem" }}>▶</span>
                          : <span style={{ color: "var(--text3)", fontSize: "1rem" }}>🔒</span>}
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-price">{course.isFree ? "FREE" : `₹${price}`}</div>
            {!course.isFree && course.discountPrice && <div className="sidebar-price-old">₹{course.price}</div>}
            {hasPurchased
              ? <button className="btn btn-green btn-lg sidebar-btn" onClick={() => navigate("/dashboard")}>Go to My Learning →</button>
              : <button className="btn btn-primary btn-lg sidebar-btn" onClick={handleBuy} disabled={paying}>
                  {paying ? "Processing…" : course.isFree ? "Enrol Free →" : `Buy for ₹${price} →`}
                </button>
            }
            <div className="sidebar-features">
              {[["📱", "Access on all devices"], ["♾️", "Lifetime access"], ["🎬", `${course.videos?.length || 0} video lectures`], ["📄", "Downloadable resources"], ["🏆", "Certificate of completion"]].map(([icon, label]) => (
                <div key={label} className="sidebar-feature"><span className="icon">{icon}</span> {label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIVE CLASS CARD
// ─────────────────────────────────────────────
function LiveClassCard({ liveClass, onClick }) {
  const isLive = liveClass.status === "live";
  const date = new Date(liveClass.scheduledAt);
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)", position: "relative" }}>
        {liveClass.thumbnail
          ? <img src={liveClass.thumbnail} alt={liveClass.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>📡</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>Live Class</div>
            </div>
        }
        {isLive && (
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <div className="live-badge"><div className="live-dot" />LIVE</div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span className={`badge ${isLive ? "badge-accent" : liveClass.status === "upcoming" ? "badge-cyan" : "badge-primary"}`}>
            {liveClass.status}
          </span>
          {liveClass.isFree && <span className="badge badge-green">FREE</span>}
        </div>
        <div className="card-title">{liveClass.title}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 12 }}>
          🗓 {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          · {liveClass.duration || 60} mins
        </div>
        <div className="card-meta">
          <span className={`price ${liveClass.isFree ? "price-free" : ""}`}>
            {liveClass.isFree ? "FREE" : `₹${liveClass.price}`}
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>
            👥 {liveClass.registrations?.length || 0} registered
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIVE CLASSES PAGE
// ─────────────────────────────────────────────
function LiveClassesPage({ navigate }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    fetch(`${API_BASE}/live-classes?${params}`).then(r => r.json()).then(d => {
      if (d.success) setClasses(d.data || d.liveClasses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status]);

  const filtered = status === "all" ? classes : classes.filter(c => c.status === status);

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 8 }}>Live <span className="grad">Classes</span></h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Join interactive sessions with expert instructors in real time</p>
        </div>
      </div>
      <div className="container section">
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", "upcoming", "live", "completed"].map(s => (
            <button key={s} className={`btn ${status === s ? "btn-primary" : "btn-outline"} btn-sm`}
              onClick={() => setStatus(s)} style={{ textTransform: "capitalize" }}>
              {s === "live" && "🔴 "}{s}
            </button>
          ))}
        </div>
        {loading ? <div className="spinner" />
          : filtered.length === 0
            ? <div className="empty-state"><div className="icon">📡</div><p>No live classes found.</p></div>
            : <div className="grid-3">{filtered.map(lc => <LiveClassCard key={lc._id} liveClass={lc} onClick={() => navigate(`/live/${lc._id}`)} />)}</div>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LIVE CLASS DETAIL
// ─────────────────────────────────────────────
function LiveClassDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [lc, setLc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/live-classes/${id}`, { headers }).then(r => r.json()).then(d => {
      if (d.success) setLc(d.data || d.liveClass);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, token]);

  const isRegistered = user?.liveClassRegistrations?.some(r => r.liveClass?.toString() === id || r.liveClass === id);

  const handleRegister = async () => {
    if (!user) { onAuth(); return; }
    setRegistering(true);
    try {
      const res = await authFetch(`/live-classes/${id}/register`, { method: "POST", body: JSON.stringify({}) });
      if (res.success) { toast("Registered! You'll receive the link before the class. 🎉", "success"); }
      else toast(res.message || "Registration failed", "error");
    } catch { toast("Error registering", "error"); }
    setRegistering(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!lc) return <div className="page"><div className="container" style={{ padding: "80px 24px", textAlign: "center" }}><h2>Class not found</h2></div></div>;

  const date = new Date(lc.scheduledAt);
  const isLive = lc.status === "live";

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate("/live")}>← Back to <span>Live Classes</span></div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {isLive && <div className="live-badge"><div className="live-dot" />LIVE NOW</div>}
            <span className={`badge ${lc.isFree ? "badge-green" : "badge-primary"}`}>{lc.isFree ? "FREE" : `₹${lc.price}`}</span>
            <span className="badge badge-cyan">{lc.platform}</span>
          </div>
          <h1 className="detail-title">{lc.title}</h1>
          <div className="detail-meta-row">
            <span>🗓 {date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
            <span>🕐 {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
            <span>⏱ {lc.duration} mins</span>
            <span>👥 {lc.registrations?.length || 0} / {lc.maxParticipants}</span>
          </div>
          {lc.description && <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{lc.description}</p>}
        </div>
      </div>
      <div className="container">
        <div className="detail-layout">
          <div>
            {isRegistered && (
              <div style={{ background: "rgba(107,203,119,0.12)", border: "1px solid var(--green)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: "0.9rem" }}>
                ✅ You're registered! Meeting link will be sent {lc.urlSendMinutesBefore || 30} minutes before the class.
              </div>
            )}
            <div style={{ background: "var(--surface)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Class Details</h3>
              {[["Platform", lc.platform], ["Duration", `${lc.duration} minutes`], ["Max Participants", lc.maxParticipants], ["Registered", lc.registrations?.length || 0], ["Seats Left", Math.max(0, lc.maxParticipants - (lc.registrations?.length || 0))]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}>
                  <span style={{ color: "var(--text2)" }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="detail-sidebar">
            <div className="sidebar-price">{lc.isFree ? "FREE" : `₹${lc.price}`}</div>
            {isRegistered
              ? <button className="btn btn-green btn-lg sidebar-btn" disabled>✅ Registered</button>
              : lc.status === "completed" || lc.status === "cancelled"
                ? <button className="btn btn-outline btn-lg sidebar-btn" disabled>Class {lc.status}</button>
                : <button className="btn btn-primary btn-lg sidebar-btn" onClick={handleRegister} disabled={registering || lc.isFull}>
                    {registering ? "Registering…" : lc.isFull ? "Class Full" : "Register Now →"}
                  </button>
            }
            <div className="sidebar-features">
              {[["📡", lc.platform + " meeting"], ["📧", "Link sent via email"], ["⏱", `${lc.duration} min session`], ["👥", `Max ${lc.maxParticipants} participants`]].map(([icon, label]) => (
                <div key={label} className="sidebar-feature"><span className="icon">{icon}</span> {label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTES PAGE
// ─────────────────────────────────────────────
function NotesCard({ note, onClick }) {
  const price = note.isFree ? 0 : (note.discountPrice ?? note.price);
  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)" }}>
        {note.thumbnail
          ? <img src={note.thumbnail} alt={note.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem" }}>📄</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>{note.fileType?.toUpperCase() || "PDF"}</div>
            </div>
        }
      </div>
      <div className="card-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span className="badge badge-yellow">{note.fileType?.toUpperCase() || "PDF"}</span>
          {note.isFree && <span className="badge badge-green">FREE</span>}
          {note.category && <span className="badge badge-primary">{note.category}</span>}
        </div>
        <div className="card-title">{note.title}</div>
        <div className="card-desc">{note.description}</div>
        <div className="card-meta">
          <span className={`price ${note.isFree ? "price-free" : ""}`}>{note.isFree ? "FREE" : `₹${price}`}</span>
          {!note.isFree && note.discountPrice && <span className="price-old">₹{note.price}</span>}
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>
            📥 {note.totalPurchases || 0} downloads
          </span>
        </div>
      </div>
    </div>
  );
}

function NotesPage({ navigate }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`${API_BASE}/notes?${params}`).then(r => r.json()).then(d => {
      if (d.success) setNotes(d.data || d.notes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container">
          <h1 className="section-title" style={{ marginBottom: 8 }}>Study <span className="grad">Notes</span></h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Curated PDFs and study material for focused learning</p>
        </div>
      </div>
      <div className="container section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="Search notes…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", color: "var(--text3)" }}>✕</button>}
        </div>
        {loading ? <div className="spinner" />
          : notes.length === 0
            ? <div className="empty-state"><div className="icon">📄</div><p>No notes found.</p></div>
            : <div className="grid-3">{notes.map(n => <NotesCard key={n._id} note={n} onClick={() => navigate(`/notes/${n._id}`)} />)}</div>
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTES DETAIL
// ─────────────────────────────────────────────
function NoteDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/notes/${id}`, { headers }).then(r => r.json()).then(d => {
      if (d.success) setNote(d.data || d.note);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, token]);

  const hasPurchased = user?.purchasedNotes?.some(p => p.notes?.toString() === id || p.notes === id);
  const price = note?.isFree ? 0 : (note?.discountPrice ?? note?.price ?? 0);

  const handleDownload = async () => {
    if (!user) { onAuth(); return; }
    if (!hasPurchased && !note?.isFree) { toast("Please purchase to download", "error"); return; }
    window.open(`${API_BASE}/notes/${id}/download?token=${token}`, "_blank");
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!note) return <div className="page"><div className="container" style={{ padding: "80px 24px", textAlign: "center" }}><h2>Note not found</h2></div></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate("/notes")}>← Back to <span>Notes</span></div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <span className="badge badge-yellow">{note.fileType?.toUpperCase()}</span>
            {note.isFree && <span className="badge badge-green">FREE</span>}
          </div>
          <h1 className="detail-title">{note.title}</h1>
          <div className="detail-meta-row">
            <span>📄 {note.fileType?.toUpperCase()}</span>
            {note.fileSizeBytes > 0 && <span>💾 {(note.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>}
            {note.previewPages > 0 && <span>👀 {note.previewPages} preview pages</span>}
            <span>📥 {note.totalPurchases || 0} downloads</span>
          </div>
          {note.description && <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{note.description}</p>}
        </div>
      </div>
      <div className="container">
        <div className="detail-layout">
          <div>
            {hasPurchased && (
              <div style={{ background: "rgba(107,203,119,0.12)", border: "1px solid var(--green)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: "0.9rem" }}>
                ✅ You own this — click Download to access your file!
              </div>
            )}
            <div style={{ background: "var(--surface)", borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Document Details</h3>
              {[["File Type", note.fileType?.toUpperCase()], ["Category", note.category || "General"], ["Downloads", note.totalPurchases || 0], ...(note.previewPages > 0 ? [["Free Preview", `${note.previewPages} pages`]] : [])].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}>
                  <span style={{ color: "var(--text2)" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="detail-sidebar">
            <div className="sidebar-price">{note.isFree ? "FREE" : `₹${price}`}</div>
            {!note.isFree && note.discountPrice && <div className="sidebar-price-old">₹{note.price}</div>}
            {(hasPurchased || note.isFree)
              ? <button className="btn btn-green btn-lg sidebar-btn" onClick={handleDownload}>⬇️ Download Now</button>
              : <button className="btn btn-primary btn-lg sidebar-btn" onClick={() => toast("Buy flow — coming soon!", "info")}>
                  Buy for ₹{price} →
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD (My Learning)
// ─────────────────────────────────────────────
function DashboardPage({ navigate }) {
  const { user, authFetch } = useAuth();
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("courses");

  useEffect(() => {
    authFetch("/payments/my").then(d => { if (d.success) setPayments(d.data || d.payments || []); }).catch(() => {});
  }, [authFetch]);

  if (!user) return <div className="page"><div className="container" style={{ padding: 80, textAlign: "center" }}><h2>Please login to view your dashboard</h2></div></div>;

  const courses = user.purchasedCourses || [];
  const notes = user.purchasedNotes || [];
  const liveRegs = user.liveClassRegistrations || [];

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div className="avatar-btn" style={{ width: 52, height: 52, fontSize: "1.2rem" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font2)", fontSize: "1.6rem", fontWeight: 700 }}>Welcome, {user.name}! 👋</h1>
              <p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>{user.email} · {user.role}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container section">
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {[["📚", courses.length, "Courses Enrolled"], ["📄", notes.length, "Notes Purchased"], ["📡", liveRegs.length, "Classes Registered"], ["💳", payments.filter(p => p.status === "paid").length, "Successful Payments"]].map(([icon, num, label]) => (
            <div key={label} className="stat-card">
              <div className="stat-card-icon">{icon}</div>
              <div className="stat-card-num">{num}</div>
              <div className="stat-card-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="tabs">
          {[["courses", "📚 My Courses"], ["notes", "📄 My Notes"], ["live", "📡 Live Classes"], ["payments", "💳 Payments"]].map(([key, label]) => (
            <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {tab === "courses" && (
          courses.length === 0
            ? <div className="empty-state"><div className="icon">📚</div><p>No courses yet. <span style={{ color: "var(--primary-light)", cursor: "pointer" }} onClick={() => navigate("/courses")}>Browse courses →</span></p></div>
            : <div className="grid-3">
                {courses.map(p => (
                  <div key={p._id || p.course} className="card" onClick={() => navigate(`/courses/${p.course?._id || p.course}`)} style={{ cursor: "pointer" }}>
                    <div className="card-thumb" style={{ background: "var(--bg3)" }}>
                      {p.course?.thumbnail ? <img src={p.course.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ fontSize: "3rem" }}>📚</div>}
                    </div>
                    <div className="card-body">
                      <div className="card-title">{p.course?.title || "Course"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Purchased {new Date(p.purchasedAt).toLocaleDateString()}</div>
                      <div style={{ marginTop: 10 }}>
                        <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: "35%" }} /></div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 4 }}>35% completed</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {tab === "notes" && (
          notes.length === 0
            ? <div className="empty-state"><div className="icon">📄</div><p>No notes yet. <span style={{ color: "var(--primary-light)", cursor: "pointer" }} onClick={() => navigate("/notes")}>Browse notes →</span></p></div>
            : <div className="grid-3">
                {notes.map(p => (
                  <div key={p._id || p.notes} className="card">
                    <div className="card-body">
                      <div style={{ fontSize: "2rem", marginBottom: 10 }}>📄</div>
                      <div className="card-title">{p.notes?.title || "Notes"}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Purchased {new Date(p.purchasedAt).toLocaleDateString()}</div>
                      <button className="btn btn-green btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(`/notes/${p.notes?._id || p.notes}`)}>⬇️ Download</button>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {tab === "live" && (
          liveRegs.length === 0
            ? <div className="empty-state"><div className="icon">📡</div><p>No classes registered. <span style={{ color: "var(--primary-light)", cursor: "pointer" }} onClick={() => navigate("/live")}>Browse classes →</span></p></div>
            : <div className="grid-3">
                {liveRegs.map((r, i) => (
                  <div key={i} className="card">
                    <div className="card-body">
                      <div style={{ fontSize: "2rem", marginBottom: 10 }}>📡</div>
                      <div className="card-title">Live Class Registration</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Registered {new Date(r.registeredAt).toLocaleDateString()}</div>
                      <span className={`badge ${r.urlSent ? "badge-green" : "badge-yellow"}`} style={{ marginTop: 10, display: "inline-flex" }}>
                        {r.urlSent ? "✅ Link Sent" : "⏳ Link Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
        )}

        {tab === "payments" && (
          payments.length === 0
            ? <div className="empty-state"><div className="icon">💳</div><p>No payment history.</p></div>
            : <div className="table-wrap">
                <table>
                  <thead><tr><th>Item</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td>{p.itemTitle || "—"}</td>
                        <td><span className="badge badge-primary">{p.itemType}</span></td>
                        <td style={{ fontWeight: 700 }}>₹{p.amountInRupees}</td>
                        <td><span className={`badge ${p.status === "paid" ? "badge-green" : p.status === "failed" ? "badge-accent" : "badge-yellow"}`}>{p.status}</span></td>
                        <td style={{ color: "var(--text3)" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
function AdminPage({ navigate }) {
  const { user, authFetch, isAdmin } = useAuth();
  const toast = useToast();
  const [section, setSection] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: "", description: "", price: "", level: "beginner", category: "", isFree: false });
  const [liveForm, setLiveForm] = useState({ title: "", description: "", scheduledAt: "", duration: 60, price: 0, isFree: true, platform: "zoom", maxParticipants: 100 });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    authFetch("/admin/stats").then(d => { if (d.success) setStats(d.data || d.stats); }).catch(() => {});
  }, [isAdmin, authFetch]);

  const loadSection = (s) => {
    setSection(s);
    if (s === "courses") authFetch("/courses/admin/all").then(d => { if (d.success) setCourses(d.data || d.courses || []); });
    if (s === "live") authFetch("/live-classes/admin/all").then(d => { if (d.success) setLiveClasses(d.data || d.liveClasses || []); });
    if (s === "notes") authFetch("/notes/admin/all").then(d => { if (d.success) setNotes(d.data || d.notes || []); });
    if (s === "users") authFetch("/admin/users").then(d => { if (d.success) setUsers(d.data || d.users || []); });
    if (s === "payments") authFetch("/payments/admin/all").then(d => { if (d.success) setPayments(d.data || d.payments || []); });
  };

  const createCourse = async () => {
    if (!courseForm.title || !courseForm.description || !courseForm.price) { toast("Fill all required fields", "error"); return; }
    setCreating(true);
    const res = await authFetch("/courses", { method: "POST", body: JSON.stringify(courseForm) });
    setCreating(false);
    if (res.success) { toast("Course created! ✅", "success"); setShowCourseForm(false); setCourseForm({ title: "", description: "", price: "", level: "beginner", category: "", isFree: false }); loadSection("courses"); }
    else toast(res.message || "Failed", "error");
  };

  const createLive = async () => {
    if (!liveForm.title || !liveForm.scheduledAt) { toast("Fill all required fields", "error"); return; }
    setCreating(true);
    const res = await authFetch("/live-classes", { method: "POST", body: JSON.stringify(liveForm) });
    setCreating(false);
    if (res.success) { toast("Live class created! ✅", "success"); setShowLiveForm(false); loadSection("live"); }
    else toast(res.message || "Failed", "error");
  };

  const togglePublish = async (courseId, current) => {
    await authFetch(`/courses/${courseId}/publish`, { method: "PATCH" });
    loadSection("courses");
    toast(`Course ${current ? "unpublished" : "published"}`, "success");
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    await authFetch(`/courses/${id}`, { method: "DELETE" });
    loadSection("courses");
    toast("Course deleted", "success");
  };

  const toggleUser = async (userId) => {
    await authFetch(`/admin/users/${userId}/status`, { method: "PATCH" });
    loadSection("users");
  };

  if (!isAdmin) return (
    <div className="page"><div className="container" style={{ padding: 80, textAlign: "center" }}>
      <div style={{ fontSize: "4rem" }}>🚫</div>
      <h2 style={{ margin: "16px 0 8px" }}>Access Denied</h2>
      <p style={{ color: "var(--text2)" }}>Admin access required</p>
      <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/")}>Go Home</button>
    </div></div>
  );

  const navItems = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "courses", icon: "📚", label: "Courses" },
    { key: "live", icon: "📡", label: "Live Classes" },
    { key: "notes", icon: "📄", label: "Notes" },
    { key: "users", icon: "👥", label: "Users" },
    { key: "payments", icon: "💳", label: "Payments" },
  ];

  return (
    <div className="page">
      <div className="admin-layout">
        <div className="admin-sidebar">
          <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Admin Panel</div>
          </div>
          {navItems.map(n => (
            <div key={n.key} className={`admin-nav-item ${section === n.key ? "active" : ""}`} onClick={() => loadSection(n.key)}>
              <span className="admin-nav-icon">{n.icon}</span> {n.label}
            </div>
          ))}
        </div>

        <div className="admin-content">
          {/* Dashboard */}
          {section === "dashboard" && (
            <>
              <div className="admin-header">
                <div className="admin-title">Platform Overview</div>
                <div className="admin-sub">Welcome back, {user?.name}</div>
              </div>
              {stats ? (
                <div className="stats-grid">
                  {[["👥", stats.totalUsers || 0, "Total Users"], ["📚", stats.totalCourses || 0, "Courses"], ["📡", stats.totalLiveClasses || 0, "Live Classes"], ["📄", stats.totalNotes || 0, "Notes"], ["💳", stats.totalPayments || 0, "Payments"], ["💰", `₹${(stats.totalRevenue || 0).toLocaleString()}`, "Revenue"]].map(([icon, num, label]) => (
                    <div key={label} className="stat-card">
                      <div className="stat-card-icon">{icon}</div>
                      <div className="stat-card-num">{num}</div>
                      <div className="stat-card-label">{label}</div>
                    </div>
                  ))}
                </div>
              ) : <div className="spinner" />}
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>⚡ Quick Actions</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={() => { setShowCourseForm(true); loadSection("courses"); }}>+ New Course</button>
                  <button className="btn btn-outline" onClick={() => { setShowLiveForm(true); loadSection("live"); }}>+ New Live Class</button>
                  <button className="btn btn-outline" onClick={() => loadSection("users")}>View Users</button>
                  <button className="btn btn-outline" onClick={() => loadSection("payments")}>View Payments</button>
                </div>
              </div>
            </>
          )}

          {/* Courses */}
          {section === "courses" && (
            <>
              <div className="admin-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="admin-title">Courses</div>
                  <div className="admin-sub">{courses.length} total courses</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCourseForm(p => !p)}>+ New Course</button>
              </div>
              {showCourseForm && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Create New Course</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[["title", "Course Title *"], ["description", "Description *"], ["price", "Price (₹) *"], ["category", "Category"]].map(([key, label]) => (
                      <div key={key} className="form-group" style={{ gridColumn: key === "description" ? "1/-1" : "auto" }}>
                        <label className="form-label">{label}</label>
                        <input className="form-input" value={courseForm[key]} onChange={e => setCourseForm(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <select className="form-input" value={courseForm.level} onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}>
                        {["beginner", "intermediate", "advanced", "all"].map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                      <input type="checkbox" id="isFree" checked={courseForm.isFree} onChange={e => setCourseForm(p => ({ ...p, isFree: e.target.checked }))} style={{ width: 18, height: 18 }} />
                      <label htmlFor="isFree" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Free Course</label>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn btn-primary" onClick={createCourse} disabled={creating}>{creating ? "Creating…" : "Create Course"}</button>
                    <button className="btn btn-outline" onClick={() => setShowCourseForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Level</th><th>Price</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c._id}>
                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                        <td><span className="badge badge-primary">{c.level}</span></td>
                        <td>{c.isFree ? <span className="badge badge-green">FREE</span> : `₹${c.discountPrice ?? c.price}`}</td>
                        <td>{c.totalStudents || 0}</td>
                        <td><span className={`badge ${c.isPublished ? "badge-green" : "badge-yellow"}`}>{c.isPublished ? "Published" : "Draft"}</span></td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => togglePublish(c._id, c.isPublished)}>{c.isPublished ? "Unpublish" : "Publish"}</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(c._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No courses yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Live Classes */}
          {section === "live" && (
            <>
              <div className="admin-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div className="admin-title">Live Classes</div>
                  <div className="admin-sub">{liveClasses.length} total classes</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowLiveForm(p => !p)}>+ New Live Class</button>
              </div>
              {showLiveForm && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Create Live Class</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[["title", "Title *", "text"], ["scheduledAt", "Schedule *", "datetime-local"], ["duration", "Duration (mins)", "number"], ["maxParticipants", "Max Participants", "number"], ["price", "Price (₹)", "number"]].map(([key, label, type]) => (
                      <div key={key} className="form-group">
                        <label className="form-label">{label}</label>
                        <input type={type} className="form-input" value={liveForm[key]} onChange={e => setLiveForm(p => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} />
                      </div>
                    ))}
                    <div className="form-group">
                      <label className="form-label">Platform</label>
                      <select className="form-input" value={liveForm.platform} onChange={e => setLiveForm(p => ({ ...p, platform: e.target.value }))}>
                        {["zoom", "google_meet", "teams", "youtube_live", "other"].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                      <input type="checkbox" id="lcFree" checked={liveForm.isFree} onChange={e => setLiveForm(p => ({ ...p, isFree: e.target.checked }))} style={{ width: 18, height: 18 }} />
                      <label htmlFor="lcFree" style={{ fontWeight: 600, fontSize: "0.9rem" }}>Free Class</label>
                    </div>
                  </div>
                  <div className="form-group" style={{ gridColumn: "1/-1" }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" rows={3} value={liveForm.description} onChange={e => setLiveForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn btn-primary" onClick={createLive} disabled={creating}>{creating ? "Creating…" : "Create"}</button>
                    <button className="btn btn-outline" onClick={() => setShowLiveForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Scheduled</th><th>Platform</th><th>Registered</th><th>Status</th></tr></thead>
                  <tbody>
                    {liveClasses.map(lc => (
                      <tr key={lc._id}>
                        <td style={{ fontWeight: 600 }}>{lc.title}</td>
                        <td style={{ color: "var(--text2)", fontSize: "0.82rem" }}>{new Date(lc.scheduledAt).toLocaleString("en-IN")}</td>
                        <td><span className="badge badge-cyan">{lc.platform}</span></td>
                        <td>{lc.registrations?.length || 0} / {lc.maxParticipants}</td>
                        <td><span className={`badge ${lc.status === "live" ? "badge-accent" : lc.status === "upcoming" ? "badge-cyan" : lc.status === "completed" ? "badge-green" : "badge-yellow"}`}>{lc.status}</span></td>
                      </tr>
                    ))}
                    {liveClasses.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No live classes yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Notes */}
          {section === "notes" && (
            <>
              <div className="admin-header">
                <div className="admin-title">Notes</div>
                <div className="admin-sub">{notes.length} total notes</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Title</th><th>Type</th><th>Price</th><th>Downloads</th><th>Status</th></tr></thead>
                  <tbody>
                    {notes.map(n => (
                      <tr key={n._id}>
                        <td style={{ fontWeight: 600 }}>{n.title}</td>
                        <td><span className="badge badge-yellow">{n.fileType?.toUpperCase()}</span></td>
                        <td>{n.isFree ? <span className="badge badge-green">FREE</span> : `₹${n.discountPrice ?? n.price}`}</td>
                        <td>{n.totalPurchases || 0}</td>
                        <td><span className={`badge ${n.isPublished ? "badge-green" : "badge-yellow"}`}>{n.isPublished ? "Published" : "Draft"}</span></td>
                      </tr>
                    ))}
                    {notes.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No notes yet. Upload via API.</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Users */}
          {section === "users" && (
            <>
              <div className="admin-header">
                <div className="admin-title">Users</div>
                <div className="admin-sub">{users.length} registered users</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Courses</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td style={{ color: "var(--text2)" }}>{u.email}</td>
                        <td><span className={`badge ${u.role === "admin" ? "badge-accent" : "badge-primary"}`}>{u.role}</span></td>
                        <td>{u.purchasedCourses?.length || 0}</td>
                        <td><span className={`badge ${u.isActive ? "badge-green" : "badge-accent"}`}>{u.isActive ? "Active" : "Banned"}</span></td>
                        <td><button className="btn btn-outline btn-sm" onClick={() => toggleUser(u._id)}>{u.isActive ? "Ban" : "Activate"}</button></td>
                      </tr>
                    ))}
                    {users.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No users yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Payments */}
          {section === "payments" && (
            <>
              <div className="admin-header">
                <div className="admin-title">All Payments</div>
                <div className="admin-sub">Complete transaction history</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>User</th><th>Item</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 600 }}>{p.user?.name || p.user || "—"}</td>
                        <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.itemTitle || "—"}</td>
                        <td><span className="badge badge-primary">{p.itemType}</span></td>
                        <td style={{ fontWeight: 700, color: "var(--primary-light)" }}>₹{p.amountInRupees}</td>
                        <td><span className={`badge ${p.status === "paid" ? "badge-green" : p.status === "failed" ? "badge-accent" : "badge-yellow"}`}>{p.status}</span></td>
                        <td style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {payments.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>No payments yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "48px 0 24px", marginTop: 60 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <div className="logo-icon">💻</div>
              <span className="logo-text">WhatNext</span>
            </div>
            <p style={{ fontSize: "0.83rem", color: "var(--text3)", lineHeight: 1.6 }}>India's most affordable online learning platform. Powered by expert instructors.</p>
          </div>
          {[["Quick Links", [["Home", "/"], ["Courses", "/courses"], ["Live Classes", "/live"], ["Notes", "/notes"]]],
            ["Support", [["FAQ", "/"], ["Contact", "/"], ["Privacy Policy", "/"], ["Terms", "/"]]],
            ["COURSE 🐾", COURSE.slice(0, 4).map(a => [a.emoji + " " + a.name, "/courses"])]
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 14, color: "var(--text)" }}>{title}</div>
              {links.map(([label, to]) => (
                <div key={label} style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 8, cursor: "pointer" }} onClick={() => navigate(to)}
                  onMouseEnter={e => e.target.style.color = "var(--text2)"} onMouseLeave={e => e.target.style.color = "var(--text3)"}>
                  {label}
                </div>
              ))}
            </div>
          ))}
        </div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 20 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>© {new Date().getFullYear()} WhatNext. All rights reserved.</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Made with 💻 for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────────
function AppRouter() {
  const { path, navigate } = useRoute();
  const { loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div className="spinner" /></div>;

  // Parse route
  const segments = path.split("/").filter(Boolean);
  const root = "/" + (segments[0] || "");
  const param = segments[1];

  const renderPage = () => {
    if (root === "/" || path === "/") return <HomePage navigate={navigate} onAuth={() => setShowAuth(true)} />;
    if (root === "/courses" && !param) return <CoursesPage navigate={navigate} />;
    if (root === "/courses" && param) return <CourseDetailPage id={param} navigate={navigate} onAuth={() => setShowAuth(true)} />;
    if (root === "/live" && !param) return <LiveClassesPage navigate={navigate} />;
    if (root === "/live" && param) return <LiveClassDetailPage id={param} navigate={navigate} onAuth={() => setShowAuth(true)} />;
    if (root === "/notes" && !param) return <NotesPage navigate={navigate} />;
    if (root === "/notes" && param) return <NoteDetailPage id={param} navigate={navigate} onAuth={() => setShowAuth(true)} />;
    if (root === "/dashboard") return <DashboardPage navigate={navigate} />;
    if (root === "/admin") return <AdminPage navigate={navigate} />;
    return (
      <div className="page">
        <div style={{ textAlign: "center", padding: "100px 24px" }}>
          <div style={{ fontSize: "5rem", marginBottom: 20 }}>💻</div>
          <h2 style={{ fontFamily: "var(--font2)", marginBottom: 12 }}>404 — Page not found</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{css}</style>
      <Navbar navigate={navigate} path={root} onAuth={() => setShowAuth(true)} />
      {renderPage()}
      <Footer navigate={navigate} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
