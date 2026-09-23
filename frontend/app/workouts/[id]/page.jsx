'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../services/api';
import SetRow from '../../../components/SetRow';
import Loading from '../../../components/Loading';

export default function WorkoutDetail() {
  const params = useParams();
  const router = useRouter();
  const workoutId = params.id;

  const [workout, setWorkout] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [setInputs, setSetInputs] = useState({});

  const loadWorkoutDetails = async () => {
    const wRes = await api.getWorkoutById(workoutId);
    const exRes = await api.getExercises();

    if (wRes.error || exRes.error) {
      setError(wRes.error || exRes.error);
    } else {
      setWorkout(wRes);
      setAllExercises(exRes);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (workoutId) {
      loadWorkoutDetails();
    }
  }, [workoutId]);

  const handleAddExercise = async () => {
    if (!selectedExerciseId) return;
    const res = await api.addExerciseToWorkout(workoutId, selectedExerciseId);
    if (res.error) {
      alert(res.error);
    } else {
      setSelectedExerciseId('');
      loadWorkoutDetails();
    }
  };

  const handleRemoveExercise = async (weId) => {
    if (confirm('Remove this exercise from the workout?')) {
      const res = await api.removeExerciseFromWorkout(workoutId, weId);
      if (res.error) {
        alert(res.error);
      } else {
        loadWorkoutDetails();
      }
    }
  };

  const handleAddSet = async (workoutExerciseId) => {
    const input = setInputs[workoutExerciseId] || { weight: '', reps: '' };
    if (!input.weight || !input.reps) {
      alert('Please enter weight and reps');
      return;
    }

    const res = await api.addSet(workoutExerciseId, Number(input.weight), Number(input.reps));
    if (res.error) {
      alert(res.error);
    } else {
      setSetInputs({
        ...setInputs,
        [workoutExerciseId]: { weight: '', reps: '' },
      });
      loadWorkoutDetails();
    }
  };

  const handleUpdateSet = async (setId, weight, reps) => {
    const res = await api.updateSet(setId, Number(weight), Number(reps));
    if (res.error) {
      alert(res.error);
    } else {
      loadWorkoutDetails();
    }
  };

  const handleDeleteSet = async (setId) => {
    const res = await api.deleteSet(setId);
    if (res.error) {
      alert(res.error);
    } else {
      loadWorkoutDetails();
    }
  };

  if (loading) return <Loading message="Loading workout details..." />;
  if (error) return <div className="card" style={{ color: '#ef4444' }}>Error: {error}</div>;
  if (!workout) return <div className="card">Workout not found.</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/workouts" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          ← Back to Workouts
        </Link>
        <h1 style={{ marginTop: '8px' }}>{workout.name}</h1>
        <p style={{ color: '#94a3b8' }}>
          📅 {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '12px' }}>+ Add Exercise to Workout</h3>
        {allExercises.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>
            No exercises created yet.{' '}
            <Link href="/exercises" style={{ color: '#10b981' }}>
              Create exercises here
            </Link>
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              className="form-control"
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
            >
              <option value="">-- Select Exercise --</option>
              {allExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.muscleGroup} • {ex.equipment})
                </option>
              ))}
            </select>
            <button onClick={handleAddExercise} className="btn" style={{ whiteSpace: 'nowrap' }}>
              Add Exercise
            </button>
          </div>
        )}
      </div>

      {workout.workoutExercises.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#94a3b8' }}>
          No exercises added to this workout yet. Select an exercise above to add it.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {workout.workoutExercises.map((we) => {
            const input = setInputs[we.id] || { weight: '', reps: '' };

            return (
              <div key={we.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{we.exercise.name}</h3>
                    <span className="badge">💪 {we.exercise.muscleGroup}</span>
                  </div>
                  <button onClick={() => handleRemoveExercise(we.id)} className="btn btn-danger btn-sm">
                    Remove Exercise
                  </button>
                </div>

                {we.sets.length > 0 && (
                  <table className="set-table" style={{ marginBottom: '16px' }}>
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {we.sets.map((set, index) => (
                        <SetRow
                          key={set.id}
                          setNumber={index + 1}
                          set={set}
                          onUpdate={handleUpdateSet}
                          onDelete={handleDeleteSet}
                        />
                      ))}
                    </tbody>
                  </table>
                )}

                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                    + Add New Set
                  </span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      className="form-control"
                      value={input.weight}
                      onChange={(e) =>
                        setSetInputs({
                          ...setInputs,
                          [we.id]: { ...input, weight: e.target.value },
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      className="form-control"
                      value={input.reps}
                      onChange={(e) =>
                        setSetInputs({
                          ...setInputs,
                          [we.id]: { ...input, reps: e.target.value },
                        })
                      }
                    />
                    <button onClick={() => handleAddSet(we.id)} className="btn btn-sm" style={{ whiteSpace: 'nowrap' }}>
                      Add Set
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
