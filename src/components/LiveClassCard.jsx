import { useNavigate } from 'react-router-dom';

export default function LiveClassCard({ liveClass }) {
  const navigate = useNavigate();
  const date = new Date(liveClass.scheduledAt);
  const isUpcoming = liveClass.status === 'upcoming';
  const isLive = liveClass.status === 'live';

  return (
    <div className="card" onClick={() => navigate(`/live/${liveClass._id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-thumb" style={{ background: 'var(--bg3)', position: 'relative' }}>
        {liveClass.thumbnail ? (
          <img src={liveClass.thumbnail} alt={liveClass.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>📡</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>Live Class</div>
          </div>
        )}
        {isLive && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
            LIVE
          </div>
        )}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className={`badge ${isLive ? 'badge-accent' : isUpcoming ? 'badge-green' : 'badge-primary'}`}>
            {isLive ? '🔴 Live Now' : isUpcoming ? '📅 Upcoming' : '✅ Completed'}
          </span>
          {liveClass.platform && <span className="badge badge-cyan">{liveClass.platform}</span>}
        </div>
        <div className="card-title">{liveClass.title}</div>
        <div className="card-desc">{liveClass.description}</div>
        <div className="card-meta">
          <span className={`price ${liveClass.isFree ? 'price-free' : ''}`}>
            {liveClass.isFree || liveClass.price === 0 ? 'FREE' : `₹${liveClass.price}`}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text3)' }}>
            📅 {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text3)' }}>
          ⏰ {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {liveClass.duration || 60} min
        </div>
      </div>
    </div>
  );
}
