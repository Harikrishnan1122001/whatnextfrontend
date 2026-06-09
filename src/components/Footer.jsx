import { Link } from 'react-router-dom';
import { ANIMALS } from '../utils/constants';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '48px 0 24px', marginTop: 60 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font2)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💻</div>
              <span style={{ background: 'linear-gradient(135deg,#fff,var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduPlatform</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--text3)', lineHeight: 1.6 }}>India's most affordable online learning platform. Powered by expert instructors.</p>
          </div>

          {[
            ['Quick Links', [['Home', '/'], ['Courses', '/courses'], ['Live Classes', '/live'], ['Notes', '/notes']]],
            ['Support', [['FAQ', '/'], ['Contact', '/'], ['Privacy Policy', '/'], ['Terms', '/']]],
            ['Animals 🐾', ANIMALS.slice(0, 4).map(a => [`${a.emoji} ${a.name}`, '/courses'])],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 14, color: 'var(--text)' }}>{title}</div>
              {links.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 8, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.target.style.color = 'var(--text2)')}
                  onMouseLeave={e => (e.target.style.color = 'var(--text3)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 20 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>© {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Made with 💻 for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
