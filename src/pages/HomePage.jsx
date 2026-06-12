import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import LiveClassCard from '../components/LiveClassCard';
import AnimalStrip from '../components/AnimalStrip';
import { API_BASE, ANIMALS } from '../utils/constants';
import { motion } from "framer-motion";

export default function HomePage({ onAuth }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/courses?limit=6`).then(r => r.json()),
      fetch(`${API_BASE}/live-classes?limit=4`).then(r => r.json()),
    ]).then(([c, l]) => {
      if (c.success) setCourses(c.data || c.courses || []);
      if (l.success) setLiveClasses(l.data || l.liveClasses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">🎓 India's Most Affordable Learning Platform</div>
          <h1 className="hero-title">
            Learn From <span className="hl">Expert Tutors</span><br />
            <span className="hl">Anytime, Anywhere</span>
          </h1>
          <p className="hero-sub">
            Courses, live classes & notes — all in one place. Join thousands of students and ace your exams with our expert-crafted content.
          </p>
          <div className="hero-ctas">
            {!user && (
              <button className="btn btn-primary btn-lg" onClick={onAuth}>
                🚀 Start Learning Free
              </button>
            )}
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/courses')}>
              Browse Courses
            </button>
          </div>
          <div className="hero-stats">
            {[['10,000+', 'Students Enrolled'], ['200+', 'Courses Available'], ['50+', 'Expert Instructors'], ['95%', 'Success Rate']].map(([num, label]) => (
              <div className="stat" key={label}>
                <span className="stat-num">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal categories */}
      <section style={{ padding: '0 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ marginBottom: 16 }}>
            <div className="section-eyebrow">STUDY SQUADS</div>
            <div className="section-title" style={{ fontSize: '1.2rem' }}>Find Your Batch Animal 🐾</div>
          </div>
          <AnimalStrip selected={null} onSelect={(level) => navigate(`/courses${level ? `?level=${level}` : ''}`)} />
        </div>
      </section>

      {/* Featured courses */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="section-eyebrow">TRENDING NOW</div>
              <div className="section-title">Featured Courses</div>
              <div className="section-sub">Hand-picked by our instructors for maximum learning impact</div>
            </div>
            <button className="btn btn-outline" onClick={() => navigate('/courses')}>View All →</button>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : courses.length > 0 ? (
            <div className="grid-3">
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">📚</div>
              <p>No courses available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Live classes */}
      {liveClasses.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div className="section-eyebrow">LIVE NOW</div>
                <div className="section-title">Upcoming Live Classes</div>
                <div className="section-sub">Real-time learning with expert instructors</div>
              </div>
              <button className="btn btn-outline" onClick={() => navigate('/live')}>View All →</button>
            </div>
            <div className="grid-3">
              {liveClasses.map(l => <LiveClassCard key={l._id} liveClass={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow">WHY EDUPLATFORM</div>
            <div className="section-title">Everything You Need to Succeed</div>
          </div>
          <div className="grid-4" style={{ marginTop: 36 }}>
            {[
              { icon: '🦁', title: 'Expert Instructors', desc: 'Learn from India\'s top educators with proven track records and years of teaching experience.' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'Access courses on any device, anytime. Download notes for offline study sessions.' },
              { icon: '💰', title: 'Affordable Pricing', desc: 'World-class education at prices that won\'t break the bank. Many free courses available.' },
              { icon: '🏆', title: 'Certificates', desc: 'Get recognized certificates on course completion to boost your career and academic profile.' },
              { icon: '📡', title: 'Live Doubt Sessions', desc: 'Join live classes and ask questions in real time. Never get stuck on a concept again.' },
              { icon: '📄', title: 'Study Notes', desc: 'Access carefully crafted PDF notes, summaries, and practice questions for every topic.' },
              { icon: '🐾', title: 'Study Squads', desc: 'Join animal-themed study groups to learn with peers at your level. Study together, grow together.' },
              { icon: '⚡', title: 'Instant Access', desc: 'Start learning immediately after purchase. No waiting, no delays. Pure learning, pure speed.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font2)' }}>{title}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal batch CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg3))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>
            {ANIMALS.slice(0, 5).map(a => a.emoji).join(' ')}
          </div>
          <h2 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, marginBottom: 16 }}>
            Which Animal Is Your Study Spirit?
          </h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            From the focused 🦁 Lion to the curious 🦉 Owl — find your batch, join your tribe, and conquer your exams together.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {!user && <button className="btn btn-primary btn-lg" onClick={onAuth}>Join Your Squad 🐾</button>}
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/courses')}>Browse All Courses</button>
          </div>
        </div>
      </section>
    </div>
  );
}
