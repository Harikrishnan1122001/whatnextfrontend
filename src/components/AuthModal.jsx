import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const toast = useToast();

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError('');
    setLoading(true);
    let res;
    if (tab === 'login') {
      res = await login(form.email, form.password);
    } else {
      if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
      res = await register(form.name, form.email, form.password);
    }
    setLoading(false);
    if (res.success) {
      toast(tab === 'login' ? 'Welcome back! 🎉' : 'Account created! 🎉');
      onClose();
    } else {
      setError(res.message || 'Something went wrong');
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{tab === 'login' ? '👋 Welcome Back' : '🚀 Join EduPlatform'}</div>
        <div className="modal-sub">{tab === 'login' ? 'Login to your account' : 'Create a free account today'}</div>

        <div className="tabs" style={{ marginBottom: 24 }}>
          <button className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</button>
        </div>

        {tab === 'register' && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handle} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handle}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {error && <div className="form-error" style={{ marginBottom: 14 }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait…' : tab === 'login' ? 'Login' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text3)', marginTop: 18 }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={{ color: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => setTab(tab === 'login' ? 'register' : 'login')}>
            {tab === 'login' ? 'Sign up free' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
