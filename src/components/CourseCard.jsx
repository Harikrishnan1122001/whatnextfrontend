import { useNavigate } from 'react-router-dom';
import { ANIMAL_EMOJI } from '../utils/constants';

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const price = course.isFree ? 0 : (course.discountPrice ?? course.price);

  return (
    <div className="card" onClick={() => navigate(`/courses/${course._id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-thumb" style={{ background: 'var(--bg3)' }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>{ANIMAL_EMOJI[course.level] || '📚'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>{course.category || 'Course'}</div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{course.level || 'All'}</span>
          {course.category && <span className="badge badge-cyan">{course.category}</span>}
          {!course.isPublished && <span className="badge badge-yellow">Draft</span>}
        </div>
        <div className="card-title">{course.title}</div>
        <div className="card-desc">{course.description}</div>
        <div className="card-meta">
          <span className={`price ${course.isFree ? 'price-free' : ''}`}>
            {course.isFree ? 'FREE' : `₹${price}`}
          </span>
          {!course.isFree && course.discountPrice && (
            <span className="price-old">₹{course.price}</span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text3)' }}>
            🎬 {course.videos?.length || 0} videos
          </span>
        </div>
      </div>
    </div>
  );
}
