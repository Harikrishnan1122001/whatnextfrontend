import { ANIMALS } from '../utils/constants';

export default function AnimalStrip({ selected, onSelect }) {
  return (
    <div className="mascot-strip">
      <div className={`mascot-card ${!selected ? 'active' : ''}`} onClick={() => onSelect(null)}>
        <div className="mascot-emoji">🌟</div>
        <div className="mascot-name">All Courses</div>
        <div className="mascot-label">View All</div>
      </div>
      {ANIMALS.map(a => (
        <div
          key={a.level + a.name}
          className={`mascot-card ${selected === a.level ? 'active' : ''}`}
          onClick={() => onSelect(a.level)}
        >
          <div className="mascot-emoji">{a.emoji}</div>
          <div className="mascot-name">{a.name}</div>
          <div className="mascot-label">{a.label}</div>
        </div>
      ))}
    </div>
  );
}
