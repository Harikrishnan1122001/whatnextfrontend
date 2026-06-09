import { useNavigate } from 'react-router-dom';

export default function NotesCard({ note }) {
  const navigate = useNavigate();
  const price = note.isFree ? 0 : (note.discountPrice ?? note.price);

  return (
    <div className="card" onClick={() => navigate(`/notes/${note._id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-thumb" style={{ background: 'var(--bg3)' }}>
        {note.thumbnail ? (
          <img src={note.thumbnail} alt={note.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>📄</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>{note.fileType?.toUpperCase() || 'PDF'}</div>
          </div>
        )}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span className="badge badge-yellow">{note.fileType?.toUpperCase() || 'PDF'}</span>
          {note.category && <span className="badge badge-primary">{note.category}</span>}
        </div>
        <div className="card-title">{note.title}</div>
        <div className="card-desc">{note.description}</div>
        <div className="card-meta">
          <span className={`price ${note.isFree ? 'price-free' : ''}`}>
            {note.isFree ? 'FREE' : `₹${price}`}
          </span>
          {!note.isFree && note.discountPrice && <span className="price-old">₹{note.price}</span>}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text3)' }}>
            📥 {note.totalPurchases || 0} downloads
          </span>
        </div>
      </div>
    </div>
  );
}
