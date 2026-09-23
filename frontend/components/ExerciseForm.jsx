'use client';

import { useState, useEffect } from 'react';

export default function ExerciseForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setMuscleGroup(initialData.muscleGroup || 'Chest');
      setEquipment(initialData.equipment || 'Barbell');
    } else {
      setName('');
      setMuscleGroup('Chest');
      setEquipment('Barbell');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, muscleGroup, equipment });
  };

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ marginBottom: '16px' }}>
        {initialData ? 'Edit Exercise' : 'Add New Exercise'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Exercise Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bench Press"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Muscle Group</label>
            <select
              className="form-control"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Core">Core</option>
              <option value="Full Body">Full Body</option>
            </select>
          </div>
          <div className="form-group">
            <label>Equipment</label>
            <select
              className="form-control"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
            >
              <option value="Barbell">Barbell</option>
              <option value="Dumbbell">Dumbbell</option>
              <option value="Machine">Machine</option>
              <option value="Cable">Cable</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Kettlebell">Kettlebell</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Exercise' : 'Create Exercise'}
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
