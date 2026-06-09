import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { openRazorpay } from '../utils/razorpay';
import { API_BASE, ANIMAL_EMOJI } from '../utils/constants';

function fmtDur(sec) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function CourseDetailPage({ onAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const toast = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCourse(d.data || d.course);
          setPurchased(d.purchased || d.data?.isPurchased || false);
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
        body: JSON.stringify({ itemType: 'course', itemId: id }),
      });
      if (!orderRes.success) { toast(orderRes.message || 'Failed to create order', 'error'); setBuying(false); return; }

      openRazorpay({
        order: orderRes.order,
        user,
        onSuccess: async (paymentData) => {
          const verifyRes = await authFetch('/payments/verify', {
            method: 'POST',
            body: JSON.stringify({ ...paymentData, itemType: 'course', itemId: id }),
          });
          if (verifyRes.success) {
            toast('🎉 Purchase successful! Happy learning!');
            setPurchased(true);
          } else {
            toast(verifyRes.message || 'Verification failed', 'error');
          }
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
  if (!course) return (
    <div className="page">
      <div className="empty-state"><div className="icon">😕</div><p>Course not found</p></div>
    </div>
  );

  const price = course.isFree ? 0 : (course.discountPrice ?? course.price);

  return (
    <div className="page">
      {/* Header */}
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate('/courses')}>
            ← Back to <span>Courses</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{course.level || 'All'}</span>
            {course.category && <span className="badge badge-cyan">{course.category}</span>}
            {course.isFree && <span className="badge badge-green">FREE</span>}
          </div>
          <h1 className="detail-title">{course.title}</h1>
          <div className="detail-meta-row">
            <span>🎬 {course.videos?.length || 0} videos</span>
            <span>👥 {course.totalStudents || 0} students</span>
            <span>🌐 {course.language || 'English'}</span>
            <span>{ANIMAL_EMOJI[course.level] || '📚'} {course.level || 'All Levels'}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container">
        <div className="detail-layout">
          {/* Main content */}
          <div>
            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>About This Course</h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.95rem' }}>{course.description}</p>
            </div>

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Requirements</h3>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {course.requirements.map((r, i) => (
                    <li key={i} style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Outcomes */}
            {course.outcomes?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>What You'll Learn</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 10 }}>
                  {course.outcomes.map((o, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span> {o}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {course.videos?.length > 0 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>
                  Course Content ({course.videos.length} videos)
                </h2>
                <div className="video-list">
                  {course.videos.map((v, i) => {
                    const canWatch = purchased || v.isPreview;
                    return (
                      <div key={v._id || i} className={`video-item ${!canWatch ? 'locked' : ''}`}>
                        <div className="video-num">{i + 1}</div>
                        <div className="video-info">
                          <div className="video-title-text">{v.title}</div>
                          {v.duration > 0 && <div className="video-dur">⏱ {fmtDur(v.duration)}</div>}
                        </div>
                        {v.isPreview && !purchased && <span className="badge badge-green" style={{ flexShrink: 0 }}>Preview</span>}
                        {!canWatch && <span style={{ fontSize: '1rem', color: 'var(--text3)' }}>🔒</span>}
                        {canWatch && <span style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>▶</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 16, aspectRatio: '16/9', objectFit: 'cover' }} />
            )}
            <div className="sidebar-price">{course.isFree ? 'FREE' : `₹${price}`}</div>
            {!course.isFree && course.discountPrice && <div className="sidebar-price-old">₹{course.price}</div>}

            {purchased ? (
              <button className="btn btn-green sidebar-btn btn-lg" onClick={() => navigate('/dashboard')}>
                ✅ Already Purchased — Go to Dashboard
              </button>
            ) : (
              <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleBuy} disabled={buying}>
                {buying ? 'Processing…' : course.isFree ? '🚀 Enroll Free' : `💳 Buy for ₹${price}`}
              </button>
            )}

            <div className="sidebar-features">
              {[
                ['🎬', `${course.videos?.length || 0} video lessons`],
                ['🌐', `Language: ${course.language || 'English'}`],
                ['📊', `Level: ${course.level || 'All Levels'}`],
                ['♾️', 'Lifetime access'],
                ['📱', 'Access on all devices'],
              ].map(([icon, text]) => (
                <div key={text} className="sidebar-feature">
                  <span className="icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
