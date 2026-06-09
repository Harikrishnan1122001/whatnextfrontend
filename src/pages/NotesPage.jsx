import { useState, useEffect } from 'react';
import NotesCard from '../components/NotesCard';
import { API_BASE } from '../utils/constants';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`${API_BASE}/notes?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setNotes(d.data || d.notes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div className="section-eyebrow">STUDY MATERIAL</div>
          <h1 className="section-title">Study Notes & PDFs</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', marginTop: 8 }}>Expert-crafted notes, summaries, and practice materials for every subject</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Search notes..." onBlur={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="spinner" />
        ) : notes.length > 0 ? (
          <>
            <p style={{ color: 'var(--text3)', fontSize: '0.83rem', marginBottom: 20 }}>{notes.length} resource{notes.length !== 1 ? 's' : ''} available</p>
            <div className="grid-3">
              {notes.map(n => <NotesCard key={n._id} note={n} />)}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">📄</div>
            <p>No notes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
