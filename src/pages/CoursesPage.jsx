// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import CourseCard from '../components/CourseCard';
// import AnimalStrip from '../components/AnimalStrip';
// import { API_BASE } from '../utils/constants';

// export default function CoursesPage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const level = searchParams.get('level');

//   useEffect(() => {
//     setLoading(true);
//     const params = new URLSearchParams();
//     if (level) params.set('level', level);
//     if (search) params.set('search', search);
//     fetch(`${API_BASE}/courses?${params}`)
//       .then(r => r.json())
//       .then(d => {
//         if (d.success) setCourses(d.data || d.courses || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [level, search]);

//   const handleSearch = (e) => {
//     if (e.key === 'Enter' || e.type === 'click') setSearch(e.target?.value || search);
//   };

//   return (
//     <div className="page">
//       <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
//         <div className="container">
//           <div className="section-eyebrow">EXPLORE</div>
//           <h1 className="section-title" style={{ marginBottom: 8 }}>All Courses</h1>
//           <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>Find the perfect course to boost your skills and career</p>
//         </div>
//       </div>

//       <div className="container" style={{ paddingTop: 32 }}>
//         {/* Search */}
//         <div className="search-bar">
//           <span>🔍</span>
//           <input
//             placeholder="Search courses..."
//             defaultValue={search}
//             onKeyDown={handleSearch}
//             onBlur={e => setSearch(e.target.value)}
//           />
//           {search && (
//             <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem' }}
//               onClick={() => setSearch('')}>✕</button>
//           )}
//         </div>

//         {/* Animal filter strip */}
//         <AnimalStrip
//           selected={level}
//           onSelect={(l) => {
//             if (l) setSearchParams({ level: l });
//             else setSearchParams({});
//           }}
//         />

//         {/* Results */}
//         {loading ? (
//           <div className="spinner" />
//         ) : courses.length > 0 ? (
//           <>
//             <p style={{ color: 'var(--text3)', fontSize: '0.83rem', marginBottom: 20 }}>{courses.length} course{courses.length !== 1 ? 's' : ''} found</p>
//             <div className="grid-3">
//               {courses.map(c => <CourseCard key={c._id} course={c} />)}
//             </div>
//           </>
//         ) : (
//           <div className="empty-state">
//             <div className="icon">🔍</div>
//             <p>No courses found. Try a different filter or search term.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import AnimalStrip from '../components/AnimalStrip';
import { API_BASE } from '../utils/constants';

const CATEGORIES = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Database', 'AI/ML', 'Design'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

function PriceRangeFilter({ minPrice, maxPrice, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        className="input"
        type="number"
        placeholder="Min ₹"
        value={minPrice}
        min={0}
        onChange={e => onChange('minPrice', e.target.value)}
        style={{ width: 90, padding: '6px 10px', fontSize: '0.85rem' }}
      />
      <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>–</span>
      <input
        className="input"
        type="number"
        placeholder="Max ₹"
        value={maxPrice}
        min={0}
        onChange={e => onChange('maxPrice', e.target.value)}
        style={{ width: 90, padding: '6px 10px', fontSize: '0.85rem' }}
      />
    </div>
  );
}

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filters from URL params
  const level = searchParams.get('level') || '';
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const LIMIT = 12;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page'); // reset page on filter change
    setSearchParams(next);
    setPage(1);
  };

  const clearAll = () => {
    setSearchParams({});
    setPage(1);
  };

  const activeFilterCount = [level, category, minPrice, maxPrice].filter(Boolean).length;

  const fetchCourses = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (level) params.set('level', level);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', String(page));
    params.set('limit', String(LIMIT));

    fetch(`${API_BASE}/courses?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const data = d.data || {};
          // Handle both old (d.courses) and new (d.data.courses) format
          setCourses(data.courses || d.courses || []);
          setTotal(data.pagination?.total ?? data.total ?? d.total ?? 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [level, category, search, minPrice, maxPrice, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="page">
      {/* Hero bar */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
        <div className="container">
          <div className="section-eyebrow">EXPLORE</div>
          <h1 className="section-title" style={{ marginBottom: 8 }}>All Courses</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>Find the perfect course to boost your skills and career</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32 }}>
        {/* Search bar */}
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <span>🔍</span>
          <input
            placeholder="Search courses…"
            defaultValue={search}
            onKeyDown={e => { if (e.key === 'Enter') updateParam('search', e.target.value); }}
            onBlur={e => { if (e.target.value !== search) updateParam('search', e.target.value); }}
          />
          {search && (
            <button style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem' }}
              onClick={() => updateParam('search', '')}>✕</button>
          )}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{ fontSize: '0.85rem', padding: '6px 14px', position: 'relative' }}
            onClick={() => setShowFilters(f => !f)}>
            ⚙️ Filters
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6, width: 18, height: 18,
                background: 'var(--primary)', borderRadius: '50%', fontSize: '0.7rem',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>{activeFilterCount}</span>
            )}
          </button>

          {/* Quick category pills */}
          {CATEGORIES.slice(0, 5).map(cat => (
            <button key={cat}
              onClick={() => updateParam('category', category === cat ? '' : cat)}
              style={{
                padding: '5px 12px', borderRadius: 99, border: '1px solid var(--border)',
                cursor: 'pointer', fontSize: '0.8rem', background: category === cat ? 'var(--primary)' : 'transparent',
                color: category === cat ? '#fff' : 'var(--text2)', transition: 'all 0.2s',
              }}>
              {cat}
            </button>
          ))}

          {activeFilterCount > 0 && (
            <button onClick={clearAll} style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕ Clear all
            </button>
          )}
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: 20, marginBottom: 20, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16
          }}>
            {/* Category dropdown */}
            <div>
              <label style={filterLabelStyle}>Category</label>
              <select className="input" value={category} onChange={e => updateParam('category', e.target.value)}
                style={{ width: '100%', padding: '7px 10px' }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Level dropdown */}
            <div>
              <label style={filterLabelStyle}>Level</label>
              <select className="input" value={level} onChange={e => updateParam('level', e.target.value)}
                style={{ width: '100%', padding: '7px 10px' }}>
                <option value="">All Levels</option>
                {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>

            {/* Price range */}
            <div>
              <label style={filterLabelStyle}>Price Range (₹)</label>
              <PriceRangeFilter minPrice={minPrice} maxPrice={maxPrice} onChange={updateParam} />
            </div>
          </div>
        )}

        {/* Animal strip (level filter) */}
        <AnimalStrip
          selected={level}
          onSelect={(l) => updateParam('level', l || '')}
        />

        {/* Active filter chips */}
        {(level || category || minPrice || maxPrice || search) && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {search && <FilterChip label={`"${search}"`} onRemove={() => updateParam('search', '')} />}
            {level && <FilterChip label={`Level: ${level}`} onRemove={() => updateParam('level', '')} />}
            {category && <FilterChip label={`Category: ${category}`} onRemove={() => updateParam('category', '')} />}
            {(minPrice || maxPrice) && (
              <FilterChip
                label={`Price: ${minPrice ? `₹${minPrice}` : '0'} – ${maxPrice ? `₹${maxPrice}` : '∞'}`}
                onRemove={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }}
              />
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="spinner" />
          </div>
        ) : courses.length > 0 ? (
          <>
            <p style={{ color: 'var(--text3)', fontSize: '0.83rem', marginBottom: 20 }}>
              {total} course{total !== 1 ? 's' : ''} found
              {page > 1 && ` · Page ${page} of ${totalPages}`}
            </p>
            <div className="grid-3">
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
                <button
                  className="btn"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  // Show pages around current
                  let p;
                  if (totalPages <= 7) p = i + 1;
                  else if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                  return (
                    <button key={p} className="btn"
                      onClick={() => setPage(p)}
                      style={{
                        padding: '7px 14px', fontSize: '0.85rem',
                        background: page === p ? 'var(--primary)' : 'transparent',
                        color: page === p ? '#fff' : 'var(--text1)',
                        borderColor: page === p ? 'var(--primary)' : 'var(--border)',
                      }}>
                      {p}
                    </button>
                  );
                })}
                <button
                  className="btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No courses found.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)', marginTop: 4 }}>Try a different filter or search term.</p>
            {activeFilterCount > 0 && (
              <button className="btn btn-primary" onClick={clearAll} style={{ marginTop: 12 }}>Clear Filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const filterLabelStyle = { fontSize: '0.8rem', color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 };

function FilterChip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', background: 'rgba(var(--primary-rgb),0.12)',
      borderRadius: 99, fontSize: '0.78rem', color: 'var(--primary)',
      border: '1px solid rgba(var(--primary-rgb),0.3)',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '0.85rem', lineHeight: 1 }}>✕</button>
    </span>
  );
}