'use client';

import { useState } from 'react';

export default function SetRow({ setNumber, set, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);

  const handleSave = async () => {
    await onUpdate(set.id, weight, reps);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr>
        <td>{setNumber}</td>
        <td>
          <input
            type="number"
            className="form-control"
            style={{ width: '80px', padding: '4px 8px' }}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            className="form-control"
            style={{ width: '80px', padding: '4px 8px' }}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </td>
        <td style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSave} className="btn btn-sm">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{setNumber}</td>
      <td>{set.weight} kg</td>
      <td>{set.reps} reps</td>
      <td style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">Edit</button>
        <button onClick={() => onDelete(set.id)} className="btn btn-danger btn-sm">Delete</button>
      </td>
    </tr>
  );
}
