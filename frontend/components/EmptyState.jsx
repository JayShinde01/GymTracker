export default function EmptyState({ message = 'No items found.', actionText, onAction }) {
  return (
    <div className="card empty-state">
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
      <p style={{ marginBottom: '16px' }}>{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn">
          {actionText}
        </button>
      )}
    </div>
  );
}
