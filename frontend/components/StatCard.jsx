export default function StatCard({ title, value, icon, unit }) {
  return (
    <div className="card stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="stat-title">{title}</span>
        {icon && <span style={{ fontSize: '1.25rem' }}>{icon}</span>}
      </div>
      <div className="stat-value">
        {value} {unit && <span style={{ fontSize: '1rem', color: '#94a3b8' }}>{unit}</span>}
      </div>
    </div>
  );
}
