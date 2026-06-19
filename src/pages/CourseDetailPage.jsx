// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { useToast } from '../context/ToastContext';
// // import { openRazorpay } from '../utils/razorpay';
// // import { API_BASE, ANIMAL_EMOJI } from '../utils/constants';

// // function fmtDur(sec) {
// //   if (!sec) return '0:00';
// //   const m = Math.floor(sec / 60), s = sec % 60;
// //   return `${m}:${String(s).padStart(2, '0')}`;
// // }

// // export default function CourseDetailPage({ onAuth }) {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { user, authFetch } = useAuth();
// //   const toast = useToast();
// //   const [course, setCourse] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [buying, setBuying] = useState(false);
// //   const [purchased, setPurchased] = useState(false);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     fetch(`${API_BASE}/courses/${id}`, {
// //       headers: token ? { Authorization: `Bearer ${token}` } : {},
// //     })
// //       .then(r => r.json())
// //       .then(d => {
// //         if (d.success) {
// //           setCourse(d.data || d.course);
// //           setPurchased(d.purchased || d.data?.isPurchased || false);
// //         }
// //         setLoading(false);
// //       })
// //       .catch(() => setLoading(false));
// //   }, [id]);

// //   const handleBuy = async () => {
// //     if (!user) { onAuth(); return; }
// //     if (purchased) { navigate('/dashboard'); return; }
// //     setBuying(true);
// //     try {
// //       const orderRes = await authFetch('/payments/create-order', {
// //         method: 'POST',
// //         body: JSON.stringify({ itemType: 'course', itemId: id }),
// //       });
// //       if (!orderRes.success) { toast(orderRes.message || 'Failed to create order', 'error'); setBuying(false); return; }

// //       openRazorpay({
// //         order: orderRes.order,
// //         user,
// //         onSuccess: async (paymentData) => {
// //           const verifyRes = await authFetch('/payments/verify', {
// //             method: 'POST',
// //             body: JSON.stringify({ ...paymentData, itemType: 'course', itemId: id }),
// //           });
// //           if (verifyRes.success) {
// //             toast('🎉 Purchase successful! Happy learning!');
// //             setPurchased(true);
// //           } else {
// //             toast(verifyRes.message || 'Verification failed', 'error');
// //           }
// //           setBuying(false);
// //         },
// //         onFailure: (msg) => {
// //           if (msg !== 'Payment cancelled') toast(msg, 'error');
// //           setBuying(false);
// //         },
// //       });
// //     } catch {
// //       toast('Something went wrong', 'error');
// //       setBuying(false);
// //     }
// //   };

// //   if (loading) return <div className="page"><div className="spinner" /></div>;
// //   if (!course) return (
// //     <div className="page">
// //       <div className="empty-state"><div className="icon">😕</div><p>Course not found</p></div>
// //     </div>
// //   );

// //   const price = course.isFree ? 0 : (course.discountPrice ?? course.price);

// //   return (
// //     <div className="page">
// //       {/* Header */}
// //       <div className="detail-header">
// //         <div className="container">
// //           <div className="detail-breadcrumb" onClick={() => navigate('/courses')}>
// //             ← Back to <span>Courses</span>
// //           </div>
// //           <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
// //             <span className="badge badge-primary">{course.level || 'All'}</span>
// //             {course.category && <span className="badge badge-cyan">{course.category}</span>}
// //             {course.isFree && <span className="badge badge-green">FREE</span>}
// //           </div>
// //           <h1 className="detail-title">{course.title}</h1>
// //           <div className="detail-meta-row">
// //             <span>🎬 {course.videos?.length || 0} videos</span>
// //             <span>👥 {course.totalStudents || 0} students</span>
// //             <span>🌐 {course.language || 'English'}</span>
// //             <span>{ANIMAL_EMOJI[course.level] || '📚'} {course.level || 'All Levels'}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Body */}
// //       <div className="container">
// //         <div className="detail-layout">
// //           {/* Main content */}
// //           <div>
// //             {/* Description */}
// //             <div style={{ marginBottom: 32 }}>
// //               <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>About This Course</h2>
// //               <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.95rem' }}>{course.description}</p>
// //             </div>

// //             {/* Requirements */}
// //             {course.requirements?.length > 0 && (
// //               <div style={{ marginBottom: 28 }}>
// //                 <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Requirements</h3>
// //                 <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
// //                   {course.requirements.map((r, i) => (
// //                     <li key={i} style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>{r}</li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}

// //             {/* Outcomes */}
// //             {course.outcomes?.length > 0 && (
// //               <div style={{ marginBottom: 28 }}>
// //                 <h3 style={{ fontWeight: 700, marginBottom: 12 }}>What You'll Learn</h3>
// //                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 10 }}>
// //                   {course.outcomes.map((o, i) => (
// //                     <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'var(--text2)' }}>
// //                       <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span> {o}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Videos */}
// //             {course.videos?.length > 0 && (
// //               <div>
// //                 <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>
// //                   Course Content ({course.videos.length} videos)
// //                 </h2>
// //                 <div className="video-list">
// //                   {course.videos.map((v, i) => {
// //                     const canWatch = purchased || v.isPreview;
// //                     return (
// //                       <div key={v._id || i} className={`video-item ${!canWatch ? 'locked' : ''}`}>
// //                         <div className="video-num">{i + 1}</div>
// //                         <div className="video-info">
// //                           <div className="video-title-text">{v.title}</div>
// //                           {v.duration > 0 && <div className="video-dur">⏱ {fmtDur(v.duration)}</div>}
// //                         </div>
// //                         {v.isPreview && !purchased && <span className="badge badge-green" style={{ flexShrink: 0 }}>Preview</span>}
// //                         {!canWatch && <span style={{ fontSize: '1rem', color: 'var(--text3)' }}>🔒</span>}
// //                         {canWatch && <span style={{ fontSize: '1rem', color: 'var(--primary-light)' }}>▶</span>}
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Sidebar */}
// //           <div className="detail-sidebar">
// //             {course.thumbnail && (
// //               <img src={course.thumbnail} alt={course.title} style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 16, aspectRatio: '16/9', objectFit: 'cover' }} />
// //             )}
// //             <div className="sidebar-price">{course.isFree ? 'FREE' : `₹${price}`}</div>
// //             {!course.isFree && course.discountPrice && <div className="sidebar-price-old">₹{course.price}</div>}

// //             {purchased ? (
// //               <button className="btn btn-green sidebar-btn btn-lg" onClick={() => navigate('/dashboard')}>
// //                 ✅ Already Purchased — Go to Dashboard
// //               </button>
// //             ) : (
// //               <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleBuy} disabled={buying}>
// //                 {buying ? 'Processing…' : course.isFree ? '🚀 Enroll Free' : `💳 Buy for ₹${price}`}
// //               </button>
// //             )}

// //             <div className="sidebar-features">
// //               {[
// //                 ['🎬', `${course.videos?.length || 0} video lessons`],
// //                 ['🌐', `Language: ${course.language || 'English'}`],
// //                 ['📊', `Level: ${course.level || 'All Levels'}`],
// //                 ['♾️', 'Lifetime access'],
// //                 ['📱', 'Access on all devices'],
// //               ].map(([icon, text]) => (
// //                 <div key={text} className="sidebar-feature">
// //                   <span className="icon">{icon}</span>
// //                   <span>{text}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useToast } from '../context/ToastContext';
// import { openRazorpay } from '../utils/razorpay';
// import { API_BASE, ANIMAL_EMOJI } from '../utils/constants';

// function fmtDur(sec) {
//   if (!sec) return '0:00';
//   const h = Math.floor(sec / 3600);
//   const m = Math.floor((sec % 3600) / 60);
//   const s = sec % 60;
//   if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
//   return `${m}:${String(s).padStart(2, '0')}`;
// }

// // ── Upload progress bar ────────────────────────────────────────
// function UploadProgress({ percent, fileName }) {
//   return (
//     <div style={{ marginTop: 12, padding: 12, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
//         <span style={{ fontSize: '0.8rem', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{fileName}</span>
//         <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{percent}%</span>
//       </div>
//       <div style={{ height: 6, background: 'var(--bg1)', borderRadius: 99, overflow: 'hidden' }}>
//         <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 99, transition: 'width 0.3s ease' }} />
//       </div>
//       {percent === 100 && (
//         <p style={{ fontSize: '0.75rem', color: 'var(--green)', marginTop: 4 }}>✅ Upload complete! Processing…</p>
//       )}
//     </div>
//   );
// }

// // ── Edit Video Modal ───────────────────────────────────────────
// function EditVideoModal({ video, courseId, authFetch, toast, onUpdated, onClose }) {
//   const [form, setForm] = useState({
//     title: video.title || '',
//     description: video.description || '',
//     duration: video.duration || 0,
//     isPreview: video.isPreview || false,
//     buyNowTriggerSeconds: video.buyNowTriggerSeconds || 300,
//     order: video.order || 0,
//   });
//   const [saving, setSaving] = useState(false);
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const handleSave = async () => {
//     if (!form.title.trim()) { toast('Title is required', 'error'); return; }
//     setSaving(true);
//     try {
//       const res = await authFetch(`/courses/${courseId}/videos/${video._id}`, {
//         method: 'PUT',
//         body: JSON.stringify(form),
//       });
//       if (res.success) {
//         toast('Video updated');
//         onUpdated(res.data?.video || { ...video, ...form });
//         onClose();
//       } else {
//         toast(res.message || 'Update failed', 'error');
//       }
//     } catch {
//       toast('Something went wrong', 'error');
//     }
//     setSaving(false);
//   };

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
//       display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
//     }} onClick={onClose}>
//       <div style={{
//         background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 24, width: '100%',
//         maxWidth: 500, border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto'
//       }} onClick={e => e.stopPropagation()}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//           <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>✏️ Edit Video</h3>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text2)' }}>✕</button>
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//           <div>
//             <label style={labelStyle}>Video Title *</label>
//             <input className="input" value={form.title} onChange={e => set('title', e.target.value)} style={{ width: '100%' }} />
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//             <div>
//               <label style={labelStyle}>Duration (seconds)</label>
//               <input className="input" type="number" min="0" value={form.duration} onChange={e => set('duration', Number(e.target.value))} style={{ width: '100%' }} />
//             </div>
//             <div>
//               <label style={labelStyle}>Order</label>
//               <input className="input" type="number" min="0" value={form.order} onChange={e => set('order', Number(e.target.value))} style={{ width: '100%' }} />
//             </div>
//           </div>
//           <div>
//             <label style={labelStyle}>Buy-Now Trigger (seconds)</label>
//             <input className="input" type="number" min="0" value={form.buyNowTriggerSeconds} onChange={e => set('buyNowTriggerSeconds', Number(e.target.value))} style={{ width: '100%' }} />
//           </div>
//           <div>
//             <label style={labelStyle}>Description</label>
//             <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
//           </div>
//           <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
//             <input type="checkbox" checked={form.isPreview} onChange={e => set('isPreview', e.target.checked)} style={{ width: 16, height: 16 }} />
//             Free Preview (visible without purchase)
//           </label>
//         </div>

//         <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
//           <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
//             {saving ? 'Saving…' : '💾 Save Changes'}
//           </button>
//           <button className="btn" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const labelStyle = { fontSize: '0.82rem', color: 'var(--text2)', display: 'block', marginBottom: 4 };

// // ── Admin video add form ───────────────────────────────────────
// function AddVideoForm({ courseId, onAdded, authFetch, toast }) {
//   const [tab, setTab] = useState('url');
//   const [saving, setSaving] = useState(false);
//   const [uploadPercent, setUploadPercent] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [file, setFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const [form, setForm] = useState({
//     title: '', videoUrl: '', description: '',
//     duration: '', isPreview: false, buyNowTriggerSeconds: 300,
//   });
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const resetForm = () => {
//     setForm({ title: '', videoUrl: '', description: '', duration: '', isPreview: false, buyNowTriggerSeconds: 300 });
//     setFile(null);
//     setUploadPercent(0);
//     setUploading(false);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   // XHR-based upload so we can track progress
//   const uploadWithProgress = (url, formData, token) => {
//     return new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open('POST', url);
//       xhr.setRequestHeader('Authorization', `Bearer ${token}`);
//       xhr.upload.addEventListener('progress', (e) => {
//         if (e.lengthComputable) {
//           const pct = Math.round((e.loaded / e.total) * 100);
//           setUploadPercent(pct);
//         }
//       });
//       xhr.onload = () => {
//         try { resolve(JSON.parse(xhr.responseText)); }
//         catch { reject(new Error('Invalid JSON response')); }
//       };
//       xhr.onerror = () => reject(new Error('Network error'));
//       xhr.send(formData);
//     });
//   };

//   const handleSubmit = async () => {
//     if (!form.title.trim()) { toast('Title is required', 'error'); return; }
//     setSaving(true);
//     try {
//       let res;

//       if (tab === 'url') {
//         if (!form.videoUrl.trim()) { toast('Video URL is required', 'error'); setSaving(false); return; }
//         res = await authFetch(`/courses/${courseId}/videos/url`, {
//           method: 'POST',
//           body: JSON.stringify({
//             title: form.title.trim(),
//             videoUrl: form.videoUrl.trim(),
//             description: form.description,
//             duration: Number(form.duration) || 0,
//             isPreview: form.isPreview,
//             buyNowTriggerSeconds: Number(form.buyNowTriggerSeconds) || 300,
//           }),
//         });
//       } else {
//         if (!file) { toast('Please select a video file', 'error'); setSaving(false); return; }

//         // Validate file size (warn if > 500MB)
//         if (file.size > 500 * 1024 * 1024) {
//           if (!window.confirm(`File is ${(file.size / 1024 / 1024).toFixed(0)}MB. Large files may take a while. Continue?`)) {
//             setSaving(false);
//             return;
//           }
//         }

//         const fd = new FormData();
//         fd.append('video', file);
//         fd.append('title', form.title.trim());
//         fd.append('description', form.description);
//         fd.append('duration', String(Number(form.duration) || 0));
//         fd.append('isPreview', form.isPreview ? 'true' : 'false');
//         fd.append('buyNowTriggerSeconds', String(Number(form.buyNowTriggerSeconds) || 300));

//         const token = localStorage.getItem('token');
//         setUploading(true);
//         res = await uploadWithProgress(`${API_BASE}/courses/${courseId}/videos/upload`, fd, token);
//       }

//       if (res.success) {
//         toast('✅ Video added successfully!');
//         onAdded(res.data?.video || res.video);
//         resetForm();
//       } else {
//         toast(res.message || 'Failed to add video', 'error');
//       }
//     } catch (err) {
//       console.error(err);
//       toast('Upload failed. Check your connection.', 'error');
//     }
//     setSaving(false);
//     setUploading(false);
//   };

//   return (
//     <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 24 }}>
//       <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>➕ Add New Video</h3>

//       {/* Tab switch */}
//       <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
//         {[['url', '🔗 Video URL'], ['upload', '📁 Upload File']].map(([t, label]) => (
//           <button key={t} onClick={() => { setTab(t); resetForm(); }}
//             style={{
//               padding: '6px 16px', borderRadius: 'var(--radius-sm)',
//               border: '1px solid var(--border)', cursor: 'pointer',
//               fontWeight: tab === t ? 700 : 400,
//               background: tab === t ? 'var(--primary)' : 'transparent',
//               color: tab === t ? '#fff' : 'var(--text1)',
//               transition: 'all 0.2s',
//             }}>
//             {label}
//           </button>
//         ))}
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//         {/* Title */}
//         <div style={{ gridColumn: '1/-1' }}>
//           <label style={labelStyle}>Video Title *</label>
//           <input className="input" placeholder="e.g. Introduction to React Hooks"
//             value={form.title} onChange={e => set('title', e.target.value)} style={{ width: '100%' }} />
//         </div>

//         {/* URL or File */}
//         {tab === 'url' ? (
//           <div style={{ gridColumn: '1/-1' }}>
//             <label style={labelStyle}>Video URL *</label>
//             <input className="input" placeholder="https://youtube.com/... or direct .mp4 URL"
//               value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} style={{ width: '100%' }} />
//           </div>
//         ) : (
//           <div style={{ gridColumn: '1/-1' }}>
//             <label style={labelStyle}>Video File *</label>
//             <div
//               style={{
//                 border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)',
//                 padding: 24, textAlign: 'center', cursor: 'pointer',
//                 background: file ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--bg1)',
//                 transition: 'all 0.2s',
//               }}
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={e => e.preventDefault()}
//               onDrop={e => {
//                 e.preventDefault();
//                 const dropped = e.dataTransfer.files[0];
//                 if (dropped && dropped.type.startsWith('video/')) setFile(dropped);
//                 else toast('Please drop a video file', 'error');
//               }}
//             >
//               {file ? (
//                 <div>
//                   <div style={{ fontSize: '2rem', marginBottom: 6 }}>🎬</div>
//                   <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text1)' }}>{file.name}</p>
//                   <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
//                   <button
//                     onClick={e => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
//                     style={{ marginTop: 6, fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
//                     ✕ Remove
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📁</div>
//                   <p style={{ fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>Drop video here or click to browse</p>
//                   <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>MP4, WebM, MOV, AVI supported</p>
//                 </div>
//               )}
//             </div>
//             <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }}
//               onChange={e => setFile(e.target.files[0] || null)} />

//             {uploading && <UploadProgress percent={uploadPercent} fileName={file?.name || ''} />}
//           </div>
//         )}

//         {/* Duration */}
//         <div>
//           <label style={labelStyle}>Duration (seconds)</label>
//           <input className="input" type="number" min="0" placeholder="0"
//             value={form.duration} onChange={e => set('duration', e.target.value)} style={{ width: '100%' }} />
//         </div>

//         {/* Buy-Now trigger */}
//         <div>
//           <label style={labelStyle}>Buy-Now Trigger (seconds)</label>
//           <input className="input" type="number" min="0" placeholder="300"
//             value={form.buyNowTriggerSeconds} onChange={e => set('buyNowTriggerSeconds', e.target.value)} style={{ width: '100%' }} />
//         </div>

//         {/* Description */}
//         <div style={{ gridColumn: '1/-1' }}>
//           <label style={labelStyle}>Description (optional)</label>
//           <textarea className="input" rows={2} placeholder="Short description…"
//             value={form.description} onChange={e => set('description', e.target.value)}
//             style={{ width: '100%', resize: 'vertical' }} />
//         </div>

//         {/* Preview toggle */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <input type="checkbox" id="chk_preview" checked={form.isPreview}
//             onChange={e => set('isPreview', e.target.checked)}
//             style={{ width: 16, height: 16, cursor: 'pointer' }} />
//           <label htmlFor="chk_preview" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>
//             Free Preview (visible without purchase)
//           </label>
//         </div>
//       </div>

//       <button className="btn btn-primary" onClick={handleSubmit}
//         disabled={saving || (tab === 'upload' && uploading && uploadPercent < 100)}
//         style={{ marginTop: 16 }}>
//         {uploading && uploadPercent < 100 ? `Uploading… ${uploadPercent}%` : saving ? 'Adding…' : '➕ Add Video'}
//       </button>
//     </div>
//   );
// }

// // ── Reorder drag-and-drop video list ──────────────────────────
// function VideoItem({ v, i, purchased, isAdmin, onDelete, onEdit }) {
//   const canWatch = purchased || v.isPreview;
//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
//       borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
//       marginBottom: 8, background: 'var(--bg1)',
//       opacity: !canWatch ? 0.65 : 1,
//       transition: 'opacity 0.2s',
//     }}>
//       <div style={{
//         width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: '0.78rem', fontWeight: 700, flexShrink: 0
//       }}>{i + 1}</div>

//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {v.title}
//         </div>
//         <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
//           {v.duration > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>⏱ {fmtDur(v.duration)}</span>}
//           {v.description && <span style={{ fontSize: '0.75rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{v.description}</span>}
//         </div>
//       </div>

//       {v.isPreview && !purchased && <span className="badge badge-green" style={{ flexShrink: 0 }}>Preview</span>}
//       <span style={{ fontSize: '1rem', color: canWatch ? 'var(--primary-light)' : 'var(--text3)' }}>
//         {canWatch ? '▶' : '🔒'}
//       </span>

//       {isAdmin && (
//         <div style={{ display: 'flex', gap: 4 }}>
//           <button onClick={() => onEdit(v)}
//             style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 4 }}
//             title="Edit video">✏️</button>
//           <button onClick={() => onDelete(v._id)}
//             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 4 }}
//             title="Delete video">🗑</button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main Page ──────────────────────────────────────────────────
// export default function CourseDetailPage({ onAuth }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user, authFetch } = useAuth();
//   const toast = useToast();

//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const [purchased, setPurchased] = useState(false);
//   const [showAddVideo, setShowAddVideo] = useState(false);
//   const [editingVideo, setEditingVideo] = useState(null);
//   const [activeTab, setActiveTab] = useState('content'); // 'content' | 'about'

//   const isAdmin = user?.role === 'admin';

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     fetch(`${API_BASE}/courses/${id}`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//     })
//       .then(r => r.json())
//       .then(d => {
//         if (d.success) {
//           setCourse(d.data?.course ?? null);
//           setPurchased(d.data?.purchased ?? false);
//         }
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   const handleBuy = async () => {
//     if (!user) { onAuth(); return; }
//     if (purchased) { navigate('/dashboard'); return; }
//     setBuying(true);
//     try {
//       const orderRes = await authFetch('/payments/create-order', {
//         method: 'POST',
//         body: JSON.stringify({ itemType: 'course', itemId: id }),
//       });
//       if (!orderRes.success) { toast(orderRes.message || 'Failed to create order', 'error'); setBuying(false); return; }

//       openRazorpay({
//         order: orderRes.order, user,
//         onSuccess: async (paymentData) => {
//           const verifyRes = await authFetch('/payments/verify', {
//             method: 'POST',
//             body: JSON.stringify({ ...paymentData, itemType: 'course', itemId: id }),
//           });
//           if (verifyRes.success) {
//             toast('🎉 Purchase successful! Happy learning!');
//             setPurchased(true);
//           } else {
//             toast(verifyRes.message || 'Verification failed', 'error');
//           }
//           setBuying(false);
//         },
//         onFailure: (msg) => {
//           if (msg !== 'Payment cancelled') toast(msg, 'error');
//           setBuying(false);
//         },
//       });
//     } catch {
//       toast('Something went wrong', 'error');
//       setBuying(false);
//     }
//   };

//   const handleVideoAdded = (newVideo) => {
//     if (!newVideo) return;
//     setCourse(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
//     setShowAddVideo(false);
//     toast('Video added to course!');
//   };

//   const handleDeleteVideo = async (videoId) => {
//     if (!window.confirm('Delete this video? This cannot be undone.')) return;
//     const res = await authFetch(`/courses/${id}/videos/${videoId}`, { method: 'DELETE' });
//     if (res.success) {
//       setCourse(prev => ({ ...prev, videos: prev.videos.filter(v => v._id !== videoId) }));
//       toast('Video deleted');
//     } else {
//       toast(res.message || 'Delete failed', 'error');
//     }
//   };

//   const handleVideoUpdated = (updatedVideo) => {
//     setCourse(prev => ({
//       ...prev,
//       videos: prev.videos.map(v => v._id === updatedVideo._id ? updatedVideo : v)
//     }));
//     setEditingVideo(null);
//   };

//   const handleTogglePublish = async () => {
//     const res = await authFetch(`/courses/${id}/publish`, { method: 'PATCH' });
//     if (res.success) {
//       setCourse(prev => ({ ...prev, isPublished: res.data.isPublished, publishedAt: res.data.isPublished ? new Date().toISOString() : null }));
//       toast(res.message);
//     } else {
//       toast(res.message || 'Failed', 'error');
//     }
//   };

//   // ── Loading & Not Found ──────────────────────────────────────
//   if (loading) return (
//     <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
//       <div className="spinner" />
//     </div>
//   );

//   if (!course) return (
//     <div className="page">
//       <div className="empty-state">
//         <div className="icon">😕</div>
//         <p>Course not found</p>
//         <button className="btn btn-primary" onClick={() => navigate('/courses')} style={{ marginTop: 12 }}>Browse Courses</button>
//       </div>
//     </div>
//   );

//   const price = course.isFree ? 0 : (course.discountPrice ?? course.price);
//   const totalDuration = course.videos?.reduce((acc, v) => acc + (v.duration || 0), 0) || 0;

//   return (
//     <div className="page">
//       {/* Edit Video Modal */}
//       {editingVideo && (
//         <EditVideoModal
//           video={editingVideo}
//           courseId={id}
//           authFetch={authFetch}
//           toast={toast}
//           onUpdated={handleVideoUpdated}
//           onClose={() => setEditingVideo(null)}
//         />
//       )}

//       {/* ── Header ── */}
//       <div className="detail-header">
//         <div className="container">
//           <div className="detail-breadcrumb" onClick={() => navigate('/courses')}>← Back to <span>Courses</span></div>

//           <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
//             <span className="badge badge-primary">{course.level || 'All'}</span>
//             {course.category && <span className="badge badge-cyan">{course.category}</span>}
//             {course.isFree && <span className="badge badge-green">FREE</span>}
//             {isAdmin && (
//               <span style={{
//                 padding: '2px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600,
//                 background: course.isPublished ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
//                 color: course.isPublished ? '#22c55e' : '#ef4444',
//                 border: `1px solid ${course.isPublished ? '#22c55e' : '#ef4444'}`,
//               }}>
//                 {course.isPublished ? '🟢 Published' : '🔴 Draft'}
//               </span>
//             )}
//           </div>

//           <h1 className="detail-title">{course.title}</h1>
//           {course.shortDescription && (
//             <p style={{ color: 'var(--text2)', fontSize: '0.95rem', marginBottom: 12 }}>{course.shortDescription}</p>
//           )}

//           <div className="detail-meta-row">
//             <span>🎬 {course.videos?.length || 0} videos</span>
//             {totalDuration > 0 && <span>⏱ {fmtDur(totalDuration)} total</span>}
//             <span>👥 {course.totalStudents || 0} students</span>
//             <span>🌐 {course.language || 'English'}</span>
//             <span>{ANIMAL_EMOJI?.[course.level] || '📚'} {course.level || 'All Levels'}</span>
//           </div>
//         </div>
//       </div>

//       {/* ── Body ── */}
//       <div className="container">
//         {/* Admin toolbar */}
//         {isAdmin && (
//           <div style={{
//             display: 'flex', gap: 10, flexWrap: 'wrap', padding: '14px 16px',
//             background: 'rgba(var(--primary-rgb),0.06)', border: '1px solid var(--border)',
//             borderRadius: 'var(--radius)', marginBottom: 24, alignItems: 'center',
//           }}>
//             <span style={{ fontSize: '0.82rem', color: 'var(--text2)', fontWeight: 600 }}>⚙️ Admin</span>
//             <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
//               onClick={() => setShowAddVideo(v => !v)}>
//               {showAddVideo ? '✕ Close' : '➕ Add Video'}
//             </button>
//             <button
//               className="btn"
//               style={{ padding: '6px 14px', fontSize: '0.85rem', color: course.isPublished ? '#ef4444' : 'var(--green)', borderColor: course.isPublished ? '#ef4444' : 'var(--green)' }}
//               onClick={handleTogglePublish}>
//               {course.isPublished ? '📴 Unpublish' : '🚀 Publish'}
//             </button>
//             <button className="btn" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
//               onClick={() => navigate(`/admin/courses/${id}/edit`)}>
//               ✏️ Edit Course
//             </button>
//           </div>
//         )}

//         <div className="detail-layout">
//           {/* Left column */}
//           <div>
//             {/* Add Video form */}
//             {isAdmin && showAddVideo && (
//               <AddVideoForm courseId={id} onAdded={handleVideoAdded} authFetch={authFetch} toast={toast} />
//             )}

//             {/* Tab bar */}
//             <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
//               {[['content', '📋 Course Content'], ['about', 'ℹ️ About']].map(([t, label]) => (
//                 <button key={t} onClick={() => setActiveTab(t)} style={{
//                   padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
//                   fontWeight: activeTab === t ? 700 : 400,
//                   color: activeTab === t ? 'var(--primary)' : 'var(--text2)',
//                   borderBottom: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent',
//                   marginBottom: -2, fontSize: '0.9rem',
//                 }}>
//                   {label}
//                 </button>
//               ))}
//             </div>

//             {/* Content Tab */}
//             {activeTab === 'content' && (
//               <div>
//                 {course.videos?.length > 0 ? (
//                   <div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//                       <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.1rem', fontWeight: 700 }}>
//                         {course.videos.length} Lessons
//                         {totalDuration > 0 && <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text2)', marginLeft: 8 }}>· {fmtDur(totalDuration)}</span>}
//                       </h2>
//                       {!purchased && course.videos.filter(v => v.isPreview).length > 0 && (
//                         <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
//                           {course.videos.filter(v => v.isPreview).length} free preview{course.videos.filter(v => v.isPreview).length !== 1 ? 's' : ''}
//                         </span>
//                       )}
//                     </div>
//                     <div className="video-list">
//                       {course.videos.map((v, i) => (
//                         <VideoItem
//                           key={v._id || i}
//                           v={v} i={i}
//                           purchased={purchased}
//                           isAdmin={isAdmin}
//                           onDelete={handleDeleteVideo}
//                           onEdit={setEditingVideo}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="empty-state">
//                     <div className="icon">🎬</div>
//                     <p>No videos yet{isAdmin ? ' — add the first one above' : ''}</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* About Tab */}
//             {activeTab === 'about' && (
//               <div>
//                 {/* Description */}
//                 <div style={{ marginBottom: 32 }}>
//                   <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>About This Course</h2>
//                   <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{course.description}</p>
//                 </div>

//                 {/* Requirements */}
//                 {course.requirements?.length > 0 && (
//                   <div style={{ marginBottom: 28 }}>
//                     <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Requirements</h3>
//                     <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
//                       {course.requirements.map((r, i) => (
//                         <li key={i} style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>{r}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Outcomes */}
//                 {course.outcomes?.length > 0 && (
//                   <div style={{ marginBottom: 28 }}>
//                     <h3 style={{ fontWeight: 700, marginBottom: 12 }}>What You'll Learn</h3>
//                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
//                       {course.outcomes.map((o, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'var(--text2)', alignItems: 'flex-start' }}>
//                           <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span>{o}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Tags */}
//                 {course.tags?.length > 0 && (
//                   <div style={{ marginBottom: 28 }}>
//                     <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Tags</h3>
//                     <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//                       {course.tags.map((tag, i) => (
//                         <span key={i} style={{ padding: '4px 12px', background: 'var(--bg3)', borderRadius: 99, fontSize: '0.8rem', color: 'var(--text2)', border: '1px solid var(--border)' }}>
//                           {tag}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Instructor */}
//                 {course.instructor && (
//                   <div style={{ marginBottom: 28, padding: 16, background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
//                     <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Instructor</h3>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                       {course.instructor.avatar ? (
//                         <img src={course.instructor.avatar} alt={course.instructor.name}
//                           style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
//                       ) : (
//                         <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
//                           {course.instructor.name?.[0]?.toUpperCase() || '?'}
//                         </div>
//                       )}
//                       <div>
//                         <div style={{ fontWeight: 600 }}>{course.instructor.name}</div>
//                         <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Course Instructor</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── Sidebar ── */}
//           <div className="detail-sidebar">
//             {course.thumbnail && (
//               <img src={course.thumbnail} alt={course.title}
//                 style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 16, aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
//             )}

//             {/* Price */}
//             <div style={{ marginBottom: 4 }}>
//               <span className="sidebar-price">{course.isFree ? 'FREE' : `₹${price}`}</span>
//               {!course.isFree && course.discountPrice && (
//                 <>
//                   <span className="sidebar-price-old" style={{ marginLeft: 8 }}>₹{course.price}</span>
//                   <span style={{ marginLeft: 8, fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>
//                     {Math.round((1 - course.discountPrice / course.price) * 100)}% off
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* CTA */}
//             {purchased ? (
//               <button className="btn btn-green sidebar-btn btn-lg" onClick={() => navigate('/dashboard')}>
//                 ✅ Go to Dashboard
//               </button>
//             ) : (
//               <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleBuy} disabled={buying}>
//                 {buying ? 'Processing…' : course.isFree ? '🚀 Enroll Free' : `💳 Buy for ₹${price}`}
//               </button>
//             )}

//             {/* Features */}
//             <div className="sidebar-features" style={{ marginTop: 16 }}>
//               {[
//                 ['🎬', `${course.videos?.length || 0} video lessons`],
//                 totalDuration > 0 && ['⏱', `${fmtDur(totalDuration)} of content`],
//                 ['🌐', `Language: ${course.language || 'English'}`],
//                 ['📊', `Level: ${course.level || 'All Levels'}`],
//                 ['♾️', 'Lifetime access'],
//                 ['📱', 'Access on all devices'],
//               ].filter(Boolean).map(([icon, text]) => (
//                 <div key={text} className="sidebar-feature">
//                   <span className="icon">{icon}</span><span>{text}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Related notes */}
//             {course.notes?.length > 0 && (
//               <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
//                 <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.9rem' }}>📄 Companion Notes</h4>
//                 {course.notes.map(n => (
//                   <div key={n._id} style={{ padding: '10px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 8 }}>
//                     <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{n.title}</div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontSize: '0.8rem', color: n.isFree ? 'var(--green)' : 'var(--text2)' }}>
//                         {n.isFree ? 'Free' : `₹${n.effectivePrice ?? n.price}`}
//                       </span>
//                       <button className="btn btn-primary" style={{ padding: '3px 10px', fontSize: '0.75rem' }}
//                         onClick={() => navigate(`/notes/${n._id}`)}>
//                         View
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { openRazorpay } from '../utils/razorpay';
import { API_BASE, ANIMAL_EMOJI } from '../utils/constants';

/* ── helpers ─────────────────────────────────────────────── */
function fmtDur(sec) {
  if (!sec) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/* ── Upload progress ─────────────────────────────────────── */
function UploadProgress({ percent, fileName }) {
  return (
    <div style={{ marginTop: 12, padding: 12, background: 'var(--bg3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{fileName}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{percent}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg1)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percent}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: 99, transition: 'width 0.3s ease' }} />
      </div>
      {percent === 100 && (
        <p style={{ fontSize: '0.75rem', color: 'var(--green)', marginTop: 4 }}>✅ Upload complete! Processing…</p>
      )}
    </div>
  );
}

/* ── Edit Video Modal ────────────────────────────────────── */
const labelStyle = { fontSize: '0.82rem', color: 'var(--text2)', display: 'block', marginBottom: 4 };

function EditVideoModal({ video, courseId, authFetch, toast, onUpdated, onClose }) {
  const [form, setForm] = useState({
    title: video.title || '',
    description: video.description || '',
    duration: video.duration || 0,
    isPreview: video.isPreview || false,
    buyNowTriggerSeconds: video.buyNowTriggerSeconds || 300,
    order: video.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      const res = await authFetch(`/courses/${courseId}/videos/${video._id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      if (res.success) {
        toast('Video updated');
        onUpdated(res.data?.video || { ...video, ...form });
        onClose();
      } else {
        toast(res.message || 'Update failed', 'error');
      }
    } catch {
      toast('Something went wrong', 'error');
    }
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: 24, width: '100%', maxWidth: 500, border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>✏️ Edit Video</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text2)' }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Video Title *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Duration (seconds)</label>
              <input className="input" type="number" min="0" value={form.duration} onChange={e => set('duration', Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}>Order</label>
              <input className="input" type="number" min="0" value={form.order} onChange={e => set('order', Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Buy-Now Trigger (seconds)</label>
            <input className="input" type="number" min="0" value={form.buyNowTriggerSeconds} onChange={e => set('buyNowTriggerSeconds', Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.88rem' }}>
            <input type="checkbox" checked={form.isPreview} onChange={e => set('isPreview', e.target.checked)} style={{ width: 16, height: 16 }} />
            Free Preview (visible without purchase)
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
          <button className="btn" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Video Form ──────────────────────────────────────── */
function AddVideoForm({ courseId, onAdded, authFetch, toast }) {
  const [tab, setTab] = useState('url');
  const [saving, setSaving] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '', videoUrl: '', description: '',
    duration: '', isPreview: false, buyNowTriggerSeconds: 300,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const resetForm = () => {
    setForm({ title: '', videoUrl: '', description: '', duration: '', isPreview: false, buyNowTriggerSeconds: 300 });
    setFile(null); setUploadPercent(0); setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadWithProgress = (url, formData, token) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) setUploadPercent(Math.round((e.loaded / e.total) * 100));
    });
    xhr.onload = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error('Invalid JSON response')); } };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      let res;
      if (tab === 'url') {
        if (!form.videoUrl.trim()) { toast('Video URL is required', 'error'); setSaving(false); return; }
        res = await authFetch(`/courses/${courseId}/videos/url`, {
          method: 'POST',
          body: JSON.stringify({
            title: form.title.trim(), videoUrl: form.videoUrl.trim(),
            description: form.description, duration: Number(form.duration) || 0,
            isPreview: form.isPreview, buyNowTriggerSeconds: Number(form.buyNowTriggerSeconds) || 300,
          }),
        });
      } else {
        if (!file) { toast('Please select a video file', 'error'); setSaving(false); return; }
        if (file.size > 500 * 1024 * 1024) {
          if (!window.confirm(`File is ${(file.size / 1024 / 1024).toFixed(0)}MB. Large files may take a while. Continue?`)) { setSaving(false); return; }
        }
        const fd = new FormData();
        fd.append('video', file);
        fd.append('title', form.title.trim());
        fd.append('description', form.description);
        fd.append('duration', String(Number(form.duration) || 0));
        fd.append('isPreview', form.isPreview ? 'true' : 'false');
        fd.append('buyNowTriggerSeconds', String(Number(form.buyNowTriggerSeconds) || 300));
        const token = localStorage.getItem('token');
        setUploading(true);
        res = await uploadWithProgress(`${API_BASE}/courses/${courseId}/videos/upload`, fd, token);
      }
      if (res.success) {
        toast('✅ Video added successfully!');
        onAdded(res.data?.video || res.video);
        resetForm();
      } else {
        toast(res.message || 'Failed to add video', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Upload failed. Check your connection.', 'error');
    }
    setSaving(false);
    setUploading(false);
  };

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 24 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: '1rem' }}>➕ Add New Video</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['url', '🔗 Video URL'], ['upload', '📁 Upload File']].map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); resetForm(); }}
            style={{ padding: '6px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', cursor: 'pointer', fontWeight: tab === t ? 700 : 400, background: tab === t ? 'var(--primary)' : 'transparent', color: tab === t ? '#fff' : 'var(--text1)', transition: 'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Video Title *</label>
          <input className="input" placeholder="e.g. Introduction to React Hooks" value={form.title} onChange={e => set('title', e.target.value)} style={{ width: '100%' }} />
        </div>
        {tab === 'url' ? (
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Video URL *</label>
            <input className="input" placeholder="https://youtube.com/... or direct .mp4 URL" value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} style={{ width: '100%' }} />
          </div>
        ) : (
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Video File *</label>
            <div
              style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: 24, textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--bg1)', transition: 'all 0.2s' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const dropped = e.dataTransfer.files[0]; if (dropped && dropped.type.startsWith('video/')) setFile(dropped); else toast('Please drop a video file', 'error'); }}>
              {file ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>🎬</div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text1)' }}>{file.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  <button onClick={e => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ marginTop: 6, fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Remove</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📁</div>
                  <p style={{ fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>Drop video here or click to browse</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>MP4, WebM, MOV, AVI supported</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0] || null)} />
            {uploading && <UploadProgress percent={uploadPercent} fileName={file?.name || ''} />}
          </div>
        )}
        <div>
          <label style={labelStyle}>Duration (seconds)</label>
          <input className="input" type="number" min="0" placeholder="0" value={form.duration} onChange={e => set('duration', e.target.value)} style={{ width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Buy-Now Trigger (seconds)</label>
          <input className="input" type="number" min="0" placeholder="300" value={form.buyNowTriggerSeconds} onChange={e => set('buyNowTriggerSeconds', e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={labelStyle}>Description (optional)</label>
          <textarea className="input" rows={2} placeholder="Short description…" value={form.description} onChange={e => set('description', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="chk_preview" checked={form.isPreview} onChange={e => set('isPreview', e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
          <label htmlFor="chk_preview" style={{ fontSize: '0.88rem', cursor: 'pointer' }}>Free Preview (visible without purchase)</label>
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || (tab === 'upload' && uploading && uploadPercent < 100)} style={{ marginTop: 16 }}>
        {uploading && uploadPercent < 100 ? `Uploading… ${uploadPercent}%` : saving ? 'Adding…' : '➕ Add Video'}
      </button>
    </div>
  );
}

/* ── Video Player Modal ──────────────────────────────────── */
function VideoPlayerModal({ video, onClose }) {
  const isYouTube = video.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be'));
  const isVimeo   = video.videoUrl && video.videoUrl.includes('vimeo.com');

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(video.videoUrl);
  const isDirect = !isYouTube && !isVimeo;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 900 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{video.title}</span>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : isDirect && video.videoUrl ? (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <p>Unable to play this video.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Video List Item ─────────────────────────────────────── */
function VideoItem({ v, i, purchased, isAdmin, onDelete, onEdit, onPlay }) {
  const canWatch = purchased || v.isPreview;
  return (
    <div
      onClick={() => canWatch && onPlay(v)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
        marginBottom: 8, background: 'var(--bg1)',
        opacity: !canWatch ? 0.65 : 1,
        cursor: canWatch ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s',
      }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          {v.duration > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>⏱ {fmtDur(v.duration)}</span>}
          {v.description && <span style={{ fontSize: '0.75rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{v.description}</span>}
        </div>
      </div>
      {v.isPreview && !purchased && <span className="badge badge-green" style={{ flexShrink: 0 }}>Preview</span>}
      <span style={{ fontSize: '1rem', color: canWatch ? 'var(--primary-light)' : 'var(--text3)' }}>
        {canWatch ? '▶' : '🔒'}
      </span>
      {isAdmin && (
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 4 }} title="Edit video">✏️</button>
          <button onClick={() => onDelete(v._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', padding: '2px 6px', borderRadius: 4 }} title="Delete video">🗑</button>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function CourseDetailPage({ onAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authFetch } = useAuth();
  const toast = useToast();

  const [course, setCourse]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [buying, setBuying]           = useState(false);
  const [enrolling, setEnrolling]     = useState(false);
  const [purchased, setPurchased]     = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeTab, setActiveTab]     = useState('content');

  const isAdmin = user?.role === 'admin';

  /* ── Load course ── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          // Backend returns { data: { course, purchased } }
          const courseData = d.data?.course ?? d.data ?? d.course ?? null;
          const purchasedFlag =
            d.data?.purchased ??
            d.purchased ??
            courseData?.isPurchased ??
            false;
          setCourse(courseData);
          setPurchased(purchasedFlag);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* ── Free enrol ── */
  // Calls the dedicated free-enrol endpoint — no Razorpay needed.
  const handleFreeEnrol = async () => {
    if (!user) { onAuth(); return; }
    setEnrolling(true);
    try {
      const res = await authFetch('/payments/free-enrol', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'course', itemId: id }),
      });
      if (res.success) {
        toast('🎉 Enrolled successfully! Happy learning!');
        setPurchased(true);
        _refetchCourse();
      } else {
        toast(res.message || 'Enrolment failed', 'error');
      }
    } catch (err) {
      console.error('Free enrol error:', err);
      toast('Something went wrong', 'error');
    }
    setEnrolling(false);
  };

  /* ── Re-fetch course (to get unlocked video URLs) ── */
  const _refetchCourse = () => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setCourse(d.data?.course ?? d.data ?? d.course ?? null);
          setPurchased(true);
        }
      })
      .catch(() => {});
  };

  /* ── Paid purchase ── */
  const handleBuy = async () => {
    if (!user) { onAuth(); return; }
    if (purchased) { navigate('/dashboard'); return; }

    // Route free courses to free enrol
    if (course.isFree || price === 0) { await handleFreeEnrol(); return; }

    setBuying(true);
    try {
      const orderRes = await authFetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ itemType: 'course', itemId: id }),
      });
      if (!orderRes.success) {
        toast(orderRes.message || 'Failed to create order', 'error');
        setBuying(false);
        return;
      }
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
            _refetchCourse();
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

  /* ── Admin actions ── */
  const handleVideoAdded = (newVideo) => {
    if (!newVideo) return;
    setCourse(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
    setShowAddVideo(false);
    toast('Video added to course!');
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    const res = await authFetch(`/courses/${id}/videos/${videoId}`, { method: 'DELETE' });
    if (res.success) {
      setCourse(prev => ({ ...prev, videos: prev.videos.filter(v => v._id !== videoId) }));
      toast('Video deleted');
    } else {
      toast(res.message || 'Delete failed', 'error');
    }
  };

  const handleVideoUpdated = (updatedVideo) => {
    setCourse(prev => ({
      ...prev,
      videos: prev.videos.map(v => v._id === updatedVideo._id ? updatedVideo : v),
    }));
    setEditingVideo(null);
  };

  const handleTogglePublish = async () => {
    const res = await authFetch(`/courses/${id}/publish`, { method: 'PATCH' });
    if (res.success) {
      setCourse(prev => ({ ...prev, isPublished: res.data.isPublished, publishedAt: res.data.isPublished ? new Date().toISOString() : null }));
      toast(res.message);
    } else {
      toast(res.message || 'Failed', 'error');
    }
  };

  /* ── Loading / not found ── */
  if (loading) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!course) return (
    <div className="page">
      <div className="empty-state">
        <div className="icon">😕</div>
        <p>Course not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/courses')} style={{ marginTop: 12 }}>Browse Courses</button>
      </div>
    </div>
  );

  const price = course.isFree ? 0 : (course.discountPrice ?? course.price ?? 0);
  const totalDuration = course.videos?.reduce((acc, v) => acc + (v.duration || 0), 0) || 0;

  return (
    <div className="page">
      {/* ── Modals ── */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo} courseId={id}
          authFetch={authFetch} toast={toast}
          onUpdated={handleVideoUpdated}
          onClose={() => setEditingVideo(null)}
        />
      )}
      {playingVideo && (
        <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}

      {/* ── Header ── */}
      <div className="detail-header">
        <div className="container">
          <div className="detail-breadcrumb" onClick={() => navigate('/courses')}>← Back to <span>Courses</span></div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="badge badge-primary">{course.level || 'All'}</span>
            {course.category && <span className="badge badge-cyan">{course.category}</span>}
            {course.isFree && <span className="badge badge-green">FREE</span>}
            {isAdmin && (
              <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600, background: course.isPublished ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: course.isPublished ? '#22c55e' : '#ef4444', border: `1px solid ${course.isPublished ? '#22c55e' : '#ef4444'}` }}>
                {course.isPublished ? '🟢 Published' : '🔴 Draft'}
              </span>
            )}
          </div>
          <h1 className="detail-title">{course.title}</h1>
          {course.shortDescription && (
            <p style={{ color: 'var(--text2)', fontSize: '0.95rem', marginBottom: 12 }}>{course.shortDescription}</p>
          )}
          <div className="detail-meta-row">
            <span>🎬 {course.videos?.length || 0} videos</span>
            {totalDuration > 0 && <span>⏱ {fmtDur(totalDuration)} total</span>}
            <span>👥 {course.totalStudents || 0} students</span>
            <span>🌐 {course.language || 'English'}</span>
            <span>{ANIMAL_EMOJI?.[course.level] || '📚'} {course.level || 'All Levels'}</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container">
        {/* Admin toolbar */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '14px 16px', background: 'rgba(var(--primary-rgb),0.06)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 24, alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text2)', fontWeight: 600 }}>⚙️ Admin</span>
            <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => setShowAddVideo(v => !v)}>
              {showAddVideo ? '✕ Close' : '➕ Add Video'}
            </button>
            <button className="btn" style={{ padding: '6px 14px', fontSize: '0.85rem', color: course.isPublished ? '#ef4444' : 'var(--green)', borderColor: course.isPublished ? '#ef4444' : 'var(--green)' }} onClick={handleTogglePublish}>
              {course.isPublished ? '📴 Unpublish' : '🚀 Publish'}
            </button>
            <button className="btn" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => navigate(`/admin/courses/${id}/edit`)}>
              ✏️ Edit Course
            </button>
          </div>
        )}

        <div className="detail-layout">
          {/* ── Left column ── */}
          <div>
            {isAdmin && showAddVideo && (
              <AddVideoForm courseId={id} onAdded={handleVideoAdded} authFetch={authFetch} toast={toast} />
            )}

            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 24 }}>
              {[['content', '📋 Course Content'], ['about', 'ℹ️ About']].map(([t, label]) => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? 'var(--primary)' : 'var(--text2)', borderBottom: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -2, fontSize: '0.9rem' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── Content Tab ── */}
            {activeTab === 'content' && (
              <div>
                {/* Access notice for non-enrolled users */}
                {!purchased && !course.isFree && (
                  <div style={{ padding: '12px 16px', background: 'rgba(232,17,59,0.06)', border: '1px solid rgba(232,17,59,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.88rem', color: 'var(--text2)' }}>
                    🔒 Purchase this course to unlock all videos and play them directly here.
                  </div>
                )}
                {purchased && (
                  <div style={{ padding: '12px 16px', background: 'rgba(31,168,85,0.08)', border: '1px solid rgba(31,168,85,0.3)', borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: '0.88rem', color: 'var(--green)' }}>
                    ✅ You have full access — click any lesson to watch.
                  </div>
                )}

                {course.videos?.length > 0 ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.1rem', fontWeight: 700 }}>
                        {course.videos.length} Lessons
                        {totalDuration > 0 && <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text2)', marginLeft: 8 }}>· {fmtDur(totalDuration)}</span>}
                      </h2>
                      {!purchased && course.videos.filter(v => v.isPreview).length > 0 && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
                          {course.videos.filter(v => v.isPreview).length} free preview{course.videos.filter(v => v.isPreview).length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="video-list">
                      {course.videos.map((v, i) => (
                        <VideoItem
                          key={v._id || i}
                          v={v} i={i}
                          purchased={purchased}
                          isAdmin={isAdmin}
                          onDelete={handleDeleteVideo}
                          onEdit={setEditingVideo}
                          onPlay={setPlayingVideo}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="icon">🎬</div>
                    <p>No videos yet{isAdmin ? ' — add the first one above' : ''}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── About Tab ── */}
            {activeTab === 'about' && (
              <div>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: 'var(--font2)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>About This Course</h2>
                  <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{course.description}</p>
                </div>
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
                {course.outcomes?.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 12 }}>What You'll Learn</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
                      {course.outcomes.map((o, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.88rem', color: 'var(--text2)', alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span>{o}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {course.tags?.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Tags</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {course.tags.map((tag, i) => (
                        <span key={i} style={{ padding: '4px 12px', background: 'var(--bg3)', borderRadius: 99, fontSize: '0.8rem', color: 'var(--text2)', border: '1px solid var(--border)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {course.instructor && (
                  <div style={{ marginBottom: 28, padding: 16, background: 'var(--bg2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Instructor</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {course.instructor.avatar ? (
                        <img src={course.instructor.avatar} alt={course.instructor.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                          {course.instructor.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{course.instructor.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Course Instructor</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="detail-sidebar">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', borderRadius: 'var(--radius-sm)', marginBottom: 16, aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
            )}

            {/* Price */}
            <div style={{ marginBottom: 4 }}>
              <span className="sidebar-price">{course.isFree ? 'FREE' : `₹${price}`}</span>
              {!course.isFree && course.discountPrice && (
                <>
                  <span className="sidebar-price-old" style={{ marginLeft: 8 }}>₹{course.price}</span>
                  <span style={{ marginLeft: 8, fontSize: '0.82rem', color: 'var(--green)', fontWeight: 600 }}>
                    {Math.round((1 - course.discountPrice / course.price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* CTA */}
            {purchased ? (
              <button className="btn btn-green sidebar-btn btn-lg" onClick={() => navigate('/dashboard')}>
                ✅ Go to Dashboard
              </button>
            ) : course.isFree || price === 0 ? (
              <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleFreeEnrol} disabled={enrolling}>
                {enrolling ? 'Enrolling…' : '🚀 Enroll Free'}
              </button>
            ) : (
              <button className="btn btn-primary sidebar-btn btn-lg" onClick={handleBuy} disabled={buying}>
                {buying ? 'Processing…' : `💳 Buy for ₹${price}`}
              </button>
            )}

            {/* Features */}
            <div className="sidebar-features" style={{ marginTop: 16 }}>
              {[
                ['🎬', `${course.videos?.length || 0} video lessons`],
                totalDuration > 0 ? ['⏱', `${fmtDur(totalDuration)} of content`] : null,
                ['🌐', `Language: ${course.language || 'English'}`],
                ['📊', `Level: ${course.level || 'All Levels'}`],
                ['♾️', 'Lifetime access'],
                ['📱', 'Access on all devices'],
              ].filter(Boolean).map(([icon, text]) => (
                <div key={text} className="sidebar-feature">
                  <span className="icon">{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>

            {/* Companion notes */}
            {course.notes?.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: '0.9rem' }}>📄 Companion Notes</h4>
                {course.notes.map(n => (
                  <div key={n._id} style={{ padding: '10px 12px', background: 'var(--bg1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{n.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: n.isFree ? 'var(--green)' : 'var(--text2)' }}>
                        {n.isFree ? 'Free' : `₹${n.effectivePrice ?? n.price}`}
                      </span>
                      <button className="btn btn-primary" style={{ padding: '3px 10px', fontSize: '0.75rem' }} onClick={() => navigate(`/notes/${n._id}`)}>
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}