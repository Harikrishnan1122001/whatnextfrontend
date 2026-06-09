import { useState, useEffect } from 'react';
import LiveClassCard from '../components/LiveClassCard';
import { API_BASE } from '../utils/constants';

const STATUSES = ['all', 'upcoming', 'live', 'completed'];

export default function LiveClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    fetch(`${API_BASE}/live-classes?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setClasses(d.data || d.liveClasses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  return (
    <div className="page">
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div className="section-eyebrow">INTERACTIVE LEARNING</div>
          <h1 className="section-title">Live Classes</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', marginTop: 8 }}>Learn in real-time with expert instructors. Ask questions, get instant answers.</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Status filter */}
        <div className="tabs" style={{ maxWidth: 400 }}>
          {STATUSES.map(s => (
            <button key={s} className={`tab ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
              {s === 'all' ? '🌟 All' : s === 'upcoming' ? '📅 Upcoming' : s === 'live' ? '🔴 Live' : '✅ Done'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : classes.length > 0 ? (
          <div className="grid-3">
            {classes.map(l => <LiveClassCard key={l._id} liveClass={l} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="icon">📡</div>
            <p>No {status !== 'all' ? status : ''} live classes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
