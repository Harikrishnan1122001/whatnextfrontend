

import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "https://whatnextbackend.vercel.app/api";

function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const threshold = options.threshold || 0.12;
  const rootMargin = options.rootMargin || "0px 0px -40px 0px";
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } }, { threshold, rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, ...style }}>{children}</div>;
}
function RevealLeft({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, ...style }}>{children}</div>;
}
function RevealRight({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal();
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)", transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, ...style }}>{children}</div>;
}
function RevealScale({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.15 });
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.92)", transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, ...style }}>{children}</div>;
}
function RevealFlip({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 });
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "perspective(600px) rotateX(0deg)" : "perspective(600px) rotateX(-20deg)", transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, transformOrigin: "top center", ...style }}>{children}</div>;
}
function RevealBounce({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 });
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.85)", transition: `opacity 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`, ...style }}>{children}</div>;
}

function AnimatedNumber({ target, prefix = "", suffix = "", duration = 1200 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal({ threshold: 0.5 });
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) { setCount(target); return; }
    const end = parseFloat(target);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    requestAnimationFrame(tick);
  }, [visible, target, duration]);
  return <span ref={ref}>{prefix}{typeof count === "number" ? count.toLocaleString() : count}{suffix}</span>;
}

function MagneticBtn({ children, className = "", onClick, disabled, style = {} }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (disabled) return;
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return <button ref={ref} className={className} onClick={onClick} disabled={disabled} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)", ...style }}>{children}</button>;
}

function TiltCard({ children, className = "", style = {}, onClick }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.01)`;
  };
  const handleLeave = () => { if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)"; };
  return <div ref={ref} className={className} style={{ transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)", ...style }} onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick}>{children}</div>;
}

function ParticleMascotCard({ emoji, name, label, active, onClick }) {
  const [particles, setParticles] = useState([]);
  const handleEnter = () => {
    const p = Array.from({ length: 8 }, (_, i) => ({ id: Date.now() + i, angle: (i / 8) * 360, dist: 30 + Math.random() * 20 }));
    setParticles(p);
    setTimeout(() => setParticles([]), 600);
  };
  return (
    <div className={`mascot-card ${active ? "active" : ""}`} onClick={onClick} onMouseEnter={handleEnter} style={{ position: "relative" }}>
      {particles.map(p => <span key={p.id} style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", pointerEvents: "none", animation: "particleBurst 0.6s ease-out forwards", "--angle": p.angle + "deg", "--dist": p.dist + "px" }} />)}
      <div className="mascot-emoji">{emoji}</div>
      <div className="mascot-name">{name}</div>
      <div className="mascot-label">{label}</div>
    </div>
  );
}

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const logout = useCallback(() => { setUser(null); setToken(null); localStorage.removeItem("token"); }, []);
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => { if (d.success) setUser(d.data || d.user); else logout(); })
        .catch(() => logout()).finally(() => setLoading(false));
    } else setLoading(false);
  }, [token, logout]);
  const login = async (email, password) => {
    const r = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (d.success) { setToken(d.token); localStorage.setItem("token", d.token); setUser(d.user || d.data); }
    return d;
  };
  const register = async (name, email, password) => {
    const r = await fetch(`${API_BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const d = await r.json();
    if (d.success) { setToken(d.token); localStorage.setItem("token", d.token); setUser(d.user || d.data); }
    return d;
  };
  const authFetch = useCallback((url, opts = {}) => {
    const headers = { Authorization: `Bearer ${token}`, ...(opts.headers || {}) };
    if (!(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
    return fetch(`${API_BASE}${url}`, { ...opts, headers }).then(r => r.json());
  }, [token]);
  return <AuthContext.Provider value={{ user, token, loading, login, register, logout, authFetch, isAdmin: user?.role === "admin" }}>{children}</AuthContext.Provider>;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #ffffff; --bg2: #fff5f6; --bg3: #ffe9eb; --surface: #ffffff; --surface2: #fff0f1;
    --primary: #e8113b; --primary-light: #ff4d6d; --primary-dark: #c00d30; --primary-glow: rgba(232,17,59,0.18);
    --accent: #ff8a00; --accent2: #ffd93d; --green: #1fa855; --cyan: #0ea5b7;
    --text: #1a1a2e; --text2: #6b6b7d; --text3: #9a9aab;
    --border: rgba(232,17,59,0.16); --radius: 14px; --radius-sm: 8px;
    --shadow: 0 8px 32px rgba(232,17,59,0.10);
    --font: 'Plus Jakarta Sans', sans-serif; --font2: 'Space Grotesk', sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: var(--font); border: none; outline: none; }
  input, textarea, select { font-family: var(--font); }
  img { max-width: 100%; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg3); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 3px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .page { min-height: 100vh; padding-top: 72px; }

  @keyframes heroFadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes floatY { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
  @keyframes floatYSlow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-14px) rotate(2deg); } 66% { transform: translateY(-6px) rotate(-2deg); } }
  @keyframes logoPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(232,17,59,0.25); } 50% { box-shadow: 0 0 0 8px rgba(232,17,59,0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes particleBurst { 0% { transform: translate(-50%,-50%) scale(1); opacity: 1; } 100% { transform: translate(calc(-50% + calc(cos(var(--angle, 0deg)) * var(--dist, 30px))),calc(-50% + calc(sin(var(--angle, 0deg)) * var(--dist, 30px)))) scale(0); opacity: 0; } }
  @keyframes badgePop { 0% { transform: scale(0) rotate(-15deg); opacity: 0; } 70% { transform: scale(1.15) rotate(3deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); } }
  @keyframes livePulseRing { 0% { box-shadow: 0 0 0 0 rgba(232,17,59,0.5); } 70% { box-shadow: 0 0 0 8px rgba(232,17,59,0); } 100% { box-shadow: 0 0 0 0 rgba(232,17,59,0); } }
  @keyframes shineSweep { 0% { left: -100%; } 100% { left: 200%; } }
  @keyframes toastBounce { 0% { opacity: 0; transform: translateX(60px) scale(0.8); } 60% { transform: translateX(-8px) scale(1.02); } 80% { transform: translateX(4px) scale(0.99); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
  @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.88) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes avatarRing { 0%, 100% { box-shadow: 0 0 0 0 rgba(232,17,59,0.4); } 50% { box-shadow: 0 0 0 6px rgba(232,17,59,0); } }
  @keyframes mobileMenuSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

  .hero-eyebrow { animation: heroFadeIn 0.6s ease 0.1s both; }
  .hero-title { animation: heroFadeIn 0.7s ease 0.25s both; }
  .hero-sub { animation: heroFadeIn 0.7s ease 0.4s both; }
  .hero-ctas { animation: heroFadeIn 0.7s ease 0.55s both; }
  .hero-stats { animation: heroFadeIn 0.7s ease 0.7s both; }

  .stat-num { background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 50%, var(--primary) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; font-family: var(--font2); font-size: 2rem; font-weight: 700; }
  .section-eyebrow { font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--primary); margin-bottom: 10px; display: inline-flex; align-items: center; gap: 8px; position: relative; }
  .section-eyebrow::after { content: ''; display: inline-block; height: 2px; width: 32px; background: linear-gradient(90deg, var(--primary), transparent); border-radius: 1px; animation: shimmer 2s linear infinite; background-size: 200% 100%; }

  /* ── NAVBAR ── */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); height: 72px; display: flex; align-items: center; animation: heroFadeIn 0.5s ease both; box-shadow: 0 2px 16px rgba(232,17,59,0.05); }
  .navbar .inner { display: flex; align-items: center; gap: 32px; width: 100%; }
  .scroll-progress { position: fixed; top: 72px; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--primary), var(--accent)); transform-origin: left center; z-index: 101; transition: transform 0.05s linear; }

  .logo { display: flex; align-items: center; gap: 10px; font-family: var(--font2); font-size: 1.4rem; font-weight: 700; cursor: pointer; flex-shrink: 0; }
  .logo-img { height: 40px; width: auto; object-fit: contain; border-radius: 8px; transition: transform 0.3s ease, box-shadow 0.3s ease; animation: logoPulse 3s ease-in-out infinite; }
  .logo:hover .logo-img { transform: scale(1.08) rotate(-2deg); box-shadow: 0 4px 20px rgba(232,17,59,0.3); animation: none; }

  .nav-links { display: flex; gap: 4px; flex: 1; }
  .nav-link { padding: 8px 16px; border-radius: var(--radius-sm); color: var(--text2); font-size: 0.9rem; font-weight: 500; transition: all 0.2s; position: relative; overflow: hidden; }
  .nav-link::after { content: ''; position: absolute; bottom: 4px; left: 50%; right: 50%; height: 2px; background: var(--primary); border-radius: 1px; transition: left 0.3s ease, right 0.3s ease; }
  .nav-link:hover::after, .nav-link.active::after { left: 16px; right: 16px; }
  .nav-link:hover, .nav-link.active { background: var(--bg3); color: var(--primary); }

  .nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
  .desktop-auth-btns { display: flex; gap: 10px; }

  .avatar-btn { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; cursor: pointer; flex-shrink: 0; animation: avatarRing 3s ease-in-out infinite; transition: transform 0.2s ease; }
  .avatar-btn:hover { transform: scale(1.1); animation: none; }

  /* ── HAMBURGER ── */
  .hamburger-btn { display: none; background: none; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 7px 10px; cursor: pointer; color: var(--text); font-size: 1.3rem; line-height: 1; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
  .hamburger-btn:hover { background: var(--bg3); border-color: var(--primary); color: var(--primary); }

  /* ── MOBILE NAV MENU ── */
  .mobile-nav-overlay { display: none; position: fixed; top: 72px; left: 0; right: 0; bottom: 0; background: rgba(26,26,46,0.4); z-index: 98; backdrop-filter: blur(2px); }
  .mobile-nav-menu { display: none; position: fixed; top: 72px; left: 0; right: 0; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 99; box-shadow: 0 12px 32px rgba(232,17,59,0.12); animation: mobileMenuSlide 0.25s cubic-bezier(0.22,1,0.36,1) both; }
  .mobile-nav-item { display: flex; align-items: center; gap: 14px; padding: 15px 24px; font-size: 1rem; font-weight: 600; color: var(--text2); cursor: pointer; border-bottom: 1px solid rgba(232,17,59,0.06); transition: background 0.15s, color 0.15s, padding-left 0.2s; }
  .mobile-nav-item:hover { background: var(--bg2); color: var(--primary); padding-left: 30px; }
  .mobile-nav-item.active { background: rgba(232,17,59,0.06); color: var(--primary); border-left: 3px solid var(--primary); }
  .mobile-nav-item .nav-icon { font-size: 1.2rem; width: 28px; text-align: center; flex-shrink: 0; }
  .mobile-nav-auth { padding: 16px 24px; display: flex; flex-direction: column; gap: 10px; background: var(--bg2); }
  .mobile-nav-user { padding: 14px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .mobile-nav-user-info { flex: 1; }
  .mobile-nav-user-name { font-weight: 700; font-size: 0.95rem; }
  .mobile-nav-user-email { font-size: 0.78rem; color: var(--text3); margin-top: 2px; }

  /* ── BUTTONS ── */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600; transition: all 0.2s; position: relative; overflow: hidden; }
  .btn-primary { background: var(--primary); color: #fff; }
  .btn-primary::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: rgba(255,255,255,0.2); transform: skewX(-20deg); transition: none; }
  .btn-primary:hover::before { animation: shineSweep 0.5s ease forwards; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 6px 24px var(--primary-glow); }
  .btn-primary:disabled { opacity: 0.6; transform: none; cursor: not-allowed; }
  .btn-outline { background: transparent; color: var(--primary); border: 1px solid var(--primary); }
  .btn-outline:hover { background: var(--primary); color: #fff; transform: translateY(-1px); }
  .btn-sm { padding: 7px 14px; font-size: 0.82rem; }
  .btn-lg { padding: 14px 32px; font-size: 1rem; border-radius: var(--radius); }
  .btn-accent { background: var(--accent); color: #fff; }
  .btn-accent:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-green:hover { opacity: 0.9; }
  .btn-danger { background: #d92d20; color: #fff; }
  .btn-danger:hover { background: #b42318; }
  .btn-yellow { background: var(--accent2); color: #1a1a2e; }

  /* ── CARDS ── */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease, border-color 0.3s ease; will-change: transform; position: relative; }
  .card::before { content: ''; position: absolute; inset: 0; border-radius: var(--radius); padding: 1px; background: linear-gradient(135deg, transparent 40%, rgba(232,17,59,0.4), transparent 60%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
  .card:hover::before { opacity: 1; }
  .card:hover { border-color: var(--primary); transform: translateY(-8px) scale(1.01); box-shadow: var(--shadow), 0 0 0 1px var(--primary-glow), 0 20px 40px rgba(232,17,59,0.14); }
  .card-thumb { width: 100%; aspect-ratio: 16/9; object-fit: cover; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--text3); overflow: hidden; }
  .card-thumb img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); width: 100%; height: 100%; object-fit: cover; }
  .card:hover .card-thumb img { transform: scale(1.06); }
  .card-body { padding: 16px; }
  .card-title { font-size: 1rem; font-weight: 700; margin-bottom: 6px; line-height: 1.4; }
  .card-desc { font-size: 0.83rem; color: var(--text2); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .badge-primary { background: rgba(232,17,59,0.12); color: var(--primary); }
  .badge-accent { background: rgba(255,138,0,0.15); color: #c45f00; }
  .badge-green { background: rgba(31,168,85,0.12); color: var(--green); }
  .badge-yellow { background: rgba(255,217,61,0.2); color: #b88600; }
  .badge-cyan { background: rgba(14,165,183,0.12); color: var(--cyan); }

  .price { font-size: 1.15rem; font-weight: 800; color: var(--primary); }
  .price-free { color: var(--green); }
  .price-old { font-size: 0.82rem; color: var(--text3); text-decoration: line-through; margin-left: 4px; }

  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }

  /* ── HERO ── */
  .hero { padding: 80px 0 60px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,17,59,0.10) 0%, transparent 70%); pointer-events: none; animation: floatYSlow 8s ease-in-out infinite; }
  .hero::after { content: ''; position: absolute; bottom: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,138,0,0.06) 0%, transparent 70%); pointer-events: none; animation: floatYSlow 11s ease-in-out infinite reverse; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 20px; padding: 6px 16px; font-size: 0.82rem; color: var(--primary); margin-bottom: 28px; font-weight: 600; }
  .hero-title { font-family: var(--font2); font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 700; line-height: 1.15; margin-bottom: 20px; color: var(--text); }
  .hero-title .hl { color: var(--primary); }
  .hero-sub { font-size: 1.1rem; color: var(--text2); max-width: 560px; line-height: 1.7; margin-bottom: 36px; }
  .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }
  .hero-stats { display: flex; gap: 40px; margin-top: 56px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; }
  .stat-label { font-size: 0.82rem; color: var(--text2); margin-top: 2px; }

  /* ── SECTIONS ── */
  .section { padding: 56px 0; }
  .section-header { margin-bottom: 36px; }
  .section-title { font-family: var(--font2); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; color: var(--text); }
  .section-sub { color: var(--text2); margin-top: 10px; font-size: 0.95rem; max-width: 600px; line-height: 1.6; }

  /* ── FORMS ── */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 0.83rem; font-weight: 600; color: var(--text2); margin-bottom: 7px; }
  .form-input { width: 100%; padding: 11px 14px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 0.9rem; transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s; }
  .form-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); transform: scale(1.005); }
  .form-input::placeholder { color: var(--text3); }
  select.form-input option { background: #fff; color: var(--text); }
  .form-error { font-size: 0.78rem; color: #d92d20; margin-top: 5px; animation: heroFadeIn 0.3s ease; }
  .form-hint { font-size: 0.75rem; color: var(--text3); margin-top: 4px; }
  .checkbox-row { display: flex; align-items: center; gap: 10px; padding: 4px 0; }
  .checkbox-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
  .checkbox-row label { font-size: 0.88rem; font-weight: 600; cursor: pointer; }

  /* ── FILE UPLOAD ── */
  .file-upload-area { border: 2px dashed var(--border); border-radius: var(--radius-sm); padding: 24px; text-align: center; cursor: pointer; transition: all 0.25s; background: var(--bg2); }
  .file-upload-area:hover, .file-upload-area.drag-over { border-color: var(--primary); background: rgba(232,17,59,0.04); transform: scale(1.01); }
  .file-upload-area input[type="file"] { display: none; }
  .file-upload-icon { font-size: 2.2rem; margin-bottom: 8px; animation: floatY 2s ease-in-out infinite; }
  .file-upload-text { font-size: 0.88rem; color: var(--text2); }
  .file-upload-hint { font-size: 0.75rem; color: var(--text3); margin-top: 4px; }
  .file-selected { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(31,168,85,0.08); border: 1px solid var(--green); border-radius: var(--radius-sm); font-size: 0.85rem; margin-top: 8px; animation: heroFadeIn 0.4s ease; }

  /* ── PROGRESS ── */
  .upload-progress { margin-top: 10px; }
  .progress-bar-wrap { width: 100%; background: var(--bg3); border-radius: 4px; height: 8px; overflow: hidden; }
  .progress-bar { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; transition: width 0.3s; position: relative; overflow: hidden; }
  .progress-bar::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: rgba(255,255,255,0.3); animation: shineSweep 1.2s ease-in-out infinite; }

  /* ── MODAL ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,26,46,0.55); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: flex-start; justify-content: center; padding: 20px; overflow-y: auto; animation: heroFadeIn 0.2s ease both; }
  .modal { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 36px; max-width: 540px; width: 100%; position: relative; box-shadow: var(--shadow); margin: auto; animation: modalEnter 0.35s cubic-bezier(0.34,1.3,0.64,1) both; }
  .modal-lg { max-width: 760px; }
  .modal-close { position: absolute; top: 16px; right: 16px; background: var(--bg3); border: none; color: var(--text2); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem; flex-shrink: 0; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .modal-close:hover { color: #fff; background: var(--primary); transform: rotate(90deg) scale(1.1); }
  .modal-title { font-family: var(--font2); font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; padding-right: 40px; color: var(--text); }
  .modal-sub { color: var(--text2); font-size: 0.88rem; margin-bottom: 24px; }

  /* ── TOAST ── */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
  .toast { background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 18px; font-size: 0.88rem; display: flex; align-items: center; gap: 10px; animation: toastBounce 0.45s cubic-bezier(0.34,1.3,0.64,1) both; min-width: 260px; max-width: 360px; box-shadow: var(--shadow); color: var(--text); }
  .toast.success { border-color: var(--green); }
  .toast.error { border-color: var(--primary); }

  /* ── SPINNER ── */
  .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; display: block; }
  .spinner-sm { width: 20px; height: 20px; border-width: 2px; margin: 0; }
  .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: var(--radius-sm); }

  /* ── TABS ── */
  .tabs { display: flex; gap: 4px; background: var(--bg3); border-radius: var(--radius-sm); padding: 4px; margin-bottom: 28px; overflow-x: auto; }
  .tab { flex: 1; padding: 9px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; color: var(--text2); background: transparent; border: none; cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.3,0.64,1); text-align: center; white-space: nowrap; min-width: fit-content; }
  .tab.active { background: var(--primary); color: #fff; transform: scale(1.02); }

  /* ── TAGS ── */
  .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag { padding: 4px 12px; background: #fff; border: 1px solid var(--border); border-radius: 20px; font-size: 0.78rem; color: var(--text2); cursor: pointer; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .tag:hover, .tag.active { border-color: var(--primary); color: var(--primary); background: rgba(232,17,59,0.06); transform: scale(1.05); }

  /* ── DETAIL PAGE ── */
  .detail-header { background: linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%); border-bottom: 1px solid var(--border); padding: 48px 0; }
  .detail-breadcrumb { font-size: 0.82rem; color: var(--text3); margin-bottom: 16px; cursor: pointer; transition: color 0.2s, transform 0.2s; display: inline-block; }
  .detail-breadcrumb:hover { color: var(--primary); transform: translateX(-4px); }
  .detail-breadcrumb span { color: var(--text2); }
  .detail-title { font-family: var(--font2); font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 700; margin-bottom: 12px; color: var(--text); }
  .detail-meta-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; color: var(--text2); font-size: 0.85rem; margin-bottom: 20px; }
  .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; padding: 40px 0; align-items: start; }
  .detail-sidebar { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; position: sticky; top: 90px; transition: box-shadow 0.3s, transform 0.3s; box-shadow: var(--shadow); }
  .detail-sidebar:hover { box-shadow: 0 8px 32px rgba(232,17,59,0.18); transform: translateY(-2px); }
  .sidebar-price { font-family: var(--font2); font-size: 2rem; font-weight: 800; color: var(--primary); margin-bottom: 4px; }
  .sidebar-price-old { font-size: 0.9rem; color: var(--text3); text-decoration: line-through; margin-bottom: 16px; }
  .sidebar-btn { width: 100%; margin-bottom: 10px; justify-content: center; }
  .sidebar-features { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
  .sidebar-feature { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: var(--text2); transition: color 0.2s, transform 0.2s; }
  .sidebar-feature:hover { color: var(--primary); transform: translateX(4px); }

  /* ── VIDEO LIST ── */
  .video-list { display: flex; flex-direction: column; gap: 6px; }
  .video-item { display: flex; align-items: center; gap: 14px; padding: 12px 14px; background: var(--bg2); border: 1px solid transparent; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.25s cubic-bezier(0.22,1,0.36,1); }
  .video-item:hover { border-color: var(--border); background: var(--bg3); transform: translateX(6px); box-shadow: -4px 0 0 var(--primary); }
  .video-item.locked { opacity: 0.6; cursor: not-allowed; }
  .video-num { width: 28px; height: 28px; background: var(--bg3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--primary); flex-shrink: 0; transition: background 0.2s, color 0.2s; }
  .video-item:hover .video-num { background: var(--primary); color: #fff; }
  .video-info { flex: 1; min-width: 0; }
  .video-title-text { font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .video-dur { font-size: 0.75rem; color: var(--text3); margin-top: 2px; }

  /* ── ADMIN ── */
  .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 72px); }
  .admin-sidebar { background: #fff; border-right: 1px solid var(--border); padding: 24px 0; position: sticky; top: 72px; height: calc(100vh - 72px); overflow-y: auto; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: var(--text2); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.25s cubic-bezier(0.22,1,0.36,1); border-left: 3px solid transparent; }
  .admin-nav-item:hover { color: var(--primary); background: var(--bg2); padding-left: 24px; }
  .admin-nav-item.active { color: var(--primary); border-left-color: var(--primary); background: rgba(232,17,59,0.06); }
  .admin-nav-icon { font-size: 1.1rem; flex-shrink: 0; }
  .admin-content { padding: 32px; background: var(--bg2); min-height: calc(100vh - 72px); }
  .admin-header { margin-bottom: 28px; }
  .admin-title { font-family: var(--font2); font-size: 1.6rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .admin-sub { color: var(--text2); font-size: 0.88rem; }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: transform 0.3s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.3s; cursor: default; }
  .stat-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 32px rgba(232,17,59,0.15); }
  .stat-card-icon { font-size: 1.8rem; margin-bottom: 12px; transition: transform 0.3s; }
  .stat-card:hover .stat-card-icon { transform: scale(1.2) rotate(-5deg); }
  .stat-card-num { font-family: var(--font2); font-size: 1.8rem; font-weight: 700; color: var(--primary); }
  .stat-card-label { font-size: 0.8rem; color: var(--text2); margin-top: 2px; }

  /* ── TABLE ── */
  .table-wrap { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; min-width: 600px; }
  th { background: var(--bg2); padding: 12px 16px; text-align: left; font-size: 0.78rem; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); white-space: nowrap; }
  td { padding: 13px 16px; font-size: 0.87rem; border-bottom: 1px solid rgba(232,17,59,0.06); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr { transition: background 0.15s; }
  tr:hover td { background: rgba(232,17,59,0.03); }

  /* ── MISC ── */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-state .icon { font-size: 4rem; margin-bottom: 16px; animation: floatY 2.5s ease-in-out infinite; }
  .empty-state p { font-size: 0.9rem; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
  .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 16px; margin-bottom: 28px; transition: border-color 0.2s, box-shadow 0.2s; }
  .search-bar:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
  .search-bar input { flex: 1; background: none; border: none; color: var(--text); font-size: 0.9rem; outline: none; }
  .search-bar input::placeholder { color: var(--text3); }

  /* ── CATEGORY STRIP ── */
  .mascot-strip { display: flex; gap: 20px; padding: 20px 0; overflow-x: auto; scrollbar-width: none; }
  .mascot-strip::-webkit-scrollbar { display: none; }
  .mascot-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; min-width: 130px; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.3,0.64,1); flex-shrink: 0; }
  .mascot-card:hover { border-color: var(--primary); transform: translateY(-8px) scale(1.04); box-shadow: 0 12px 32px rgba(232,17,59,0.18); }
  .mascot-card.active { border-color: var(--primary); background: rgba(232,17,59,0.06); }
  .mascot-emoji { font-size: 2.4rem; margin-bottom: 8px; transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); display: block; }
  .mascot-card:hover .mascot-emoji { transform: scale(1.25) rotate(-8deg); }
  .mascot-name { font-size: 0.8rem; font-weight: 600; color: var(--text2); }
  .mascot-label { font-size: 0.7rem; color: var(--text3); margin-top: 2px; }

  /* ── FEATURES ── */
  .features-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
  .feature-item { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 20px; transition: all 0.3s cubic-bezier(0.34,1.3,0.64,1); cursor: default; }
  .feature-item:hover { border-color: var(--primary); transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 40px rgba(232,17,59,0.14); }
  .feature-icon { font-size: 2rem; margin-bottom: 12px; transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); display: block; }
  .feature-item:hover .feature-icon { transform: scale(1.3) rotate(-8deg); }
  .feature-title { font-weight: 700; margin-bottom: 6px; font-size: 0.95rem; color: var(--text); }
  .feature-desc { font-size: 0.82rem; color: var(--text2); line-height: 1.5; }

  /* ── LIVE ── */
  .live-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: rgba(232,17,59,0.12); border-radius: 20px; font-size: 0.72rem; font-weight: 700; color: var(--primary); }
  .live-dot { width: 7px; height: 7px; background: var(--primary); border-radius: 50%; animation: livePulseRing 1.5s ease-in-out infinite; }

  .grad { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* ── USER MENU ── */
  .user-menu { position: absolute; top: calc(100% + 10px); right: 0; background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 8px; min-width: 200px; box-shadow: var(--shadow); z-index: 150; animation: modalEnter 0.25s cubic-bezier(0.34,1.3,0.64,1) both; }
  .user-menu-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px; font-size: 0.87rem; color: var(--text2); cursor: pointer; transition: all 0.2s; }
  .user-menu-item:hover { background: var(--bg2); color: var(--primary); transform: translateX(4px); }
  .user-menu-divider { border: none; border-top: 1px solid var(--border); margin: 6px 0; }

  /* ── VIDEO MANAGER ── */
  .video-manager-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 8px; transition: all 0.25s; }
  .video-manager-item:hover { border-color: var(--primary); transform: translateX(4px); }
  .video-manager-info { flex: 1; min-width: 0; }
  .video-manager-title { font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .video-manager-meta { font-size: 0.75rem; color: var(--text3); margin-top: 2px; display: flex; gap: 12px; }
  .video-type-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
  .video-type-tab { flex: 1; padding: 10px; background: var(--bg2); border: 2px solid var(--border); border-radius: var(--radius-sm); text-align: center; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: var(--text2); transition: all 0.25s cubic-bezier(0.34,1.3,0.64,1); }
  .video-type-tab.active { border-color: var(--primary); color: var(--primary); background: rgba(232,17,59,0.06); transform: scale(1.02); }

  /* ── INFO BOXES ── */
  .info-box { background: rgba(232,17,59,0.05); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 0.84rem; color: var(--text2); margin-bottom: 16px; }
  .success-box { background: rgba(31,168,85,0.08); border: 1px solid rgba(31,168,85,0.3); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 0.87rem; color: var(--green); animation: heroFadeIn 0.4s ease; }
  .warning-box { background: rgba(255,217,61,0.12); border: 1px solid rgba(255,217,61,0.4); border-radius: var(--radius-sm); padding: 12px 16px; font-size: 0.87rem; color: #b88600; }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .hamburger-btn { display: flex !important; }
    .desktop-auth-btns { display: none !important; }
    .nav-links { display: none; }
    .mobile-nav-menu { display: block; }
    .detail-layout { grid-template-columns: 1fr; }
    .admin-layout { grid-template-columns: 1fr; }
    .admin-sidebar { position: static; height: auto; display: flex; overflow-x: auto; padding: 8px; border-right: none; border-bottom: 1px solid var(--border); }
    .admin-nav-item { border-left: none; border-bottom: 3px solid transparent; white-space: nowrap; }
    .admin-nav-item.active { border-left-color: transparent; border-bottom-color: var(--primary); }
    .hero-stats { gap: 24px; }
    .hero { padding: 48px 0 40px; }
  }
  @media (max-width: 600px) {
    .grid-3, .grid-2 { grid-template-columns: 1fr; }
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .modal { padding: 20px; }
    .admin-content { padding: 16px; }
    .hero-stats { gap: 16px; }
    .hero-title { font-size: 1.8rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />;
}

const LOGO_URL = "https://res.cloudinary.com/dfsimrqwi/image/upload/v1781501874/What_Next_actual_Logo_1_1_q10dni.png";
function Logo({ onClick }) {
  return <div className="logo" onClick={onClick}><img src={LOGO_URL} alt="WhatNext" className="logo-img" /></div>;
}

const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{icons[t.type] || "💬"} {t.msg}</div>)}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => useContext(ToastContext);

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

function FileUploadArea({ accept, onFile, file, label, hint, icon = "📁" }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const handleFile = (f) => { if (f) onFile(f); };
  return (
    <div>
      <div className={`file-upload-area ${drag ? "drag-over" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}>
        <input ref={inputRef} type="file" accept={accept} onChange={e => handleFile(e.target.files[0])} />
        <div className="file-upload-icon">{icon}</div>
        <div className="file-upload-text">{label || "Click or drag file here"}</div>
        {hint && <div className="file-upload-hint">{hint}</div>}
      </div>
      {file && <div className="file-selected"><span>✅</span><span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span><span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>({(file.size / 1024 / 1024).toFixed(1)} MB)</span></div>}
    </div>
  );
}

function AuthModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const toast = useToast();
  const submit = async () => {
    setErr(""); setLoading(true);
    const res = tab === "login" ? await login(form.email, form.password) : await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) { toast("Welcome! 🎉", "success"); onClose(); }
    else setErr(res.message || "Something went wrong");
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ marginBottom: 24 }}><Logo /></div>
        <div className="tabs">
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Sign Up</button>
        </div>
        {tab === "register" && <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>}
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && submit()} /></div>
        {err && <div className="form-error" style={{ marginBottom: 12 }}>⚠️ {err}</div>}
        <MagneticBtn className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={loading}>{loading ? "Please wait…" : tab === "login" ? "Login →" : "Create Account →"}</MagneticBtn>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text3)", marginTop: 16 }}>By continuing you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAVBAR — FIXED WITH MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────
function Navbar({ navigate, path, onAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const [menu, setMenu] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const links = [
    { label: "Home", to: "/", icon: "🏠" },
    { label: "Courses", to: "/courses", icon: "📚" },
    { label: "Live Classes", to: "/live", icon: "📡" },
    { label: "Notes", to: "/notes", icon: "📄" },
  ];
  if (isAdmin) links.push({ label: "Admin", to: "/admin", icon: "⚙️" });

  const handleNavClick = (to) => { navigate(to); setMobileNav(false); setMenu(false); };

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileNav) return;
    const close = (e) => {
      if (!e.target.closest(".mobile-nav-menu") && !e.target.closest(".hamburger-btn")) setMobileNav(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [mobileNav]);

  return (
    <>
      <nav className="navbar">
        <div className="container inner">
          <Logo onClick={() => handleNavClick("/")} />

          {/* Desktop links */}
          <div className="nav-links">
            {links.map(l => (
              <span key={l.to} className={`nav-link ${path === l.to ? "active" : ""}`} onClick={() => handleNavClick(l.to)} style={{ cursor: "pointer" }}>{l.label}</span>
            ))}
          </div>

          <div className="nav-actions">
            {/* Desktop auth */}
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
                    <div className="user-menu-item" onClick={() => handleNavClick("/dashboard")}>📚 My Learning</div>
                    {isAdmin && <div className="user-menu-item" onClick={() => handleNavClick("/admin")}>⚙️ Admin Panel</div>}
                    <hr className="user-menu-divider" />
                    <div className="user-menu-item" style={{ color: "var(--primary)" }} onClick={() => { logout(); setMenu(false); }}>🚪 Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="desktop-auth-btns">
                <MagneticBtn className="btn btn-outline btn-sm" onClick={onAuth}>Login</MagneticBtn>
                <MagneticBtn className="btn btn-primary btn-sm" onClick={onAuth}>Sign Up Free</MagneticBtn>
              </div>
            )}

            {/* Hamburger button */}
            <button className="hamburger-btn" onClick={() => setMobileNav(p => !p)} aria-label="Toggle menu">
              {mobileNav ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNav && (
        <div className="mobile-nav-menu">
          {/* User info if logged in */}
          {user && (
            <div className="mobile-nav-user">
              <div className="avatar-btn" style={{ flexShrink: 0 }}>{user.name?.[0]?.toUpperCase() || "U"}</div>
              <div className="mobile-nav-user-info">
                <div className="mobile-nav-user-name">{user.name}</div>
                <div className="mobile-nav-user-email">{user.email}</div>
              </div>
            </div>
          )}

          {/* Nav links */}
          {links.map(l => (
            <div key={l.to} className={`mobile-nav-item ${path === l.to ? "active" : ""}`} onClick={() => handleNavClick(l.to)}>
              <span className="nav-icon">{l.icon}</span>
              <span>{l.label}</span>
            </div>
          ))}

          {/* Logged in extra links */}
          {user && (
            <div key="dashboard-mobile" className={`mobile-nav-item ${path === "/dashboard" ? "active" : ""}`} onClick={() => handleNavClick("/dashboard")}>
              <span className="nav-icon">🎓</span>
              <span>My Learning</span>
            </div>
          )}

          {/* Auth actions */}
          <div className="mobile-nav-auth">
            {user ? (
              <button className="btn btn-danger" style={{ width: "100%", justifyContent: "center" }} onClick={() => { logout(); setMobileNav(false); }}>🚪 Logout</button>
            ) : (
              <>
                <MagneticBtn className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onAuth(); setMobileNav(false); }}>Get Started Free →</MagneticBtn>
                <MagneticBtn className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onAuth(); setMobileNav(false); }}>Login</MagneticBtn>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const COURSE_CATS = [
  { emoji: "💻", name: "MERN Stack", label: "Full Stack", level: "advanced" },
  { emoji: "⚛️", name: "React.js", label: "Frontend", level: "intermediate" },
  { emoji: "🟢", name: "Node.js", label: "Backend", level: "intermediate" },
  { emoji: "📱", name: "Flutter", label: "Mobile App", level: "intermediate" },
  { emoji: "🎨", name: "UI/UX Design", label: "Design", level: "beginner" },
  { emoji: "🤖", name: "AI", label: "Artificial Intelligence", level: "advanced" },
  { emoji: "📊", name: "Data Science", label: "Analytics", level: "advanced" },
  { emoji: "☁️", name: "AWS Cloud", label: "Cloud", level: "advanced" },
  { emoji: "🔒", name: "Cyber Security", label: "Security", level: "advanced" },
  { emoji: "📈", name: "Digital Marketing", label: "Marketing", level: "beginner" }
];

function CategoryStrip({ onSelect, selected }) {
  return (
    <div className="mascot-strip">
      <ParticleMascotCard emoji="🌟" name="All Courses" label="View All" active={!selected} onClick={() => onSelect(null)} />
      {COURSE_CATS.map(a => <ParticleMascotCard key={a.level + a.name} emoji={a.emoji} name={a.name} label={a.label} active={selected === a.level} onClick={() => onSelect(a.level)} />)}
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const price = course.isFree ? 0 : (course.discountPrice ?? course.price);
  const levelEmojis = { beginner: "🎨", intermediate: "⚛️", advanced: "💻", all: "📚" };
  return (
    <TiltCard className="card" onClick={() => onClick(course._id)} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)" }}>
        {course.thumbnail ? <img src={course.thumbnail} alt={course.title} /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: "3rem" }}>{levelEmojis[course.level] || "📚"}</div><div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>{course.category || "Course"}</div></div>}
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
          <span className={`price ${course.isFree ? "price-free" : ""}`}>{course.isFree ? "FREE" : `₹${price}`}</span>
          {!course.isFree && course.discountPrice && <span className="price-old">₹{course.price}</span>}
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>🎬 {course.videos?.length || 0} videos</span>
        </div>
      </div>
    </TiltCard>
  );
}

function LiveClassCard({ liveClass, onClick }) {
  const isLive = liveClass.status === "live";
  const date = new Date(liveClass.scheduledAt);
  return (
    <TiltCard className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)", position: "relative" }}>
        {liveClass.thumbnail ? <img src={liveClass.thumbnail} alt={liveClass.title} /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: "3rem" }}>📡</div><div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>Live Class</div></div>}
        {isLive && <div style={{ position: "absolute", top: 12, left: 12 }}><div className="live-badge"><div className="live-dot" />LIVE</div></div>}
      </div>
      <div className="card-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <span className={`badge ${isLive ? "badge-accent" : liveClass.status === "upcoming" ? "badge-cyan" : "badge-primary"}`}>{liveClass.status}</span>
          {liveClass.isFree && <span className="badge badge-green">FREE</span>}
        </div>
        <div className="card-title">{liveClass.title}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 12 }}>🗓 {date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {liveClass.duration || 60} mins</div>
        <div className="card-meta">
          <span className={`price ${liveClass.isFree ? "price-free" : ""}`}>{liveClass.isFree ? "FREE" : `₹${liveClass.price}`}</span>
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>👥 {liveClass.registrations?.length || 0} registered</span>
        </div>
      </div>
    </TiltCard>
  );
}

function NotesCard({ note, onClick }) {
  const price = note.isFree ? 0 : (note.discountPrice ?? note.price);
  return (
    <TiltCard className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="card-thumb" style={{ background: "var(--bg3)" }}>
        {note.thumbnail ? <img src={note.thumbnail} alt={note.title} /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: "3rem" }}>📄</div><div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 8 }}>{note.fileType?.toUpperCase() || "PDF"}</div></div>}
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
          <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "var(--text3)" }}>📥 {note.totalPurchases || 0} downloads</span>
        </div>
      </div>
    </TiltCard>
  );
}

function HomePage({ navigate, onAuth }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/courses?limit=6`).then(r => r.json()).then(d => { if (d.success) setCourses(d.data || d.courses || []); setLoadingCourses(false); }).catch(() => setLoadingCourses(false));
    fetch(`${API_BASE}/live-classes?limit=4`).then(r => r.json()).then(d => { if (d.success) setLiveClasses(d.data || d.liveClasses || []); }).catch(() => {});
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">🎓 India's Most Affordable Learning Platform</div>
          <h1 className="hero-title">Learn From <span className="hl">Expert Tutors</span><br />Anytime, Anywhere</h1>
          <p className="hero-sub">Access 500+ courses, live interactive classes, and downloadable study notes — all at prices that don't break the bank.</p>
          <div className="hero-ctas">
            {user ? <MagneticBtn className="btn btn-primary btn-lg" onClick={() => navigate("/courses")}>Browse Courses 🚀</MagneticBtn> : <MagneticBtn className="btn btn-primary btn-lg" onClick={onAuth}>Get Started Free →</MagneticBtn>}
            <MagneticBtn className="btn btn-outline btn-lg" onClick={() => navigate("/live")}>View Live Classes 📡</MagneticBtn>
          </div>
          <div className="hero-stats">
            {[["50000", "K+", "Active Students"], ["500", "+", "Expert Courses"], ["1000", "+", "Live Classes"], ["4.8", "★", "Average Rating"]].map(([n, sfx, l]) => (
              <div key={l} className="stat">
                <span className="stat-num"><AnimatedNumber target={parseFloat(n)} suffix={sfx} duration={1400} /></span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <RevealLeft><div className="section-header"><div className="section-eyebrow">Choose Your Batch</div><h2 className="section-title">Find Your <span className="grad">Learning Tribe</span></h2></div></RevealLeft>
          <Reveal delay={100}><CategoryStrip onSelect={() => navigate("/courses")} selected={null} /></Reveal>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <Reveal><div className="section-header"><div className="section-eyebrow">Why WhatNext</div><h2 className="section-title">Everything You Need to <span className="grad">Excel</span></h2></div></Reveal>
          <div className="features-row">
            {[["📡", "Live Classes", "Interact with instructors in real-time."], ["🎬", "Video Courses", "Learn at your pace with HD video lectures."], ["📄", "Study Notes", "Curated PDF notes to reinforce your learning."], ["📊", "Track Progress", "Monitor video progress and stay on goals."], ["💳", "Easy Payments", "Secure Razorpay checkout. Pay once, learn forever."], ["🏆", "Certificates", "Earn certificates to showcase achievements."]].map(([icon, title, desc], i) => (
              <RevealBounce key={title} delay={i * 90}><div className="feature-item"><div className="feature-icon">{icon}</div><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div></RevealBounce>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <RevealFlip>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
              <div><div className="section-eyebrow">Popular Picks</div><h2 className="section-title">Featured <span className="grad">Courses</span></h2></div>
              <button className="btn btn-outline btn-sm" onClick={() => navigate("/courses")}>View All →</button>
            </div>
          </RevealFlip>
          {loadingCourses ? <div className="spinner" /> : courses.length === 0 ? <div className="empty-state"><div className="icon">📚</div><p>No courses yet.</p></div> : (
            <div className="grid-3">{courses.slice(0, 6).map((c, i) => <RevealBounce key={c._id} delay={i * 80}><CourseCard course={c} onClick={() => navigate(`/courses/${c._id}`)} /></RevealBounce>)}</div>
          )}
        </div>
      </section>

      {liveClasses.length > 0 && (
        <section className="section" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="container">
            <RevealLeft>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                <div><div className="section-eyebrow">Coming Up</div><h2 className="section-title">Upcoming <span className="grad">Live Classes</span></h2></div>
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/live")}>View All →</button>
              </div>
            </RevealLeft>
            <div className="grid-3">{liveClasses.slice(0, 3).map((lc, i) => <RevealScale key={lc._id} delay={i * 90}><LiveClassCard liveClass={lc} onClick={() => navigate(`/live/${lc._id}`)} /></RevealScale>)}</div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <RevealScale>
            <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)", border: "1px solid var(--border)", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16, animation: "floatYSlow 4s ease-in-out infinite" }}>💻</div>
              <h2 style={{ fontFamily: "var(--font2)", fontSize: "1.8rem", fontWeight: 700, marginBottom: 12, color: "#fff" }}>Ready to start learning?</h2>
              <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>Join 50,000+ students mastering their subjects with expert guidance.</p>
              <MagneticBtn className="btn btn-lg" style={{ background: "#fff", color: "var(--primary)" }} onClick={user ? () => navigate("/courses") : onAuth}>{user ? "Browse Courses 🚀" : "Start Learning Free →"}</MagneticBtn>
            </div>
          </RevealScale>
        </div>
      </section>
    </div>
  );
}

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
    fetch(`${API_BASE}/courses?${params}`).then(r => r.json()).then(d => { if (d.success) setCourses(d.data || d.courses || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search, level, category]);

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container"><Reveal><h1 className="section-title" style={{ marginBottom: 8 }}>All <span className="grad">Courses</span></h1><p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Explore our library of expert-taught courses</p></Reveal></div>
      </div>
      <div className="container section">
        <Reveal><CategoryStrip onSelect={setLevel} selected={level} /></Reveal>
        <Reveal delay={80}>
          <div className="search-bar" style={{ marginTop: 16 }}>
            <span style={{ color: "var(--text3)" }}>🔍</span>
            <input placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", color: "var(--text3)" }}>✕</button>}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="tag-row">
            <span className={`tag ${!category ? "active" : ""}`} onClick={() => setCategory("")}>All</span>
            {categories.map(c => <span key={c} className={`tag ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</span>)}
          </div>
        </Reveal>
        {loading ? <div className="spinner" /> : courses.length === 0 ? <div className="empty-state"><div className="icon">🔎</div><p>No courses found. Try adjusting filters.</p></div> : (
          <div className="grid-3">{courses.map((c, i) => <RevealBounce key={c._id} delay={i * 60}><CourseCard course={c} onClick={() => navigate(`/courses/${c._id}`)} /></RevealBounce>)}</div>
        )}
      </div>
    </div>
  );
}

function CourseDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/courses/${id}`, { headers }).then(r => r.json()).then(d => { if (d.success) setCourse(d.data || d.course); setLoading(false); }).catch(() => setLoading(false));
  }, [id, token]);

  const hasPurchased = course?.purchased || user?.purchasedCourses?.some(p => p.course?.toString() === id || p.course === id);
  const price = course?.isFree ? 0 : (course?.discountPrice ?? course?.price ?? 0);

  const handleBuy = async () => {
    if (!user) { onAuth(); return; }
    if (course.isFree || price === 0) { toast("Enrolling…", "info"); return; }
    setPaying(true);
    try {
      const order = await authFetch("/payments/create-order", { method: "POST", body: JSON.stringify({ itemType: "course", itemId: id }) });
      if (!order.success) { toast(order.message || "Order failed", "error"); setPaying(false); return; }
      const options = { key: order.razorpayKeyId || "", amount: order.order?.amount, currency: order.order?.currency || "INR", name: "WhatNext", description: course.title, order_id: order.order?.id, handler: async (res) => { const verify = await authFetch("/payments/verify", { method: "POST", body: JSON.stringify({ razorpayOrderId: res.razorpay_order_id, razorpayPaymentId: res.razorpay_payment_id, razorpaySignature: res.razorpay_signature, itemType: "course", itemId: id }) }); if (verify.success) { toast("Purchase successful! 🎉", "success"); navigate("/dashboard"); } else toast(verify.message || "Verification failed", "error"); }, prefill: { name: user.name, email: user.email } };
      if (window.Razorpay) { const rz = new window.Razorpay(options); rz.open(); } else toast("Payment gateway not loaded", "error");
    } catch { toast("Payment error", "error"); }
    setPaying(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!course) return <div className="page"><div className="container" style={{ padding: "80px 24px", textAlign: "center" }}><h2>Course not found</h2></div></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <Reveal>
            <div className="detail-breadcrumb" onClick={() => navigate("/courses")}>← Back to <span>Courses</span></div>
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <span className="badge badge-primary">{course.level}</span>
              {course.category && <span className="badge badge-cyan">{course.category}</span>}
              {course.isFree && <span className="badge badge-green">FREE</span>}
            </div>
            <h1 className="detail-title">{course.title}</h1>
            <div className="detail-meta-row"><span>🎬 {course.videos?.length || 0} videos</span><span>👥 {course.totalStudents || 0} students</span><span>🌐 {course.language || "English"}</span></div>
            <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{course.description}</p>
          </Reveal>
        </div>
      </div>
      <div className="container">
        <div className="detail-layout">
          <div>
            {hasPurchased && <Reveal><div className="success-box" style={{ marginBottom: 24 }}>✅ You have access to this course!</div></Reveal>}
            {course.outcomes?.length > 0 && (
              <RevealFlip>
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🎯 What You'll Learn</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {course.outcomes.map((o, i) => <Reveal key={i} delay={i * 50}><div style={{ display: "flex", gap: 8, fontSize: "0.87rem", color: "var(--text2)" }}><span style={{ color: "var(--green)", flexShrink: 0 }}>✓</span> {o}</div></Reveal>)}
                  </div>
                </div>
              </RevealFlip>
            )}
            {course.requirements?.length > 0 && (
              <RevealLeft>
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 14 }}>📋 Requirements</h3>
                  {course.requirements.map((r, i) => <div key={i} style={{ fontSize: "0.87rem", color: "var(--text2)", marginBottom: 6, display: "flex", gap: 8 }}><span>•</span> {r}</div>)}
                </div>
              </RevealLeft>
            )}
            <Reveal>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 14 }}>🎬 Course Content</h3>
                {(!course.videos || course.videos.length === 0) ? <div style={{ color: "var(--text3)", fontSize: "0.87rem" }}>No videos added yet.</div> : (
                  <div className="video-list">
                    {course.videos.map((v, i) => (
                      <Reveal key={v._id || i} delay={i * 40}>
                        <div className={`video-item ${!hasPurchased && !v.isPreview ? "locked" : ""}`}>
                          <div className="video-num">{i + 1}</div>
                          <div className="video-info"><div className="video-title-text">{v.title}</div>{v.duration > 0 && <div className="video-dur">{Math.floor(v.duration / 60)}m {v.duration % 60}s</div>}</div>
                          {v.isPreview ? <span className="badge badge-green">Preview</span> : hasPurchased ? <span style={{ color: "var(--text3)" }}>▶</span> : <span style={{ color: "var(--text3)" }}>🔒</span>}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
          <RevealRight>
            <div className="detail-sidebar">
              <div className="sidebar-price">{course.isFree ? "FREE" : `₹${price}`}</div>
              {!course.isFree && course.discountPrice && <div className="sidebar-price-old">₹{course.price}</div>}
              {hasPurchased ? <MagneticBtn className="btn btn-green btn-lg sidebar-btn" onClick={() => navigate("/dashboard")}>Go to My Learning →</MagneticBtn> : <MagneticBtn className="btn btn-primary btn-lg sidebar-btn" onClick={handleBuy} disabled={paying}>{paying ? "Processing…" : course.isFree ? "Enrol Free →" : `Buy for ₹${price} →`}</MagneticBtn>}
              <div className="sidebar-features">
                {[["📱", "Access on all devices"], ["♾️", "Lifetime access"], ["🎬", `${course.videos?.length || 0} video lectures`], ["📄", "Downloadable resources"], ["🏆", "Certificate of completion"]].map(([icon, label]) => <div key={label} className="sidebar-feature"><span>{icon}</span> {label}</div>)}
              </div>
            </div>
          </RevealRight>
        </div>
      </div>
    </div>
  );
}

function LiveClassesPage({ navigate }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    fetch(`${API_BASE}/live-classes?${params}`).then(r => r.json()).then(d => { if (d.success) setClasses(d.data || d.liveClasses || d.classes || []); setLoading(false); }).catch(() => setLoading(false));
  }, [status]);
  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container"><Reveal><h1 className="section-title" style={{ marginBottom: 8 }}>Live <span className="grad">Classes</span></h1><p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Join interactive sessions with expert instructors in real time</p></Reveal></div>
      </div>
      <div className="container section">
        <Reveal>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {["all", "upcoming", "live", "completed"].map(s => <button key={s} className={`btn ${status === s ? "btn-primary" : "btn-outline"} btn-sm`} onClick={() => setStatus(s)} style={{ textTransform: "capitalize" }}>{s === "live" && "🔴 "}{s}</button>)}
          </div>
        </Reveal>
        {loading ? <div className="spinner" /> : classes.length === 0 ? <div className="empty-state"><div className="icon">📡</div><p>No live classes found.</p></div> : (
          <div className="grid-3">{classes.map((lc, i) => <RevealBounce key={lc._id} delay={i * 70}><LiveClassCard liveClass={lc} onClick={() => navigate(`/live/${lc._id}`)} /></RevealBounce>)}</div>
        )}
      </div>
    </div>
  );
}

function LiveClassDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [lc, setLc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/live-classes/${id}`, { headers }).then(r => r.json()).then(d => { if (d.success) setLc(d.data || d.liveClass); setLoading(false); }).catch(() => setLoading(false));
  }, [id, token]);

  const isRegistered = lc?.registered || user?.liveClassRegistrations?.some(r => r.liveClass?.toString() === id || r.liveClass === id);

  const handleRegister = async () => {
    if (!user) { onAuth(); return; }
    if (!lc.isFree && lc.price > 0) {
      try {
        const order = await authFetch('/payments/create-order', { method: 'POST', body: JSON.stringify({ itemType: 'liveClass', itemId: id }) });
        if (!order.success) { toast(order.message || 'Could not create order', 'error'); return; }
        const options = { key: order.razorpayKeyId || '', amount: order.order?.amount, currency: order.order?.currency || 'INR', name: 'WhatNext', description: lc.title, order_id: order.order?.id, handler: async (razorpayRes) => { const verify = await authFetch('/payments/verify', { method: 'POST', body: JSON.stringify({ razorpayOrderId: razorpayRes.razorpay_order_id, razorpayPaymentId: razorpayRes.razorpay_payment_id, razorpaySignature: razorpayRes.razorpay_signature, itemType: 'liveClass', itemId: id }) }); if (verify.success) { toast("Payment successful! You're registered 🎉", 'success'); const headers = token ? { Authorization: `Bearer ${token}` } : {}; fetch(`${API_BASE}/live-classes/${id}`, { headers }).then(r => r.json()).then(d => { if (d.success) setLc(d.data || d.liveClass); }); } else toast(verify.message || 'Payment verification failed', 'error'); }, prefill: { name: user.name, email: user.email }, modal: { ondismiss: () => toast('Payment cancelled', 'info') } };
        if (window.Razorpay) { const rz = new window.Razorpay(options); rz.open(); } else toast('Payment gateway not loaded', 'error');
      } catch { toast('Payment error', 'error'); }
      return;
    }
    setRegistering(true);
    try {
      const res = await authFetch(`/live-classes/${id}/register`, { method: 'POST', body: JSON.stringify({}) });
      if (res.success) { toast('Registered! 🎉 Meeting link will be sent before class starts.', 'success'); const headers = token ? { Authorization: `Bearer ${token}` } : {}; fetch(`${API_BASE}/live-classes/${id}`, { headers }).then(r => r.json()).then(d => { if (d.success) setLc(d.data || d.liveClass); }); }
      else toast(res.message || 'Registration failed', 'error');
    } catch { toast('Error registering', 'error'); }
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
          <Reveal>
            <div className="detail-breadcrumb" onClick={() => navigate("/live")}>← Back to <span>Live Classes</span></div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              {isLive && <div className="live-badge"><div className="live-dot" />LIVE NOW</div>}
              <span className={`badge ${lc.isFree ? "badge-green" : "badge-primary"}`}>{lc.isFree ? "FREE" : `₹${lc.price}`}</span>
              <span className="badge badge-cyan">{lc.platform}</span>
            </div>
            <h1 className="detail-title">{lc.title}</h1>
            <div className="detail-meta-row"><span>🗓 {date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span><span>🕐 {date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span><span>⏱ {lc.duration} mins</span><span>👥 {lc.registrations?.length || 0} / {lc.maxParticipants}</span></div>
            {lc.description && <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{lc.description}</p>}
          </Reveal>
        </div>
      </div>
      <div className="container">
        <div className="detail-layout">
          <div>
            {isRegistered && <Reveal><div className="success-box" style={{ marginBottom: 24 }}>✅ You're registered! Meeting link will be sent {lc.urlSendMinutesBefore || 30} minutes before the class.</div></Reveal>}
            <RevealFlip delay={60}>
              <div style={{ background: "var(--surface)", borderRadius: 14, padding: 24, border: "1px solid var(--border)" }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Class Details</h3>
                {[["Platform", lc.platform], ["Duration", `${lc.duration} minutes`], ["Max Participants", lc.maxParticipants], ["Registered", lc.registrations?.length || 0], ["Seats Left", lc.availableSeats ?? Math.max(0, lc.maxParticipants - (lc.registrations?.length || 0))]].map(([k, v], i) => (
                  <Reveal key={k} delay={i * 50}><div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}><span style={{ color: "var(--text2)" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div></Reveal>
                ))}
              </div>
            </RevealFlip>
          </div>
          <RevealRight>
            <div className="detail-sidebar">
              <div className="sidebar-price">{lc.isFree ? "FREE" : `₹${lc.price}`}</div>
              {isRegistered ? <button className="btn btn-green btn-lg sidebar-btn" disabled>✅ Registered</button> : lc.status === "completed" || lc.status === "cancelled" ? <button className="btn btn-outline btn-lg sidebar-btn" disabled>Class {lc.status}</button> : <MagneticBtn className="btn btn-primary btn-lg sidebar-btn" onClick={handleRegister} disabled={registering || lc.isFull}>{registering ? "Registering…" : lc.isFull ? "Class Full" : "Register Now →"}</MagneticBtn>}
              <div className="sidebar-features">
                {[["📡", lc.platform + " meeting"], ["📧", "Link sent via email"], ["⏱", `${lc.duration} min session`], ["👥", `Max ${lc.maxParticipants} participants`]].map(([icon, label]) => <div key={label} className="sidebar-feature"><span>{icon}</span> {label}</div>)}
              </div>
            </div>
          </RevealRight>
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
    fetch(`${API_BASE}/notes?${params}`).then(r => r.json()).then(d => { if (d.success) setNotes(d.data || d.notes || []); setLoading(false); }).catch(() => setLoading(false));
  }, [search]);
  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container"><Reveal><h1 className="section-title" style={{ marginBottom: 8 }}>Study <span className="grad">Notes</span></h1><p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Curated PDFs and study material for focused learning</p></Reveal></div>
      </div>
      <div className="container section">
        <Reveal>
          <div className="search-bar">
            <span style={{ color: "var(--text3)" }}>🔍</span>
            <input placeholder="Search notes…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", color: "var(--text3)" }}>✕</button>}
          </div>
        </Reveal>
        {loading ? <div className="spinner" /> : notes.length === 0 ? <div className="empty-state"><div className="icon">📄</div><p>No notes found.</p></div> : (
          <div className="grid-3">{notes.map((n, i) => <RevealBounce key={n._id} delay={i * 65}><NotesCard note={n} onClick={() => navigate(`/notes/${n._id}`)} /></RevealBounce>)}</div>
        )}
      </div>
    </div>
  );
}

function NoteDetailPage({ id, navigate, onAuth }) {
  const { user, authFetch, token } = useAuth();
  const toast = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_BASE}/notes/${id}`, { headers }).then(r => r.json()).then(d => { if (d.success) setNote(d.data || d.note); setLoading(false); }).catch(() => setLoading(false));
  }, [id, token]);

  const hasPurchased = note?.purchased || user?.purchasedNotes?.some(p => p.notes?.toString() === id || p.notes === id);
  const price = note?.isFree ? 0 : (note?.discountPrice ?? note?.price ?? 0);

  const handleDownload = async () => {
    if (!user) { onAuth(); return; }
    if (!hasPurchased && !note?.isFree) { toast("Please purchase to download", "error"); return; }
    window.open(`${API_BASE}/notes/${id}/download?token=${token}`, "_blank");
  };

  const handleBuy = async () => {
    if (!user) { onAuth(); return; }
    setPaying(true);
    try {
      const order = await authFetch("/payments/create-order", { method: "POST", body: JSON.stringify({ itemType: "notes", itemId: id }) });
      if (!order.success) { toast(order.message || "Order failed", "error"); setPaying(false); return; }
      const options = { key: order.razorpayKeyId || "", amount: order.order?.amount, currency: order.order?.currency || "INR", name: "WhatNext", description: note.title, order_id: order.order?.id, handler: async (res) => { const verify = await authFetch("/payments/verify", { method: "POST", body: JSON.stringify({ razorpayOrderId: res.razorpay_order_id, razorpayPaymentId: res.razorpay_payment_id, razorpaySignature: res.razorpay_signature, itemType: "notes", itemId: id }) }); if (verify.success) toast("Purchase successful! 🎉", "success"); else toast(verify.message || "Verification failed", "error"); }, prefill: { name: user.name, email: user.email } };
      if (window.Razorpay) { const rz = new window.Razorpay(options); rz.open(); } else toast("Payment gateway not loaded", "error");
    } catch { toast("Payment error", "error"); }
    setPaying(false);
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!note) return <div className="page"><div className="container" style={{ padding: "80px 24px", textAlign: "center" }}><h2>Note not found</h2></div></div>;

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <Reveal>
            <div className="detail-breadcrumb" onClick={() => navigate("/notes")}>← Back to <span>Notes</span></div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <span className="badge badge-yellow">{note.fileType?.toUpperCase()}</span>
              {note.isFree && <span className="badge badge-green">FREE</span>}
            </div>
            <h1 className="detail-title">{note.title}</h1>
            <div className="detail-meta-row"><span>📄 {note.fileType?.toUpperCase()}</span>{note.fileSizeBytes > 0 && <span>💾 {(note.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>}{note.previewPages > 0 && <span>👀 {note.previewPages} preview pages</span>}<span>📥 {note.totalPurchases || 0} downloads</span></div>
            {note.description && <p style={{ color: "var(--text2)", maxWidth: 700, lineHeight: 1.6 }}>{note.description}</p>}
          </Reveal>
        </div>
      </div>
      <div className="container">
        <div className="detail-layout">
          <div>
            {hasPurchased && <Reveal><div className="success-box" style={{ marginBottom: 24 }}>✅ You own this — click Download to access your file!</div></Reveal>}
            <RevealFlip delay={60}>
              <div style={{ background: "var(--surface)", borderRadius: 14, padding: 24, border: "1px solid var(--border)" }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📋 Document Details</h3>
                {[["File Type", note.fileType?.toUpperCase()], ["Category", note.category || "General"], ["Downloads", note.totalPurchases || 0], ...(note.previewPages > 0 ? [["Free Preview", `${note.previewPages} pages`]] : [])].map(([k, v], i) => (
                  <Reveal key={k} delay={i * 50}><div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.87rem" }}><span style={{ color: "var(--text2)" }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div></Reveal>
                ))}
              </div>
            </RevealFlip>
          </div>
          <RevealRight>
            <div className="detail-sidebar">
              <div className="sidebar-price">{note.isFree ? "FREE" : `₹${price}`}</div>
              {!note.isFree && note.discountPrice && <div className="sidebar-price-old">₹{note.price}</div>}
              {(hasPurchased || note.isFree) ? <MagneticBtn className="btn btn-green btn-lg sidebar-btn" onClick={handleDownload}>⬇️ Download Now</MagneticBtn> : <MagneticBtn className="btn btn-primary btn-lg sidebar-btn" onClick={handleBuy} disabled={paying}>{paying ? "Processing…" : `Buy for ₹${price} →`}</MagneticBtn>}
            </div>
          </RevealRight>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ navigate }) {
  const { user, authFetch } = useAuth();
  const [payments, setPayments] = useState([]);
  const [tab, setTab] = useState("courses");
  useEffect(() => { if (user) authFetch("/payments/my").then(d => { if (d.success) setPayments(d.data || d.payments || []); }).catch(() => {}); }, [authFetch, user]);

  if (!user) return <div className="page"><div className="container" style={{ padding: 80, textAlign: "center" }}><h2>Please login to view your dashboard</h2></div></div>;

  const courses = user.purchasedCourses || [];
  const notes = user.purchasedNotes || [];
  const liveRegs = user.liveClassRegistrations || [];

  return (
    <div className="page">
      <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "40px 0 28px" }}>
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="avatar-btn" style={{ width: 52, height: 52, fontSize: "1.2rem", flexShrink: 0 }}>{user.name?.[0]?.toUpperCase()}</div>
              <div><h1 style={{ fontFamily: "var(--font2)", fontSize: "1.6rem", fontWeight: 700 }}>Welcome, {user.name}! 👋</h1><p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>{user.email} · {user.role}</p></div>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="container section">
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {[["📚", courses.length, "Courses Enrolled"], ["📄", notes.length, "Notes Purchased"], ["📡", liveRegs.length, "Classes Registered"], ["💳", payments.filter(p => p.status === "paid").length, "Successful Payments"]].map(([icon, num, label], i) => (
            <RevealBounce key={label} delay={i * 80}><div className="stat-card"><div className="stat-card-icon">{icon}</div><div className="stat-card-num"><AnimatedNumber target={num} duration={800} /></div><div className="stat-card-label">{label}</div></div></RevealBounce>
          ))}
        </div>
        <Reveal>
          <div className="tabs">
            {[["courses", "📚 My Courses"], ["notes", "📄 My Notes"], ["live", "📡 Live Classes"], ["payments", "💳 Payments"]].map(([key, label]) => (
              <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
            ))}
          </div>
        </Reveal>
        {tab === "courses" && (courses.length === 0 ? <div className="empty-state"><div className="icon">📚</div><p>No courses yet. <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => navigate("/courses")}>Browse courses →</span></p></div> : <div className="grid-3">{courses.map((p, i) => <RevealBounce key={p._id || p.course} delay={i * 70}><div className="card" onClick={() => navigate(`/courses/${p.course?._id || p.course}`)} style={{ cursor: "pointer" }}><div className="card-thumb" style={{ background: "var(--bg3)" }}>{p.course?.thumbnail ? <img src={p.course.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <div style={{ fontSize: "3rem" }}>📚</div>}</div><div className="card-body"><div className="card-title">{p.course?.title || "Course"}</div><div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Purchased {new Date(p.purchasedAt).toLocaleDateString()}</div><div style={{ marginTop: 10 }}><div className="progress-bar-wrap"><div className="progress-bar" style={{ width: "35%" }} /></div><div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 4 }}>35% completed</div></div></div></div></RevealBounce>)}</div>)}
        {tab === "notes" && (notes.length === 0 ? <div className="empty-state"><div className="icon">📄</div><p>No notes yet. <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => navigate("/notes")}>Browse notes →</span></p></div> : <div className="grid-3">{notes.map((p, i) => <RevealBounce key={p._id || p.notes} delay={i * 70}><div className="card"><div className="card-body"><div style={{ fontSize: "2rem", marginBottom: 10 }}>📄</div><div className="card-title">{p.notes?.title || "Notes"}</div><div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Purchased {new Date(p.purchasedAt).toLocaleDateString()}</div><button className="btn btn-green btn-sm" style={{ marginTop: 12 }} onClick={() => navigate(`/notes/${p.notes?._id || p.notes}`)}>⬇️ Download</button></div></div></RevealBounce>)}</div>)}
        {tab === "live" && (liveRegs.length === 0 ? <div className="empty-state"><div className="icon">📡</div><p>No classes registered. <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => navigate("/live")}>Browse classes →</span></p></div> : <div className="grid-3">{liveRegs.map((r, i) => <RevealBounce key={i} delay={i * 70}><div className="card"><div className="card-body"><div style={{ fontSize: "2rem", marginBottom: 10 }}>📡</div><div className="card-title">Live Class Registration</div><div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 6 }}>Registered {new Date(r.registeredAt).toLocaleDateString()}</div><span className={`badge ${r.urlSent ? "badge-green" : "badge-yellow"}`} style={{ marginTop: 10, display: "inline-flex" }}>{r.urlSent ? "✅ Link Sent" : "⏳ Link Pending"}</span></div></div></RevealBounce>)}</div>)}
        {tab === "payments" && (payments.length === 0 ? <div className="empty-state"><div className="icon">💳</div><p>No payment history.</p></div> : <Reveal><div className="table-wrap"><table><thead><tr><th>Item</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map(p => <tr key={p._id}><td>{p.itemTitle || "—"}</td><td><span className="badge badge-primary">{p.itemType}</span></td><td style={{ fontWeight: 700 }}>₹{p.amountInRupees}</td><td><span className={`badge ${p.status === "paid" ? "badge-green" : p.status === "failed" ? "badge-accent" : "badge-yellow"}`}>{p.status}</span></td><td style={{ color: "var(--text3)" }}>{new Date(p.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></Reveal>)}
      </div>
    </div>
  );
}

function VideoManagerModal({ course, onClose, authFetch, toast }) {
  const [videos, setVideos] = useState(course.videos || []);
  const [addMode, setAddMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlForm, setUrlForm] = useState({ title: "", videoUrl: "", description: "", duration: 0, isPreview: false, buyNowTriggerSeconds: 300, order: course.videos?.length || 0 });
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", duration: 0, isPreview: false, buyNowTriggerSeconds: 300 });
  const [videoFile, setVideoFile] = useState(null);

  const refreshVideos = async () => { const res = await authFetch(`/courses/${course._id}`); if (res.success) setVideos((res.data || res.course)?.videos || []); };

  const addUrlVideo = async () => {
    if (!urlForm.title || !urlForm.videoUrl) { toast("Title and URL are required", "error"); return; }
    setUploading(true);
    const res = await authFetch(`/courses/${course._id}/videos/url`, { method: "POST", body: JSON.stringify({ ...urlForm, duration: Number(urlForm.duration), order: Number(urlForm.order), buyNowTriggerSeconds: Number(urlForm.buyNowTriggerSeconds) }) });
    setUploading(false);
    if (res.success) { toast("Video added! ✅", "success"); setUrlForm({ title: "", videoUrl: "", description: "", duration: 0, isPreview: false, buyNowTriggerSeconds: 300, order: videos.length + 1 }); refreshVideos(); }
    else toast(res.message || "Failed to add video", "error");
  };

  const uploadVideoFile = async () => {
    if (!uploadForm.title) { toast("Video title is required", "error"); return; }
    if (!videoFile) { toast("Please select a video file", "error"); return; }
    setUploading(true); setProgress(0);
    const formData = new FormData();
    formData.append("video", videoFile); formData.append("title", uploadForm.title); formData.append("description", uploadForm.description); formData.append("duration", String(uploadForm.duration)); formData.append("isPreview", String(uploadForm.isPreview)); formData.append("buyNowTriggerSeconds", String(uploadForm.buyNowTriggerSeconds));
    const authToken = localStorage.getItem("token");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/courses/${course._id}/videos/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => { setUploading(false); try { const res = JSON.parse(xhr.responseText); if (res.success) { toast("Video uploaded! ✅", "success"); setVideoFile(null); setUploadForm({ title: "", description: "", duration: 0, isPreview: false, buyNowTriggerSeconds: 300 }); setProgress(0); refreshVideos(); } else toast(res.message || "Upload failed", "error"); } catch { toast("Upload failed", "error"); } };
    xhr.onerror = () => { setUploading(false); toast("Network error during upload", "error"); };
    xhr.send(formData);
  };

  const deleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;
    const res = await authFetch(`/courses/${course._id}/videos/${videoId}`, { method: "DELETE" });
    if (res.success) { toast("Video deleted", "success"); refreshVideos(); } else toast(res.message || "Delete failed", "error");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">🎬 Manage Videos</div>
        <div className="modal-sub">{course.title} · {videos.length} video{videos.length !== 1 ? "s" : ""}</div>
        {videos.length > 0 && <div style={{ marginBottom: 24 }}><div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Existing Videos</div>{videos.map((v, i) => <div key={v._id || i} className="video-manager-item"><div className="video-num">{i + 1}</div><div className="video-manager-info"><div className="video-manager-title">{v.title}</div><div className="video-manager-meta"><span>{v.videoType === "upload" ? "📁 File" : "🔗 URL"}</span>{v.duration > 0 && <span>⏱ {Math.floor(v.duration / 60)}m {v.duration % 60}s</span>}{v.isPreview && <span className="badge badge-green" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>Preview</span>}</div></div><button className="btn btn-danger btn-sm" onClick={() => deleteVideo(v._id)}>Delete</button></div>)}</div>}
        <hr className="divider" />
        <div style={{ fontWeight: 700, marginBottom: 16 }}>➕ Add New Video</div>
        <div className="video-type-tabs">
          <div className={`video-type-tab ${addMode === "url" ? "active" : ""}`} onClick={() => setAddMode("url")}>🔗 Add by URL<br /><span style={{ fontSize: "0.72rem", color: "var(--text3)", fontWeight: 400 }}>YouTube, Vimeo, direct link</span></div>
          <div className={`video-type-tab ${addMode === "upload" ? "active" : ""}`} onClick={() => setAddMode("upload")}>📁 Upload File<br /><span style={{ fontSize: "0.72rem", color: "var(--text3)", fontWeight: 400 }}>MP4, WebM, MOV</span></div>
        </div>
        {addMode === "url" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Video Title *</label><input className="form-input" placeholder="e.g. Introduction to React Hooks" value={urlForm.title} onChange={e => setUrlForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Video URL *</label><input className="form-input" placeholder="https://youtube.com/watch?v=..." value={urlForm.videoUrl} onChange={e => setUrlForm(p => ({ ...p, videoUrl: e.target.value }))} /><div className="form-hint">Supports YouTube, Vimeo, Google Drive, or direct video URLs</div></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Description</label><textarea className="form-input" rows={2} placeholder="Brief description" value={urlForm.description} onChange={e => setUrlForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Duration (seconds)</label><input type="number" className="form-input" value={urlForm.duration} onChange={e => setUrlForm(p => ({ ...p, duration: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Order</label><input type="number" className="form-input" value={urlForm.order} onChange={e => setUrlForm(p => ({ ...p, order: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Buy-Now Trigger (seconds)</label><input type="number" className="form-input" value={urlForm.buyNowTriggerSeconds} onChange={e => setUrlForm(p => ({ ...p, buyNowTriggerSeconds: e.target.value }))} /></div>
              <div className="form-group" style={{ display: "flex", alignItems: "center" }}><div className="checkbox-row"><input type="checkbox" id="url-preview" checked={urlForm.isPreview} onChange={e => setUrlForm(p => ({ ...p, isPreview: e.target.checked }))} /><label htmlFor="url-preview">Free Preview</label></div></div>
            </div>
            <button className="btn btn-primary" onClick={addUrlVideo} disabled={uploading}>{uploading ? "Adding…" : "➕ Add Video URL"}</button>
          </div>
        )}
        {addMode === "upload" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Video Title *</label><input className="form-input" value={uploadForm.title} onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))} /></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Description</label><textarea className="form-input" rows={2} value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Duration (seconds)</label><input type="number" className="form-input" value={uploadForm.duration} onChange={e => setUploadForm(p => ({ ...p, duration: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Buy-Now Trigger (seconds)</label><input type="number" className="form-input" value={uploadForm.buyNowTriggerSeconds} onChange={e => setUploadForm(p => ({ ...p, buyNowTriggerSeconds: e.target.value }))} /></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><div className="checkbox-row"><input type="checkbox" id="upload-preview" checked={uploadForm.isPreview} onChange={e => setUploadForm(p => ({ ...p, isPreview: e.target.checked }))} /><label htmlFor="upload-preview">Free Preview</label></div></div>
              <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Video File *</label><FileUploadArea accept="video/*" onFile={setVideoFile} file={videoFile} label="Click or drag video file here" hint="Supported: MP4, WebM, MOV (max 500MB)" icon="🎬" /></div>
            </div>
            {uploading && <div className="upload-progress"><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text2)", marginBottom: 6 }}><span>Uploading…</span><span>{progress}%</span></div><div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${progress}%` }} /></div></div>}
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={uploadVideoFile} disabled={uploading || !videoFile}>{uploading ? `Uploading ${progress}%…` : "📤 Upload Video"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseFormModal({ course, onClose, onSave, authFetch, toast }) {
  const isEdit = !!course;
  const [form, setForm] = useState({ title: course?.title || "", description: course?.description || "", shortDescription: course?.shortDescription || "", price: course?.price || "", discountPrice: course?.discountPrice || "", category: course?.category || "", level: course?.level || "beginner", language: course?.language || "English", tags: course?.tags?.join(",") || "", requirements: course?.requirements?.join("\n") || "", outcomes: course?.outcomes?.join("\n") || "", isFree: course?.isFree || false, isPublished: course?.isPublished || false });
  const [thumbnail, setThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!form.title || !form.description) { toast("Title and description are required", "error"); return; }
    if (!form.isFree && !form.price) { toast("Price is required for paid courses", "error"); return; }
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (thumbnail) fd.append("thumbnail", thumbnail);
    const authToken = localStorage.getItem("token");
    const url = isEdit ? `/courses/${course._id}` : "/courses";
    const res = await fetch(`${API_BASE}${url}`, { method: isEdit ? "PUT" : "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd }).then(r => r.json());
    setSaving(false);
    if (res.success) { toast(`Course ${isEdit ? "updated" : "created"}! ✅`, "success"); onSave(); onClose(); } else toast(res.message || "Failed", "error");
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{isEdit ? "✏️ Edit Course" : "➕ Create New Course"}</div>
        <div className="modal-sub">{isEdit ? `Editing: ${course.title}` : "Fill in the course details below"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Course Title *</label><input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Full Description *</label><textarea rows={4} className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Short Description</label><input className="form-input" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} disabled={form.isFree} /></div>
          <div className="form-group"><label className="form-label">Discount Price (₹)</label><input type="number" className="form-input" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} disabled={form.isFree} /></div>
          <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Level</label><select className="form-input" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>{["beginner","intermediate","advanced","all"].map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Language</label><input className="form-input" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Tags</label><input className="form-input" placeholder="react,node,mongodb" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Requirements</label><textarea rows={3} className="form-input" placeholder="One per line" value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Learning Outcomes</label><textarea rows={3} className="form-input" placeholder="One per line" value={form.outcomes} onChange={e => setForm(p => ({ ...p, outcomes: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Thumbnail</label><FileUploadArea accept="image/*" onFile={setThumbnail} file={thumbnail} label="Upload course thumbnail" hint="PNG, JPG, WebP — 16:9 recommended" icon="🖼️" /></div>
          <div className="form-group" style={{ display: "flex", gap: 24 }}>
            <div className="checkbox-row"><input type="checkbox" id="cf-free" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked, price: e.target.checked ? "0" : p.price }))} /><label htmlFor="cf-free">Free Course</label></div>
            <div className="checkbox-row"><input type="checkbox" id="cf-pub" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} /><label htmlFor="cf-pub">Publish immediately</label></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Update Course" : "Create Course"}</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LiveClassFormModal({ liveClass, onClose, onSave, authFetch, toast }) {
  const isEdit = !!liveClass;
  const [form, setForm] = useState({ title: liveClass?.title || "", description: liveClass?.description || "", scheduledAt: liveClass?.scheduledAt ? new Date(liveClass.scheduledAt).toISOString().slice(0, 16) : "", duration: liveClass?.duration || 60, platform: liveClass?.platform || "zoom", price: liveClass?.price || 0, isFree: liveClass?.isFree ?? true, maxParticipants: liveClass?.maxParticipants || 100, urlSendMinutesBefore: liveClass?.urlSendMinutesBefore || 30, meetingUrl: liveClass?.meetingUrl || "", meetingId: liveClass?.meetingId || "", meetingPassword: liveClass?.meetingPassword || "", tags: liveClass?.tags?.join(",") || "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (!form.title) { toast("Title is required", "error"); return; }
    if (!form.scheduledAt) { toast("Schedule date/time is required", "error"); return; }
    setSaving(true);
    const authToken = localStorage.getItem("token");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (thumbnail) fd.append("thumbnail", thumbnail);
    const url = isEdit ? `/live-classes/${liveClass._id}` : "/live-classes";
    const res = await fetch(`${API_BASE}${url}`, { method: isEdit ? "PUT" : "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd }).then(r => r.json());
    setSaving(false);
    if (res.success) { toast(`Live class ${isEdit ? "updated" : "created"}! ✅`, "success"); onSave(); onClose(); } else toast(res.message || "Failed", "error");
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{isEdit ? "✏️ Edit Live Class" : "📡 Create Live Class"}</div>
        <div className="modal-sub">{isEdit ? `Editing: ${liveClass.title}` : "Schedule a new live session"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Class Title *</label><input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Description</label><textarea rows={3} className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Schedule Date & Time *</label><input type="datetime-local" className="form-input" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Duration (minutes)</label><input type="number" className="form-input" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} /></div>
          <div className="form-group"><label className="form-label">Platform</label><select className="form-input" value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}>{["zoom","google_meet","teams","youtube_live","other"].map(pl => <option key={pl} value={pl}>{pl.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Max Participants</label><input type="number" className="form-input" value={form.maxParticipants} onChange={e => setForm(p => ({ ...p, maxParticipants: Number(e.target.value) }))} /></div>
          <div className="form-group"><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} disabled={form.isFree} /></div>
          <div className="form-group"><label className="form-label">Send URL (minutes before)</label><input type="number" className="form-input" value={form.urlSendMinutesBefore} onChange={e => setForm(p => ({ ...p, urlSendMinutesBefore: Number(e.target.value) }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Meeting URL</label><input className="form-input" placeholder="https://zoom.us/j/..." value={form.meetingUrl} onChange={e => setForm(p => ({ ...p, meetingUrl: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Meeting ID</label><input className="form-input" value={form.meetingId} onChange={e => setForm(p => ({ ...p, meetingId: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Meeting Password</label><input className="form-input" value={form.meetingPassword} onChange={e => setForm(p => ({ ...p, meetingPassword: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Thumbnail</label><FileUploadArea accept="image/*" onFile={setThumbnail} file={thumbnail} label="Upload thumbnail" icon="🖼️" /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><div className="checkbox-row"><input type="checkbox" id="lc-free" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked, price: e.target.checked ? 0 : p.price }))} /><label htmlFor="lc-free">Free Class</label></div></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? "Saving…" : isEdit ? "Update Live Class" : "Create Live Class"}</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function NotesFormModal({ note, onClose, onSave, authFetch, toast }) {
  const isEdit = !!note;
  const [form, setForm] = useState({ title: note?.title || "", description: note?.description || "", price: note?.price || "", discountPrice: note?.discountPrice || "", category: note?.category || "", tags: note?.tags?.join(",") || "", previewPages: note?.previewPages || 0, isFree: note?.isFree || false, isPublished: note?.isPublished ?? true });
  const [docFile, setDocFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const submit = async () => {
    if (!form.title) { toast("Title is required", "error"); return; }
    if (!isEdit && !docFile) { toast("Document file is required", "error"); return; }
    setSaving(true); setProgress(0);
    const authToken = localStorage.getItem("token");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (docFile) fd.append("document", docFile);
    if (thumbnail) fd.append("thumbnail", thumbnail);
    const xhr = new XMLHttpRequest();
    xhr.open(isEdit ? "PUT" : "POST", `${API_BASE}${isEdit ? `/notes/${note._id}` : "/notes"}`);
    xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => { setSaving(false); try { const res = JSON.parse(xhr.responseText); if (res.success) { toast(`Notes ${isEdit ? "updated" : "uploaded"}! ✅`, "success"); onSave(); onClose(); } else toast(res.message || "Failed", "error"); } catch { toast("Failed", "error"); } };
    xhr.onerror = () => { setSaving(false); toast("Network error", "error"); };
    xhr.send(fd);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{isEdit ? "✏️ Edit Notes" : "📄 Upload Notes"}</div>
        <div className="modal-sub">{isEdit ? `Editing: ${note.title}` : "Upload study material for students"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Description</label><textarea rows={3} className="form-input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} disabled={form.isFree} /></div>
          <div className="form-group"><label className="form-label">Discount Price (₹)</label><input type="number" className="form-input" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} disabled={form.isFree} /></div>
          <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Tags</label><input className="form-input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Free Preview Pages</label><input type="number" className="form-input" value={form.previewPages} onChange={e => setForm(p => ({ ...p, previewPages: e.target.value }))} /></div>
          <div className="form-group" style={{ display: "flex", gap: 24, alignItems: "center", paddingTop: 24 }}>
            <div className="checkbox-row"><input type="checkbox" id="nf-free" checked={form.isFree} onChange={e => setForm(p => ({ ...p, isFree: e.target.checked, price: e.target.checked ? "0" : p.price }))} /><label htmlFor="nf-free">Free Notes</label></div>
            <div className="checkbox-row"><input type="checkbox" id="nf-pub" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} /><label htmlFor="nf-pub">Published</label></div>
          </div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Document File {!isEdit && "*"}</label><FileUploadArea accept=".pdf,.docx,.ppt,.pptx,.xlsx,.xls" onFile={setDocFile} file={docFile} label={isEdit ? "Upload new file (leave empty to keep current)" : "Click or drag document here"} hint="Supported: PDF, DOCX, PPT, XLSX" icon="📄" /></div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}><label className="form-label">Thumbnail</label><FileUploadArea accept="image/*" onFile={setThumbnail} file={thumbnail} label="Upload thumbnail (optional)" icon="🖼️" /></div>
        </div>
        {saving && progress > 0 && <div className="upload-progress" style={{ marginTop: 12 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--text2)", marginBottom: 6 }}><span>Uploading…</span><span>{progress}%</span></div><div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${progress}%` }} /></div></div>}
        <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? `Uploading ${progress}%…` : isEdit ? "Update Notes" : "Upload Notes"}</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LiveClassActionsModal({ liveClass, onClose, authFetch, toast, onSave }) {
  const [status, setStatus] = useState(liveClass.status);
  const [meetingUrl, setMeetingUrl] = useState(liveClass.meetingUrl || "");
  const [meetingId, setMeetingId] = useState(liveClass.meetingId || "");
  const [meetingPassword, setMeetingPassword] = useState(liveClass.meetingPassword || "");
  const [saving, setSaving] = useState(false);
  const updateStatus = async () => { setSaving(true); const res = await authFetch(`/live-classes/${liveClass._id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); setSaving(false); if (res.success) { toast(`Status updated to ${status}`, "success"); onSave(); } else toast(res.message || "Failed", "error"); };
  const updateMeeting = async () => { setSaving(true); const res = await authFetch(`/live-classes/${liveClass._id}/meeting-url`, { method: "PATCH", body: JSON.stringify({ meetingUrl, meetingId, meetingPassword }) }); setSaving(false); if (res.success) { toast("Meeting details updated! ✅", "success"); onSave(); } else toast(res.message || "Failed", "error"); };
  const sendUrlToAll = async () => { if (!meetingUrl) { toast("Set a meeting URL first", "error"); return; } if (!window.confirm(`Send meeting URL to all ${liveClass.registrations?.length || 0} registrants?`)) return; setSaving(true); const res = await authFetch(`/live-classes/${liveClass._id}/send-url`, { method: "POST", body: JSON.stringify({}) }); setSaving(false); if (res.success) toast(`Sent to ${res.data?.succeeded || 0} registrants ✅`, "success"); else toast(res.message || "Failed", "error"); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">⚙️ Manage Live Class</div>
        <div className="modal-sub">{liveClass.title}</div>
        <div style={{ marginBottom: 24 }}><div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12 }}>📌 Update Status</div><select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>{["upcoming","live","completed","cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select><button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={updateStatus} disabled={saving}>Update Status</button></div>
        <hr className="divider" />
        <div style={{ marginBottom: 24 }}><div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 12 }}>🔗 Meeting Details</div><div className="form-group"><label className="form-label">Meeting URL</label><input className="form-input" placeholder="https://zoom.us/j/..." value={meetingUrl} onChange={e => setMeetingUrl(e.target.value)} /></div><div className="form-group"><label className="form-label">Meeting ID</label><input className="form-input" value={meetingId} onChange={e => setMeetingId(e.target.value)} /></div><div className="form-group"><label className="form-label">Meeting Password</label><input className="form-input" value={meetingPassword} onChange={e => setMeetingPassword(e.target.value)} /></div><div style={{ display: "flex", gap: 10 }}><button className="btn btn-primary btn-sm" onClick={updateMeeting} disabled={saving}>Save Meeting Details</button><button className="btn btn-accent btn-sm" onClick={sendUrlToAll} disabled={saving}>📨 Send URL to All ({liveClass.registrations?.length || 0})</button></div></div>
      </div>
    </div>
  );
}

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
  const [videoManagerCourse, setVideoManagerCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState(null);
  const [liveFormData, setLiveFormData] = useState(null);
  const [notesFormData, setNotesFormData] = useState(null);
  const [liveActionsData, setLiveActionsData] = useState(null);

  useEffect(() => { if (!isAdmin) return; authFetch("/admin/stats").then(d => { if (d.success) setStats(d.data || d.stats); }).catch(() => {}); }, [isAdmin, authFetch]);

  const loadSection = useCallback((s) => {
    setSection(s);
    if (s === "courses") authFetch("/courses/admin/all").then(d => { if (d.success) setCourses(d.data || d.courses || []); });
    if (s === "live") authFetch("/live-classes/admin/all").then(d => { if (d.success) setLiveClasses(d.data || d.classes || d.liveClasses || []); });
    if (s === "notes") authFetch("/notes/admin/all").then(d => { if (d.success) setNotes(d.data || d.notes || []); });
    if (s === "users") authFetch("/admin/users").then(d => { if (d.success) setUsers(d.data || d.users || []); });
    if (s === "payments") authFetch("/payments/admin/all").then(d => { if (d.success) setPayments(d.data || d.payments || []); });
  }, [authFetch]);

  const togglePublishCourse = async (courseId, current) => { await authFetch(`/courses/${courseId}/publish`, { method: "PATCH" }); loadSection("courses"); toast(`Course ${current ? "unpublished" : "published"}`, "success"); };
  const deleteCourse = async (id) => { if (!window.confirm("Delete this course?")) return; const res = await authFetch(`/courses/${id}`, { method: "DELETE" }); if (res.success) { loadSection("courses"); toast("Course deleted", "success"); } else toast(res.message || "Delete failed", "error"); };
  const deleteLiveClass = async (id) => { if (!window.confirm("Delete this live class?")) return; const res = await authFetch(`/live-classes/${id}`, { method: "DELETE" }); if (res.success) { loadSection("live"); toast("Live class deleted", "success"); } else toast(res.message || "Delete failed", "error"); };
  const deleteNotes = async (id) => { if (!window.confirm("Delete these notes?")) return; const res = await authFetch(`/notes/${id}`, { method: "DELETE" }); if (res.success) { loadSection("notes"); toast("Notes deleted", "success"); } else toast(res.message || "Delete failed", "error"); };
  const togglePublishNotes = async (id, current) => { await authFetch(`/notes/${id}/toggle-publish`, { method: "PATCH" }); loadSection("notes"); toast(`Notes ${current ? "unpublished" : "published"}`, "success"); };
  const toggleUser = async (userId) => { await authFetch(`/admin/users/${userId}/status`, { method: "PATCH" }); loadSection("users"); };

  if (!isAdmin) return <div className="page"><div className="container" style={{ padding: 80, textAlign: "center" }}><div style={{ fontSize: "4rem" }}>🚫</div><h2 style={{ margin: "16px 0 8px" }}>Access Denied</h2><p style={{ color: "var(--text2)" }}>Admin access required</p><button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/")}>Go Home</button></div></div>;

  const navItems = [{ key: "dashboard", icon: "📊", label: "Dashboard" }, { key: "courses", icon: "📚", label: "Courses" }, { key: "live", icon: "📡", label: "Live Classes" }, { key: "notes", icon: "📄", label: "Notes" }, { key: "users", icon: "👥", label: "Users" }, { key: "payments", icon: "💳", label: "Payments" }];

  return (
    <div className="page">
      {videoManagerCourse && <VideoManagerModal course={videoManagerCourse} onClose={() => setVideoManagerCourse(null)} authFetch={authFetch} toast={toast} />}
      {courseFormData !== null && <CourseFormModal course={Object.keys(courseFormData).length > 0 ? courseFormData : null} onClose={() => setCourseFormData(null)} onSave={() => loadSection("courses")} authFetch={authFetch} toast={toast} />}
      {liveFormData !== null && <LiveClassFormModal liveClass={Object.keys(liveFormData).length > 0 ? liveFormData : null} onClose={() => setLiveFormData(null)} onSave={() => loadSection("live")} authFetch={authFetch} toast={toast} />}
      {notesFormData !== null && <NotesFormModal note={Object.keys(notesFormData).length > 0 ? notesFormData : null} onClose={() => setNotesFormData(null)} onSave={() => loadSection("notes")} authFetch={authFetch} toast={toast} />}
      {liveActionsData && <LiveClassActionsModal liveClass={liveActionsData} onClose={() => setLiveActionsData(null)} authFetch={authFetch} toast={toast} onSave={() => loadSection("live")} />}
      <div className="admin-layout">
        <div className="admin-sidebar">
          <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}><div style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1 }}>Admin Panel</div></div>
          {navItems.map(n => <div key={n.key} className={`admin-nav-item ${section === n.key ? "active" : ""}`} onClick={() => loadSection(n.key)}><span className="admin-nav-icon">{n.icon}</span> {n.label}</div>)}
        </div>
        <div className="admin-content">
          {section === "dashboard" && (<>
            <Reveal><div className="admin-header"><div className="admin-title">Platform Overview</div><div className="admin-sub">Welcome back, {user?.name}</div></div></Reveal>
            {stats ? <div className="stats-grid">{[["👥", stats.users?.total ?? 0, "Total Users"], ["📚", stats.courses?.total ?? 0, "Courses"], ["📡", stats.liveClasses?.total ?? 0, "Live Classes"], ["📄", stats.notes?.total ?? 0, "Notes"], ["💳", stats.revenue?.transactions ?? 0, "Payments"], ["💰", `₹${(stats.revenue?.total ?? 0).toLocaleString()}`, "Revenue"]].map(([icon,num,label],i) => <RevealBounce key={label} delay={i*70}><div className="stat-card"><div className="stat-card-icon">{icon}</div><div className="stat-card-num">{typeof num === "number" ? <AnimatedNumber target={num} duration={900} /> : num}</div><div className="stat-card-label">{label}</div></div></RevealBounce>)}</div> : <div className="spinner" />}
            <Reveal delay={200}><div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}><h3 style={{ fontWeight: 700, marginBottom: 16 }}>⚡ Quick Actions</h3><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><MagneticBtn className="btn btn-primary" onClick={() => { setCourseFormData({}); loadSection("courses"); }}>+ New Course</MagneticBtn><MagneticBtn className="btn btn-outline" onClick={() => { setLiveFormData({}); loadSection("live"); }}>+ New Live Class</MagneticBtn><MagneticBtn className="btn btn-outline" onClick={() => { setNotesFormData({}); loadSection("notes"); }}>+ Upload Notes</MagneticBtn><MagneticBtn className="btn btn-outline" onClick={() => loadSection("users")}>View Users</MagneticBtn><MagneticBtn className="btn btn-outline" onClick={() => loadSection("payments")}>View Payments</MagneticBtn></div></div></Reveal>
          </>)}
          {section === "courses" && (<>
            <Reveal><div className="admin-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><div className="admin-title">Courses</div><div className="admin-sub">{courses.length} total courses</div></div><button className="btn btn-primary" onClick={() => setCourseFormData({})}>+ New Course</button></div></Reveal>
            <Reveal delay={80}><div className="table-wrap"><table><thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Price</th><th>Videos</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead><tbody>{courses.map(c => <tr key={c._id}><td style={{ fontWeight: 600, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</td><td>{c.category || "—"}</td><td><span className="badge badge-primary">{c.level}</span></td><td>{c.isFree ? <span className="badge badge-green">FREE</span> : `₹${c.discountPrice ?? c.price}`}</td><td style={{ textAlign: "center" }}>{c.videos?.length || 0}</td><td style={{ textAlign: "center" }}>{c.totalStudents || 0}</td><td><span className={`badge ${c.isPublished ? "badge-green" : "badge-yellow"}`}>{c.isPublished ? "Published" : "Draft"}</span></td><td><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}><button className="btn btn-primary btn-sm" onClick={() => setVideoManagerCourse(c)}>🎬 Videos</button><button className="btn btn-outline btn-sm" onClick={() => setCourseFormData(c)}>✏️</button><button className="btn btn-outline btn-sm" onClick={() => togglePublishCourse(c._id, c.isPublished)}>{c.isPublished ? "Unpublish" : "Publish"}</button><button className="btn btn-danger btn-sm" onClick={() => deleteCourse(c._id)}>🗑️</button></div></td></tr>)}{courses.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No courses yet. <span style={{ color: "var(--primary)", cursor: "pointer" }} onClick={() => setCourseFormData({})}>Create one →</span></td></tr>}</tbody></table></div></Reveal>
          </>)}
          {section === "live" && (<>
            <Reveal><div className="admin-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><div className="admin-title">Live Classes</div><div className="admin-sub">{liveClasses.length} total classes</div></div><button className="btn btn-primary" onClick={() => setLiveFormData({})}>+ New Live Class</button></div></Reveal>
            <Reveal delay={80}><div className="table-wrap"><table><thead><tr><th>Title</th><th>Scheduled</th><th>Platform</th><th>Price</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead><tbody>{liveClasses.map(lc => <tr key={lc._id}><td style={{ fontWeight: 600, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lc.title}</td><td style={{ color: "var(--text2)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>{new Date(lc.scheduledAt).toLocaleString("en-IN")}</td><td><span className="badge badge-cyan">{lc.platform}</span></td><td>{lc.isFree ? <span className="badge badge-green">FREE</span> : `₹${lc.price}`}</td><td>{lc.registrations?.length||0} / {lc.maxParticipants}</td><td><span className={`badge ${lc.status==="live"?"badge-accent":lc.status==="upcoming"?"badge-cyan":lc.status==="completed"?"badge-green":"badge-yellow"}`}>{lc.status}</span></td><td><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}><button className="btn btn-primary btn-sm" onClick={() => setLiveActionsData(lc)}>⚙️ Manage</button><button className="btn btn-outline btn-sm" onClick={() => setLiveFormData(lc)}>✏️</button><button className="btn btn-danger btn-sm" onClick={() => deleteLiveClass(lc._id)}>🗑️</button></div></td></tr>)}{liveClasses.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No live classes yet.</td></tr>}</tbody></table></div></Reveal>
          </>)}
          {section === "notes" && (<>
            <Reveal><div className="admin-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><div className="admin-title">Notes / Documents</div><div className="admin-sub">{notes.length} total documents</div></div><button className="btn btn-primary" onClick={() => setNotesFormData({})}>+ Upload Notes</button></div></Reveal>
            <Reveal delay={80}><div className="table-wrap"><table><thead><tr><th>Title</th><th>Category</th><th>Type</th><th>Price</th><th>Downloads</th><th>Status</th><th>Actions</th></tr></thead><tbody>{notes.map(n => <tr key={n._id}><td style={{ fontWeight: 600, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</td><td>{n.category || "—"}</td><td><span className="badge badge-yellow">{n.fileType?.toUpperCase() || "PDF"}</span></td><td>{n.isFree ? <span className="badge badge-green">FREE</span> : `₹${n.discountPrice ?? n.price}`}</td><td style={{ textAlign: "center" }}>{n.totalPurchases || 0}</td><td><span className={`badge ${n.isPublished ? "badge-green" : "badge-yellow"}`}>{n.isPublished ? "Published" : "Draft"}</span></td><td><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}><button className="btn btn-outline btn-sm" onClick={() => setNotesFormData(n)}>✏️ Edit</button><button className="btn btn-outline btn-sm" onClick={() => togglePublishNotes(n._id, n.isPublished)}>{n.isPublished ? "Unpublish" : "Publish"}</button><button className="btn btn-danger btn-sm" onClick={() => deleteNotes(n._id)}>🗑️</button></div></td></tr>)}{notes.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No notes yet.</td></tr>}</tbody></table></div></Reveal>
          </>)}
          {section === "users" && (<>
            <Reveal><div className="admin-header"><div className="admin-title">Users</div><div className="admin-sub">{users.length} registered users</div></div></Reveal>
            <Reveal delay={80}><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Courses</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead><tbody>{users.map(u => <tr key={u._id}><td style={{ fontWeight: 600 }}>{u.name}</td><td style={{ color: "var(--text2)" }}>{u.email}</td><td><span className={`badge ${u.role === "admin" ? "badge-accent" : "badge-primary"}`}>{u.role}</span></td><td style={{ textAlign: "center" }}>{u.purchasedCourses?.length || 0}</td><td style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td><td><span className={`badge ${u.isActive ? "badge-green" : "badge-accent"}`}>{u.isActive ? "Active" : "Banned"}</span></td><td><button className="btn btn-outline btn-sm" onClick={() => toggleUser(u._id)}>{u.isActive ? "Ban" : "Activate"}</button></td></tr>)}{users.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text3)", padding: 40 }}>No users yet</td></tr>}</tbody></table></div></Reveal>
          </>)}
          {section === "payments" && (<>
            <Reveal><div className="admin-header"><div className="admin-title">All Payments</div><div className="admin-sub">Complete transaction history</div></div></Reveal>
            <Reveal delay={80}><div className="table-wrap"><table><thead><tr><th>User</th><th>Item</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{payments.map(p => <tr key={p._id}><td style={{ fontWeight: 600 }}>{p.user?.name || "—"}</td><td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.itemTitle || "—"}</td><td><span className="badge badge-primary">{p.itemType}</span></td><td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{p.amountInRupees}</td><td><span className={`badge ${p.status==="paid"?"badge-green":p.status==="failed"?"badge-accent":"badge-yellow"}`}>{p.status}</span></td><td style={{ color: "var(--text3)", fontSize: "0.82rem" }}>{new Date(p.createdAt).toLocaleDateString()}</td></tr>)}{payments.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text3)", padding: 40 }}>No payments yet</td></tr>}</tbody></table></div></Reveal>
          </>)}
        </div>
      </div>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "48px 0 24px", marginTop: 60 }}>
      <div className="container">
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div><div style={{ marginBottom: 14 }}><Logo onClick={() => navigate("/")} /></div><p style={{ fontSize: "0.83rem", color: "var(--text3)", lineHeight: 1.6 }}>India's most affordable online learning platform. Powered by expert instructors.</p></div>
            {[["Quick Links", [["Home","/"],["Courses","/courses"],["Live Classes","/live"],["Notes","/notes"]]],["Support", [["FAQ","/"],["Contact","/"],["Privacy Policy","/"],["Terms","/"]]],["Categories", COURSE_CATS.slice(0,4).map(a => [a.emoji+" "+a.name,"/courses"])]].map(([title, links]) => (
              <div key={title}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 14, color: "var(--text)" }}>{title}</div>
                {links.map(([label, to]) => <div key={label} style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 8, cursor: "pointer", transition: "color 0.2s, transform 0.2s", display: "block" }} onClick={() => navigate(to)} onMouseEnter={e => { e.target.style.color = "var(--primary)"; e.target.style.transform = "translateX(4px)"; }} onMouseLeave={e => { e.target.style.color = "var(--text3)"; e.target.style.transform = "translateX(0)"; }}>{label}</div>)}
              </div>
            ))}
          </div>
        </Reveal>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", marginBottom: 20 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>© {new Date().getFullYear()} WhatNext. All rights reserved.</p>
          <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Made with 💻 for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}

function AppRouter() {
  const { path, navigate } = useRoute();
  const { loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div className="spinner" /></div>;

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
    return <div className="page"><div style={{ textAlign: "center", padding: "100px 24px" }}><div style={{ fontSize: "5rem", marginBottom: 20 }}>💻</div><h2 style={{ fontFamily: "var(--font2)", marginBottom: 12 }}>404 — Page not found</h2><MagneticBtn className="btn btn-primary" onClick={() => navigate("/")}>Go Home</MagneticBtn></div></div>;
  };

  return (
    <>
      <style>{css}</style>
      <ScrollProgressBar />
      <Navbar navigate={navigate} path={root} onAuth={() => setShowAuth(true)} />
      {renderPage()}
      <Footer navigate={navigate} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}