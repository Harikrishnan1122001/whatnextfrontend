
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { openRazorpay } from '../utils/razorpay';
import { API_BASE } from '../utils/constants';

export default function LiveClassDetailPage({ onAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const toast = useToast();
  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/live-classes/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          // FIX: backend sends d.data.liveClass and d.data.registered
          setCls(d.data?.liveClass || d.data || d.liveClass);
          setRegistered(d.data?.registered ?? d.registered ?? false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!user) { onAuth(); return; }
    if (registered) return;
    setBuying(true);

    try {
      if (cls.isFree || cls.price === 0) {
        const res = await authFetch(`/live-classes/${id}/register`, { method: 'POST' });
        if (res.success) { toast('🎉 Registered successfully!'); setRegistered(true); }
        else toast(res.message || 'Registration failed', 'error');
        setBuying(false);
        return;
      }

      const orderRes = await authFetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'live_class', itemId: id }),
      });
      if (!orderRes.success) { toast(orderRes.message || 'Order failed', 'error'); setBuying(false); return; }

      openRazorpay({
        order: orderRes.order,
        user,
        onSuccess: async (paymentData) => {
          const verifyRes = await authFetch('/payments/verify', {
            method: 'POST',
            body: JSON.stringify({ ...paymentData, itemType: 'live_class', itemId: id }),
          });
          if (verifyRes.success) { toast("🎉 Payment successful! You're registered."); setRegistered(true); }
          else toast(verifyRes.message || 'Verification failed', 'error');
          setBuying(false);
        },
        onFailure: (msg) => {
          if (msg !== 'Payment cancelled') toast(msg, 'error');
          setBuying(false);
        },
      });
    } catch {
      toast('Something went wrong', 'error');
      setBuying(false);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!cls) return <div className="page"><div className="empty-state"><div className="icon">😕</div><p>Class not found</p></div></div>;

  // FIX: robust date parsing - works for both ISO and datetime-local strings
  const date = new Date(cls.scheduledAt);
  const isValidDate = !isNaN(date.getTime());
  const isLive = cls.status === 'live';

  // FIX: availableSeats computed in backend and sent directly since registrations are hidden
  const availableSeats = cls.availableSeats ?? (cls.maxParticipants || 100);

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate('/live')}>← Back to <span>Live Classes</span></div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span className={`badge ${isLive ? 'badge-accent' : cls.status === 'upcoming' ? 'badge-green' : 'badge-primary'}`}>
              {isLive ? '🔴 Live Now' : cls.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
            </span>
            {cls.platform && <span className="badge badge-cyan">{cls.platform}</span>}
          </div>
          <h1 className="detail-title">{cls.title}</h1>
          <div className="detail-meta-row">
            {isValidDate && (
              <>
                <span>📅 {date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>⏰ {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            )}
            <span>⏱ {cls.duration || 60} minutes</span>
            <span>👥 {cls.registrationCount || 0} / {cls.maxParticipants || 100} registered</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          <div>
            {cls.description && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font2)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>About This Class</h2>
                <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>{cls.description}</p>
              </div>
            )}

            {cls.tags?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 10 }}>Topics Covered</h3>
                <div className="tags">
                  {cls.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            )}

            {registered && cls.meetingUrl && (
              <div style={{ background: 'rgba(107,203,119,0.1)', border: '1px solid var(--green)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>✅ You're Registered!</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 12 }}>Meeting link will be sent to your email before the class starts.</p>
                {isLive && (
                  <a href={cls.meetingUrl} target="_blank" rel="noreferrer" className="btn btn-green">Join Now →</a>
                )}
              </div>
            )}

            {registered && !cls.meetingUrl && (
              <div style={{ background: 'rgba(107,203,119,0.08)', border: '1px solid var(--green)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>✅ You're Registered!</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>The meeting link will be sent to your email {cls.urlSendMinutesBefore || 30} minutes before the class starts.</p>
              </div>
            )}
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-price">{cls.isFree || cls.price === 0 ? 'FREE' : `₹${cls.price}`}</div>

            {registered ? (
              <button className="btn btn-green sidebar-btn btn-lg" disabled>✅ You're Registered</button>
            ) : (
              <button
                className="btn btn-primary sidebar-btn btn-lg"
                onClick={handleRegister}
                disabled={buying || cls.status === 'completed' || cls.status === 'cancelled'}>
                {buying ? 'Processing…'
                  : cls.status === 'completed' ? 'Class Ended'
                  : cls.status === 'cancelled' ? 'Cancelled'
                  : cls.isFree || cls.price === 0 ? '🚀 Register Free'
                  : `💳 Register ₹${cls.price}`}
              </button>
            )}

            <div className="sidebar-features" style={{ marginTop: 20 }}>
              {[
                ['📅', isValidDate ? date.toLocaleDateString('en-IN') : 'TBD'],
                ['⏰', isValidDate ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'TBD'],
                ['⏱', `${cls.duration || 60} minutes`],
                ['💻', `Platform: ${cls.platform || 'Zoom'}`],
                ['👥', `${availableSeats} seats left`],
              ].map(([icon, text]) => (
                <div key={text} className="sidebar-feature">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}