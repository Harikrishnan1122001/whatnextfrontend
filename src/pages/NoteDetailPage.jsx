import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { openRazorpay } from '../utils/razorpay';
import { API_BASE } from '../utils/constants';

export default function NoteDetailPage({ onAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const toast = useToast();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/notes/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setNote(d.data || d.note);
          setPurchased(d.purchased || false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) { onAuth(); return; }
    if (purchased) { navigate('/dashboard'); return; }
    setBuying(true);
    try {
      const orderRes = await authFetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'notes', itemId: id }),
      });
      if (!orderRes.success) { toast(orderRes.message || 'Order failed', 'error'); setBuying(false); return; }

      openRazorpay({
        order: orderRes.order,
        user,
        onSuccess: async (paymentData) => {
          const verifyRes = await authFetch('/payments/verify', {
            method: 'POST',
            body: JSON.stringify({ ...paymentData, itemType: 'notes', itemId: id }),
          });
          if (verifyRes.success) { toast('🎉 Purchased! Go to dashboard to download.'); setPurchased(true); }
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

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      window.open(`${API_BASE}/notes/${id}/download?token=${token}`, '_blank');
    } catch {
      toast('Download failed', 'error');
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!note) return <div className="page"><div className="empty-state"><div className="icon">😕</div><p>Notes not found</p></div></div>;

  const price = note.isFree ? 0 : (note.discountPrice ?? note.price);

  return (
    <div className="page">
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate('/notes')}>← Back to <span>Notes</span></div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span className="badge badge-yellow">{note.fileType?.toUpperCase() || 'PDF'}</span>
            {note.category && <span className="badge badge-primary">{note.category}</span>}
            {note.isFree && <span className="badge badge-green">FREE</span>}
          </div>
          <h1 className="detail-title">{note.title}</h1>
          <div className="detail-meta-row">
            <span>📥 {note.totalPurchases || 0} downloads</span>
            {note.fileSizeBytes > 0 && <span>📦 {(note.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>}
            {note.previewPages > 0 && <span>👁 {note.previewPages} preview pages</span>}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          <div>
            {note.description && (
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'var(--font2)', fontWeight: 700, fontSize: '1.2rem', marginBottom: 12 }}>About These Notes</h2>
                <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>{note.description}</p>
              </div>
            )}
            {note.tags?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 10 }}>Tags</h3>
                <div className="tags">{note.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            )}
          </div>

          <div className="detail-sidebar">
            <div className="sidebar-price">{note.isFree ? 'FREE' : `₹${price}`}</div>
            {!note.isFree && note.discountPrice && <div className="sidebar-price-old">₹{note.price}</div>}

            {purchased ? (
              <button className="btn btn-green sidebar-btn btn-lg" onClick={handleDownload}>
                📥 Download Notes
              </button>
            ) : (
              <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleBuy} disabled={buying}>
                {buying ? 'Processing…' : note.isFree ? '📥 Download Free' : `💳 Buy for ₹${price}`}
              </button>
            )}

            <div className="sidebar-features" style={{ marginTop: 20 }}>
              {[
                ['📄', `Format: ${note.fileType?.toUpperCase() || 'PDF'}`],
                ['♾️', 'Lifetime access'],
                ['📱', 'Download anytime'],
                ...(note.previewPages > 0 ? [['👁', `${note.previewPages} free preview pages`]] : []),
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