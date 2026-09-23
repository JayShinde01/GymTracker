'use client';

import { useState, useEffect } from 'react';

export default function WorkoutForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDate(initialData.date ? initialData.date.split('T')[0] : '');
    } else {
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, date });
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>
        {initialData ? 'Edit Workout' : 'Log New Workout'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Workout Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Chest Day, Leg Routine"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Workout' : 'Create Workout'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
