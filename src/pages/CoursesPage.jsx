import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import AnimalStrip from '../components/AnimalStrip';
import { API_BASE } from '../utils/constants';

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const level = searchParams.get('level');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (level) params.set('level', level);
    if (search) params.set('search', search);
    fetch(`${API_BASE}/courses?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setCourses(d.data || d.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [level, search]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') setSearch(e.target?.value || search);
  };

  return (
    <div className="page">
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div className="section-eyebrow">EXPLORE</div>
          <h1 className="section-title" style={{ marginBottom: 8 }}>All Courses</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>Find the perfect course to boost your skills and career</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Search */}
        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search courses..."
            defaultValue={search}
            onKeyDown={handleSearch}
            onBlur={e => setSearch(e.target.value)}
          />
          {search && (
            <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Animal filter strip */}
        <AnimalStrip
          selected={level}
          onSelect={(l) => {
            if (l) setSearchParams({ level: l });
            else setSearchParams({});
          }}
        />

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : courses.length > 0 ? (
          <>
            <p style={{ color: 'var(--text3)', fontSize: '0.83rem', marginBottom: 20 }}>{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
            <div className="grid-3">
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No courses found. Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
