// pages/admin/AdminCoursesPage.jsx
// Full admin panel: list all courses, create, edit, publish/unpublish, delete

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { API_BASE } from '../../utils/constants';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Database', 'AI/ML', 'Design', 'Other'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];

const EMPTY_FORM = {
  title: '', description: '', shortDescription: '',
  price: '', discountPrice: '', isFree: false,
  category: '', level: 'beginner', language: 'English',
  tags: '', requirements: '', outcomes: '',
};

function TagInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        className="input"
        rows={2}
        placeholder={placeholder || 'Comma-separated values…'}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', resize: 'vertical', fontSize: '0.85rem' }}
      />
      {value && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
          {value.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
            <span key={i} style={{ padding: '2px 10px', background: 'var(--bg3)', borderRadius: 99, fontSize: '0.75rem', color: 'var(--text2)', border: '1px solid var(--border)' }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(initial?.thumbnail || null);
  const fileRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setThumbnail(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (!form.description.trim()) return;
    onSave(form, thumbnail);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Title */}
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Course Title *</label>
        <input className="input" placeholder="e.g. Complete Node.js Bootcamp"
          value={form.title} onChange={e => set('title', e.target.value)} style={{ width: '100%' }} />
      </div>

      {/* Short description */}
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Short Description</label>
        <input className="input" placeholder="One-line summary shown in cards"
          value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} style={{ width: '100%' }} />
      </div>

      {/* Description */}
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Full Description *</label>
        <textarea className="input" rows={4} placeholder="Detailed course description…"
          value={form.description} onChange={e => set('description', e.target.value)}
          style={{ width: '100%', resize: 'vertical' }} />
      </div>

      {/* Price */}
      <div>
        <label style={labelStyle}>Price (₹) *</label>
        <input className="input" type="number" min="0" placeholder="999"
          value={form.price} onChange={e => set('price', e.target.value)}
          disabled={form.isFree} style={{ width: '100%', opacity: form.isFree ? 0.5 : 1 }} />
      </div>

      {/* Discount price */}
      <div>
        <label style={labelStyle}>Discount Price (₹)</label>
        <input className="input" type="number" min="0" placeholder="499"
          value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)}
          disabled={form.isFree} style={{ width: '100%', opacity: form.isFree ? 0.5 : 1 }} />
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>Category</label>
        <select className="input" value={form.category} onChange={e => set('category', e.target.value)} style={{ width: '100%', padding: '7px 10px' }}>
          <option value="">Select category…</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Level */}
      <div>
        <label style={labelStyle}>Level</label>
        <select className="input" value={form.level} onChange={e => set('level', e.target.value)} style={{ width: '100%', padding: '7px 10px' }}>
          {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
        </select>
      </div>

      {/* Language */}
      <div>
        <label style={labelStyle}>Language</label>
        <select className="input" value={form.language} onChange={e => set('language', e.target.value)} style={{ width: '100%', padding: '7px 10px' }}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Free toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="isFree" checked={form.isFree} onChange={e => { set('isFree', e.target.checked); if (e.target.checked) { set('price', '0'); set('discountPrice', ''); } }}
          style={{ width: 16, height: 16, cursor: 'pointer' }} />
        <label htmlFor="isFree" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>Free Course</label>
      </div>

      {/* Thumbnail */}
      <div style={{ gridColumn: '1/-1' }}>
        <label style={labelStyle}>Thumbnail</label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 160, height: 90, borderRadius: 'var(--radius-sm)', border: '2px dashed var(--border)',
              background: 'var(--bg1)', overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => fileRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)', textAlign: 'center', padding: 8 }}>Click to upload<br />16:9 recommended</span>
            )}
          </div>
          <div>
            <button className="btn" type="button" onClick={() => fileRef.current?.click()} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              📷 Choose Image
            </button>
            {thumbnail && <p style={{ fontSize: '0.75rem', color: 'var(--green)', marginTop: 6 }}>✓ {thumbnail.name}</p>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>

      {/* Tags */}
      <div style={{ gridColumn: '1/-1' }}>
        <TagInput label="Tags" value={form.tags} onChange={v => set('tags', v)} placeholder="javascript, nodejs, backend" />
      </div>

      {/* Requirements */}
      <div>
        <TagInput label="Requirements" value={form.requirements} onChange={v => set('requirements', v)} placeholder="Basic JS knowledge, Node installed" />
      </div>

      {/* Outcomes */}
      <div>
        <TagInput label="What You'll Learn" value={form.outcomes} onChange={v => set('outcomes', v)} placeholder="Build REST APIs, Deploy to cloud" />
      </div>

      {/* Actions */}
      <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !form.title.trim() || !form.description.trim()}
          style={{ flex: 1 }}>
          {loading ? 'Saving…' : initial?._id ? '💾 Update Course' : '✅ Create Course'}
        </button>
        <button className="btn" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null); // null = create, object = edit
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    const res = await authFetch(`/courses/admin/all?${params}`);
    if (res.success) {
      setCourses(res.data?.courses || []);
      setTotalPages(res.data?.pagination?.pages || 1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [page, search]);

  const buildFormData = (form, thumbnail) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== undefined) fd.append(k, String(v));
    });
    if (thumbnail) fd.append('thumbnail', thumbnail);
    return fd;
  };

  const handleCreate = async (form, thumbnail) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = buildFormData(form, thumbnail);
      const raw = await fetch(`${API_BASE}/courses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const res = await raw.json();
      if (res.success) {
        toast('✅ Course created!');
        setShowForm(false);
        fetchCourses();
      } else {
        toast(res.message || 'Failed to create course', 'error');
      }
    } catch {
      toast('Something went wrong', 'error');
    }
    setFormLoading(false);
  };

  const handleUpdate = async (form, thumbnail) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem('token');
      const fd = buildFormData(form, thumbnail);
      const raw = await fetch(`${API_BASE}/courses/${editCourse._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const res = await raw.json();
      if (res.success) {
        toast('✅ Course updated!');
        setEditCourse(null);
        fetchCourses();
      } else {
        toast(res.message || 'Failed to update', 'error');
      }
    } catch {
      toast('Something went wrong', 'error');
    }
    setFormLoading(false);
  };

  const handleTogglePublish = async (courseId) => {
    const res = await authFetch(`/courses/${courseId}/publish`, { method: 'PATCH' });
    if (res.success) {
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, isPublished: res.data.isPublished } : c));
      toast(res.message);
    } else {
      toast(res.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await authFetch(`/courses/${courseId}`, { method: 'DELETE' });
    if (res.success) {
      setCourses(prev => prev.filter(c => c._id !== courseId));
      toast('Course deleted');
    } else {
      toast(res.message || 'Delete failed', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 2 }}>📚 Courses</h2>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{courses.length} courses loaded</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditCourse(null); }}>
          ➕ Create New Course
        </button>
      </div>

      {/* Create/Edit form */}
      {(showForm || editCourse) && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>
            {editCourse ? `✏️ Edit: ${editCourse.title}` : '➕ Create New Course'}
          </h3>
          <CourseForm
            initial={editCourse ? {
              ...editCourse,
              tags: (editCourse.tags || []).join(', '),
              requirements: (editCourse.requirements || []).join(', '),
              outcomes: (editCourse.outcomes || []).join(', '),
            } : null}
            onSave={editCourse ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditCourse(null); }}
            loading={formLoading}
          />
        </div>
      )}

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 20, maxWidth: 400 }}>
        <span>🔍</span>
        <input placeholder="Search courses…" value={search}
          onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Escape' && setSearch('')} />
        {search && <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }} onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📚</div>
          <p>No courses yet. Create the first one!</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Title', 'Level', 'Price', 'Videos', 'Students', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text3)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px', maxWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.thumbnail && (
                        <img src={c.thumbnail} alt="" style={{ width: 40, height: 26, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{c.title}</div>
                        {c.category && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{c.category}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{c.level || '—'}</span>
                  </td>
                  <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                    {c.isFree ? (
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>FREE</span>
                    ) : (
                      <span>
                        ₹{c.discountPrice ?? c.price}
                        {c.discountPrice && <span style={{ color: 'var(--text3)', textDecoration: 'line-through', marginLeft: 4, fontSize: '0.75rem' }}>₹{c.price}</span>}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text2)' }}>{c.videos?.length || 0}</td>
                  <td style={{ padding: '12px', color: 'var(--text2)' }}>{c.totalStudents || 0}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600,
                      background: c.isPublished ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)',
                      color: c.isPublished ? '#22c55e' : '#ef4444',
                    }}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => navigate(`/courses/${c._id}`)}>
                        👁 View
                      </button>
                      <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => { setEditCourse(c); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                        ✏️ Edit
                      </button>
                      <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', color: c.isPublished ? '#ef4444' : 'var(--green)', borderColor: c.isPublished ? '#ef4444' : 'var(--green)' }}
                        onClick={() => handleTogglePublish(c._id)}>
                        {c.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef4444' }}
                        onClick={() => handleDelete(c._id, c.title)}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>← Prev</button>
          <span style={{ padding: '6px 14px', fontSize: '0.85rem', color: 'var(--text2)' }}>Page {page} of {totalPages}</span>
          <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Next →</button>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: '0.82rem', color: 'var(--text2)', display: 'block', marginBottom: 4, fontWeight: 500 };