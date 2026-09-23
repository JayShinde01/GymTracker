export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
      <p>{message}</p>
    </div>
  );
}
