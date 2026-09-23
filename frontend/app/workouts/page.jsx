'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../services/api';
import WorkoutForm from '../../components/WorkoutForm';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadWorkouts = async () => {
    const res = await api.getWorkouts();
    if (res.error) {
      if (res.error === 'Access token missing' || res.error === 'Invalid token') {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      setError(res.error);
    } else {
      setWorkouts(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWorkouts();
  }, [router]);

  const handleCreateOrUpdate = async (formData) => {
    setSubmitting(true);
    let res;
    if (editingWorkout) {
      res = await api.updateWorkout(editingWorkout.id, formData.name, formData.date);
    } else {
      res = await api.createWorkout(formData.name, formData.date);
    }
    setSubmitting(false);

    if (res.error) {
      alert(res.error);
    } else {
      setShowForm(false);
      setEditingWorkout(null);
      loadWorkouts();
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const res = await api.deleteWorkout(id);
      if (res.error) {
        alert(res.error);
      } else {
        loadWorkouts();
      }
    }
  };

  if (loading) return <Loading message="Loading workouts..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Workout Log 📋</h1>
          <p style={{ color: '#94a3b8' }}>Record your workout sessions and sets.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingWorkout(null);
              setShowForm(true);
            }}
            className="btn"
          >
            + Log New Workout
          </button>
        )}
      </div>

      {showForm && (
        <WorkoutForm
          initialData={editingWorkout}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingWorkout(null);
          }}
          isSubmitting={submitting}
        />
      )}

      {error && <div className="card" style={{ color: '#ef4444' }}>{error}</div>}

      {workouts.length === 0 && !showForm ? (
        <EmptyState
          message="No workouts logged yet. Start logging your workouts now!"
          actionText="+ Log New Workout"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {workouts.map((w) => (
            <div key={w.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{w.name}</h3>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  📅 {new Date(w.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#10b981' }}>
                  {w.workoutExercises ? `${w.workoutExercises.length} Exercises Logged` : ''}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link href={`/workouts/${w.id}`} className="btn btn-sm">
                  View / Edit Sets
                </Link>
                <button
                  onClick={() => {
                    setEditingWorkout(w);
                    setShowForm(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(w.id, w.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
